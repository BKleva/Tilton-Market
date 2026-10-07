// Shared across all pages: open-now pill, mobile nav, scroll reveal, footer year
// ---------- Open now pill (8am–6pm daily, store time) ----------
(function () {
  var pill = document.getElementById('openPill');
  var parts = new Intl.DateTimeFormat('en-US', { timeZone: 'America/New_York', hour: 'numeric', minute: 'numeric', hour12: false }).formatToParts(new Date());
  var h = +parts.find(function (p) { return p.type === 'hour'; }).value % 24;
  var m = +parts.find(function (p) { return p.type === 'minute'; }).value;
  var mins = h * 60 + m;
  var open = mins >= 480 && mins < 1080;
  pill.hidden = false;
  pill.classList.toggle('closed', !open);
  document.getElementById('openText').textContent = open ? 'Open now · until 6pm' : 'Closed · opens 8am';
})();

// ---------- Mobile nav ----------
var burger = document.getElementById('burger');
var nav = document.getElementById('nav');
burger.addEventListener('click', function () {
  var o = nav.classList.toggle('open');
  burger.setAttribute('aria-expanded', o);
});
nav.addEventListener('click', function (e) {
  if (e.target.tagName === 'A') { nav.classList.remove('open'); burger.setAttribute('aria-expanded', false); }
});

// ---------- Scroll reveal ----------
var els = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window) {
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
  }, { threshold: 0.12 });
  els.forEach(function (el, i) { el.style.transitionDelay = (i % 4) * 60 + 'ms'; io.observe(el); });
} else {
  els.forEach(function (el) { el.classList.add('in'); });
}
document.getElementById('yr').textContent = new Date().getFullYear();
