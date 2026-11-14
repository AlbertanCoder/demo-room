// The second page's offline helper, retired (plan step 20, 13 Nov 2026). A device that visited the page while it was
// being built still has the old helper for this folder. This one takes its place, throws away what it saved, and
// removes itself, so the folder is answered like any other address.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.delete('mk3-next-v1').then(() => self.registration.unregister()));
});
