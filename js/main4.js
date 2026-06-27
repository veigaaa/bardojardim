/* ============================================================
   Bar do Jardim — main4.js  (Glassmorphism v3)
   Vanilla JS puro. Scroll nativo via CSS scroll-behavior: smooth.
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Navbar: scroll e menu mobile ---------- */
  var navbar    = document.getElementById('navbar');
  var navToggle = document.getElementById('navToggle');
  var navLinks  = document.getElementById('navLinks');
  var navItems  = navLinks.querySelectorAll('a');

  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 80);
  }, { passive: true });

  navToggle.addEventListener('click', function () {
    var aberto = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', aberto);
    navToggle.setAttribute('aria-expanded', String(aberto));
    document.body.style.overflow = aberto ? 'hidden' : '';
  });

  navItems.forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  document.addEventListener('click', function (e) {
    if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  /* ---------- Link activo conforme secção visível ---------- */
  var sections = Array.from(document.querySelectorAll('section[id]'));

  function actualizarActivo() {
    var limiar  = navbar.offsetHeight + 60;
    var activa  = null;
    sections.forEach(function (sec) {
      if (sec.offsetTop <= window.scrollY + limiar) activa = sec.id;
    });
    navItems.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + activa);
    });
  }

  window.addEventListener('scroll', actualizarActivo, { passive: true });
  actualizarActivo();

  /* ---------- Parallax: hero ---------- */
  var heroParallax = document.getElementById('heroParallax');

  function paralaxeHero() {
    if (!heroParallax) return;
    heroParallax.style.transform = 'translateY(' + (window.scrollY * 0.38) + 'px)';
  }
  window.addEventListener('scroll', paralaxeHero, { passive: true });
  paralaxeHero();

  /* ---------- Parallax: foto dividers ---------- */
  var fotoImgs = Array.from(
    document.querySelectorAll('.foto-divider-img, .foto-duo-img')
  );

  function paralaxeFotos() {
    fotoImgs.forEach(function (img) {
      var velocidade = parseFloat(img.getAttribute('data-parallax-speed') || '0.3');
      var rect       = img.parentElement.getBoundingClientRect();
      var centro     = rect.top + rect.height / 2 - window.innerHeight / 2;
      img.style.transform = 'translateY(' + (centro * velocidade) + 'px)';
    });
  }

  window.addEventListener('scroll', paralaxeFotos, { passive: true });
  paralaxeFotos();

  /* ---------- Intersection Observer — animações de entrada ---------- */
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      var irmaos = entry.target.parentElement.querySelectorAll('.reveal');
      var idx    = 0;
      irmaos.forEach(function (el, i) { if (el === entry.target) idx = i; });
      entry.target.style.transitionDelay = (idx * 70) + 'ms';
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  /* ---------- Tabs do menu ---------- */
  var tabBtns     = document.querySelectorAll('.tab-btn');
  var tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var id = btn.getAttribute('data-tab');
      tabBtns.forEach(function (b) { b.classList.remove('active'); });
      tabContents.forEach(function (c) { c.classList.remove('active'); });
      btn.classList.add('active');
      var alvo = document.getElementById('tab-' + id);
      if (alvo) alvo.classList.add('active');
    });
  });

  /* ---------- Fallback fundo se imagem não carregar ---------- */
  (function () {
    var probe = new Image();
    probe.onerror = function () {
      var el = document.querySelector('.bg-fixed-img');
      if (el) el.style.background =
        'linear-gradient(135deg, #000c2e 0%, #0007CE 50%, #001a6e 100%)';
    };
    probe.src = 'images/exterior.jpg';
  }());

}());
