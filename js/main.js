/* ============================================================
   Bar do Jardim — JavaScript principal
   Sem dependências externas. Vanilla JS puro.
   ============================================================ */

(function () {
  'use strict';

  /* ---------- Navbar: scroll e menu mobile ---------- */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navLinkItems = navLinks.querySelectorAll('a');

  // Adiciona classe 'scrolled' quando a página desce
  window.addEventListener('scroll', function () {
    navbar.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  // Abre/fecha menu mobile
  navToggle.addEventListener('click', function () {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.classList.toggle('open', isOpen);
    navToggle.setAttribute('aria-expanded', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Fecha menu ao clicar num link
  navLinkItems.forEach(function (link) {
    link.addEventListener('click', function () {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Fecha menu ao clicar fora
  document.addEventListener('click', function (e) {
    if (!navbar.contains(e.target) && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      navToggle.classList.remove('open');
      document.body.style.overflow = '';
    }
  });

  /* ---------- Scroll suave para links internos ---------- */
  document.querySelectorAll('a.scroll-link, .nav-links a').forEach(function (link) {
    link.addEventListener('click', function (e) {
      const href = link.getAttribute('href');
      if (href && href.startsWith('#') && href.length > 1) {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          const offset = navbar.offsetHeight + 8;
          const top = target.getBoundingClientRect().top + window.scrollY - offset;
          window.scrollTo({ top: top, behavior: 'smooth' });
        }
      }
    });
  });

  /* ---------- Link activo na navbar conforme secção ---------- */
  const sections = document.querySelectorAll('section[id]');

  function actualizarLinkActivo() {
    const scrollPos = window.scrollY + navbar.offsetHeight + 40;
    let activo = null;
    sections.forEach(function (sec) {
      if (sec.offsetTop <= scrollPos) activo = sec.id;
    });
    navLinkItems.forEach(function (link) {
      const href = link.getAttribute('href');
      link.classList.toggle('active', href === '#' + activo);
    });
  }

  window.addEventListener('scroll', actualizarLinkActivo, { passive: true });
  actualizarLinkActivo();

  /* ---------- Animações de entrada com Intersection Observer ---------- */
  const observerOpts = {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  };

  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Atraso cascata para cards numa grelha
        const siblings = entry.target.parentElement.querySelectorAll('.reveal');
        siblings.forEach(function (el, i) {
          if (el === entry.target) {
            el.style.transitionDelay = (i * 80) + 'ms';
          }
        });
        observer.unobserve(entry.target);
      }
    });
  }, observerOpts);

  document.querySelectorAll('.reveal').forEach(function (el) {
    observer.observe(el);
  });

  // Hero fade-in imediato
  const heroContent = document.querySelector('.fade-in');
  if (heroContent) {
    setTimeout(function () {
      heroContent.classList.add('visible');
    }, 100);
  }

  /* ---------- Tabs do menu ---------- */
  const tabBtns = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');

  tabBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const tabId = btn.getAttribute('data-tab');

      tabBtns.forEach(function (b) { b.classList.remove('active'); });
      tabContents.forEach(function (c) { c.classList.remove('active'); });

      btn.classList.add('active');
      const content = document.getElementById('tab-' + tabId);
      if (content) content.classList.add('active');
    });
  });

  /* ---------- Lightbox da galeria ---------- */
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const lightboxClose = document.getElementById('lightboxClose');
  const lightboxPrev = document.getElementById('lightboxPrev');
  const lightboxNext = document.getElementById('lightboxNext');
  const galleryItems = Array.from(document.querySelectorAll('.gallery-item'));

  let currentIndex = 0;

  function abrirLightbox(index) {
    currentIndex = index;
    const item = galleryItems[index];
    lightboxImg.src = item.getAttribute('data-src');
    lightboxImg.alt = item.querySelector('img').alt;
    lightboxCaption.textContent = item.getAttribute('data-caption') || '';
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
    lightboxClose.focus();
  }

  function fecharLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
    lightboxImg.src = '';
  }

  function irPara(delta) {
    currentIndex = (currentIndex + delta + galleryItems.length) % galleryItems.length;
    const item = galleryItems[currentIndex];
    lightboxImg.src = item.getAttribute('data-src');
    lightboxImg.alt = item.querySelector('img').alt;
    lightboxCaption.textContent = item.getAttribute('data-caption') || '';
  }

  galleryItems.forEach(function (item, i) {
    item.addEventListener('click', function () { abrirLightbox(i); });
    item.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); abrirLightbox(i); }
    });
    item.setAttribute('tabindex', '0');
    item.setAttribute('role', 'button');
  });

  lightboxClose.addEventListener('click', fecharLightbox);
  lightboxPrev.addEventListener('click', function () { irPara(-1); });
  lightboxNext.addEventListener('click', function () { irPara(1); });

  // Fechar ao clicar fora da imagem
  lightbox.addEventListener('click', function (e) {
    if (e.target === lightbox) fecharLightbox();
  });

  // Teclado
  document.addEventListener('keydown', function (e) {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape') fecharLightbox();
    if (e.key === 'ArrowLeft') irPara(-1);
    if (e.key === 'ArrowRight') irPara(1);
  });

  // Swipe no mobile
  let touchStartX = 0;
  lightbox.addEventListener('touchstart', function (e) {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  lightbox.addEventListener('touchend', function (e) {
    const diff = touchStartX - e.changedTouches[0].screenX;
    if (Math.abs(diff) > 50) irPara(diff > 0 ? 1 : -1);
  }, { passive: true });

})();
