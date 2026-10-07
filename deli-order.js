(function () {
  var $ = function (id) { return document.getElementById(id); };
  var cart = [];

  var itemType = $('itemType'), addBtn = $('addBtn'), err1 = $('err1');
  var groups = { Sandwich: 'g-sandwich', 'Hot Case Item': 'g-hot', Lunchmeat: 'g-lunch', Cheese: 'g-cheese', Salads: 'g-salad' };

  function show(el, on) { el.hidden = !on; }
  function val(id) { return $(id).value.trim(); }
  function weight() {
    var r = document.querySelector('input[name=weight]:checked');
    if (!r) return '';
    return r.value === 'Other' ? val('weightOther') : r.value;
  }

  function syncForm() {
    var t = itemType.value;
    Object.keys(groups).forEach(function (k) { show($(groups[k]), k === t); });
    show($('f-weight'), t && t !== 'Sandwich');
    var cat = val('lmCat');
    show($('f-turkey'), t === 'Lunchmeat' && cat === 'Turkey');
    show($('f-beef'), t === 'Lunchmeat' && cat === 'Beef & Pork');
    show($('f-lmother'), t === 'Lunchmeat' && /^(Salami|Bologna|Chicken)$/.test(cat));
    var other = document.querySelector('input[name=weight]:checked');
    show($('f-wother'), !!other && other.value === 'Other');
    addBtn.disabled = !t;
    err1.hidden = true;
  }
  itemType.addEventListener('change', syncForm);
  $('lmCat').addEventListener('change', syncForm);
  document.querySelectorAll('input[name=weight]').forEach(function (r) { r.addEventListener('change', syncForm); });

  function fail(msg) { err1.textContent = msg; err1.hidden = false; }

  function buildItem() {
    var t = itemType.value, w = weight(), cat = val('lmCat');
    if (t === 'Sandwich') {
      if (!val('sandwichDesc')) return fail('Tell us what kind of sandwich you would like.');
      var q = Math.max(1, parseInt($('sandwichQty').value, 10) || 1);
      return { title: 'Sandwich × ' + q, detail: val('sandwichDesc') };
    }
    var title;
    if (t === 'Hot Case Item') { title = val('hotItem'); if (!title) return fail('Which hot case item would you like?'); }
    else if (t === 'Cheese') { title = val('cheeseKind'); if (!title) return fail('Which cheese would you like?'); }
    else if (t === 'Salads') { title = val('saladKind'); if (!title) return fail('Please pick a salad.'); }
    else {
      if (!cat) return fail('Please pick a lunchmeat.');
      if (cat === 'Turkey') { title = val('lmTurkey'); if (!title) return fail('Please pick a turkey.'); }
      else if (cat === 'Beef & Pork') { title = val('lmBeef'); if (!title) return fail('Please pick a lunchmeat.'); }
      else { title = cat + (val('lmOther') ? ' – ' + val('lmOther') : ''); }
    }
    if (!w) return fail(document.querySelector('input[name=weight]:checked') ? 'Please enter a weight.' : 'Please choose a weight.');
    return { title: title, detail: w };
  }

  function resetBuilder() {
    itemType.value = '';
    ['sandwichDesc', 'hotItem', 'cheeseKind', 'lmOther', 'weightOther'].forEach(function (id) { $(id).value = ''; });
    ['lmCat', 'lmTurkey', 'lmBeef', 'saladKind'].forEach(function (id) { $(id).value = ''; });
    $('sandwichQty').value = 1;
    document.querySelectorAll('input[name=weight]').forEach(function (r) { r.checked = false; });
    syncForm();
  }

  function renderCart() {
    var ul = $('cart');
    ul.textContent = '';
    cart.forEach(function (it, i) {
      var li = document.createElement('li');
      var d = document.createElement('div');
      var b = document.createElement('b'); b.textContent = it.title;
      var s = document.createElement('span'); s.textContent = it.detail;
      d.appendChild(b); d.appendChild(s);
      var x = document.createElement('button');
      x.type = 'button'; x.className = 'rm'; x.setAttribute('aria-label', 'Remove ' + it.title); x.textContent = '×';
      x.addEventListener('click', function () { cart.splice(i, 1); renderCart(); });
      li.appendChild(d); li.appendChild(x);
      ul.appendChild(li);
    });
    $('cartEmpty').hidden = cart.length > 0;
    $('toStep2').disabled = cart.length === 0;
  }

  addBtn.addEventListener('click', function () {
    var it = buildItem();
    if (!it) return;
    cart.push(it);
    renderCart();
    resetBuilder();
    $('cart').lastElementChild.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  });

  // ---- steps ----
  function setStep(n) {
    ['step1', 'step2', 'step3', 'stepDone'].forEach(function (id, i) {
      $(id).classList.toggle('on', (n === 'done' ? 3 : n - 1) === i);
    });
    document.querySelectorAll('#steps li').forEach(function (li) {
      var s = +li.dataset.s;
      li.classList.toggle('on', n === 'done' ? true : s <= n);
    });
    document.querySelector('.order-main').scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
  $('toStep2').addEventListener('click', function () {
    // add whatever is half-built, if valid
    if (itemType.value) { var it = buildItem(); if (!it) return; cart.push(it); renderCart(); resetBuilder(); }
    setStep(2);
  });
  document.querySelectorAll('[data-go]').forEach(function (b) { b.addEventListener('click', function () { setStep(+b.dataset.go); }); });

  var contact = {};
  $('step2').addEventListener('submit', function (e) {
    e.preventDefault();
    var err = $('err2');
    contact = { first_name: val('fn'), last_name: val('ln'), phone: val('ph'), notes: val('notes') };
    var digits = contact.phone.replace(/\D/g, '');
    if (!contact.first_name || !contact.last_name) { err.textContent = 'Please enter your first and last name.'; err.hidden = false; return; }
    if (digits.length < 10) { err.textContent = 'Please enter a phone number we can reach you at.'; err.hidden = false; return; }
    err.hidden = true;
    renderReview();
    setStep(3);
  });

  function orderText() {
    return cart.map(function (it, i) { return (i + 1) + '. ' + it.title + ' — ' + it.detail; }).join('\n');
  }
  function renderReview() {
    var r = $('review');
    r.textContent = '';
    var h = document.createElement('h4'); h.textContent = 'Order'; r.appendChild(h);
    var ol = document.createElement('ol');
    cart.forEach(function (it) {
      var li = document.createElement('li');
      var b = document.createElement('b'); b.textContent = it.title;
      li.appendChild(b); li.appendChild(document.createTextNode(' — ' + it.detail));
      ol.appendChild(li);
    });
    r.appendChild(ol);
    var h2 = document.createElement('h4'); h2.textContent = 'Pickup contact'; r.appendChild(h2);
    var p = document.createElement('p');
    p.textContent = contact.first_name + ' ' + contact.last_name + ' · ' + contact.phone;
    r.appendChild(p);
    if (contact.notes) { var n = document.createElement('p'); n.className = 'fine-s'; n.textContent = 'Note: ' + contact.notes; r.appendChild(n); }
  }

  $('sendBtn').addEventListener('click', function () {
    var btn = this, err = $('err3');
    btn.disabled = true; btn.textContent = 'Sending…'; err.hidden = true;
    var body = new URLSearchParams({
      'form-name': 'deli-order', 'bot-field': '',
      first_name: contact.first_name, last_name: contact.last_name, phone: contact.phone,
      notes: contact.notes, order: orderText()
    }).toString();
    fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: body })
      .then(function (r) { if (!r.ok) throw new Error(r.status); })
      .then(function () {
        $('doneName').textContent = contact.first_name;
        cart = [];
        renderCart();
        setStep('done');
      })
      .catch(function () {
        err.textContent = 'Sorry, that did not go through. Please try again or call the deli at 609-641-5118 ext. 1.';
        err.hidden = false;
      })
      .then(function () { btn.disabled = false; btn.textContent = 'Send my order'; });
  });

  $('againBtn').addEventListener('click', function () {
    cart = []; contact = {}; renderCart(); resetBuilder();
    ['fn', 'ln', 'ph', 'notes'].forEach(function (id) { $(id).value = ''; });
    setStep(1);
  });

  renderCart();
  syncForm();
})();
