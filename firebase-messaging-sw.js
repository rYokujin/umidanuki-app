// =============================================================================
// BUJINKAN UMIDANUKI DOJO - NATIVE WEB PUSH SERVICE WORKER
// Zero hardcoded API keys or external imports; handles FCM data-only payloads
// =============================================================================

self.addEventListener("push", function(_event)
{
    let _payload = {};
    if (_event.data)
    {
        try
        {
            _payload = _event.data.json();
        }
        catch (_e)
        {
            _payload = { data: { body: _event.data.text() } };
        }
    }

    let _notif = (_payload && _payload.notification) ? _payload.notification : {};
    let _data = (_payload && _payload.data) ? _payload.data : {};
    let _title = _notif.title || _data.title || "Bujinkan Umidanuki Dôjô";
    let _body = _notif.body || _data.body || "Neue Dôjô-Eilmeldung verfügbar.";
    let _icon_url = new URL("./sprites/spr_dojo_logo.png", self.location.href).href;
    let _target_url = new URL("./", self.location.href).href;

    let _notify_promise = self.registration.showNotification(_title, {
        body: _body,
        icon: _icon_url,
        badge: _icon_url,
        vibrate: [200, 100, 200],
        tag: "umidanuki-announcement-" + Date.now(),
        renotify: true,
        data: {
            target_url: _target_url
        }
    }).then(function()
    {
        return clients.matchAll({ type: "window", includeUncontrolled: true });
    }).then(function(_window_list)
    {
        for (let _i = 0; _i < _window_list.length; _i++)
        {
            _window_list[_i].postMessage({
                type: "DOJO_PUSH",
                title: _title,
                body: _body
            });
        }
    });

    _event.waitUntil(_notify_promise);
});

self.addEventListener("notificationclick", function(_event)
{
    _event.notification.close();
    let _target_url = (_event.notification.data && _event.notification.data.target_url)
        ? _event.notification.data.target_url
        : "./";

    _event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then(function(_window_list)
        {
            for (let _i = 0; _i < _window_list.length; _i++)
            {
                let _client = _window_list[_i];
                if ("focus" in _client)
                {
                    return _client.focus();
                }
            }
            if (clients.openWindow)
            {
                return clients.openWindow(_target_url);
            }
            return null;
        })
    );
});
