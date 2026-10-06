const CACHE_PREFIX = "boreviax-ledger-";
const CACHE_NAME = `${CACHE_PREFIX}v15-shell`;
const APP_SHELL = [
  "/",
  "/index.html",
  "/style.css",
  "/app.js",
  "/config.js",
  "/vendor/supabase.mjs",
  "/vendor/xlsx.mjs",
  "/manifest.webmanifest",
  "/icons/icon-192.png",
  "/icons/icon-512.png"
];

self.addEventListener("install",event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE_NAME);
    await cache.addAll(APP_SHELL);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate",event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(key=>key.startsWith(CACHE_PREFIX)&&key!==CACHE_NAME).map(key=>caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener("message",event=>{
  if(event.data?.type==="SKIP_WAITING")void self.skipWaiting();
});

self.addEventListener("fetch",event=>{
  const request=event.request;
  if(request.method!=="GET")return;
  const url=new URL(request.url);

  // Financial and authentication responses must never enter the service-worker cache.
  if(url.hostname.endsWith("supabase.co"))return;
  if(url.origin===self.location.origin&&url.pathname.startsWith("/cloud/"))return;

  if(url.origin!==self.location.origin)return;

  if(request.mode==="navigate"){
    event.respondWith((async()=>{
      try{
        const response=await fetch(request);
        if(response.ok){
          const cache=await caches.open(CACHE_NAME);
          await cache.put("/index.html",response.clone());
        }
        return response;
      }catch(_){
        return (await caches.match("/index.html"))||(await caches.match("/"))||new Response("Offline",{status:503});
      }
    })());
    return;
  }

  event.respondWith((async()=>{
    try{
      const response=await fetch(request);
      if(response.ok){
        const cache=await caches.open(CACHE_NAME);
        await cache.put(request,response.clone());
      }
      return response;
    }catch(_){return (await caches.match(request))||new Response("Offline",{status:503});}
  })());
});
