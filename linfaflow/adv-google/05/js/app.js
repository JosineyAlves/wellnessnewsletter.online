/* LinfaFlow advertorial — self-contained page script.
   Replaces jQuery + slick + lazysizes + theme runtime. No external requests. */
(function () {
  'use strict';

  /* ---------- body OS class (kept from original theme JS) ---------- */
  document.body.classList.add(
    navigator.userAgent.indexOf('Mac') > -1 ? 'mac-os' : 'window-os'
  );

  /* ---------- FAQ accordion (.el-question + .el-answer) ---------- */
  var DURATION = 300;
  var questions = Array.prototype.slice.call(document.querySelectorAll('.el-question'));

  questions.forEach(function (q) {
    var a = q.nextElementSibling;
    if (!a || !a.classList.contains('el-answer')) return;

    a.style.overflow = 'hidden';
    a.style.transition = 'max-height ' + DURATION + 'ms ease';
    a.style.maxHeight = '0px';
    a.style.display = 'none';          // collapsed by default (matches original inline style)
    q._answer = a;
    q._timer = null;

    q.setAttribute('role', 'button');
    q.setAttribute('tabindex', '0');
    q.setAttribute('aria-expanded', 'false');

    q.addEventListener('click', function () { toggle(q); });
    q.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(q); }
    });
  });

  function open(q) {
    var a = q._answer;
    clearTimeout(q._timer);
    q.classList.add('active');
    q.setAttribute('aria-expanded', 'true');
    a.style.display = '';
    a.style.maxHeight = '0px';
    void a.offsetHeight;                       // force reflow
    a.style.maxHeight = a.scrollHeight + 'px';
    q._timer = setTimeout(function () { a.style.maxHeight = 'none'; }, DURATION + 30);
  }

  function close(q) {
    var a = q._answer;
    clearTimeout(q._timer);
    q.classList.remove('active');
    q.setAttribute('aria-expanded', 'false');
    a.style.maxHeight = a.scrollHeight + 'px';
    void a.offsetHeight;
    a.style.maxHeight = '0px';
    q._timer = setTimeout(function () { a.style.display = 'none'; }, DURATION + 30);
  }

  function toggle(q) {
    var isOpen = q.classList.contains('active');
    questions.forEach(function (other) {
      if (other !== q && other.classList.contains('active')) close(other);
    });
    if (isOpen) close(q); else open(q);
  }

  /* ---------- sticky bottom bar (kept from original section script) ---------- */
  (function () {
    var bar = document.querySelector('.custom_sticky_bottom-shopi');
    if (!bar) return;
    var target = document.querySelector('.barshow');

    function update() {
      if (!target) { bar.classList.remove('active'); return; }
      var triggerPoint = window.innerHeight * 0.66;
      if (target.getBoundingClientRect().top <= triggerPoint) bar.classList.add('active');
      else bar.classList.remove('active');
    }
    window.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    update();
  })();
})();
