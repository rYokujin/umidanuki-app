// =============================================================================
// BUJINKAN UMIDANUKI DOJO - FIREBASE CLOUD MESSAGING SERVICE WORKER
// Handles background push notifications & notification click routing
// =============================================================================

importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.14.1/firebase-messaging-compat.js");

// Public Firebase Web App configuration (Spark Plan - Analytics intentionally omitted for privacy)
const firebase_sw_config = {
    apiKey: "AIzaSyAheAyR5fPJ78niutzhPcOa1iCHPiHaEAM",
    authDomain: "umidanuki-app.firebaseapp.com",
    projectId: "umidanuki-app",
    storageBucket: "umidanuki-app.firebasestorage.app",
    messagingSenderId: "1092621337066",
    appId: "1:1092621337066:web:5e668f204fa65c4cc2b293"
};

function IsFirebaseSwConfigReady()
{
    return Boolean(
        firebase_sw_config.apiKey &&
        firebase_sw_config.projectId &&
        firebase_sw_config.messagingSenderId &&
        firebase_sw_config.appId &&
        firebase_sw_config.apiKey.indexOf("YOUR_FIREBASE_") === -1 &&
        firebase_sw_config.projectId.indexOf("YOUR_FIREBASE_") === -1
    );
}

if (IsFirebaseSwConfigReady())
{
    firebase.initializeApp(firebase_sw_config);
    const sw_messaging = firebase.messaging();

    sw_messaging.onBackgroundMessage(function(_payload)
    {
        let _notif = (_payload && _payload.notification) ? _payload.notification : {};
        let _data = (_payload && _payload.data) ? _payload.data : {};
        let _title = _notif.title || _data.title || "Bujinkan Umidanuki Dôjô";
        let _body = _notif.body || _data.body || "Neue Dôjô-Eilmeldung verfügbar.";

        return self.registration.showNotification(_title, {
            body: _body,
            icon: "./sprites/spr_dojo_logo.png",
            badge: "./sprites/spr_dojo_logo.png",
            tag: "umidanuki-announcement",
            renotify: true,
            data: {
                target_url: "./"
            }
        });
    });
}

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
