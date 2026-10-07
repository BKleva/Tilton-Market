// ---------- Weekly deli specials ----------
// Update this each week. `flyer` is the day's PDF from the deli; `item` is optional —
// add { name, price, unit, note } to show the special as a full card on the page.
var SPECIALS = {
  weekStart: '2026-10-04', // a Sunday
  days: [
    { key: 'Sun', flyer: 'https://tiltonmarket.com/wp-content/uploads/2026/09/86400_WEEKEND-1-.pdf' },
    { key: 'Mon', flyer: 'https://tiltonmarket.com/wp-content/uploads/2026/10/86400_MONDAY-2.pdf',
      item: { name: "Tilton Market's Fresh Health Salad", price: '$5.49', unit: 'per lb', note: 'Made fresh in our deli kitchen.' } },
    { key: 'Tue', flyer: 'https://tiltonmarket.com/wp-content/uploads/2026/10/86400_TUESDAY-2.pdf' },
    { key: 'Wed', flyer: 'https://tiltonmarket.com/wp-content/uploads/2026/10/86400_WEDNESDAY-2.pdf' },
    { key: 'Thu', flyer: 'https://tiltonmarket.com/wp-content/uploads/2026/10/86400_THURSDAY-2.pdf' },
    { key: 'Fri', flyer: 'https://tiltonmarket.com/wp-content/uploads/2026/10/86400_FRIDAY-2.pdf' },
    { key: 'Sat', flyer: 'https://tiltonmarket.com/wp-content/uploads/2026/10/86400_WEEKEND-2.pdf' }
  ]
};
var LONG = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function dayDate(i) {
  var p = SPECIALS.weekStart.split('-');
  return new Date(+p[0], +p[1] - 1, +p[2] + i);
}

function specialHTML(i) {
  var d = SPECIALS.days[i];
  if (d.item) {
    return '<div class="sp-item"><div class="sp-burst"><div><b>' + d.item.price + '</b><small>' + d.item.unit.toUpperCase() + '</small></div></div>' +
      '<div><div class="sp-name">' + d.item.name + '</div><p class="sp-sub">' + d.item.note + '</p>' +
      '<p style="margin-top:.8rem"><a class="sp-link" href="' + d.flyer + '" target="_blank" rel="noopener">View the full flyer ↗</a></p></div></div>';
  }
  return '<div class="sp-empty"><div class="sp-name">' + LONG[i] + "'s deli special</div>" +
    '<p>Posted fresh at the counter — open the flyer to see what\'s on sale today.</p>' +
    '<a class="sp-link" href="' + d.flyer + '" target="_blank" rel="noopener">Open ' + LONG[i] + ' flyer ↗</a></div>';
}

var week = document.getElementById('week');
var board = document.getElementById('board');
var heroSpecial = document.getElementById('heroSpecial');
var heroDay = document.getElementById('heroDay');
var todayIdx = new Date().getDay();

function select(i) {
  [].forEach.call(week.children, function (b, n) { b.setAttribute('aria-selected', n === i); });
  var dt = dayDate(i);
  board.innerHTML =
    '<div>' + specialHTML(i) + '</div>' +
    '<div class="board-side"><h4>' + LONG[i] + ', ' + MONTHS[dt.getMonth()] + ' ' + dt.getDate() + '</h4>' +
    '<p>Want it waiting for you? Order ahead and we\'ll slice it fresh, or call the deli at ext. 1.</p>' +
    '<a class="btn btn-mustard btn-sm" href="/deli-order/">Order from the deli</a></div>';
}

SPECIALS.days.forEach(function (d, i) {
  var dt = dayDate(i);
  var b = document.createElement('button');
  b.className = 'day' + (i === todayIdx ? ' today' : '');
  b.setAttribute('role', 'tab');
  b.innerHTML = '<span>' + d.key + '</span><b>' + dt.getDate() + '</b><small>TODAY</small>';
  b.addEventListener('click', function () { select(i); });
  week.appendChild(b);
});
select(todayIdx);
heroSpecial.innerHTML = specialHTML(todayIdx);
heroDay.textContent = LONG[todayIdx];

// ---------- Catering tabs ----------
var tabs = document.getElementById('cateringTabs');
tabs.querySelector('.tab-btns').addEventListener('click', function (e) {
  var b = e.target.closest('button');
  if (!b) return;
  [].forEach.call(tabs.querySelectorAll('.tab-btns button'), function (x) { x.classList.toggle('on', x === b); });
  [].forEach.call(tabs.querySelectorAll('.tab-pane'), function (p) { p.classList.toggle('on', p.id === 't-' + b.dataset.t); });
});
