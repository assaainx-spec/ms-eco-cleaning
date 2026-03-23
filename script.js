
// ── SCROLL RESTORE AFTER LANGUAGE SWITCH ──
(function() {
  const pos = sessionStorage.getItem('scrollPos');
  if (pos) {
    sessionStorage.removeItem('scrollPos');
    window.addEventListener('load', () => window.scrollTo(0, parseInt(pos)));
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
if (localStorage.getItem('cookiesAccepted')) {
  document.getElementById('cookieBanner').style.display = 'none';
}
function acceptCookies() {
  localStorage.setItem('cookiesAccepted', '1');
  document.getElementById('cookieBanner').style.display = 'none';
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
function openLightbox(item) {
  currentIdx = activeItems.indexOf(item);
  showLightboxItem(currentIdx);
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
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
}
document.addEventListener('keydown', e => {
  if (!document.getElementById('lightbox').classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') lightboxNav(1);
  if (e.key === 'ArrowLeft') lightboxNav(-1);
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

