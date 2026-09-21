const SHELL = 'qas-shell-v1';
const API = 'qas-quran-api-v1';
const CORE = ['./','./index.html','./styles.css','./app.js','./manifest.webmanifest'];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(SHELL).then(cache => cache.addAll(CORE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => ![SHELL,API].includes(k)).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET') return;
  if (url.origin === self.location.origin) {
    event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(res => {const copy=res.clone(); caches.open(SHELL).then(c=>c.put(event.request, copy)); return res;})));
    return;
  }
  if (url.origin === 'https://api.alquran.cloud') {
    event.respondWith(networkFirstWithSevenDayFallback(event.request));
  }
});
async function networkFirstWithSevenDayFallback(request){
  const cache = await caches.open(API);
  try {
    const response = await fetch(request);
    if (response.ok) await cache.put(request, response.clone());
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) {
      const date = cached.headers.get('date');
      if (date) {
        const age = Date.now() - new Date(date).getTime();
        if (age > 7*24*60*60*1000) return new Response(JSON.stringify({code:503,status:'STALE_CACHE',data:null}), {status:503,headers:{'content-type':'application/json'}});
      }
      return cached;
    }
    return new Response(JSON.stringify({code:503,status:'OFFLINE',data:null}), {status:503,headers:{'content-type':'application/json'}});
  }
}
