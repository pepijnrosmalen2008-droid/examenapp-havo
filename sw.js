const CACHE = 'slagio-v344';
const ASSETS = ['/', '/index.html', '/over-ons.html', '/faq.html', '/privacy.html', '/styles.css', '/data.js', '/data-havo.js', '/data-vwo.js', '/state.js', '/cloud.js', '/profile.js', '/vak.js', '/quiz.js', '/tools.js', '/sim.js', '/lb.js', '/features.js', '/schedule.js', '/v4.js', '/zoek.js', '/klas.js', '/init.js', '/examens.js', '/ce_data.js', '/manifest.json', '/icon-192.png', '/icon-512.png', '/logo.svg', '/apple-touch-icon.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  // skipWaiting zodat de nieuwe SW direct overneemt (geen banner nodig).
  // Auto-reload is verwijderd uit init.js zodat er geen sessie-verlies optreedt.
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const { request } = e;
  const url = new URL(request.url);

  if (url.origin !== self.location.origin) return;

  if (request.mode === 'navigate') {
    const pathname = url.pathname.replace(/\/$/, '');
    const isSpaRoute = pathname === '/havo' || pathname === '/vwo';
    const target = isSpaRoute ? '/index.html' : request.url;
    e.respondWith(
      fetch(target)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(isSpaRoute ? '/index.html' : request, clone));
          return res;
        })
        .catch(() => caches.match(isSpaRoute ? '/index.html' : request))
    );
    return;
  }

  // Grote/zelden wijzigende bestanden (data + media) blijven cache-first: die
  // wil je niet elke load opnieuw downloaden (data-havo.js is ~800 KB).
  const DATA_FILES = ['/data.js', '/data-havo.js', '/data-vwo.js', '/ce_data.js', '/examens.js'];
  const isBigData = DATA_FILES.includes(url.pathname);
  const isCode = !isBigData && (url.pathname.endsWith('.js') || url.pathname.endsWith('.css'));

  if (isCode) {
    // Network-first voor app-code (klein, wijzigt vaak): altijd de verse versie
    // wanneer online, cache als offline-fallback. Zo lopen updates nooit achter.
    e.respondWith(
      fetch(request)
        .then(res => {
          if (res.ok) { const clone = res.clone(); caches.open(CACHE).then(c => c.put(request, clone)); }
          return res;
        })
        .catch(() => caches.match(request))
    );
    return;
  }

  // Stale-while-revalidate voor data/media: direct uit cache (snel + offline),
  // met een achtergrond-revalidatie zodat een verouderd bestand zich herstelt.
  e.respondWith(
    caches.match(request).then(cached => {
      const network = fetch(request).then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE).then(c => c.put(request, clone));
        }
        return res;
      }).catch(() => cached || caches.match('/index.html'));
      return cached || network;
    })
  );
});

// â”€â”€ PUSH (server-side VAPID, voor toekomstige backend) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
self.addEventListener('push', e => {
  const data = e.data ? e.data.json() : {};
  e.waitUntil(self.registration.showNotification(data.title || 'Slagio ðŸ“š', {
    body: data.body || 'Tijd om te oefenen!',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: { url: data.url || '/' },
    vibrate: [200, 100, 200],
    tag: data.tag || 'slagio',
    renotify: true,
    actions: [
      { action: 'open', title: 'ðŸŽ¯ Oefenen' },
      { action: 'dismiss', title: 'Later' }
    ]
  }));
});

// â”€â”€ PERIODIC BACKGROUND SYNC (Chrome PWA: dagelijks, ook als app dicht is) â”€â”€
self.addEventListener('periodicsync', e => {
  if (e.tag === 'slagio-daily') {
    e.waitUntil(_triggerDailyNotif());
  }
});

async function _triggerDailyNotif() {
  const cfg = await _readKV('notif');
  if (!cfg?.enabled) return;

  const now = Date.now();
  if (cfg.lastShown && now - cfg.lastShown < 20 * 3600000) return;

  let title = 'Slagio ðŸ“š';
  let body = 'Vergeet je dagelijkse oefening niet!';
  let url = '/';

  if (cfg.streak > 1) {
    body = `Je hebt een streak van ${cfg.streak} dagen! Oefen even om hem te bewaren. ðŸ”¥`;
  }
  if (cfg.examDays != null && cfg.examDays > 0 && cfg.examDays <= 14) {
    title = `â° Nog ${cfg.examDays} dag${cfg.examDays === 1 ? '' : 'en'}!`;
    body = `Je volgende examen is over ${cfg.examDays} dag${cfg.examDays === 1 ? '' : 'en'}. Vlug even oefenen?`;
    url = '/?start=quiz';
  }

  await self.registration.showNotification(title, {
    body,
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    data: { url },
    vibrate: [200, 100, 200],
    tag: 'slagio-daily',
    renotify: false,
    actions: [
      { action: 'open', title: 'ðŸŽ¯ Oefenen' },
      { action: 'dismiss', title: 'Later' }
    ]
  });

  await _writeKV('notif', { ...cfg, lastShown: now });
}

// â”€â”€ NOTIFICATION CLICK â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
self.addEventListener('notificationclick', e => {
  e.notification.close();
  if (e.action === 'dismiss') return;
  const url = e.notification.data?.url || '/';
  e.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
      for (const c of list) {
        if (c.url.startsWith(self.location.origin) && 'focus' in c) return c.focus();
      }
      return clients.openWindow(url);
    })
  );
});

// â”€â”€ MESSAGE (app stuurt streak/examen-data naar SW) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
self.addEventListener('message', e => {
  if (e.data?.type === 'SKIP_WAITING') self.skipWaiting(); // veilige update: alleen op verzoek
  if (e.data?.type === 'NOTIF_CONFIG') _writeKV('notif', e.data.config);
});

// â”€â”€ IndexedDB helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function _openDB() {
  return new Promise((res, rej) => {
    const r = indexedDB.open('slagio-sw', 1);
    r.onupgradeneeded = () => r.result.createObjectStore('kv');
    r.onsuccess = () => res(r.result);
    r.onerror = () => rej(r.error);
  });
}
async function _readKV(key) {
  try {
    const db = await _openDB();
    return new Promise(res => {
      const r = db.transaction('kv', 'readonly').objectStore('kv').get(key);
      r.onsuccess = () => res(r.result || null);
      r.onerror = () => res(null);
    });
  } catch { return null; }
}
async function _writeKV(key, val) {
  try {
    const db = await _openDB();
    return new Promise(res => {
      const tx = db.transaction('kv', 'readwrite');
      tx.objectStore('kv').put(val, key);
      tx.oncomplete = res; tx.onerror = res;
    });
  } catch {}
}
