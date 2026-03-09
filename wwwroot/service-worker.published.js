// Caution! Be sure you understand the caveats before publishing an application with
// offline support. See https://aka.ms/blazor-offline-considerations

self.importScripts('./service-worker-assets.js');
self.addEventListener('install', event => event.waitUntil(onInstall(event)));
self.addEventListener('activate', event => event.waitUntil(onActivate(event)));
self.addEventListener('fetch', event => event.respondWith(onFetch(event)));

const cacheNamePrefix = 'offline-cache-';
const cacheName = `${cacheNamePrefix}${self.assetsManifest.version}`;
const offlineAssetsInclude = [ /\.dll$/, /\.pdb$/, /\.wasm/, /\.html/, /\.js$/, /\.json$/, /\.css$/, /\.woff$/, /\.png$/, /\.jpe?g$/, /\.gif$/, /\.ico$/, /\.blat$/, /\.dat$/, /\.webmanifest$/ ];
const offlineAssetsExclude = [ /^service-worker\.js$/ ];

// Replace with your base path if you are hosting on a subfolder. Ensure there is a trailing '/'.
const base = "/";
const baseUrl = new URL(base, self.origin);
const manifestUrlList = self.assetsManifest.assets.map(asset => new URL(asset.url, baseUrl).href);

async function onInstall(event) {
    console.info('Service worker: Install');

    // Fetch and cache all matching items from the assets manifest
    const assetsRequests = self.assetsManifest.assets
        .filter(asset => offlineAssetsInclude.some(pattern => pattern.test(asset.url)))
        .filter(asset => !offlineAssetsExclude.some(pattern => pattern.test(asset.url)))
        .map(asset => new Request(asset.url, { integrity: asset.hash, cache: 'no-cache' }));

    await caches.open(cacheName).then(cache => cache.addAll(assetsRequests));
}

async function onActivate(event) {
    console.info('Service worker: Activate');

    // Delete unused caches
    const cacheKeys = await caches.keys();
    await Promise.all(cacheKeys
        .filter(key => key.startsWith(cacheNamePrefix) && key !== cacheName)
        .map(key => caches.delete(key)));
}

async function onFetch(event) {
    if (event.request.method !== 'GET') return;

    event.respondWith((async () => {
        const cache = await caches.open(CACHE_NAME);
        
        // 1. Try to find the exact file in cache (e.g., /main.css or /_framework/dotnet.wasm)
        let response = await cache.match(event.request);

        // 2. If not in cache, try the network
        if (!response) {
            try {
                response = await fetch(event.request);
                if (response.ok) {
                    await cache.put(event.request, response.clone());
                }
            } catch (error) {
                // 3. OFFLINE FALLBACK
                // If the network fails and it's a navigation request (like /settings),
                // serve the cached index.html so Blazor can boot up.
                if (event.request.mode === 'navigate') {
                    response = await cache.match('index.html');
                }
            }
        }

        // 4. THE REDIRECT FIX (Still required for Cloudflare)
        if (response && response.redirected) {
            return new Response(response.body, {
                headers: response.headers,
                status: response.status,
                statusText: response.statusText
            });
        }

        return response || fetch(event.request);
    })());
}
