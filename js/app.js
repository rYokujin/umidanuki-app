// =============================================================================
// BUJINKAN UMIDANUKI DOJO - CORE APPLICATION LOGIC (SECURITY HARDENED)
// Session-Token Auth, Server-Authoritative Actions, 50-Stage Dam,
// 4-Row Nafudakake, Kuden Quiz & Local Offline QR-Code Generator
// =============================================================================

// =============================================================================
// GLOBAL STATE VARIABLES (ZERO HARDCODED MEMBER DATA, ZERO PERSISTED PIN)
// =============================================================================

let google_script_api_url = localStorage.getItem("umidanuki_api_url") || "";
let active_session_token = sessionStorage.getItem("umidanuki_session_token") || "";
let is_live_sheet_mode = false;
let is_logging_in = false;
let is_redeeming_token = false;
let is_generating_qr = false;
let is_action_in_flight = false;

let dojo_dam_stage = 1;
let dam_stage_current_xp = 0;
const dam_stage_required_xp = 10;
let is_trainer_dam_preview_active = false;
let active_member_id = "";
let dojo_members_data = {};
let last_month_top3_list = [];

let selected_training_unit = "Senpai-Training";
let selected_session_tags = ["Kihon Happô", "Gyokko Ryû", "Hanbô"];
let current_quiz_index = 0;
let quiz_next_timeout_id = null;

let html5_qr_scanner = null;
let is_camera_scanning = false;
let is_camera_transitioning = false;

let toast_timeout_id = null;
let dam_sprite_request_id = 0;
const dam_sprite_availability_cache = {};
let api_request_chain = Promise.resolve();

// 31 Bujinkan training categories for QR session tagging
const available_training_tags = [
    "Rei Hô / Etikette", "Kamae", "Ukemi Waza", "Taihen Jutsu", "Sabaki Waza",
    "Shinobi Aruki Jutsu", "Hoken Jûrôppô", "Uke Waza", "Ha Jutsu Kyû Hô",
    "Sanshin No Kata", "Kihon Happô", "Gyaku Gi", "Shime Waza", "Kyûsho Jutsu",
    "Mutô Dori", "Hanbô", "Rokushaku Bô", "Tantô", "Katana", "Shukô",
    "Shuriken", "Jutte", "Gyokko Ryû", "Kotô Ryû", "Kukishinden Ryû",
    "Tôgakure Ryû", "Kumogakure Ryû", "Takagi Yoshin Ryû", "Shinden Fudô Ryû",
    "Gikan Ryû", "Gyokushin Ryû"
];

// =============================================================================
// NAFUDA CUSTOMIZATION CATALOG (5 OPTIONS PER CATEGORY)
// =============================================================================

const wood_shop_options = [
    { key: "yakisugi", label: "Yakisugi", desc: "Yakisugi (Geflammt)", css: "wood-yakisugi", cost: 150 },
    { key: "ebony", label: "Ebenholz", desc: "Ebenholz (Tiefschwarz)", css: "wood-ebony", cost: 150 },
    { key: "sugi", label: "Sugi", desc: "Sugi (Rötlich-braun, lebhaft)", css: "wood-sugi", cost: 150 },
    { key: "hinoki", label: "Hinoki", desc: "Hinoki (Hellgelb bis blassrosa)", css: "wood-hinoki", cost: 150 },
    { key: "kurogaki", label: "Kurogaki", desc: "Kurogaki (Hell, schwarze Zeichnung)", css: "wood-kurogaki", cost: 150 }
];

const ink_shop_options = [
    { key: "gold", label: "Gold", desc: "Goldene Schrift", css: "ink-gold", cost: 120 },
    { key: "silver", label: "Silber", desc: "Silberne Schrift", css: "ink-silver", cost: 120 },
    { key: "red", label: "Rot", desc: "Rote Schrift", css: "ink-red", cost: 120 },
    { key: "green", label: "Grün", desc: "Grüne Schrift", css: "ink-green", cost: 120 },
    { key: "purple", label: "Violett", desc: "Violette Schrift", css: "ink-purple", cost: 120 }
];

const stamp_shop_options = [
    { key: "dojo_stamp", label: "Dôjô", desc: "Roter Dôjô-Stempel", cost: 100 },
    { key: "bujin_logo", label: "Bujin", desc: "Bujin-Logo (武神)", cost: 100 },
    { key: "kanji_nin", label: "Nin (忍)", desc: "Nin (忍) im Kreis", cost: 100 },
    { key: "kanji_umidanuki", label: "Umidanuki", desc: "Umidanuki (海狸) im Kreis", cost: 100 },
    { key: "kanji_samurai", label: "Samurai", desc: "Samurai (侍) im Kreis", cost: 100 }
];

// =============================================================================
// UTILITIES
// =============================================================================

function EscapeHtml(raw_value)
{
    return String(raw_value === null || raw_value === undefined ? "" : raw_value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function ShowToastMessage(msg_text)
{
    let _toast = document.getElementById("ui_toast");
    if (!_toast) { return; }

    if (toast_timeout_id !== null)
    {
        clearTimeout(toast_timeout_id);
        toast_timeout_id = null;
    }

    _toast.textContent = msg_text;
    _toast.classList.add("show");
    toast_timeout_id = setTimeout(function()
    {
        _toast.classList.remove("show");
        toast_timeout_id = null;
    }, 2800);
}

// =============================================================================
// INITIALIZATION, EVENT BINDING & SESSION-TOKEN AUTHENTICATION
// =============================================================================

function InitializeDojoApp()
{
    // Actively purge any legacy plaintext credentials from persistent localStorage
    localStorage.removeItem("umidanuki_user_pin");
    localStorage.removeItem("umidanuki_user_name");

    BuildCompleteQuizPool();
    BindEventListeners();

    document.getElementById("input_api_url").value = google_script_api_url;

    RenderDamVisualStage(dojo_dam_stage);
    RenderMonthlyLeaderboards();
    RenderNafudakakeBoard();
    RenderCosmeticWorkshopCards();
    RenderTrainerTagCloud();
    RenderKudenQuiz();
    InitializeShurikenCanvas();

    if (google_script_api_url !== "" && active_session_token !== "")
    {
        ResumeActiveDojoSession();
    }
}

function BindEventListeners()
{
    let _login_form = document.getElementById("form_dojo_login");
    if (_login_form)
    {
        _login_form.addEventListener("submit", function(_ev)
        {
            _ev.preventDefault();
            PerformLiveSheetLogin();
        });
    }

    let _user_badge_btn = document.getElementById("btn_open_own_dashboard");
    if (_user_badge_btn)
    {
        _user_badge_btn.addEventListener("click", function()
        {
            OpenMemberDashboard(active_member_id);
        });
    }

    let _logout_btn = document.getElementById("btn_logout_user");
    if (_logout_btn)
    {
        _logout_btn.addEventListener("click", LogoutDojoUser);
    }

    let _btn_contrib_1 = document.getElementById("btn_contribute_1");
    if (_btn_contrib_1)
    {
        _btn_contrib_1.addEventListener("click", function() { ContributeTaidenToDam(1); });
    }

    let _btn_contrib_5 = document.getElementById("btn_contribute_5");
    if (_btn_contrib_5)
    {
        _btn_contrib_5.addEventListener("click", function() { ContributeTaidenToDam(5); });
    }

    let _btn_reset_stage = document.getElementById("btn_reset_dam_stage");
    if (_btn_reset_stage)
    {
        _btn_reset_stage.addEventListener("click", ResetDamToLiveStage);
    }

    let _stage_slider = document.getElementById("ui_stage_slider");
    if (_stage_slider)
    {
        _stage_slider.addEventListener("input", function()
        {
            PreviewDamVisualStageOnly(_stage_slider.value);
        });
    }

    let _btn_exchange = document.getElementById("btn_exchange_kuden");
    if (_btn_exchange)
    {
        _btn_exchange.addEventListener("click", ExchangeKudenToTaiden);
    }

    let _btn_start_shuriken = document.getElementById("btn_start_shuriken");
    if (_btn_start_shuriken)
    {
        _btn_start_shuriken.addEventListener("click", StartShurikenWoodGame);
    }

    let _btn_toggle_cam = document.getElementById("btn_toggle_camera");
    if (_btn_toggle_cam)
    {
        _btn_toggle_cam.addEventListener("click", ToggleCameraQrScanner);
    }

    let _qr_redeem_form = document.getElementById("form_qr_redeem");
    if (_qr_redeem_form)
    {
        _qr_redeem_form.addEventListener("submit", function(_ev)
        {
            _ev.preventDefault();
            SubmitTrainingCheckInCode();
        });
    }

    let _unit_btns = document.querySelectorAll(".unit-btn");
    _unit_btns.forEach(function(_btn)
    {
        _btn.addEventListener("click", function()
        {
            let _unit_name = _btn.dataset.unitName || "Senpai-Training";
            SelectTrainingUnit(_unit_name, _btn);
        });
    });

    let _btn_generate_qr = document.getElementById("btn_generate_qr");
    if (_btn_generate_qr)
    {
        _btn_generate_qr.addEventListener("click", GenerateTaggedQrCode);
    }

    let _modal_dialog = document.getElementById("ui_member_modal");
    if (_modal_dialog)
    {
        _modal_dialog.addEventListener("click", function(_ev)
        {
            if (_ev.target === _modal_dialog)
            {
                CloseMemberDashboard();
            }
        });
    }

    let _btn_close_modal = document.getElementById("btn_close_member_modal");
    if (_btn_close_modal)
    {
        _btn_close_modal.addEventListener("click", CloseMemberDashboard);
    }

    let _nav_items = document.querySelectorAll(".nav-item");
    _nav_items.forEach(function(_nav_btn)
    {
        _nav_btn.addEventListener("click", function()
        {
            let _target_id = _nav_btn.dataset.targetView;
            if (_target_id)
            {
                SwitchTab(_target_id, _nav_btn);
            }
        });
    });
}

function ApplyAuthenticatedBootstrapData(server_data, show_welcome_toast)
{
    active_session_token = String(server_data.session_token || active_session_token);
    is_live_sheet_mode = true;
    sessionStorage.setItem("umidanuki_session_token", active_session_token);

    dojo_members_data = {};
    (server_data.nafudakake_list || []).forEach(function(_pub, _idx)
    {
        dojo_members_data[_pub.id] = {
            id: _pub.id,
            name: _pub.name,
            jp: _pub.jp,
            rank: _pub.rank,
            belt_color: _pub.belt_color,
            row: _pub.row,
            sort_order: (typeof _pub.sort_order === "number") ? _pub.sort_order : _idx,
            month_contribution: _pub.month_contribution || 0,
            wood_type: _pub.wood_type || "standard",
            ink_type: _pub.ink_type || "standard",
            stamp_type: _pub.stamp_type || "none",
            taiden_xp: 0,
            kuden_xp: 0,
            trainings: 1,
            streak_weeks: 1,
            stats: {},
            logs: []
        };
    });

    let _own = server_data.own_profile;
    active_member_id = _own.id;
    dojo_members_data[_own.id] = Object.assign(dojo_members_data[_own.id] || {}, _own);

    if (server_data.dojo_dam)
    {
        dojo_dam_stage = server_data.dojo_dam.dam_stage || 1;
        dam_stage_current_xp = server_data.dojo_dam.dam_pool_xp || 0;
        last_month_top3_list = server_data.dojo_dam.last_month_top3 || [];
    }

    ApplyTrainerPermissions(Boolean(_own.is_trainer));
    document.getElementById("ui_login_screen").classList.add("hidden");

    UpdateTopHeaderUI();
    RenderDamVisualStage(dojo_dam_stage);
    RenderMonthlyLeaderboards();
    RenderNafudakakeBoard();
    UpdateCosmeticShopUI();
    RenderTrainerTagCloud();
    RenderKudenQuiz();

    if (show_welcome_toast)
    {
        ShowToastMessage("🦫 Willkommen im Dôjô, " + _own.name + "!");
    }
}

async function ResumeActiveDojoSession()
{
    if (is_logging_in || !google_script_api_url || !active_session_token) { return; }

    is_logging_in = true;
    let _btn = document.getElementById("btn_login_submit");
    _btn.disabled = true;
    _btn.textContent = "⏳ Stelle Sitzung wieder her...";

    try
    {
        let _response = await fetch(google_script_api_url, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({
                action: "resume_session",
                session_token: active_session_token
            })
        });

        if (!_response.ok)
        {
            throw new Error("HTTP " + _response.status);
        }

        let _data = await _response.json();
        if (_data.status === "ok" && _data.own_profile)
        {
            ApplyAuthenticatedBootstrapData(_data, false);
        }
        else
        {
            active_session_token = "";
            sessionStorage.removeItem("umidanuki_session_token");
        }
    }
    catch (_err)
    {
        active_session_token = "";
        sessionStorage.removeItem("umidanuki_session_token");
    }
    finally
    {
        is_logging_in = false;
        _btn.disabled = false;
        _btn.textContent = "🥋 Jetzt im Dôjô anmelden";
    }
}

async function PerformLiveSheetLogin()
{
    if (is_logging_in) { return; }

    let _url = document.getElementById("input_api_url").value.trim();
    let _name = document.getElementById("input_first_name").value.trim();
    let _pin = document.getElementById("input_pin_code").value.trim();

    if (_url === "" || _name === "" || _pin === "")
    {
        ShowToastMessage("⚠️ Bitte Web-App-URL, Vorname und Dôjô-PIN eingeben!");
        return;
    }

    if (!/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec$/i.test(_url))
    {
        if (_url.indexOf("docs.google.com/spreadsheets") !== -1)
        {
            ShowToastMessage("⚠️ Bitte die bereitgestellte Apps-Script-URL (/exec) eingeben, nicht den Tabellen-Link!");
            return;
        }
        if (!/^https:\/\/.+/i.test(_url))
        {
            ShowToastMessage("⚠️ Die Web-App-URL muss mit https:// beginnen!");
            return;
        }
    }

    is_logging_in = true;
    let _btn = document.getElementById("btn_login_submit");
    _btn.disabled = true;
    _btn.textContent = "⏳ Verbinde mit Dôjô-Server...";

    try
    {
        let _response = await fetch(_url, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({
                action: "login_and_fetch",
                first_name: _name,
                pin_code: _pin
            })
        });

        if (!_response.ok)
        {
            throw new Error("HTTP " + _response.status);
        }

        let _data = await _response.json();

        if (_data.status === "ok" && !_data.session_token)
        {
            ShowToastMessage("⚠️ Backend noch auf alter Version – bitte Code.gs in Apps Script als neue Version bereitstellen!");
            return;
        }

        if (_data.status !== "ok" || !_data.own_profile)
        {
            ShowToastMessage("❌ " + (_data.message || "Login fehlgeschlagen"));
            return;
        }

        // Persist ONLY the non-sensitive API URL; never store the PIN in browser storage
        google_script_api_url = _url;
        localStorage.setItem("umidanuki_api_url", _url);
        document.getElementById("input_pin_code").value = "";

        ApplyAuthenticatedBootstrapData(_data, true);
    }
    catch (_err)
    {
        ShowToastMessage("⚠️ Verbindung fehlgeschlagen (prüfe Web-App-URL).");
    }
    finally
    {
        is_logging_in = false;
        _btn.disabled = false;
        _btn.textContent = "🥋 Jetzt im Dôjô anmelden";
    }
}

function ApplyTrainerPermissions(is_trainer_flag)
{
    document.getElementById("ui_shidoshi_generator_card").style.display = is_trainer_flag ? "block" : "none";
    document.getElementById("ui_trainer_dam_preview_box").style.display = is_trainer_flag ? "block" : "none";
}

function ResetLocalSessionUi()
{
    StopCameraQrScanner();
    StopShurikenWoodGame(true);
    CloseMemberDashboard();

    if (quiz_next_timeout_id !== null)
    {
        clearTimeout(quiz_next_timeout_id);
        quiz_next_timeout_id = null;
    }

    is_live_sheet_mode = false;
    is_trainer_dam_preview_active = false;
    active_member_id = "";
    active_session_token = "";
    dojo_members_data = {};
    last_month_top3_list = [];

    sessionStorage.removeItem("umidanuki_session_token");
    localStorage.removeItem("umidanuki_user_pin");
    localStorage.removeItem("umidanuki_user_name");
    document.getElementById("input_pin_code").value = "";

    ApplyTrainerPermissions(false);
    document.getElementById("ui_qr_result_box").style.display = "none";
    document.getElementById("ui_real_qr_box").innerHTML = "";
    document.getElementById("ui_header_name").textContent = "Mein Nafuda";
    document.getElementById("ui_header_rank").textContent = "Bitte anmelden";
    document.getElementById("ui_taiden_xp").textContent = "0";
    document.getElementById("ui_kuden_xp").textContent = "0";
    document.getElementById("ui_exchange_kuden").textContent = "0";

    document.getElementById("ui_login_screen").classList.remove("hidden");
}

function LogoutDojoUser()
{
    let _token_to_revoke = active_session_token;
    let _url = google_script_api_url;

    ResetLocalSessionUi();

    if (_url && _token_to_revoke)
    {
        fetch(_url, {
            method: "POST",
            headers: { "Content-Type": "text/plain;charset=utf-8" },
            body: JSON.stringify({
                action: "logout",
                session_token: _token_to_revoke
            })
        }).catch(function() {});
    }
}

function HandleSessionExpired(server_msg)
{
    ResetLocalSessionUi();
    ShowToastMessage("🔒 " + (server_msg || "Sitzung abgelaufen – bitte erneut anmelden."));
}

// =============================================================================
// SERIALIZED SERVER-AUTHORITATIVE API CALLER
// =============================================================================

function SendAuthenticatedAction(action_name, extra_payload, silent_errors)
{
    if (!is_live_sheet_mode || !google_script_api_url || !active_session_token)
    {
        return Promise.resolve(null);
    }

    let _run_request = async function()
    {
        if (!is_live_sheet_mode || !active_session_token) { return null; }

        let _body_obj = Object.assign({}, extra_payload || {}, {
            action: action_name,
            session_token: active_session_token
        });

        try
        {
            let _res = await fetch(google_script_api_url, {
                method: "POST",
                headers: { "Content-Type": "text/plain;charset=utf-8" },
                body: JSON.stringify(_body_obj)
            });

            if (!_res.ok)
            {
                throw new Error("HTTP " + _res.status);
            }

            let _data = await _res.json();
            if (_data.code === "session_expired")
            {
                HandleSessionExpired(_data.message);
                return _data;
            }

            if (_data.status !== "ok" && !silent_errors)
            {
                ShowToastMessage("❌ " + (_data.message || "Aktion fehlgeschlagen."));
            }

            return _data;
        }
        catch (_err)
        {
            if (!silent_errors)
            {
                ShowToastMessage("⚠️ Server-Verbindungsfehler – bitte Verbindung prüfen!");
            }
            return null;
        }
    };

    let _next = api_request_chain.then(_run_request, _run_request);
    api_request_chain = _next.then(function() {}, function() {});
    return _next;
}

function ApplyAuthoritativeBalances(balances_obj)
{
    if (!balances_obj || !active_member_id) { return; }
    let _m = dojo_members_data[active_member_id];
    if (!_m) { return; }

    if (typeof balances_obj.taiden_xp === "number") { _m.taiden_xp = balances_obj.taiden_xp; }
    if (typeof balances_obj.kuden_xp === "number") { _m.kuden_xp = balances_obj.kuden_xp; }
    if (typeof balances_obj.month_contribution === "number") { _m.month_contribution = balances_obj.month_contribution; }
    if (typeof balances_obj.wood_type === "string") { _m.wood_type = balances_obj.wood_type; }
    if (typeof balances_obj.ink_type === "string") { _m.ink_type = balances_obj.ink_type; }
    if (typeof balances_obj.stamp_type === "string") { _m.stamp_type = balances_obj.stamp_type; }

    UpdateTopHeaderUI();
}

function ApplyAuthoritativeDamState(dam_obj)
{
    if (!dam_obj) { return; }
    dojo_dam_stage = dam_obj.dam_stage || dojo_dam_stage;
    dam_stage_current_xp = Number(dam_obj.dam_pool_xp) || 0;
    last_month_top3_list = dam_obj.last_month_top3 || last_month_top3_list;

    UpdateTopHeaderUI();
    if (!is_trainer_dam_preview_active)
    {
        RenderDamVisualStage(dojo_dam_stage);
    }
    RenderMonthlyLeaderboards();
}

// =============================================================================
// BELT COLOR MAPPING & NAVIGATION
// =============================================================================

function GetBeltVisualConfig(belt_color_key, rank_str_optional)
{
    let _key = String(belt_color_key || "").toLowerCase().trim();
    let _rank = String(rank_str_optional || "").toLowerCase().trim();

    if (_key.indexOf("gelb") !== -1 || _rank.indexOf("jôdan") !== -1 || _rank.indexOf("jodan") !== -1 || _rank.indexOf("chûdan") !== -1 || _rank.indexOf("chudan") !== -1 || _rank.indexOf("gedan") !== -1)
    {
        if (_key.indexOf("jodan") !== -1 || _rank.indexOf("jôdan") !== -1 || _rank.indexOf("jodan") !== -1)
        {
            return { css_class: "stripe-yellow", label: "Gelb • Jôdan (上段)", sub_mark: "上" };
        }
        if (_key.indexOf("chudan") !== -1 || _rank.indexOf("chûdan") !== -1 || _rank.indexOf("chudan") !== -1)
        {
            return { css_class: "stripe-yellow", label: "Gelb • Chûdan (中段)", sub_mark: "中" };
        }
        return { css_class: "stripe-yellow", label: "Gelb • Gedan (下段)", sub_mark: "下" };
    }

    if (_key === "schwarz" || _key === "shidoshi")
    {
        return { css_class: "stripe-dan", label: "Schwarz (Dan)", sub_mark: "" };
    }
    if (_key === "grün" || _key === "gruen")
    {
        return { css_class: "stripe-green", label: "Grün (Kyû)", sub_mark: "" };
    }
    if (_key === "rot")
    {
        return { css_class: "stripe-red", label: "Rot (Kyû)", sub_mark: "" };
    }
    return { css_class: "stripe-white", label: "Weißer Gürtel", sub_mark: "" };
}

function SwitchTab(target_view_id, nav_btn_element)
{
    if (target_view_id !== "view_checkin")
    {
        StopCameraQrScanner();
    }
    if (target_view_id !== "view_quiz" && shuriken_game_active)
    {
        StopShurikenWoodGame(false);
    }

    let _views = document.querySelectorAll(".view-section");
    let _buttons = document.querySelectorAll(".nav-item");

    _views.forEach(function(_v) { _v.classList.remove("active"); });
    _buttons.forEach(function(_b)
    {
        _b.classList.remove("active");
        _b.setAttribute("aria-selected", "false");
    });

    let _target_view = document.getElementById(target_view_id);
    if (_target_view) { _target_view.classList.add("active"); }
    if (nav_btn_element)
    {
        nav_btn_element.classList.add("active");
        nav_btn_element.setAttribute("aria-selected", "true");
    }
}

function UpdateTopHeaderUI()
{
    let _m = dojo_members_data[active_member_id];
    if (!_m) { return; }
    let _belt_cfg = GetBeltVisualConfig(_m.belt_color, _m.rank);

    document.getElementById("ui_header_name").textContent = _m.name + " (Mein Nafuda)";
    document.getElementById("ui_header_rank").textContent = _m.rank + " (" + _belt_cfg.label + ")";

    document.getElementById("ui_taiden_xp").textContent = String(_m.taiden_xp);
    document.getElementById("ui_kuden_xp").textContent = String(_m.kuden_xp);
    document.getElementById("ui_exchange_kuden").textContent = String(_m.kuden_xp);

    document.getElementById("ui_dam_pool_progress").textContent = dam_stage_current_xp + " / " + dam_stage_required_xp + " Taiden XP";
    let _pct = Math.min(100, Math.round((dam_stage_current_xp / dam_stage_required_xp) * 100));
    document.getElementById("ui_dam_pool_bar").style.width = _pct + "%";
}

// =============================================================================
// SVG STAMP GENERATORS (ALL 5 SEALS)
// =============================================================================

function GetStampSvgHtml(stamp_type, size_px)
{
    if (stamp_type === "dojo_stamp")
    {
        return `
            <svg width="${size_px}" height="${size_px}" viewBox="0 0 40 40" aria-hidden="true">
                <rect x="2" y="2" width="36" height="36" rx="6" fill="#b91c1c" stroke="#f8fafc" stroke-width="1.5"/>
                <circle cx="20" cy="20" r="14" fill="#ffffff" stroke="#0a0a0a" stroke-width="2"/>
                <path d="M11 15 C13 12, 17 14, 18 17 C15 18, 12 17, 11 15 Z" fill="#0a0a0a"/>
                <path d="M29 15 C27 12, 23 14, 22 17 C25 18, 28 17, 29 15 Z" fill="#0a0a0a"/>
                <ellipse cx="20" cy="18.5" rx="2.5" ry="1.5" fill="#0a0a0a"/>
                <path d="M12 21 Q20 23 28 21 L26 31 Q20 29 14 31 Z" fill="#0a0a0a"/>
                <rect x="18" y="21" width="4" height="10" fill="#ffffff" stroke="#0a0a0a" stroke-width="0.6"/>
            </svg>
        `;
    }
    else if (stamp_type === "bujin_logo")
    {
        return `
            <svg width="${size_px}" height="${size_px}" viewBox="0 0 40 40" aria-hidden="true">
                <circle cx="20" cy="20" r="17" fill="#b91c1c" stroke="#fbbf24" stroke-width="2.2"/>
                <text x="20" y="18" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="900">武</text>
                <text x="20" y="31" text-anchor="middle" fill="#fbbf24" font-size="11" font-weight="900">神</text>
            </svg>
        `;
    }
    else if (stamp_type === "kanji_nin")
    {
        return `
            <svg width="${size_px}" height="${size_px}" viewBox="0 0 40 40" aria-hidden="true">
                <circle cx="20" cy="20" r="17" fill="rgba(255,255,255,0.92)" stroke="#b91c1c" stroke-width="2.8"/>
                <text x="20" y="27" text-anchor="middle" fill="#111111" font-size="20" font-weight="900">忍</text>
            </svg>
        `;
    }
    else if (stamp_type === "kanji_umidanuki")
    {
        return `
            <svg width="${size_px}" height="${size_px}" viewBox="0 0 40 40" aria-hidden="true">
                <circle cx="20" cy="20" r="17" fill="rgba(255,255,255,0.92)" stroke="#9e380e" stroke-width="2.8"/>
                <text x="20" y="18" text-anchor="middle" fill="#111111" font-size="12" font-weight="900">海</text>
                <text x="20" y="31" text-anchor="middle" fill="#111111" font-size="12" font-weight="900">狸</text>
            </svg>
        `;
    }
    else if (stamp_type === "kanji_samurai")
    {
        return `
            <svg width="${size_px}" height="${size_px}" viewBox="0 0 40 40" aria-hidden="true">
                <circle cx="20" cy="20" r="17" fill="rgba(255,255,255,0.92)" stroke="#111111" stroke-width="2.8"/>
                <text x="20" y="27" text-anchor="middle" fill="#b91c1c" font-size="20" font-weight="900">侍</text>
            </svg>
        `;
    }
    return "";
}

// =============================================================================
// 4-ROW NAFUDAKAKE (SERVER-SORTED) & PORTRAIT SAMPLE-NAFUDA WORKSHOP
// =============================================================================

function GetMemberWoodClass(wood_type)
{
    if (wood_type === "yakisugi") { return "wood-yakisugi"; }
    if (wood_type === "ebony") { return "wood-ebony"; }
    if (wood_type === "sugi") { return "wood-sugi"; }
    if (wood_type === "hinoki") { return "wood-hinoki"; }
    if (wood_type === "kurogaki") { return "wood-kurogaki"; }
    return "wood-standard";
}

function GetMemberInkClass(ink_type, wood_type)
{
    if (ink_type === "gold") { return "ink-gold"; }
    if (ink_type === "silver") { return "ink-silver"; }
    if (ink_type === "red") { return "ink-red"; }
    if (ink_type === "green") { return "ink-green"; }
    if (ink_type === "purple") { return "ink-purple"; }
    return (wood_type === "yakisugi" || wood_type === "ebony") ? "ink-standard-dark" : "ink-standard-light";
}

function DetermineMemberRowNumber(member_obj)
{
    if (member_obj.row >= 1 && member_obj.row <= 4)
    {
        return member_obj.row;
    }

    let _belt = String(member_obj.belt_color || "").toLowerCase().trim();
    let _rank = String(member_obj.rank || "").toLowerCase().trim();

    if (_belt.indexOf("gelb") !== -1 || _rank.indexOf("jôdan") !== -1 || _rank.indexOf("jodan") !== -1 || _rank.indexOf("chûdan") !== -1 || _rank.indexOf("chudan") !== -1 || _rank.indexOf("gedan") !== -1)
    {
        return 3;
    }

    let _is_true_dan = /\b(\d+)\.\s*dan\b/.test(_rank) ||
        _rank.indexOf("shodan") !== -1 ||
        _rank.indexOf("nidan") !== -1 ||
        _rank.indexOf("sandan") !== -1 ||
        _rank.indexOf("yondan") !== -1 ||
        _rank.indexOf("godan") !== -1 ||
        _rank.indexOf("shidôshi") !== -1 ||
        _rank.indexOf("shidoshi") !== -1 ||
        _rank.indexOf("shihan") !== -1;

    if (_is_true_dan || _belt === "schwarz" || _belt === "shidoshi")
    {
        return 1;
    }

    if (_belt === "grün" || _belt === "gruen" || _belt === "rot")
    {
        return 2;
    }

    return 4;
}

function CreateBackTiesMarkup()
{
    return `
        <div class="nafuda-back-ties" aria-hidden="true">
            <div class="tie-col"><span>✖</span><span>✖</span></div>
            <div class="tie-col"><span>✖</span><span>✖</span></div>
            <div class="tie-col"><span>✖</span><span>✖</span></div>
        </div>
    `;
}

function RenderNafudakakeBoard()
{
    let _row_elements = {
        1: document.getElementById("nafuda_row_1"),
        2: document.getElementById("nafuda_row_2"),
        3: document.getElementById("nafuda_row_3"),
        4: document.getElementById("nafuda_row_4")
    };

    let _ties_html = CreateBackTiesMarkup();

    _row_elements[1].innerHTML = _ties_html + `<div class="nafuda-plaque rank-divider"><div class="nafuda-jp">指導士</div><div class="nafuda-stripe stripe-dan"></div><div class="nafuda-stamp-slot"></div><div class="nafuda-romaji">SHIDÔSHI</div></div>`;
    _row_elements[2].innerHTML = _ties_html + `<div class="nafuda-plaque rank-divider"><div class="nafuda-jp">先輩・後輩</div><div class="nafuda-stripe stripe-green"></div><div class="nafuda-stamp-slot"></div><div class="nafuda-romaji">SENPAI &amp;<br>KÔHAI</div></div>`;
    _row_elements[3].innerHTML = _ties_html + `<div class="nafuda-plaque rank-divider"><div class="nafuda-jp">少年部</div><div class="nafuda-stripe stripe-yellow"></div><div class="nafuda-stamp-slot"></div><div class="nafuda-romaji">KIDS<br>GELB</div></div>`;
    _row_elements[4].innerHTML = _ties_html + `<div class="nafuda-plaque rank-divider"><div class="nafuda-jp">白帯</div><div class="nafuda-stripe stripe-white"></div><div class="nafuda-stamp-slot"></div><div class="nafuda-romaji">WEISSER<br>GÜRTEL</div></div>`;

    let _members_array = Object.keys(dojo_members_data).map(function(_k)
    {
        let _m = dojo_members_data[_k];
        _m.row = DetermineMemberRowNumber(_m);
        return _m;
    });

    // Preserve exact server-computed order (no raw entry_ts exposed to frontend)
    _members_array.sort(function(_a, _b)
    {
        let _order_a = (typeof _a.sort_order === "number") ? _a.sort_order : 999999;
        let _order_b = (typeof _b.sort_order === "number") ? _b.sort_order : 999999;
        if (_order_a !== _order_b) { return _order_a - _order_b; }
        return String(_a.name).localeCompare(String(_b.name), "de");
    });

    _members_array.forEach(function(_m)
    {
        let _own_cls = (_m.id === active_member_id) ? " own-plaque" : "";
        let _wood_cls = GetMemberWoodClass(_m.wood_type);
        let _ink_cls = GetMemberInkClass(_m.ink_type, _m.wood_type);
        let _belt_cfg = GetBeltVisualConfig(_m.belt_color, _m.rank);
        let _stamp_svg = GetStampSvgHtml(_m.stamp_type, 16);

        let _plaque_btn = document.createElement("button");
        _plaque_btn.type = "button";
        _plaque_btn.className = "nafuda-plaque " + _wood_cls + _own_cls;
        _plaque_btn.setAttribute("aria-label", _m.name + " (" + _m.rank + ")");
        _plaque_btn.innerHTML = `
            <div class="nafuda-jp ${_ink_cls}">${EscapeHtml(_m.jp)}</div>
            <div class="nafuda-stripe ${_belt_cfg.css_class}">${EscapeHtml(_belt_cfg.sub_mark)}</div>
            <div class="nafuda-stamp-slot">${_stamp_svg}</div>
            <div class="nafuda-romaji ${_ink_cls}">${EscapeHtml(_m.name)}<br>${EscapeHtml(_m.rank)}</div>
        `;
        _plaque_btn.addEventListener("click", function()
        {
            HandleNafudaClick(_m.id);
        });

        let _target_row = _row_elements[_m.row] || _row_elements[4];
        _target_row.appendChild(_plaque_btn);
    });
}

function RenderCosmeticWorkshopCards()
{
    let _wood_grid = document.getElementById("ui_shop_wood_grid");
    _wood_grid.innerHTML = "";
    wood_shop_options.forEach(function(_opt)
    {
        let _card = document.createElement("button");
        _card.type = "button";
        _card.className = "cosmetic-option-card";
        _card.id = "opt_wood_" + _opt.key;
        _card.innerHTML = `
            <div class="sample-nafuda ${_opt.css}"></div>
            <div class="cosmetic-opt-label">${EscapeHtml(_opt.label)}</div>
        `;
        _card.addEventListener("click", function()
        {
            BuyNafudaCosmetic("wood", _opt.key, _opt.cost);
        });
        _wood_grid.appendChild(_card);
    });

    let _ink_grid = document.getElementById("ui_shop_ink_grid");
    _ink_grid.innerHTML = "";
    ink_shop_options.forEach(function(_opt)
    {
        let _card = document.createElement("button");
        _card.type = "button";
        _card.className = "cosmetic-option-card";
        _card.id = "opt_ink_" + _opt.key;
        _card.innerHTML = `
            <div class="sample-nafuda wood-standard">
                <div class="sample-nafuda-jp ${_opt.css}">名前</div>
                <div class="nafuda-stripe stripe-white"></div>
                <div class="sample-nafuda-rank ${_opt.css}">10. Kyû</div>
            </div>
            <div class="cosmetic-opt-label">${EscapeHtml(_opt.label)}</div>
        `;
        _card.addEventListener("click", function()
        {
            BuyNafudaCosmetic("ink", _opt.key, _opt.cost);
        });
        _ink_grid.appendChild(_card);
    });

    let _stamp_grid = document.getElementById("ui_shop_stamp_grid");
    _stamp_grid.innerHTML = "";
    stamp_shop_options.forEach(function(_opt)
    {
        let _svg = GetStampSvgHtml(_opt.key, 26);
        let _card = document.createElement("button");
        _card.type = "button";
        _card.className = "cosmetic-option-card";
        _card.id = "opt_stamp_" + _opt.key;
        _card.innerHTML = `
            <div class="sample-nafuda wood-standard center-only">${_svg}</div>
            <div class="cosmetic-opt-label">${EscapeHtml(_opt.label)}</div>
        `;
        _card.addEventListener("click", function()
        {
            BuyNafudaCosmetic("stamp", _opt.key, _opt.cost);
        });
        _stamp_grid.appendChild(_card);
    });
}

async function BuyNafudaCosmetic(category_key, item_value, cost_kuden)
{
    if (is_action_in_flight) { return; }

    let _m = dojo_members_data[active_member_id];
    if (!_m) { return; }

    let _already_equipped = (
        (category_key === "wood" && _m.wood_type === item_value) ||
        (category_key === "ink" && _m.ink_type === item_value) ||
        (category_key === "stamp" && _m.stamp_type === item_value)
    );

    if (_already_equipped)
    {
        ShowToastMessage("✔ Diese Veredelung ist bereits auf deinem Nafuda aktiv!");
        return;
    }

    if (_m.kuden_xp < cost_kuden)
    {
        ShowToastMessage("⚠️ Nicht genug Kuden XP (" + cost_kuden + " benötigt)!");
        return;
    }

    is_action_in_flight = true;
    try
    {
        let _data = await SendAuthenticatedAction("buy_cosmetic", {
            category: category_key,
            item: item_value
        });

        if (_data && _data.status === "ok")
        {
            ApplyAuthoritativeBalances(_data.own_balances);
            RenderNafudakakeBoard();
            UpdateCosmeticShopUI();
            ShowToastMessage("🎨 Nafuda-Veredelung aktiviert & gespeichert!");
        }
    }
    finally
    {
        is_action_in_flight = false;
    }
}

function UpdateCosmeticShopUI()
{
    let _m = dojo_members_data[active_member_id];
    if (!_m) { return; }

    let _active_wood_label = "Standard-Zeder";
    wood_shop_options.forEach(function(_opt)
    {
        let _el = document.getElementById("opt_wood_" + _opt.key);
        if (_el) { _el.classList.toggle("equipped", _m.wood_type === _opt.key); }
        if (_m.wood_type === _opt.key) { _active_wood_label = _opt.desc; }
    });

    let _active_ink_label = "Klassisch";
    ink_shop_options.forEach(function(_opt)
    {
        let _el = document.getElementById("opt_ink_" + _opt.key);
        if (_el) { _el.classList.toggle("equipped", _m.ink_type === _opt.key); }
        if (_m.ink_type === _opt.key) { _active_ink_label = _opt.desc; }
    });

    let _active_stamp_label = "Kein Siegel";
    stamp_shop_options.forEach(function(_opt)
    {
        let _el = document.getElementById("opt_stamp_" + _opt.key);
        if (_el) { _el.classList.toggle("equipped", _m.stamp_type === _opt.key); }
        if (_m.stamp_type === _opt.key) { _active_stamp_label = _opt.desc; }
    });

    document.getElementById("ui_wood_status").textContent = _active_wood_label;
    document.getElementById("ui_ink_status").textContent = _active_ink_label;
    document.getElementById("ui_stamp_status").textContent = _active_stamp_label;
}

function HandleNafudaClick(member_id)
{
    if (member_id !== active_member_id)
    {
        ShowToastMessage("🔒 Detail-Statistik ist nur für das eigene Nafuda einsehbar.");
        return;
    }
    OpenMemberDashboard(member_id);
}

function OpenMemberDashboard(member_id)
{
    let _m = dojo_members_data[member_id];
    if (!_m) { return; }

    let _sheet = document.getElementById("ui_modal_sheet");
    let _wood_cls = GetMemberWoodClass(_m.wood_type);
    let _ink_cls = GetMemberInkClass(_m.ink_type, _m.wood_type);
    let _belt_cfg = GetBeltVisualConfig(_m.belt_color, _m.rank);

    _sheet.className = "modal-sheet " + _wood_cls;

    let _watermark = document.getElementById("modal_watermark_jp");
    _watermark.textContent = _m.jp;
    _watermark.className = "modal-nafuda-watermark " + _ink_cls;

    document.getElementById("modal_belt_label_top").textContent = "Gürtel: " + _belt_cfg.label;

    let _title_el = document.getElementById("modal_member_name");
    _title_el.textContent = _m.name + " • " + _m.rank;
    _title_el.className = "modal-member-name " + _ink_cls;

    document.getElementById("modal_belt_stripe").className = "nafuda-stripe modal-belt-stripe " + _belt_cfg.css_class;
    document.getElementById("modal_stamp_preview").innerHTML = GetStampSvgHtml(_m.stamp_type, 32);

    document.getElementById("modal_taiden_lvl").textContent = "Lvl " + (Math.floor(_m.trainings / 5) + 1);
    document.getElementById("modal_month_contrib").textContent = _m.month_contribution + " XP";
    document.getElementById("modal_kuden_lvl").textContent = "Lvl " + (Math.floor(_m.kuden_xp / 100) + 1);
    document.getElementById("modal_kuden_xp").textContent = String(_m.kuden_xp);
    document.getElementById("modal_total_trainings").textContent = String(_m.trainings);
    document.getElementById("modal_streak").textContent = _m.streak_weeks + " Wo.";

    let _bars = document.getElementById("modal_skill_bars");
    let _stat_keys = Object.keys(_m.stats || {});
    if (_stat_keys.length === 0)
    {
        _bars.innerHTML = `<div class="empty-hint">Noch keine Trainings-Tags gescannt.</div>`;
    }
    else
    {
        _stat_keys.sort(function(_a, _b)
        {
            return (_m.stats[_b] || 0) - (_m.stats[_a] || 0);
        });
        _bars.innerHTML = _stat_keys.map(function(_topic)
        {
            let _cnt = Number(_m.stats[_topic]) || 0;
            let _pct = Math.min(100, Math.round((_cnt / 30) * 100));
            return `
                <div class="skill-bar-item">
                    <div class="skill-bar-header">
                        <span>${EscapeHtml(_topic)}</span>
                        <span class="skill-bar-count">${_cnt}x</span>
                    </div>
                    <div class="progress-track progress-track-thin"><div class="progress-fill" style="width:${_pct}%;"></div></div>
                </div>
            `;
        }).join("");
    }

    let _logs_box = document.getElementById("modal_recent_logs");
    let _last_three = (_m.logs || []).slice(0, 3);
    if (_last_three.length === 0)
    {
        _logs_box.innerHTML = `<div class="empty-hint">Noch keine Trainings-Check-Ins verbucht.</div>`;
    }
    else
    {
        _logs_box.innerHTML = _last_three.map(function(_log)
        {
            return `
                <div class="log-entry">
                    <div class="log-entry-date">✔ ${EscapeHtml(_log.date)}</div>
                    <div class="log-entry-topics">Trainiert: ${EscapeHtml(_log.topics)}</div>
                </div>
            `;
        }).join("");
    }

    let _dialog = document.getElementById("ui_member_modal");
    if (_dialog && typeof _dialog.showModal === "function")
    {
        if (!_dialog.open)
        {
            _dialog.showModal();
        }
    }
    else if (_dialog)
    {
        _dialog.setAttribute("open", "");
    }
}

function CloseMemberDashboard()
{
    let _dialog = document.getElementById("ui_member_modal");
    if (!_dialog) { return; }

    if (typeof _dialog.close === "function" && _dialog.open)
    {
        _dialog.close();
    }
    else
    {
        _dialog.removeAttribute("open");
    }
}

// =============================================================================
// COOPERATIVE DAM BUILDING & RACE-FREE CUSTOM SPRITE LOADER
// =============================================================================

async function ContributeTaidenToDam(amount_to_spend)
{
    if (is_action_in_flight) { return; }

    let _m = dojo_members_data[active_member_id];
    if (!_m) { return; }

    if (dojo_dam_stage >= 50)
    {
        ShowToastMessage("🌸 Stufe 50 ist bereits vollständig erreicht!");
        return;
    }
    if (_m.taiden_xp < amount_to_spend)
    {
        ShowToastMessage("⚠️ Nicht genug Taiden XP! Tausche Kuden XP oder scanne im Training.");
        return;
    }

    is_action_in_flight = true;
    let _b1 = document.getElementById("btn_contribute_1");
    let _b5 = document.getElementById("btn_contribute_5");
    if (_b1) { _b1.disabled = true; }
    if (_b5) { _b5.disabled = true; }

    try
    {
        let _data = await SendAuthenticatedAction("contribute_dam", { amount: amount_to_spend });
        if (_data && _data.status === "ok")
        {
            ApplyAuthoritativeBalances(_data.own_balances);
            ApplyAuthoritativeDamState(_data.dojo_dam);
            ShowToastMessage("🪵 +" + amount_to_spend + " Taiden XP in den Dôjô Damm eingezahlt!");
        }
    }
    finally
    {
        is_action_in_flight = false;
        if (_b1) { _b1.disabled = false; }
        if (_b5) { _b5.disabled = false; }
    }
}

function PreviewDamVisualStageOnly(preview_stage_num)
{
    is_trainer_dam_preview_active = true;
    RenderDamGraphicsByLevel(Number(preview_stage_num), true);
}

function ResetDamToLiveStage()
{
    is_trainer_dam_preview_active = false;
    RenderDamVisualStage(dojo_dam_stage);
    ShowToastMessage("🏯 Zurück zur offiziellen Live-Stufe (" + dojo_dam_stage + ")!");
}

function RenderDamVisualStage(live_stage_num)
{
    dojo_dam_stage = Number(live_stage_num) || 1;
    is_trainer_dam_preview_active = false;
    document.getElementById("ui_stage_slider").value = String(dojo_dam_stage);
    RenderDamGraphicsByLevel(dojo_dam_stage, false);
}

function TryLoadCustomDamSprite(stage_num)
{
    let _sprite_img = document.getElementById("ui_custom_dam_sprite");
    let _svg_stage = document.querySelector(".svg-stage");
    let _sprite_path = "sprites/spr_dam_lvl_" + stage_num + ".png";
    let _req_id = ++dam_sprite_request_id;

    if (dam_sprite_availability_cache[_sprite_path] === false)
    {
        _sprite_img.style.display = "none";
        _svg_stage.style.display = "block";
        return;
    }

    if (dam_sprite_availability_cache[_sprite_path] === true)
    {
        _sprite_img.src = _sprite_path;
        _sprite_img.style.display = "block";
        _svg_stage.style.display = "none";
        return;
    }

    let _probe = new Image();
    _probe.onload = function()
    {
        dam_sprite_availability_cache[_sprite_path] = true;
        if (_req_id !== dam_sprite_request_id) { return; }
        _sprite_img.src = _sprite_path;
        _sprite_img.style.display = "block";
        _svg_stage.style.display = "none";
    };

    _probe.onerror = function()
    {
        dam_sprite_availability_cache[_sprite_path] = false;
        if (_req_id !== dam_sprite_request_id) { return; }
        _sprite_img.style.display = "none";
        _svg_stage.style.display = "block";
    };

    _probe.src = _sprite_path;
}

function RenderDamGraphicsByLevel(stage_num, is_preview)
{
    let _lvl = Math.max(1, Math.min(50, Number(stage_num) || 1));
    TryLoadCustomDamSprite(_lvl);

    let _badge_suffix = is_preview ? " (Vorschau)" : " / 50";
    document.getElementById("ui_dam_level_badge").textContent = "Stufe " + _lvl + _badge_suffix;

    let _phase = "PHASE 1: DAMM-FUNDAMENT (1–5)";
    let _title = "Stufe " + _lvl + ": Sträucher & Baumstämme im Mellensee";
    if (_lvl >= 6 && _lvl <= 10) { _phase = "PHASE 2: SCHREIN-BIBERBURG (6–10)"; _title = "Stufe " + _lvl + ": Biberburg im Stil eines Schreins"; }
    else if (_lvl >= 11 && _lvl <= 15) { _phase = "PHASE 3: DAS UMIDANUKI DÔJÔ (11–15)"; _title = "Stufe " + _lvl + ": Dôjô-Halle mit Schildern & Niô-Wächtern"; }
    else if (_lvl >= 16 && _lvl <= 19) { _phase = "PHASE 4: ROTE TORII-ALLEE (16–19)"; _title = "Stufe " + _lvl + ": Torii-Bögen weisen den Weg"; }
    else if (_lvl >= 20 && _lvl <= 25) { _phase = "PHASE 5: AUSSENTRAININGSBEREICH (20–25)"; _title = "Stufe " + _lvl + ": Schnitttest, Shuriken, Pfähle & Meditationsinsel"; }
    else if (_lvl >= 26 && _lvl <= 35) { _phase = "PHASE 6: JAPANISCHES SCHLOSS (26–35)"; _title = "Stufe " + _lvl + ": Das Shiro erhebt sich im Hintergrund"; }
    else if (_lvl >= 36 && _lvl <= 40) { _phase = "PHASE 7: RÜSTUNGEN & NANA KOROBI (36–40)"; _title = "Stufe " + _lvl + ": Samurai-Rüstungen & Tafel 七転び八起き"; }
    else if (_lvl >= 41) { _phase = "PHASE 8: SAKURA & JAPANISCHER GARTEN (41–50)"; _title = "Stufe " + _lvl + ": Blühende Sakura-Bäume & Schlossgarten"; }

    document.getElementById("ui_stage_phase").textContent = _phase;
    document.getElementById("ui_stage_title").textContent = _title;

    document.getElementById("dam_lvl_3_5").setAttribute("opacity", _lvl >= 3 ? "1" : "0");
    document.getElementById("layer_shrine_lodge").setAttribute("opacity", _lvl >= 6 ? "1" : "0");
    document.getElementById("shrine_roof").setAttribute("opacity", _lvl >= 8 ? "1" : "0");
    document.getElementById("layer_dojo_hall").setAttribute("opacity", _lvl >= 11 ? "1" : "0");
    document.getElementById("nio_statues").setAttribute("opacity", _lvl >= 13 ? "1" : "0");
    document.getElementById("layer_torii_row").setAttribute("opacity", _lvl >= 16 ? "1" : "0");
    document.getElementById("torii_1").setAttribute("opacity", _lvl >= 16 ? "1" : "0");
    document.getElementById("torii_2").setAttribute("opacity", _lvl >= 18 ? "1" : "0");
    document.getElementById("torii_3").setAttribute("opacity", _lvl >= 19 ? "1" : "0");
    document.getElementById("layer_outdoor_training").setAttribute("opacity", _lvl >= 20 ? "1" : "0");
    document.getElementById("out_tameshigiri").setAttribute("opacity", _lvl >= 21 ? "1" : "0");
    document.getElementById("out_shuriken").setAttribute("opacity", _lvl >= 22 ? "1" : "0");
    document.getElementById("out_poles").setAttribute("opacity", _lvl >= 23 ? "1" : "0");
    document.getElementById("out_archery").setAttribute("opacity", _lvl >= 24 ? "1" : "0");
    document.getElementById("out_meditation_island").setAttribute("opacity", _lvl >= 25 ? "1" : "0");
    document.getElementById("layer_castle").setAttribute("opacity", _lvl >= 26 ? "1" : "0");
    document.getElementById("castle_tier1").setAttribute("opacity", _lvl >= 28 ? "1" : "0");
    document.getElementById("castle_tier2").setAttribute("opacity", _lvl >= 31 ? "1" : "0");
    document.getElementById("castle_top").setAttribute("opacity", _lvl >= 34 ? "1" : "0");
    document.getElementById("layer_decor_spirit").setAttribute("opacity", _lvl >= 36 ? "1" : "0");
    document.getElementById("decor_nanakorobi").setAttribute("opacity", _lvl >= 40 ? "1" : "0");
    document.getElementById("layer_sakura_garden").setAttribute("opacity", _lvl >= 41 ? "1" : "0");
    document.getElementById("layer_sakura_petals").setAttribute("opacity", _lvl >= 44 ? "1" : "0");
}

function GetSortedCurrentMonthTop3()
{
    let _arr = Object.keys(dojo_members_data)
        .map(function(_k)
        {
            return {
                name: dojo_members_data[_k].name,
                xp: dojo_members_data[_k].month_contribution || 0
            };
        })
        .filter(function(_entry)
        {
            return _entry.xp > 0;
        });

    _arr.sort(function(_a, _b)
    {
        if (_b.xp !== _a.xp) { return _b.xp - _a.xp; }
        return String(_a.name).localeCompare(String(_b.name), "de");
    });

    return _arr.slice(0, 3);
}

function RenderMonthlyLeaderboards()
{
    let _curr = GetSortedCurrentMonthTop3();
    let _medals = ["🥇", "🥈", "🥉"];

    if (_curr.length === 0)
    {
        document.getElementById("ui_top3_current").innerHTML = `<div class="empty-hint">Noch keine Einzahlungen</div>`;
    }
    else
    {
        document.getElementById("ui_top3_current").innerHTML = _curr.map(function(_e, _i)
        {
            return `<div class="podium-row"><span>${_medals[_i]} ${EscapeHtml(_e.name)}</span><span class="podium-xp">${Number(_e.xp) || 0} 🪵</span></div>`;
        }).join("");
    }

    let _valid_last = (last_month_top3_list || []).filter(function(_e) { return (Number(_e.xp) || 0) > 0; });
    if (_valid_last.length === 0)
    {
        document.getElementById("ui_top3_last").innerHTML = `<div class="empty-hint">Noch keine Daten</div>`;
    }
    else
    {
        document.getElementById("ui_top3_last").innerHTML = _valid_last.slice(0, 3).map(function(_e, _i)
        {
            return `<div class="podium-row"><span>${_medals[_i]} ${EscapeHtml(_e.name)}</span><span class="podium-xp">${Number(_e.xp) || 0} 🪵</span></div>`;
        }).join("");
    }
}

// =============================================================================
// KUDEN QUIZ (DYNAMIC 1 CORRECT + 3 RANDOM FROM 6 WRONG POOL) & 100:1 EXCHANGE
// =============================================================================

function RenderKudenQuiz()
{
    if (quiz_next_timeout_id !== null)
    {
        clearTimeout(quiz_next_timeout_id);
        quiz_next_timeout_id = null;
    }

    let _q = kuden_quiz_questions[current_quiz_index];
    if (!_q) { return; }

    document.getElementById("ui_quiz_cat").textContent = _q.category + " (" + (current_quiz_index + 1) + "/" + kuden_quiz_questions.length + ")";
    document.getElementById("ui_quiz_question").textContent = _q.question;

    let _box = document.getElementById("ui_quiz_options");
    _box.innerHTML = "";

    let _wrong_copy = ShuffleArrayInPlace(_q.wrong_pool.slice());
    let _chosen_wrongs = _wrong_copy.slice(0, 3);

    let _displayed_options = [{ text: _q.correct, is_correct: true }];
    _chosen_wrongs.forEach(function(_w_text)
    {
        _displayed_options.push({ text: _w_text, is_correct: false });
    });
    ShuffleArrayInPlace(_displayed_options);

    let _answered_lock = false;

    _displayed_options.forEach(function(_opt_obj)
    {
        let _btn = document.createElement("button");
        _btn.type = "button";
        _btn.className = "quiz-opt-btn";
        _btn.textContent = _opt_obj.text;
        _btn.dataset.isCorrect = _opt_obj.is_correct ? "1" : "0";

        _btn.addEventListener("click", function()
        {
            if (_answered_lock) { return; }
            _answered_lock = true;

            let _all_btns = _box.querySelectorAll(".quiz-opt-btn");
            _all_btns.forEach(function(_b) { _b.disabled = true; });

            if (_opt_obj.is_correct)
            {
                _btn.classList.add("correct");
                ShowToastMessage("📜 Richtig! +10 Kuden XP");
                SendAuthenticatedAction("quiz_answer_correct", {}).then(function(_data)
                {
                    if (_data && _data.status === "ok")
                    {
                        ApplyAuthoritativeBalances(_data.own_balances);
                    }
                });
            }
            else
            {
                _btn.classList.add("wrong");
                _all_btns.forEach(function(_b)
                {
                    if (_b.dataset.isCorrect === "1")
                    {
                        _b.classList.add("correct");
                    }
                });
                ShowToastMessage("⚡ Nicht ganz – merk dir die grüne Antwort!");
            }

            quiz_next_timeout_id = setTimeout(function()
            {
                quiz_next_timeout_id = null;
                current_quiz_index += 1;
                if (current_quiz_index >= kuden_quiz_questions.length)
                {
                    current_quiz_index = 0;
                    ShuffleArrayInPlace(kuden_quiz_questions);
                }
                RenderKudenQuiz();
            }, 1150);
        });
        _box.appendChild(_btn);
    });
}

async function ExchangeKudenToTaiden()
{
    if (is_action_in_flight) { return; }

    let _m = dojo_members_data[active_member_id];
    if (!_m) { return; }

    if (_m.kuden_xp < 100)
    {
        ShowToastMessage("⚠️ Du benötigst 100 Kuden XP für den 100:1-Tausch!");
        return;
    }

    is_action_in_flight = true;
    let _btn = document.getElementById("btn_exchange_kuden");
    if (_btn) { _btn.disabled = true; }

    try
    {
        let _data = await SendAuthenticatedAction("exchange_kuden", {});
        if (_data && _data.status === "ok")
        {
            ApplyAuthoritativeBalances(_data.own_balances);
            ShowToastMessage("🔄 100 Kuden XP ➔ +1 Taiden XP getauscht!");
        }
    }
    finally
    {
        is_action_in_flight = false;
        if (_btn) { _btn.disabled = false; }
    }
}

// =============================================================================
// LOCAL ISO/IEC 18004 QR-CODE SVG GENERATOR (VERSION 2-M, ZERO EXTERNAL API)
// =============================================================================

function QrGfMultiply(val_a, val_b)
{
    let _res = 0;
    let _a = val_a;
    let _b = val_b;
    for (let _i = 0; _i < 8; _i++)
    {
        if ((_b & 1) !== 0) { _res ^= _a; }
        let _hi = (_a & 0x80) !== 0;
        _a = (_a << 1) & 0xFF;
        if (_hi) { _a ^= 0x1D; }
        _b >>= 1;
    }
    return _res;
}

function QrComputeReedSolomonEc(data_bytes, ec_count)
{
    // Generator polynomial: prod_{i=0}^{ec_count-1} (x - alpha^i) in GF(256)
    let _gen = [1];
    let _alpha_pow = 1;
    for (let _i = 0; _i < ec_count; _i++)
    {
        let _next = new Array(_gen.length + 1).fill(0);
        for (let _j = 0; _j < _gen.length; _j++)
        {
            _next[_j] ^= _gen[_j];
            _next[_j + 1] ^= QrGfMultiply(_gen[_j], _alpha_pow);
        }
        _gen = _next;
        _alpha_pow = QrGfMultiply(_alpha_pow, 2);
    }

    let _rem = new Array(ec_count).fill(0);
    for (let _d = 0; _d < data_bytes.length; _d++)
    {
        let _factor = data_bytes[_d] ^ _rem[0];
        _rem.shift();
        _rem.push(0);
        for (let _k = 0; _k < ec_count; _k++)
        {
            _rem[_k] ^= QrGfMultiply(_gen[_k + 1], _factor);
        }
    }
    return _rem;
}

function QrEvaluateMaskCondition(mask_id, row_idx, col_idx)
{
    if (mask_id === 0) { return ((row_idx + col_idx) % 2) === 0; }
    if (mask_id === 1) { return (row_idx % 2) === 0; }
    if (mask_id === 2) { return (col_idx % 3) === 0; }
    if (mask_id === 3) { return ((row_idx + col_idx) % 3) === 0; }
    if (mask_id === 4) { return ((Math.floor(row_idx / 2) + Math.floor(col_idx / 3)) % 2) === 0; }
    if (mask_id === 5) { return (((row_idx * col_idx) % 2) + ((row_idx * col_idx) % 3)) === 0; }
    if (mask_id === 6) { return ((((row_idx * col_idx) % 2) + ((row_idx * col_idx) % 3)) % 2) === 0; }
    return ((((row_idx + col_idx) % 2) + ((row_idx * col_idx) % 3)) % 2) === 0;
}

function QrComputeFormatBits(ec_format_bits, mask_id)
{
    let _data = ((ec_format_bits & 3) << 3) | (mask_id & 7);
    let _rem = _data;
    for (let _i = 0; _i < 10; _i++)
    {
        _rem = (_rem << 1) ^ (((_rem >> 9) & 1) * 0x537);
    }
    return ((_data << 10) | _rem) ^ 0x5412;
}

function QrApplyFormatInfo(matrix, size, ec_format_bits, mask_id)
{
    let _bits = QrComputeFormatBits(ec_format_bits, mask_id);
    // Copy 1 (top-left)
    let _coords_1 = [
        [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 7], [8, 8],
        [7, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8]
    ];
    // Copy 2 (bottom-left + top-right)
    let _coords_2 = [
        [size - 1, 8], [size - 2, 8], [size - 3, 8], [size - 4, 8],
        [size - 5, 8], [size - 6, 8], [size - 7, 8],
        [8, size - 8], [8, size - 7], [8, size - 6], [8, size - 5],
        [8, size - 4], [8, size - 3], [8, size - 2], [8, size - 1]
    ];

    for (let _i = 0; _i < 15; _i++)
    {
        let _is_dark = ((_bits >> (14 - _i)) & 1) === 1;
        matrix[_coords_1[_i][0]][_coords_1[_i][1]] = _is_dark;
        matrix[_coords_2[_i][0]][_coords_2[_i][1]] = _is_dark;
    }
}

function QrScorePenalty(matrix, size)
{
    let _penalty = 0;

    // Rule 1: runs of 5+ same-colored modules in rows and columns
    for (let _r = 0; _r < size; _r++)
    {
        let _run_len = 1;
        for (let _c = 1; _c < size; _c++)
        {
            if (matrix[_r][_c] === matrix[_r][_c - 1]) { _run_len++; }
            else
            {
                if (_run_len >= 5) { _penalty += _run_len - 2; }
                _run_len = 1;
            }
        }
        if (_run_len >= 5) { _penalty += _run_len - 2; }
    }

    for (let _c = 0; _c < size; _c++)
    {
        let _run_len = 1;
        for (let _r = 1; _r < size; _r++)
        {
            if (matrix[_r][_c] === matrix[_r - 1][_c]) { _run_len++; }
            else
            {
                if (_run_len >= 5) { _penalty += _run_len - 2; }
                _run_len = 1;
            }
        }
        if (_run_len >= 5) { _penalty += _run_len - 2; }
    }

    // Rule 2: 2x2 blocks of same color
    for (let _r = 0; _r < size - 1; _r++)
    {
        for (let _c = 0; _c < size - 1; _c++)
        {
            let _val = matrix[_r][_c];
            if (_val === matrix[_r][_c + 1] && _val === matrix[_r + 1][_c] && _val === matrix[_r + 1][_c + 1])
            {
                _penalty += 3;
            }
        }
    }

    // Rule 4: dark/light balance
    let _dark_count = 0;
    for (let _r = 0; _r < size; _r++)
    {
        for (let _c = 0; _c < size; _c++)
        {
            if (matrix[_r][_c]) { _dark_count++; }
        }
    }
    let _ratio_diff = Math.abs((_dark_count * 100) / (size * size) - 50);
    _penalty += Math.floor(_ratio_diff / 5) * 10;

    return _penalty;
}

function EncodeQrVersion2Matrix(text_str)
{
    // Version 2-M: 25x25, 28 data codewords (max 26 UTF-8 bytes), 16 EC codewords, 7 remainder bits
    let _size = 25;
    let _data_cap = 28;
    let _ec_count = 16;
    let _ec_format_bits = 0; // Level M = 00

    let _utf8_bytes = Array.from(new TextEncoder().encode(String(text_str || "")));
    if (_utf8_bytes.length > 26)
    {
        _utf8_bytes = _utf8_bytes.slice(0, 26);
    }

    // Build bit stream: Mode (0100 = Byte) + Length (8 bits) + Payload + Terminator
    let _bit_stream = [];
    let _push_bits = function(_val, _len)
    {
        for (let _b = _len - 1; _b >= 0; _b--)
        {
            _bit_stream.push((_val >> _b) & 1);
        }
    };

    _push_bits(0x4, 4);
    _push_bits(_utf8_bytes.length, 8);
    for (let _i = 0; _i < _utf8_bytes.length; _i++)
    {
        _push_bits(_utf8_bytes[_i], 8);
    }

    let _max_data_bits = _data_cap * 8;
    let _term_len = Math.min(4, _max_data_bits - _bit_stream.length);
    _push_bits(0, _term_len);

    while ((_bit_stream.length % 8) !== 0)
    {
        _bit_stream.push(0);
    }

    let _data_codewords = [];
    for (let _i = 0; _i < _bit_stream.length; _i += 8)
    {
        let _byte = 0;
        for (let _b = 0; _b < 8; _b++)
        {
            _byte = (_byte << 1) | _bit_stream[_i + _b];
        }
        _data_codewords.push(_byte);
    }

    let _pad_toggle = 0;
    while (_data_codewords.length < _data_cap)
    {
        _data_codewords.push(_pad_toggle === 0 ? 0xEC : 0x11);
        _pad_toggle = 1 - _pad_toggle;
    }

    let _ec_codewords = QrComputeReedSolomonEc(_data_codewords, _ec_count);
    let _all_codewords = _data_codewords.concat(_ec_codewords);

    let _final_bits = [];
    for (let _i = 0; _i < _all_codewords.length; _i++)
    {
        for (let _b = 7; _b >= 0; _b--)
        {
            _final_bits.push((_all_codewords[_i] >> _b) & 1);
        }
    }
    // 7 remainder bits for Version 2
    for (let _r = 0; _r < 7; _r++)
    {
        _final_bits.push(0);
    }

    // Prepare function-module mask and base matrix
    let _is_func = [];
    let _base_matrix = [];
    for (let _r = 0; _r < _size; _r++)
    {
        _is_func.push(new Array(_size).fill(false));
        _base_matrix.push(new Array(_size).fill(false));
    }

    let _set_func = function(_r, _c, _dark)
    {
        if (_r >= 0 && _r < _size && _c >= 0 && _c < _size)
        {
            _is_func[_r][_c] = true;
            _base_matrix[_r][_c] = _dark;
        }
    };

    // Place 3 finder patterns + 1-module white separators
    let _draw_finder = function(_top, _left)
    {
        for (let _dr = -1; _dr <= 7; _dr++)
        {
            for (let _dc = -1; _dc <= 7; _dc++)
            {
                let _in_outer = (_dr >= 0 && _dr <= 6 && _dc >= 0 && _dc <= 6);
                let _is_border = (_dr === 0 || _dr === 6 || _dc === 0 || _dc === 6);
                let _is_center = (_dr >= 2 && _dr <= 4 && _dc >= 2 && _dc <= 4);
                _set_func(_top + _dr, _left + _dc, _in_outer && (_is_border || _is_center));
            }
        }
    };

    _draw_finder(0, 0);
    _draw_finder(0, _size - 7);
    _draw_finder(_size - 7, 0);

    // Alignment pattern centered at (18, 18) for Version 2
    for (let _dr = -2; _dr <= 2; _dr++)
    {
        for (let _dc = -2; _dc <= 2; _dc++)
        {
            let _dist = Math.max(Math.abs(_dr), Math.abs(_dc));
            _set_func(18 + _dr, 18 + _dc, _dist !== 1);
        }
    }

    // Timing patterns
    for (let _i = 8; _i < _size - 8; _i++)
    {
        _set_func(6, _i, (_i % 2) === 0);
        _set_func(_i, 6, (_i % 2) === 0);
    }

    // Reserve format information areas and fixed dark module (17, 8)
    for (let _i = 0; _i <= 8; _i++)
    {
        if (!_is_func[8][_i]) { _set_func(8, _i, false); }
        if (!_is_func[_i][8]) { _set_func(_i, 8, false); }
    }
    for (let _i = _size - 8; _i < _size; _i++)
    {
        _set_func(8, _i, false);
        _set_func(_i, 8, false);
    }
    _set_func(17, 8, true);

    // Place data + EC bits in standard right-to-left zig-zag order
    let _bit_idx = 0;
    let _upward = true;
    for (let _right_col = _size - 1; _right_col >= 1; _right_col -= 2)
    {
        if (_right_col === 6) { _right_col = 5; }
        for (let _step = 0; _step < _size; _step++)
        {
            let _r = _upward ? (_size - 1 - _step) : _step;
            for (let _dx = 0; _dx < 2; _dx++)
            {
                let _c = _right_col - _dx;
                if (!_is_func[_r][_c])
                {
                    _base_matrix[_r][_c] = (_bit_idx < _final_bits.length) ? (_final_bits[_bit_idx] === 1) : false;
                    _bit_idx++;
                }
            }
        }
        _upward = !_upward;
    }

    // Pick lowest-penalty mask among all 8 ISO masks
    let _best_matrix = null;
    let _best_penalty = Infinity;
    for (let _mask_id = 0; _mask_id < 8; _mask_id++)
    {
        let _cand = [];
        for (let _r = 0; _r < _size; _r++)
        {
            let _row_copy = [];
            for (let _c = 0; _c < _size; _c++)
            {
                let _val = _base_matrix[_r][_c];
                if (!_is_func[_r][_c] && QrEvaluateMaskCondition(_mask_id, _r, _c))
                {
                    _val = !_val;
                }
                _row_copy.push(_val);
            }
            _cand.push(_row_copy);
        }

        QrApplyFormatInfo(_cand, _size, _ec_format_bits, _mask_id);
        let _pen = QrScorePenalty(_cand, _size);
        if (_pen < _best_penalty)
        {
            _best_penalty = _pen;
            _best_matrix = _cand;
        }
    }

    return _best_matrix;
}

function BuildLocalQrSvgHtml(text_str)
{
    let _matrix = EncodeQrVersion2Matrix(text_str);
    let _size = _matrix.length;
    let _quiet = 4;
    let _total = _size + _quiet * 2;
    let _path_parts = [];

    for (let _r = 0; _r < _size; _r++)
    {
        for (let _c = 0; _c < _size; _c++)
        {
            if (_matrix[_r][_c])
            {
                _path_parts.push("M" + (_c + _quiet) + "," + (_r + _quiet) + "h1v1h-1z");
            }
        }
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${_total} ${_total}" aria-hidden="true">` +
        `<rect width="${_total}" height="${_total}" fill="#ffffff"/>` +
        `<path d="${_path_parts.join("")}" fill="#000000"/>` +
        `</svg>`;
}

// =============================================================================
// SINGLE-USE QR CHECK-IN PROTECTION & SHIDOSHI QR GENERATOR
// =============================================================================

function GetRedeemedTokensForMember(member_id)
{
    try
    {
        let _raw = localStorage.getItem("umidanuki_redeemed_" + member_id);
        return _raw ? JSON.parse(_raw) : [];
    }
    catch (_e)
    {
        return [];
    }
}

function HasMemberRedeemedToken(member_id, token_upper)
{
    let _list = GetRedeemedTokensForMember(member_id);
    return _list.indexOf(token_upper) !== -1;
}

function MarkTokenAsRedeemedForMember(member_id, token_upper)
{
    let _list = GetRedeemedTokensForMember(member_id);
    if (_list.indexOf(token_upper) === -1)
    {
        _list.push(token_upper);
        if (_list.length > 50)
        {
            _list = _list.slice(_list.length - 50);
        }
        localStorage.setItem("umidanuki_redeemed_" + member_id, JSON.stringify(_list));
    }
}

function RenderTrainerTagCloud()
{
    let _cloud = document.getElementById("ui_trainer_tag_cloud");
    if (!_cloud) { return; }
    _cloud.innerHTML = "";

    available_training_tags.forEach(function(_t)
    {
        let _sel = selected_session_tags.indexOf(_t) !== -1;
        let _chip = document.createElement("button");
        _chip.type = "button";
        _chip.className = "tag-chip" + (_sel ? " selected" : "");
        _chip.setAttribute("aria-pressed", _sel ? "true" : "false");
        _chip.textContent = _t;
        _chip.addEventListener("click", function()
        {
            let _i = selected_session_tags.indexOf(_t);
            if (_i === -1) { selected_session_tags.push(_t); }
            else if (selected_session_tags.length > 1) { selected_session_tags.splice(_i, 1); }
            RenderTrainerTagCloud();
        });
        _cloud.appendChild(_chip);
    });
}

function SelectTrainingUnit(unit_name, clicked_btn)
{
    selected_training_unit = unit_name;
    let _all_btns = document.querySelectorAll(".unit-btn");
    _all_btns.forEach(function(_b) { _b.classList.remove("active-unit"); });
    if (clicked_btn) { clicked_btn.classList.add("active-unit"); }
    ShowToastMessage("🥋 Einheit gewählt: " + unit_name);
}

async function GenerateTaggedQrCode()
{
    if (is_generating_qr) { return; }

    if (!is_live_sheet_mode || !google_script_api_url)
    {
        ShowToastMessage("⚠️ Bitte zuerst im Dôjô anmelden!");
        return;
    }

    is_generating_qr = true;
    let _gen_btn = document.getElementById("btn_generate_qr");
    if (_gen_btn) { _gen_btn.disabled = true; }

    try
    {
        let _data = await SendAuthenticatedAction("generate_shidoshi_qr", {
            unit_name: selected_training_unit,
            tags: selected_session_tags
        });

        if (_data && _data.status === "ok" && _data.qr_token)
        {
            let _generated_token = _data.qr_token;
            document.getElementById("ui_qr_unit_title").textContent = selected_training_unit.toUpperCase();
            document.getElementById("ui_qr_tags_label").textContent = "Inhalte: " + selected_session_tags.join(", ");
            document.getElementById("ui_qr_code_pin").textContent = _generated_token;
            document.getElementById("ui_real_qr_box").innerHTML = BuildLocalQrSvgHtml(_generated_token);
            document.getElementById("ui_qr_result_box").style.display = "block";

            ShowToastMessage("🔐 QR-Code (" + selected_training_unit + ") lokal erzeugt!");
        }
    }
    finally
    {
        is_generating_qr = false;
        if (_gen_btn) { _gen_btn.disabled = false; }
    }
}

function ToggleCameraQrScanner()
{
    if (is_camera_transitioning) { return; }

    if (is_camera_scanning)
    {
        StopCameraQrScanner();
        return;
    }

    if (typeof Html5Qrcode === "undefined")
    {
        ShowToastMessage("⚠️ Kamera-Scanner nicht verfügbar (offline?) – bitte Code manuell eingeben.");
        return;
    }

    let _reader_el = document.getElementById("qr_camera_reader");
    let _btn = document.getElementById("btn_toggle_camera");
    _reader_el.style.display = "block";
    _btn.textContent = "⏹️ Kamera-Scanner beenden";

    if (!html5_qr_scanner)
    {
        html5_qr_scanner = new Html5Qrcode("qr_camera_reader");
    }

    is_camera_transitioning = true;
    html5_qr_scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        function(_decoded_text)
        {
            StopCameraQrScanner();
            document.getElementById("input_scan_token").value = _decoded_text.trim();
            SubmitTrainingCheckInCode();
        },
        function() {}
    ).then(function()
    {
        is_camera_scanning = true;
        is_camera_transitioning = false;
    }).catch(function()
    {
        is_camera_scanning = false;
        is_camera_transitioning = false;
        _reader_el.style.display = "none";
        _btn.textContent = "📷 QR-Code mit Kamera scannen";
        ShowToastMessage("⚠️ Kamerazugriff nicht möglich – bitte Code-Eingabe nutzen.");
    });
}

function StopCameraQrScanner()
{
    let _reader_el = document.getElementById("qr_camera_reader");
    let _btn = document.getElementById("btn_toggle_camera");

    if (html5_qr_scanner && is_camera_scanning)
    {
        is_camera_transitioning = true;
        html5_qr_scanner.stop().then(function()
        {
            is_camera_scanning = false;
            is_camera_transitioning = false;
            _reader_el.style.display = "none";
            _btn.textContent = "📷 QR-Code mit Kamera scannen";
        }).catch(function()
        {
            is_camera_scanning = false;
            is_camera_transitioning = false;
            _reader_el.style.display = "none";
            _btn.textContent = "📷 QR-Code mit Kamera scannen";
        });
    }
    else
    {
        _reader_el.style.display = "none";
        _btn.textContent = "📷 QR-Code mit Kamera scannen";
    }
}

async function SubmitTrainingCheckInCode()
{
    if (is_redeeming_token) { return; }

    let _token_raw = document.getElementById("input_scan_token").value.trim();
    let _token_upper = _token_raw.toUpperCase();
    let _m = dojo_members_data[active_member_id];

    if (!_m) { return; }
    if (_token_upper === "")
    {
        ShowToastMessage("⚠️ Bitte zuerst einen QR-Code scannen oder eingeben!");
        return;
    }

    if (HasMemberRedeemedToken(active_member_id, _token_upper))
    {
        ShowToastMessage("⚠️ Du hast diesen Trainings-Code bereits einmal eingelöst!");
        document.getElementById("input_scan_token").value = "";
        return;
    }

    is_redeeming_token = true;
    let _redeem_btn = document.getElementById("btn_redeem_token");
    _redeem_btn.disabled = true;

    try
    {
        let _data = await SendAuthenticatedAction("scan_training_qr", {
            qr_token: _token_upper
        });

        if (!_data || _data.status !== "ok")
        {
            return;
        }

        MarkTokenAsRedeemedForMember(active_member_id, _token_upper);
        document.getElementById("input_scan_token").value = "";

        _m.taiden_xp = _data.taiden_xp;
        _m.trainings = _data.trainings;
        if (typeof _data.streak_weeks === "number")
        {
            _m.streak_weeks = _data.streak_weeks;
        }
        _m.stats = _data.stats;
        _m.logs = _data.logs;
        UpdateTopHeaderUI();
        ShowToastMessage("🪵 +10 Taiden XP & Training im Google Sheet verbucht!");
    }
    finally
    {
        is_redeeming_token = false;
        _redeem_btn.disabled = false;
    }
}

document.addEventListener("DOMContentLoaded", InitializeDojoApp);
