/* ============================================================
   ESTUDIO 21 ARQ — main.js
   - Navbar scroll / shrink
   - Mobile menu toggle
   - Scroll animations (IntersectionObserver)
   - Contact form validation + mock submit
   ============================================================ */

(function () {
  'use strict';

  /* ---- NAVBAR SCROLL ---- */
  const navbar = document.getElementById('navbar');

  function handleNavScroll() {
    if (window.scrollY > 40) {
      navbar.classList.add('navbar--scrolled');
    } else {
      navbar.classList.remove('navbar--scrolled');
    }
  }

  window.addEventListener('scroll', handleNavScroll, { passive: true });
  handleNavScroll(); // run once on load


  /* ---- MOBILE MENU ---- */
  const hamburger    = document.getElementById('hamburger');
  const mobileMenu   = document.getElementById('mobileMenu');
  const mobileClose  = document.getElementById('mobileClose');
  const mobileOverlay = document.getElementById('mobileOverlay');

  function openMenu() {
    mobileMenu.classList.add('open');
    mobileOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
  }

  function closeMenu() {
    mobileMenu.classList.remove('open');
    mobileOverlay.classList.remove('show');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', openMenu);
  mobileClose.addEventListener('click', closeMenu);
  mobileOverlay.addEventListener('click', closeMenu);

  // Mobile sub-menu accordion
  const mobileParents = document.querySelectorAll('.mobile-parent');
  mobileParents.forEach(function (parent) {
    parent.addEventListener('click', function () {
      const li = parent.closest('.mobile-has-sub');
      li.classList.toggle('open');
    });
  });

  // Close mobile menu on nav link click
  const mobileLinks = mobileMenu.querySelectorAll('a');
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', closeMenu);
  });


  /* ---- SCROLL ANIMATIONS ---- */
  const animateEls = document.querySelectorAll('[data-animate]');

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );

    animateEls.forEach(function (el, i) {
      // Stagger siblings slightly
      el.style.transitionDelay = (i % 4) * 0.08 + 's';
      observer.observe(el);
    });
  } else {
    // Fallback: show everything
    animateEls.forEach(function (el) {
      el.classList.add('visible');
    });
  }


  /* ---- SMOOTH SCROLL FOR ANCHOR LINKS ---- */
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = parseInt(
          getComputedStyle(document.documentElement)
            .getPropertyValue('--nav-h')
        ) || 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top: top, behavior: 'smooth' });
      }
    });
  });


  /* ---- CONTACT FORM VALIDATION ---- */
  const form       = document.getElementById('contactForm');
  const successMsg = document.getElementById('formSuccess');

  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      let valid = true;

      // Clear previous errors
      form.querySelectorAll('.error').forEach(function (el) {
        el.classList.remove('error');
      });

      // Required fields
      const nombre = document.getElementById('nombre');
      const email  = document.getElementById('email');

      if (!nombre.value.trim()) {
        nombre.classList.add('error');
        nombre.focus();
        valid = false;
      }

      if (!email.value.trim() || !isValidEmail(email.value.trim())) {
        email.classList.add('error');
        if (valid) email.focus();
        valid = false;
      }

      if (!valid) return;

      // Mock submission: disable button, show success
      const btn = form.querySelector('.btn-submit');
      btn.disabled = true;
      btn.textContent = 'Enviando…';

      setTimeout(function () {
        btn.disabled = false;
        btn.textContent = 'Enviar';
        form.reset();
        successMsg.classList.add('visible');
        setTimeout(function () {
          successMsg.classList.remove('visible');
        }, 5000);
      }, 1200);
    });

    // Remove error class on input
    form.querySelectorAll('input, select, textarea').forEach(function (el) {
      el.addEventListener('input', function () {
        el.classList.remove('error');
      });
    });
  }

  function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }


  /* ---- ACTIVE NAV ON SCROLL ---- */
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-link');

  function updateActiveNav() {
    let current = '';
    sections.forEach(function (section) {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(function (link) {
      link.classList.remove('active');
      if (link.getAttribute('href') === '#' + current ||
          (current === 'inicio' && link.getAttribute('href') === '#')) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });

})();
