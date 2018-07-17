var ver = 'v1::'; //Cache version
if ('serviceWorker' in navigator) {
	navigator.serviceWorker.register('/sw.js').then(function() {
		console.log('service worker registration complete.');
	}, function() {
		console.log('service worker registration failure.');
	});
}
self.addEventListener("install", function(event) {
	// console.log('install event');
	event.waitUntil(caches.open(ver + 'fundamentals').then(function(cache) {
		return cache.addAll(['/css/styles.css', '/js/main.js', '/index.html', '/restaurant.html', '/img/1.jpg', '/img/2.jpg', '/img/3.jpg', '/img/4.jpg', '/img/5.jpg', '/img/6.jpg', '/img/7.jpg', '/img/8.jpg', '/img/9.jpg', '/img/10.jpg', '/js/dbhelper.js', 'data/restaurants.json', '/js/restaurant_info.js', ]);
	}).then(function() {
		console.log('Install complete');
	}));
});
self.addEventListener("fetch", function(event) {
	//console.log('fetch event');
	if (event.request.method !== 'GET') {
		return;
	}
	event.respondWith(caches.match(event.request).then(function(cached) {
		var networked = fetch(event.request).then(fetchedFromNetwork, unableToResolve).catch(unableToResolve);
		console.log('fetch event', cached ? '(cached)' : '(network)', event.request.url);
		return cached || networked;

		function fetchedFromNetwork(response) {
			var cacheCopy = response.clone();
			//   console.log('fetch response from network.');
			caches.open(ver + 'pages').then(function add(cache) {
				cache.put(event.request, cacheCopy);
			}).then(function() {
				console.log('fetch response stored in cache.', event.request.url);
			});
			return response;
		}

		function unableToResolve() {
			console.log('fetch request failed in both cache and network. ' + err);
			return new Response('<h1>Service Unavailable</h1>', {
				status: 503,
				statusText: 'Service Unavailable',
				headers: new Headers({
					'Content-Type': 'text/html'
				})
			});
		}
	}));
});
self.addEventListener("activate", function(event) {
	console.log('activate event in progress.');
	event.waitUntil(caches.keys().then(function(keys) {
		return Promise.all(keys.filter(function(key) {
			return !key.startsWith(ver);
		}).map(function(key) {
			return caches.delete(key);
		}));
	}).then(function() {
		console.log('activate completed.');
	}));
});