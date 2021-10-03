console.log("Service-worker.js file is working for you")

//variable to store an array of strings that represents what static files we want to cahce for our application
const CACHE_NAME = 'static-cache-v1';
const DATA_CACHE_NAME = 'data-cache-v1';
const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "css/style.css",
    "js/index.js",
    "js/idb.js",
    "/manifest.json",
    "/icons/icon-192x192.png",
    "/icons/icon-512x512.png"
]

//install
self.addEventListener("install", function (evt) {

    evt.waitUntil(
        caches.open(CACHE_NAME).then((cache) => { cache.addAll(FILES_TO_CACHE)})
    );

    self.skipWaiting();
})
self.addEventListener("activate", function(evt) {
    evt.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(
                keyList.map(key => {
                    if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
                        console.log("Removing old chache data", key)
                        return caches.delete(key);
                    }
                })
            )
        }))
        self.clients.claim();
    })
    
function deleteWaitingNewTransaction() {
    const transaction = db.transaction(["waiting_new_transaction"], "readwrite");
    const store = transaction.objectStore("waiting_new_transaction");
    store.clear();
  }

// fetch
self.addEventListener("fetch", function (evt) {
    // cache successful requests to the API
    if (evt.request.url.includes("/api/")) {
      evt.respondWith(
        caches
          .open(DATA_CACHE_NAME)
          //open the cache, run a fetch based on whatever request comes in, attempting to fetch the resource
          .then((cache) => {
            return (
              fetch(evt.request)
                //end up here at .then if its able to fetch the resource
                .then((response) => {
                  // If the response was good, clone it and store it in the cache.
                  if (response.status === 200) {
                    //if good, clone and store in the cache
                    cache.put(evt.request.url, response.clone());
                  }
  
                  return response;
                })
                .catch((err) => {
                  // Network request failed, try to get it from the cache.
                  return cache.match(evt.request);
                })
            );
          })
          .catch((err) => console.log(err))
      );
  
      return;
    }

    evt.respondWith(
        caches.match(evt.request).then(function (response) {
          return response || fetch(evt.request);
        })
      );
    });
