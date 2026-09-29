const CACHE_NAME = "sandglass-v1";
const ASSETS = ["./", "./index.html", "./manifest.json", "./icon.svg", "./style.css", "./timer.js", "./install.js", "./notifications.js"];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener("notificationclick", (event) => {
event.notification.close();
event.waitUntil(
self.clients.matchAll({type: "window", includeUncontrolled: true}).then((clientsArr) => {
	cont existing = clientsArr.find((c) => "focus" in c);
	if (exisiting) return exisiting.focus();
	return self.clients.openWindow("./index.html");
})
);
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => cached);
    })
  );
});
