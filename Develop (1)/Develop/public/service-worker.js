const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";
const FILES_TO_CACHE = [
    "/",
    "/index.js",
    "/manifest.json",
    "/style.css",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png",
    "/db.js"
];

self.addEventListener("install", function(event) {
    // Perform install steps
    event.waitUntil(
      caches.open(CACHE_NAME).then(function(cache) {
        console.log("Opened cache");
        return cache.addAll(urlsToCache);
      })
    );
  });

 
  // fetch
self.addEventListener("fetch", function(evt) {
    if (evt.request.url.includes("/api/")) {
      evt.respondWith(
        caches.open(DATA_CACHE_NAME).then(cache => {
          return fetch(evt.request)
            .then(response => {
              // If the response was good, clone it and store it in the cache.
              if (response.status === 200) {
                cache.put(evt.request.url, response.clone());
              }
  
              return response;
            })
            .catch(err => {
              // Network request failed, try to get it from the cache.
              return cache.match(evt.request);
            });
        }).catch(err => console.log(err))
      );
  
      return;
    }
    self.addEventListener("install", function(event) {
        // Perform install steps
        event.waitUntil(
          caches.open(CACHE_NAME).then(function(cache) {
            console.log("Opened cache");
            return cache.addAll(urlsToCache);
          })
        );
      });
      event.respondWith(
          fetch(event.request).catch(function() {
            return caches.match(event.request).then(function(response) {
              if (response) {
                return response;
              } else if (event.request.headers.get("accept").includes("text/html")) {
                // return the cached home page for all requests for html pages
                return caches.match("/");
              }
            });
          })
        );
      
  
    
  });