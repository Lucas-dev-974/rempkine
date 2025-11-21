importScripts(
    'https://storage.googleapis.com/workbox-cdn/releases/7.3.0/workbox-sw.js'
);

// This is your Service Worker, you can put any of your custom Service Worker
// code in this file, above the `precacheAndRoute` line.

// When widget is installed/pinned, push initial state.
self.addEventListener('widgetinstall', (event) => {
    event.waitUntil(updateWidget(event));
});

// When widget is shown, update content to ensure it is up-to-date.
self.addEventListener('widgetresume', (event) => {
    event.waitUntil(updateWidget(event));
});

// When the user clicks an element with an associated Action.Execute,
// handle according to the 'verb' in event.action.
self.addEventListener('widgetclick', (event) => {
if (event.action == "updateName") {
    event.waitUntil(updateName(event));
}
});

// When the widget is uninstalled/unpinned, clean up any unnecessary
// periodic sync or widget-related state.
self.addEventListener('widgetuninstall', (event) => {});

const updateWidget = async (event) => {
// The widget definition represents the fields specified in the manifest.
    const widgetDefinition = event.widget.definition;

    // Fetch the template and data defined in the manifest to generate the payload.
    const payload = {
        template: JSON.stringify(await (await fetch(widgetDefinition.msAcTemplate)).json()),
        data: JSON.stringify(await (await fetch(widgetDefinition.data)).json()),
    };

    // Push payload to widget.
    await self.widgets.updateByInstanceId(event.instanceId, payload);
}

const updateName = async (event) => {
    const name = event.data.json().name;

    // The widget definition represents the fields specified in the manifest.
    const widgetDefinition = event.widget.definition;

    // Fetch the template and data defined in the manifest to generate the payload.
    const payload = {
        template: JSON.stringify(await (await fetch(widgetDefinition.msAcTemplate)).json()),
        data: JSON.stringify({name}),
    };

    // Push payload to widget.
    await self.widgets.updateByInstanceId(event.instanceId, payload);
}

// Configuration Workbox pour le cache
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);

// Gestion des mises à jour du Service Worker
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Mise à jour automatique du cache
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== 'pages-cache' && cacheName !== 'assets-cache') {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Stratégie de cache pour les routes - NetworkFirst avec priorité réseau
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'document',
  new workbox.strategies.NetworkFirst({
    cacheName: 'pages-cache',
    networkTimeoutSeconds: 0, // Pas de timeout, toujours essayer le réseau d'abord
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 10, // Moins d'entrées en cache
        maxAgeSeconds: 5 * 60, // 5 minutes seulement
      }),
    ],
  })
);

// Stratégie de cache pour les assets statiques - NetworkFirst aussi
workbox.routing.registerRoute(
  ({ request }) => request.destination === 'script' ||
                  request.destination === 'style' ||
                  request.destination === 'image',
  new workbox.strategies.NetworkFirst({
    cacheName: 'assets-cache',
    networkTimeoutSeconds: 2, // Timeout court pour les assets
    plugins: [
      new workbox.expiration.ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 60 * 60, // 1 heure seulement
      }),
    ],
  })
);

// Stratégie agressive pour le développement - Toujours réseau en priorité
self.addEventListener('fetch', (event) => {
  const request = event.request;
  const method = request.method;
  const url = request.url;

  // Ne pas intercepter les requêtes non-GET (POST, PATCH, DELETE, PUT, etc.)
  // L'API Cache ne supporte que les requêtes GET
  if (method !== 'GET') {
    return; // Laisser passer la requête sans interception
  }

  // Ne pas intercepter les requêtes API
  const isApiRequest = url.includes('/api/') || url.includes('/auth/') || url.includes('/contract');
  if (isApiRequest) {
    return; // Laisser passer les requêtes API sans interception
  }

  const isLocalhost = url.includes('localhost') ||
                      url.includes('127.0.0.1') ||
                      url.includes('dev');

  // En développement, toujours privilégier le réseau
  if (isLocalhost) {
    if (request.destination === 'document') {
      event.respondWith(
        fetch(request)
          .then((response) => {
            // Mettre à jour le cache avec la nouvelle version (uniquement GET)
            if (response.status === 200 && response.type === 'basic') {
              const responseClone = response.clone();
              caches.open('pages-cache').then((cache) => {
                cache.put(request, responseClone).catch(() => {
                  // Ignorer les erreurs de cache silencieusement
                });
              });
            }
            return response;
          })
          .catch(() => {
            // Fallback vers le cache seulement si le réseau échoue
            return caches.match(request).then((response) => {
              return response || caches.match('/offline.html');
            });
          })
      );
    } else if (request.destination === 'script' ||
               request.destination === 'style' ||
               request.destination === 'image') {
      // Pour les assets, même stratégie
      event.respondWith(
        fetch(request)
          .then((response) => {
            if (response.status === 200 && response.type === 'basic') {
              const responseClone = response.clone();
              caches.open('assets-cache').then((cache) => {
                cache.put(request, responseClone).catch(() => {
                  // Ignorer les erreurs de cache silencieusement
                });
              });
            }
            return response;
          })
          .catch(() => {
            return caches.match(request);
          })
      );
    }
  } else {
    // En production, utiliser la stratégie normale
    if (request.destination === 'document') {
      event.respondWith(
        caches.match(request).then((response) => {
          return response || fetch(request).then((fetchResponse) => {
            if (fetchResponse.status === 200 && fetchResponse.type === 'basic') {
              const responseClone = fetchResponse.clone();
              caches.open('pages-cache').then((cache) => {
                cache.put(request, responseClone).catch(() => {
                  // Ignorer les erreurs de cache silencieusement
                });
              });
            }
            return fetchResponse;
          });
        })
      );
    }
  }
});