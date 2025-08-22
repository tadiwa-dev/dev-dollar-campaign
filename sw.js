const CACHE_NAME = 'dev-dollar-v1';
const STATIC_CACHE = 'dev-dollar-static-v1';
const DYNAMIC_CACHE = 'dev-dollar-dynamic-v1';

const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './logo.png',
  './icon-192.png',
  './icon-512.png'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .catch((error) => {
        console.log('Cache failed:', error);
      })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  		// Skip non-GET requests
		if (request.method !== 'GET') {
			return;
		}
		
		// Skip non-HTTP requests (like chrome-extension, data:, etc.)
		if (!request.url.startsWith('http:') && !request.url.startsWith('https:')) {
			return;
		}

  		// Handle navigation requests
		if (request.mode === 'navigate') {
			event.respondWith(
				caches.match('./index.html')
					.then((response) => {
						return response || fetch(request);
					})
					.catch(() => {
						return caches.match('./index.html');
					})
			);
			return;
		}

  		// Handle static assets
		if (STATIC_ASSETS.includes(url.pathname)) {
			event.respondWith(
				caches.match(request)
					.then((response) => {
						return response || fetch(request);
					})
					.catch(() => {
						return fetch(request);
					})
			);
			return;
		}

  		// Handle other requests with network-first strategy
		event.respondWith(
			fetch(request)
				.then((response) => {
					// Clone the response before caching
					const responseClone = response.clone();
					
					// Cache successful responses (only for http/https schemes)
					if (response.status === 200 && (request.url.startsWith('http:') || request.url.startsWith('https:'))) {
						caches.open(DYNAMIC_CACHE)
							.then((cache) => {
								cache.put(request, responseClone);
							})
							.catch((error) => {
								console.log('Cache put failed:', error);
							});
					}
					
					return response;
				})
				.catch(() => {
					// Return cached response if network fails
					return caches.match(request);
				})
		);
});

// Background sync for offline donations
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync-donation') {
    event.waitUntil(syncDonations());
  }
});

async function syncDonations() {
  try {
    // Get offline donations from IndexedDB or localStorage
    const offlineDonations = await getOfflineDonations();
    
    if (offlineDonations.length > 0) {
      // Process offline donations
      console.log('Syncing offline donations:', offlineDonations);
      
      // Clear offline donations after successful sync
      await clearOfflineDonations();
    }
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}

// Helper functions for offline donations
async function getOfflineDonations() {
  // This would integrate with your existing localStorage logic
  // For now, return empty array
  return [];
}

async function clearOfflineDonations() {
  // Clear offline donations after successful sync
  console.log('Offline donations synced successfully');
}

// Push notification handling
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New donation received!',
    		icon: './icon-192.png',
		badge: './icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      			{
				action: 'explore',
				title: 'View Campaign',
				icon: './icon-192.png'
			},
			{
				action: 'close',
				title: 'Close',
				icon: './icon-192.png'
			}
    ]
  };

  event.waitUntil(
    self.registration.showNotification('Development Dollar Campaign', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/')
    );
  }
});
