'use strict';
const MANIFEST = 'flutter-app-manifest';
const TEMP = 'flutter-temp-cache';
const CACHE_NAME = 'flutter-app-cache';
const RESOURCES = {
  "version.json": "e27e9c00386f4589569bd20b2b096046",
"assets/assets/images/Celbux.png": "d817453705f66bc256130e6809b94ee4",
"assets/assets/images/app_launcher_icon.png": "b7551685788e2cfa6aabdeb3cbe4fa49",
"assets/assets/images/logo.png": "2aeb387110769fb4f497ee06a6b91ed1",
"assets/assets/images/login_bg@2x.png": "2cae8e08f03973eb61b11ca31e3a88d7",
"assets/assets/images/logo_landscape.png": "2aeb387110769fb4f497ee06a6b91ed1",
"assets/assets/images/how.png": "334455629abf4354dbf822687b56e089",
"assets/assets/images/celbux-application-sprite.svg": "bf3edfd8ade00ad2c39391c375e6686c",
"assets/assets/images/logo.PNG": "2aeb387110769fb4f497ee06a6b91ed1",
"assets/assets/images/createAccount_bg@2x.png": "a52ef39583db2aedf54f157817d5790a",
"assets/assets/images/celbux_splash.png": "16c6e34273376f863669da1bb15d6375",
"assets/assets/images/tiny_celbux.png": "a3be36233ae4add496a7a6e8b37a128f",
"assets/assets/logos/cel_green_icon.png": "9bcc9ca9c84e331d90f72f01ae103d41",
"assets/assets/logos/cash.png": "803f84ee1504c107523599efc8d6386a",
"assets/assets/logos/cel_green.png": "e4d766854235c312b93ea4d70c3097fa",
"assets/assets/logos/wallet.png": "07bd305a96884fe26ee4c8b73432fb0e",
"assets/assets/logos/woolworths.png": "55c7bc53ed213b96b3e8d20a8f65b17a",
"assets/assets/logos/cel_light.png": "3b45e00491841f24da6391c4458d77f5",
"assets/assets/logos/wimpy.png": "e6e16e79f41cb4e20f43633ef2a59bb7",
"assets/assets/logos/q4fuel.jpg": "9e7cd84240a038e6c4ed532fe5b9c8c6",
"assets/assets/logos/clicks.png": "b12e11198788af9955c629a7c8def181",
"assets/assets/logos/celbux.jpeg": "d7b6367f4535ca680234b0616a095e38",
"assets/assets/logos/celbux-logo-white.png": "8c18b9e23448d6a684fb11ca6e4f056f",
"assets/assets/logos/exclusive_books.png": "99ab71da90710998936543e31982483f",
"assets/assets/logos/sasol.png": "d1da084588616990bcbab3a47a2dde39",
"assets/assets/logos/tall_green.png": "e082ee8543bea577ae3b91a3a1f5102c",
"assets/NOTICES": "518062702346bd54896450cd98589c1c",
"assets/packages/cupertino_icons/assets/CupertinoIcons.ttf": "6d342eb68f170c97609e9da345464e5e",
"assets/fonts/MaterialIcons-Regular.otf": "7e7a6cccddf6d7b20012a548461d5d81",
"assets/AssetManifest.json": "45bc7b1f1d0b0b1395824b8527732303",
"assets/FontManifest.json": "dc3d03800ccca4601324923c0b1d6d57",
"canvaskit/canvaskit.js": "c2b4e5f3d7a3d82aed024e7249a78487",
"canvaskit/profiling/canvaskit.js": "ae2949af4efc61d28a4a80fffa1db900",
"canvaskit/profiling/canvaskit.wasm": "95e736ab31147d1b2c7b25f11d4c32cd",
"canvaskit/canvaskit.wasm": "4b83d89d9fecbea8ca46f2f760c5a9ba",
"favicon.png": "5dcef449791fa27946b3d35ad8803796",
"callback.html": "592b4a74503f1a714be17877db0725bd",
"main.dart.js": "e8235bc0847e36d6f1afc6ffacdf82bb",
"icons/Icon-maskable-512.png": "301a7604d45b3e739efc881eb04896ea",
"icons/Icon-192.png": "ac9a721a12bbc803b44f645561ecb1e1",
"icons/Icon-512.png": "96e752610906ba2a93c65f8abe1645f1",
"icons/Icon-maskable-192.png": "c457ef57daa1d16f64b27b786ec2ea3c",
"index.html": "1b383269bd12b138adcd1a3dd60ec3d5",
"/": "1b383269bd12b138adcd1a3dd60ec3d5",
"manifest.json": "e06bb6fbaebcf1bf9696b83dc2acb19e"
};

// The application shell files that are downloaded before a service worker can
// start.
const CORE = [
  "/",
"main.dart.js",
"index.html",
"assets/NOTICES",
"assets/AssetManifest.json",
"assets/FontManifest.json"];
// During install, the TEMP cache is populated with the application shell files.
self.addEventListener("install", (event) => {
  self.skipWaiting();
  return event.waitUntil(
    caches.open(TEMP).then((cache) => {
      return cache.addAll(
        CORE.map((value) => new Request(value, {'cache': 'reload'})));
    })
  );
});

// During activate, the cache is populated with the temp files downloaded in
// install. If this service worker is upgrading from one with a saved
// MANIFEST, then use this to retain unchanged resource files.
self.addEventListener("activate", function(event) {
  return event.waitUntil(async function() {
    try {
      var contentCache = await caches.open(CACHE_NAME);
      var tempCache = await caches.open(TEMP);
      var manifestCache = await caches.open(MANIFEST);
      var manifest = await manifestCache.match('manifest');
      // When there is no prior manifest, clear the entire cache.
      if (!manifest) {
        await caches.delete(CACHE_NAME);
        contentCache = await caches.open(CACHE_NAME);
        for (var request of await tempCache.keys()) {
          var response = await tempCache.match(request);
          await contentCache.put(request, response);
        }
        await caches.delete(TEMP);
        // Save the manifest to make future upgrades efficient.
        await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
        return;
      }
      var oldManifest = await manifest.json();
      var origin = self.location.origin;
      for (var request of await contentCache.keys()) {
        var key = request.url.substring(origin.length + 1);
        if (key == "") {
          key = "/";
        }
        // If a resource from the old manifest is not in the new cache, or if
        // the MD5 sum has changed, delete it. Otherwise the resource is left
        // in the cache and can be reused by the new service worker.
        if (!RESOURCES[key] || RESOURCES[key] != oldManifest[key]) {
          await contentCache.delete(request);
        }
      }
      // Populate the cache with the app shell TEMP files, potentially overwriting
      // cache files preserved above.
      for (var request of await tempCache.keys()) {
        var response = await tempCache.match(request);
        await contentCache.put(request, response);
      }
      await caches.delete(TEMP);
      // Save the manifest to make future upgrades efficient.
      await manifestCache.put('manifest', new Response(JSON.stringify(RESOURCES)));
      return;
    } catch (err) {
      // On an unhandled exception the state of the cache cannot be guaranteed.
      console.error('Failed to upgrade service worker: ' + err);
      await caches.delete(CACHE_NAME);
      await caches.delete(TEMP);
      await caches.delete(MANIFEST);
    }
  }());
});

// The fetch handler redirects requests for RESOURCE files to the service
// worker cache.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== 'GET') {
    return;
  }
  var origin = self.location.origin;
  var key = event.request.url.substring(origin.length + 1);
  // Redirect URLs to the index.html
  if (key.indexOf('?v=') != -1) {
    key = key.split('?v=')[0];
  }
  if (event.request.url == origin || event.request.url.startsWith(origin + '/#') || key == '') {
    key = '/';
  }
  // If the URL is not the RESOURCE list then return to signal that the
  // browser should take over.
  if (!RESOURCES[key]) {
    return;
  }
  // If the URL is the index.html, perform an online-first request.
  if (key == '/') {
    return onlineFirst(event);
  }
  event.respondWith(caches.open(CACHE_NAME)
    .then((cache) =>  {
      return cache.match(event.request).then((response) => {
        // Either respond with the cached resource, or perform a fetch and
        // lazily populate the cache.
        return response || fetch(event.request).then((response) => {
          cache.put(event.request, response.clone());
          return response;
        });
      })
    })
  );
});

self.addEventListener('message', (event) => {
  // SkipWaiting can be used to immediately activate a waiting service worker.
  // This will also require a page refresh triggered by the main worker.
  if (event.data === 'skipWaiting') {
    self.skipWaiting();
    return;
  }
  if (event.data === 'downloadOffline') {
    downloadOffline();
    return;
  }
});

// Download offline will check the RESOURCES for all files not in the cache
// and populate them.
async function downloadOffline() {
  var resources = [];
  var contentCache = await caches.open(CACHE_NAME);
  var currentContent = {};
  for (var request of await contentCache.keys()) {
    var key = request.url.substring(origin.length + 1);
    if (key == "") {
      key = "/";
    }
    currentContent[key] = true;
  }
  for (var resourceKey of Object.keys(RESOURCES)) {
    if (!currentContent[resourceKey]) {
      resources.push(resourceKey);
    }
  }
  return contentCache.addAll(resources);
}

// Attempt to download the resource online before falling back to
// the offline cache.
function onlineFirst(event) {
  return event.respondWith(
    fetch(event.request).then((response) => {
      return caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch((error) => {
      return caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          if (response != null) {
            return response;
          }
          throw error;
        });
      });
    })
  );
}
