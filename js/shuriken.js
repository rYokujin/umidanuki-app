// =============================================================================
// BUJINKAN UMIDANUKI DOJO - SHURIKEN WOOD-SPLITTER MINIGAME (CANVAS)
// =============================================================================

const shuriken_logical_width = 380;
const shuriken_logical_height = 220;

let wood_canvas = null;
let wood_ctx = null;
let shuriken_game_active = false;
let shuriken_is_starting = false;
let shuriken_round_token = "";
let shuriken_game_seconds = 20;
let shuriken_game_hits = 0;
let shuriken_timer_interval = null;
let shuriken_spawner_interval = null;
let shuriken_extra_spawn_timeout = null;
let shuriken_raf_id = null;
let shuriken_last_frame_ts = 0;

let flying_logs = [];
let split_halves = [];
let flying_shurikens = [];

function InitializeShurikenCanvas()
{
    wood_canvas = document.getElementById("shuriken_canvas");
    if (!wood_canvas) { return; }

    wood_ctx = wood_canvas.getContext("2d");
    ConfigureShurikenCanvasDpi();

    wood_canvas.addEventListener("pointerdown", function(_ev)
    {
        if (!shuriken_game_active) { return; }

        let _rect = wood_canvas.getBoundingClientRect();
        if (_rect.width <= 0 || _rect.height <= 0) { return; }

        let _click_x = ((_ev.clientX - _rect.left) / _rect.width) * shuriken_logical_width;
        let _click_y = ((_ev.clientY - _rect.top) / _rect.height) * shuriken_logical_height;
        CheckLogHit(_click_x, _click_y);
    });
}

function ConfigureShurikenCanvasDpi()
{
    if (!wood_canvas || !wood_ctx) { return; }

    let _dpr = Math.min(window.devicePixelRatio || 1, 2);
    wood_canvas.width = Math.round(shuriken_logical_width * _dpr);
    wood_canvas.height = Math.round(shuriken_logical_height * _dpr);
    wood_ctx.setTransform(_dpr, 0, 0, _dpr, 0, 0);
}

function ClearShurikenTimers()
{
    if (shuriken_timer_interval)
    {
        clearInterval(shuriken_timer_interval);
        shuriken_timer_interval = null;
    }
    if (shuriken_spawner_interval)
    {
        clearInterval(shuriken_spawner_interval);
        shuriken_spawner_interval = null;
    }
    if (shuriken_extra_spawn_timeout)
    {
        clearTimeout(shuriken_extra_spawn_timeout);
        shuriken_extra_spawn_timeout = null;
    }
    if (shuriken_raf_id !== null)
    {
        cancelAnimationFrame(shuriken_raf_id);
        shuriken_raf_id = null;
    }
}

async function StartShurikenWoodGame()
{
    if (shuriken_game_active || shuriken_is_starting) { return; }

    let _m = dojo_members_data[active_member_id];
    if (!_m || _m.kuden_xp < 50)
    {
        ShowToastMessage("⚠️ Du benötigst 50 Kuden XP für eine Runde!");
        return;
    }

    shuriken_is_starting = true;
    let _start_btn = document.getElementById("btn_start_shuriken");
    if (_start_btn) { _start_btn.disabled = true; }

    let _start_res = await SendAuthenticatedAction("shuriken_start", {});

    shuriken_is_starting = false;
    if (_start_btn) { _start_btn.disabled = false; }

    if (!_start_res || _start_res.status !== "ok" || !_start_res.round_token)
    {
        return;
    }

    ApplyAuthoritativeBalances(_start_res.own_balances);
    shuriken_round_token = _start_res.round_token;

    ClearShurikenTimers();
    ConfigureShurikenCanvasDpi();

    shuriken_game_active = true;
    shuriken_game_seconds = 20;
    shuriken_game_hits = 0;
    shuriken_last_frame_ts = 0;
    flying_logs = [];
    split_halves = [];
    flying_shurikens = [];

    document.getElementById("ui_game_timer").textContent = "20s";
    document.getElementById("ui_game_hits").textContent = "0";
    document.getElementById("ui_arena_overlay").style.display = "none";

    SpawnTossedLog();

    shuriken_spawner_interval = setInterval(function()
    {
        if (shuriken_game_active && shuriken_game_seconds > 1)
        {
            SpawnTossedLog();
            if (Math.random() < 0.35)
            {
                shuriken_extra_spawn_timeout = setTimeout(function()
                {
                    if (shuriken_game_active) { SpawnTossedLog(); }
                }, 200);
            }
        }
    }, 540);

    shuriken_timer_interval = setInterval(function()
    {
        if (!shuriken_game_active) { return; }
        shuriken_game_seconds -= 1;
        document.getElementById("ui_game_timer").textContent = shuriken_game_seconds + "s";
        if (shuriken_game_seconds <= 0)
        {
            EndShurikenWoodGame();
        }
    }, 1000);

    shuriken_raf_id = requestAnimationFrame(UpdateShurikenGameLoop);
}

function StopShurikenWoodGame(is_silent)
{
    if (!shuriken_game_active) { return; }

    shuriken_game_active = false;
    shuriken_round_token = "";
    ClearShurikenTimers();

    flying_logs = [];
    split_halves = [];
    flying_shurikens = [];

    if (wood_ctx)
    {
        wood_ctx.clearRect(0, 0, shuriken_logical_width, shuriken_logical_height);
    }

    let _overlay = document.getElementById("ui_arena_overlay");
    let _msg = document.getElementById("ui_arena_msg");
    if (_overlay) { _overlay.style.display = "flex"; }
    if (!is_silent && _msg)
    {
        _msg.textContent = "Triff mindestens 15 Hölzer (50 XP) oder 30+ Hölzer (100 XP)!";
    }
}

function SpawnTossedLog()
{
    if (!shuriken_game_active) { return; }

    let _start_x = 50 + Math.random() * (shuriken_logical_width - 100);
    let _vx = (_start_x < shuriken_logical_width / 2)
        ? (1.0 + Math.random() * 1.6)
        : -(1.0 + Math.random() * 1.6);
    let _vy = -(6.6 + Math.random() * 1.9);

    flying_logs.push({
        x: _start_x,
        y: shuriken_logical_height + 20,
        vx: _vx,
        vy: _vy,
        angle: Math.random() * Math.PI,
        v_angle: (Math.random() - 0.5) * 0.08,
        radius: 28
    });
}

function CheckLogHit(tap_x, tap_y)
{
    flying_shurikens.push({
        x: shuriken_logical_width / 2,
        y: shuriken_logical_height,
        tx: tap_x,
        ty: tap_y,
        angle: 0,
        life: 10
    });

    for (let _i = flying_logs.length - 1; _i >= 0; _i--)
    {
        let _log = flying_logs[_i];
        let _dx = tap_x - _log.x;
        let _dy = tap_y - _log.y;
        if (Math.sqrt(_dx * _dx + _dy * _dy) <= _log.radius + 20)
        {
            split_halves.push({
                x: _log.x - 10,
                y: _log.y,
                vx: -2.8,
                vy: -2.0,
                angle: _log.angle - 0.3,
                v_angle: -0.12
            });
            split_halves.push({
                x: _log.x + 10,
                y: _log.y,
                vx: 2.8,
                vy: -2.0,
                angle: _log.angle + 0.3,
                v_angle: 0.12
            });
            flying_logs.splice(_i, 1);
            shuriken_game_hits += 1;
            document.getElementById("ui_game_hits").textContent = String(shuriken_game_hits);
            break;
        }
    }
}

function UpdateShurikenGameLoop(frame_timestamp)
{
    if (!shuriken_game_active) { return; }

    // Normalize physics delta-time to 60 FPS so 60Hz, 90Hz, and 120Hz displays play identically
    let _dt = 1;
    if (shuriken_last_frame_ts > 0)
    {
        _dt = Math.min(2.5, Math.max(0.25, (frame_timestamp - shuriken_last_frame_ts) / 16.6667));
    }
    shuriken_last_frame_ts = frame_timestamp;

    wood_ctx.clearRect(0, 0, shuriken_logical_width, shuriken_logical_height);

    for (let _i = flying_logs.length - 1; _i >= 0; _i--)
    {
        let _l = flying_logs[_i];
        _l.x += _l.vx * _dt;
        _l.y += _l.vy * _dt;
        _l.vy += 0.17 * _dt;
        _l.angle += _l.v_angle * _dt;
        DrawWoodLogPiece(_l.x, _l.y, _l.angle, 48, 20, false);

        if (_l.y > shuriken_logical_height + 50 && _l.vy > 0)
        {
            flying_logs.splice(_i, 1);
        }
    }

    for (let _j = split_halves.length - 1; _j >= 0; _j--)
    {
        let _h = split_halves[_j];
        _h.x += _h.vx * _dt;
        _h.y += _h.vy * _dt;
        _h.vy += 0.28 * _dt;
        _h.angle += _h.v_angle * _dt;
        DrawWoodLogPiece(_h.x, _h.y, _h.angle, 24, 18, true);

        if (_h.y > shuriken_logical_height + 50)
        {
            split_halves.splice(_j, 1);
        }
    }

    let _lerp_factor = 1 - Math.pow(1 - 0.45, _dt);
    for (let _k = flying_shurikens.length - 1; _k >= 0; _k--)
    {
        let _s = flying_shurikens[_k];
        _s.x += (_s.tx - _s.x) * _lerp_factor;
        _s.y += (_s.ty - _s.y) * _lerp_factor;
        _s.angle += 0.6 * _dt;
        _s.life -= _dt;
        DrawShurikenStar(_s.x, _s.y, _s.angle);

        if (_s.life <= 0)
        {
            flying_shurikens.splice(_k, 1);
        }
    }

    shuriken_raf_id = requestAnimationFrame(UpdateShurikenGameLoop);
}

function DrawWoodLogPiece(pos_x, pos_y, angle, width, height, is_split_half)
{
    wood_ctx.save();
    wood_ctx.translate(pos_x, pos_y);
    wood_ctx.rotate(angle);
    wood_ctx.fillStyle = is_split_half ? "#d99b66" : "#6e3d1c";
    wood_ctx.strokeStyle = "#3b1e0a";
    wood_ctx.lineWidth = 2;
    wood_ctx.fillRect(-width / 2, -height / 2, width, height);
    wood_ctx.strokeRect(-width / 2, -height / 2, width, height);
    wood_ctx.fillStyle = "#f3dec3";
    wood_ctx.fillRect(width / 2 - 5, -height / 2 + 2, 4, height - 4);
    wood_ctx.restore();
}

function DrawShurikenStar(pos_x, pos_y, angle)
{
    wood_ctx.save();
    wood_ctx.translate(pos_x, pos_y);
    wood_ctx.rotate(angle);
    wood_ctx.fillStyle = "#e2e8f0";
    for (let _p = 0; _p < 4; _p++)
    {
        wood_ctx.rotate(Math.PI / 2);
        wood_ctx.beginPath();
        wood_ctx.moveTo(0, -14);
        wood_ctx.lineTo(4, -3);
        wood_ctx.lineTo(-4, -3);
        wood_ctx.closePath();
        wood_ctx.fill();
    }
    wood_ctx.restore();
}

async function EndShurikenWoodGame()
{
    shuriken_game_active = false;
    ClearShurikenTimers();

    let _token = shuriken_round_token;
    shuriken_round_token = "";

    let _overlay = document.getElementById("ui_arena_overlay");
    let _msg = document.getElementById("ui_arena_msg");
    _overlay.style.display = "flex";

    let _m = dojo_members_data[active_member_id];
    if (!_m) { return; }

    let _hits = shuriken_game_hits;
    if (_hits < 15 || !_token)
    {
        _msg.textContent = _hits + " Hölzer gespalten (Mindestens 15 für 50 XP oder 30+ für 100 XP nötig).";
        if (_token)
        {
            await SendAuthenticatedAction("shuriken_finish", { round_token: _token, hits: _hits }, true);
        }
        return;
    }

    _msg.textContent = "⏳ Prüfe Ergebnis (" + _hits + " Treffer)...";
    let _finish_res = await SendAuthenticatedAction("shuriken_finish", { round_token: _token, hits: _hits });

    if (!_finish_res || _finish_res.status !== "ok")
    {
        _msg.textContent = "⚠️ Ergebnis konnte nicht verbucht werden.";
        return;
    }

    ApplyAuthoritativeBalances(_finish_res.own_balances);
    let _reward = Number(_finish_res.reward) || 0;

    if (_reward >= 100)
    {
        _msg.textContent = "🥷 Meisterhaft! " + _hits + " Hölzer gespalten! Du erhältst +100 Kuden XP!";
        ShowToastMessage("🎯 30+ Treffer! +100 Kuden XP gewonnen!");
    }
    else if (_reward >= 50)
    {
        _msg.textContent = "🪵 Gut gemacht! " + _hits + " Hölzer gespalten – du erhältst deine 50 Kuden XP zurück!";
        ShowToastMessage("📜 15+ Treffer! Einsatz (50 Kuden XP) zurückerhalten!");
    }
    else
    {
        _msg.textContent = _hits + " Hölzer gespalten (Mindestens 15 für 50 XP oder 30+ für 100 XP nötig).";
    }
}
