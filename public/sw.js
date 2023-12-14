
self.addEventListener('push', function (e) {
    console.log('inside')
    if (!(self.Notification && self.Notification.permission === 'granted')) {
        return;
    }

    if (e.data) {
        console.log('resr')
        var msg = e.data.json();
        console.log(msg)
        e.waitUntil(self.registration.showNotification(msg.title, {
            body: msg.body,
            icon: msg.icon,
            actions: msg.actions
        }));
    }
});

self.addEventListener('notificationclick', function (event) { 
    var url = 'https://www.google.com'; 
    event.notification.close(); 
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(windowClients => { 
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                if (client.url === url && 'focus' in client) {
                    return client.focus();
                }
            } 
            if (clients.openWindow) {
                return clients.openWindow(url);
            }
        })
    );
});