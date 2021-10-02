console.log("Service-worker.js file is working for you")

//variable to store an array of strings that represents what static files we want to cahce for our application
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

//variables to store the names of our cache
const CACHE_NAME = 'static-cache-v1';
const DATA_CACHE_NAME = 'data-cache-v1';

