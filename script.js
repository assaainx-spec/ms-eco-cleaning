
// ── SCROLL RESTORE AFTER LANGUAGE SWITCH ──
(function() {
  const pos = sessionStorage.getItem('scrollPos');
  if (pos) {
    sessionStorage.removeItem('scrollPos');
    window.addEventListener('load', () => {
      document.documentElement.style.scrollBehavior = 'auto';
      document.body.style.scrollBehavior = 'auto';
      window.scrollTo(0, parseInt(pos));
      setTimeout(() => {
        document.documentElement.style.scrollBehavior = '';
        document.body.style.scrollBehavior = '';
      }, 50);
    });
  }
})();

// ── LANGUAGE STRINGS ──
const _lang = document.documentElement.lang || 'nl';
const _t = {
  nl: {
    galleryCollapse: '▲ Galerij inklappen',
    galleryExpand:   '▼ Galerij uitklappen',
    sending:         'Bezig met verzenden...',
    sent:            '✓ Bericht verstuurd!',
    retry:           '✗ Probeer opnieuw',
    connError:       '✗ Verbindingsfout',
    submitDefault:   'Verstuur Bericht ✦',
  },
  en: {
    galleryCollapse: '▲ Collapse Gallery',
    galleryExpand:   '▼ Expand Gallery',
    sending:         'Sending...',
    sent:            '✓ Message sent!',
    retry:           '✗ Please try again',
    connError:       '✗ Connection error',
    submitDefault:   'Send Message ✦',
  },
  pl: {
    galleryCollapse: '▲ Zwiń Galerię',
    galleryExpand:   '▼ Rozwiń Galerię',
    sending:         'Wysyłanie...',
    sent:            '✓ Wiadomość wysłana!',
    retry:           '✗ Spróbuj ponownie',
    connError:       '✗ Błąd połączenia',
    submitDefault:   'Wyślij Wiadomość ✦',
  },
}[_lang] || {
  galleryCollapse: '▲ Collapse Gallery',
  galleryExpand:   '▼ Expand Gallery',
  sending:         'Sending...',
  sent:            '✓ Message sent!',
  retry:           '✗ Please try again',
  connError:       '✗ Connection error',
  submitDefault:   'Send Message ✦',
};

// ── GALLERY COLLAPSE ──
function toggleGallery() {
  const col = document.getElementById('galleryCollapsible');
  const btn = document.getElementById('galleryToggle');
  const isCollapsed = col.classList.toggle('collapsed');
  btn.classList.toggle('collapsed', isCollapsed);
  btn.setAttribute('aria-expanded', !isCollapsed);
  btn.textContent = isCollapsed ? _t.galleryExpand : _t.galleryCollapse;
}

// ── COOKIE BANNER ──
function loadGoogleServices() {
  if (!document.getElementById('gfonts')) {
    var pc = document.createElement('link');
    pc.rel = 'preconnect';
    pc.href = 'https://fonts.googleapis.com';
    document.head.appendChild(pc);
    var lnk = document.createElement('link');
    lnk.id = 'gfonts';
    lnk.rel = 'stylesheet';
    lnk.href = 'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;600;700&family=Jost:wght@300;400;500;600&display=swap';
    document.head.appendChild(lnk);
  }
  document.querySelectorAll('.map-placeholder').forEach(function(el) {
    var iframe = document.createElement('iframe');
    iframe.src = el.getAttribute('data-src');
    iframe.width = '100%';
    iframe.height = '100%';
    iframe.style.cssText = 'border:0; border-radius:12px;';
    iframe.allowFullscreen = true;
    iframe.loading = 'lazy';
    iframe.referrerPolicy = 'no-referrer-when-downgrade';
    iframe.title = el.getAttribute('data-title') || 'Map';
    el.parentNode.replaceChild(iframe, el);
  });
}
if (localStorage.getItem('cookiesAccepted')) {
  document.getElementById('cookieBanner').style.display = 'none';
  loadGoogleServices();
}
function acceptCookies() {
  localStorage.setItem('cookiesAccepted', '1');
  document.getElementById('cookieBanner').style.display = 'none';
  loadGoogleServices();
}

// ── SLIDE DRAWER ──
const hambBtn = document.getElementById('hambBtn');
const mobileMenu = document.getElementById('mobileMenu');
const drawerOverlay = document.getElementById('drawerOverlay');
function closeMenu() {
  hambBtn.classList.remove('open');
  mobileMenu.classList.remove('open');
  drawerOverlay.classList.remove('open');
}
hambBtn.addEventListener('click', () => {
  const opening = !mobileMenu.classList.contains('open');
  hambBtn.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  drawerOverlay.classList.toggle('open');
});
drawerOverlay.addEventListener('click', closeMenu);

// ── SMOOTH SCROLL (account for fixed topbar) ──
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = target.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top: offset, behavior: 'smooth' });
  });
});

// ── TOPBAR SHADOW ON SCROLL ──
let scrollTicking = false;
window.addEventListener('scroll', () => {
  if (!scrollTicking) {
    requestAnimationFrame(() => {
      document.getElementById('topbar').style.boxShadow = window.scrollY > 10 ? '0 4px 24px rgba(0,0,0,.5)' : '';
      scrollTicking = false;
    });
    scrollTicking = true;
  }
});

// ── GALLERY FILTER ──
let activeItems = [];
function filterGallery(cat, btn) {
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const items = document.querySelectorAll('.gallery-item');
  items.forEach(item => {
    if (cat === 'all' || item.dataset.cat === cat) {
      item.style.display = '';
    } else {
      item.style.display = 'none';
    }
  });
  buildActiveItems();
}
function buildActiveItems() {
  activeItems = Array.from(document.querySelectorAll('.gallery-item')).filter(i => i.style.display !== 'none');
}
buildActiveItems();

// ── LIGHTBOX ──
let currentIdx = 0;
let lightboxOpener = null;
function openLightbox(item) {
  lightboxOpener = document.activeElement;
  currentIdx = activeItems.indexOf(item);
  showLightboxItem(currentIdx);
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
  document.querySelector('.lightbox-close').focus();
}
function showLightboxItem(idx) {
  const item = activeItems[idx];
  if (!item) return;
  const img = item.querySelector('img');
  if (img) document.getElementById('lightboxImg').src = img.src;
  currentIdx = idx;
}
function lightboxNav(dir) {
  const next = (currentIdx + dir + activeItems.length) % activeItems.length;
  showLightboxItem(next);
}
function closeLightbox() {
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
  if (lightboxOpener) { lightboxOpener.focus(); lightboxOpener = null; }
}
document.addEventListener('keydown', e => {
  if (!document.getElementById('lightbox').classList.contains('open')) return;
  if (e.key === 'Escape') { closeLightbox(); return; }
  if (e.key === 'ArrowRight') { lightboxNav(1); return; }
  if (e.key === 'ArrowLeft') { lightboxNav(-1); return; }
  if (e.key === 'Tab') {
    const focusable = [
      document.querySelector('.lightbox-close'),
      document.getElementById('lightboxPrev'),
      document.getElementById('lightboxNext')
    ];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (e.shiftKey) {
      if (document.activeElement === first) { e.preventDefault(); last.focus(); }
    } else {
      if (document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }
});
document.getElementById('lightbox').addEventListener('click', e => {
  if (e.target === document.getElementById('lightbox') || e.target === document.getElementById('lightboxImg')) closeLightbox();
});

// ── FORM ──
async function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('.form-submit');
  btn.textContent = _t.sending;
  btn.disabled = true;
  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });
    if (res.ok) {
      btn.textContent = _t.sent;
      btn.style.background = 'linear-gradient(135deg,#2ab5ac,#4ecdc4)';
      form.reset();
      setTimeout(() => { btn.textContent = _t.submitDefault; btn.style.background = ''; btn.disabled = false; }, 4000);
    } else {
      btn.textContent = _t.retry;
      btn.style.background = '#c0392b';
      setTimeout(() => { btn.textContent = _t.submitDefault; btn.style.background = ''; btn.disabled = false; }, 3000);
    }
  } catch {
    btn.textContent = _t.connError;
    btn.style.background = '#c0392b';
    setTimeout(() => { btn.textContent = _t.submitDefault; btn.style.background = ''; btn.disabled = false; }, 3000);
  }
}

