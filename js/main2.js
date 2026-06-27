/* ============================================================
   Bar do Jardim — main2.js  (tema Glassmorphism)
   Vanilla JS puro, sem dependências externas.
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Navbar: scroll e menu mobile ---------- */
  const navbar    = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');
  const navItems  = navLinks.querySelectorAll('a');

  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 80);
  }, { passive: true });

  navToggle.addEventListener('click', function () {
    const aberto = navLinks.classList.toggle('open');
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

  // Fecha ao clicar fora
  document.addEventListener('click', function (e) {
    if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  /* ---------- Scroll suave para links internos ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = link.getAttribute('href');
      if (!href || href === '#') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight + 12;
      window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
    });
  });

  /* ---------- Link activo conforme secção visível ---------- */
  const sections = Array.from(document.querySelectorAll('section[id]'));

  function actualizarActivo() {
    const limiar = navbar.offsetHeight + 60;
    let activa = null;
    sections.forEach(function (sec) {
      if (sec.offsetTop <= window.scrollY + limiar) activa = sec.id;
    });
    navItems.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + activa);
    });
  }

  window.addEventListener('scroll', actualizarActivo, { passive: true });
  actualizarActivo();

  /* ---------- Efeito paralaxe no hero ---------- */
  const heroParallax = document.getElementById('heroParallax');

  if (heroParallax) {
    function aplicarParalaxe() {
      // Move a imagem do hero mais lentamente que o scroll (factor 0.4)
      const y = window.scrollY * 0.4;
      heroParallax.style.transform = 'translateY(' + y + 'px)';
    }
    window.addEventListener('scroll', aplicarParalaxe, { passive: true });
    aplicarParalaxe();
  }

  /* ---------- Intersection Observer — animações de entrada ---------- */
  const io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      // Atraso em cascata para irmãos dentro da mesma grelha
      const irmaos = entry.target.parentElement.querySelectorAll('.reveal');
      let idx = 0;
      irmaos.forEach(function (el, i) { if (el === entry.target) idx = i; });
      entry.target.style.transitionDelay = (idx * 70) + 'ms';
      entry.target.classList.add('visible');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  document.querySelectorAll('.reveal').forEach(function (el) { io.observe(el); });

  /* ---------- Tabs do menu ---------- */
  const tabBtns     = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const id = btn.getAttribute('data-tab');
      tabBtns.forEach(function (b) { b.classList.remove('active'); });
      tabContents.forEach(function (c) { c.classList.remove('active'); });
      btn.classList.add('active');
      const alvo = document.getElementById('tab-' + id);
      if (alvo) alvo.classList.add('active');
    });
  });

  /* ---------- Lightbox da galeria ---------- */
  const lightbox   = document.getElementById('lightbox');
  const lbImg      = document.getElementById('lbImg');
  const lbCaption  = document.getElementById('lbCaption');
  const lbCounter  = document.getElementById('lbCounter');
  const lbClose    = document.getElementById('lbClose');
  const lbPrev     = document.getElementById('lbPrev');
  const lbNext     = document.getElementById('lbNext');
  const itens      = Array.from(document.querySelectorAll('.masonry-item'));

  let idxActual = 0;

  function mostrarFoto(idx) {
    idxActual = (idx + itens.length) % itens.length;
    const item = itens[idxActual];
    lbImg.src  = item.getAttribute('data-src') || '';
    lbImg.alt  = item.querySelector('img').alt  || '';
    lbCaption.textContent = item.getAttribute('data-caption') || '';
    lbCounter.textContent = (idxActual + 1) + ' / ' + itens.length;
  }

  function abrirLightbox(idx) {
    mostrarFoto(idx);
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lbClose.focus();
  }

  function fecharLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    // Limpa src para interromper carregamento de imagens grandes
    setTimeout(function () { if (!lightbox.classList.contains('open')) lbImg.src = ''; }, 400);
  }

  itens.forEach(function (item, i) {
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
    item.setAttribute('aria-label', 'Ver foto ' + (i + 1));
    item.addEventListener('click', function () { abrirLightbox(i); });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrirLightbox(i); }
    });
  });

  lbClose.addEventListener('click', fecharLightbox);
  lbPrev.addEventListener('click', function () { mostrarFoto(idxActual - 1); });
  lbNext.addEventListener('click', function () { mostrarFoto(idxActual + 1); });

  // Fechar ao clicar no fundo
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) fecharLightbox();
  });

  // Teclado
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')      fecharLightbox();
    if (e.key === 'ArrowLeft')   mostrarFoto(idxActual - 1);
    if (e.key === 'ArrowRight')  mostrarFoto(idxActual + 1);
  });

  // Swipe mobile
  let txInicio = 0;
  lightbox.addEventListener('touchstart', function (e) {
    txInicio = e.changedTouches[0].screenX;
  }, { passive: true });
  lightbox.addEventListener('touchend', function (e) {
    const diff = txInicio - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 45) mostrarFoto(idxActual + (diff > 0 ? 1 : -1));
  }, { passive: true });

  /* ---------- Fallback para fundo fixo sem imagem ---------- */
  /* Se exterior.jpg não carregar, o overlay CSS já tem gradiente de fallback.
     Aqui apenas garantimos que o .bg-fixed-img::after fica visível. */
  (function () {
    const probe = new Image();
    probe.onerror = function () {
      const el = document.querySelector('.bg-fixed-img');
      if (el) el.style.background = 'linear-gradient(135deg,#000820 0%,#0007CE 50%,#001a6e 100%)';
    };
    probe.src = 'images/exterior.jpg';
  }());

})();
