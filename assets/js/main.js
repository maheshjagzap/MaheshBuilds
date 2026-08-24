/**
 * MAHESH BUILDS  — main.js
 * Digital Experiences & Web Development
 */

(function () {
  'use strict';

  /* ── PRELOADER ──────────────────────────────────────────── */
  window.addEventListener('load', function () {
    const preloader = document.getElementById('preloader');
    if (preloader) {
      setTimeout(() => preloader.classList.add('hidden'), 400);
    }
  });

  /* ── THEME TOGGLE ───────────────────────────────────────── */
  const themeToggle = document.getElementById('themeToggle');
  const html        = document.documentElement;

  function applyTheme(theme) {
    html.setAttribute('data-theme', theme);
    localStorage.setItem('mb-theme', theme);
  }

  // Load saved preference, default dark
  const savedTheme = localStorage.getItem('mb-theme') || 'dark';
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  /* ── HEADER SCROLL ──────────────────────────────────────── */
  const header = document.getElementById('header');

  function onScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 60);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ── MOBILE NAV ─────────────────────────────────────────── */
  const mobileBtn = document.getElementById('mobileNavToggle');
  const navbar    = document.getElementById('navbar');

  if (mobileBtn && navbar) {
    function openNav() {
      navbar.classList.add('open');
      mobileBtn.classList.add('open');
      mobileBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }
    function closeNav() {
      navbar.classList.remove('open');
      mobileBtn.classList.remove('open');
      mobileBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    mobileBtn.addEventListener('click', () => {
      navbar.classList.contains('open') ? closeNav() : openNav();
    });

    navbar.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', closeNav);
    });

    document.addEventListener('click', (e) => {
      if (navbar.classList.contains('open') && !navbar.contains(e.target) && !mobileBtn.contains(e.target)) {
        closeNav();
      }
    });

    // Keyboard close
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && navbar.classList.contains('open')) closeNav();
    });
  }

  /* ── ACTIVE NAV LINK (scrollspy) ───────────────────────── */
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function updateActiveLink() {
    const scrollPos = window.scrollY + 120;
    sections.forEach(section => {
      const top    = section.offsetTop;
      const bottom = top + section.offsetHeight;
      if (scrollPos >= top && scrollPos < bottom) {
        navLinks.forEach(l => l.classList.remove('active'));
        const active = document.querySelector(`.nav-link[href="#${section.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }
  window.addEventListener('scroll', updateActiveLink, { passive: true });
  updateActiveLink();

  /* ── SCROLL TO TOP ──────────────────────────────────────── */
  const scrollTopBtn = document.getElementById('scrollTop');
  if (scrollTopBtn) {
    window.addEventListener('scroll', () => {
      scrollTopBtn.classList.toggle('visible', window.scrollY > 400);
    }, { passive: true });

    scrollTopBtn.addEventListener('click', (e) => {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── AOS INIT ───────────────────────────────────────────── */
  if (typeof AOS !== 'undefined') {
    AOS.init({
      duration: 650,
      easing: 'ease-out-cubic',
      once: true,
      offset: 50,
    });
  }

  /* ── PROJECT FILTER ─────────────────────────────────────── */
  const filterBtns     = document.querySelectorAll('.filter-btn');
  const projectCards   = document.querySelectorAll('.project-card');
  const featuredWork   = document.querySelector('.featured-work');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      // Featured project visibility
      if (featuredWork) {
        const fpTags = (featuredWork.dataset.tags || '').split(' ');
        const showFp = filter === 'all' || fpTags.includes(filter);
        featuredWork.style.display = showFp ? '' : 'none';
      }

      // Card grid visibility
      projectCards.forEach(card => {
        const tags = (card.dataset.tags || '').split(' ');
        const show = filter === 'all' || tags.includes(filter);
        if (show) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  /* ── FEATURED WORK IMAGE SWITCHER ───────────────────────── */
  window.switchFwImg = function (thumb, src) {
    const mainImg = document.getElementById('fwMainImg');
    if (!mainImg) return;

    mainImg.style.opacity = '0';
    mainImg.style.transform = 'scale(0.97)';

    setTimeout(() => {
      mainImg.src = src;
      mainImg.style.opacity = '1';
      mainImg.style.transform = 'scale(1)';
    }, 180);

    document.querySelectorAll('.fw-thumb').forEach(t => t.classList.remove('active'));
    thumb.classList.add('active');
  };

  // Allow keyboard navigation on thumb images
  document.querySelectorAll('.fw-thumb').forEach(thumb => {
    thumb.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        thumb.click();
      }
    });
  });

  /* ── SMOOTH SCROLL for anchor links ────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = header ? header.offsetHeight : 0;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── EMAILJS CONTACT FORM ───────────────────────────────── */
  /*
   * EmailJS Configuration
   * ─────────────────────
   * The existing EmailJS keys have been preserved from the previous site.
   * If you want to update the template for the new MAHESH BUILDS contact form:
   *
   * 1. Go to https://www.emailjs.com and log in
   * 2. Dashboard → Email Templates → Edit your template (template_6lpa9fr)
   *    Update to include the new fields:
   *    - {{from_name}}
   *    - {{business_name}}
   *    - {{from_email}}
   *    - {{project_type}}
   *    - {{message}}
   * 3. The service and template IDs below are the existing ones.
   *    Replace if you create a new service/template.
   */

  const EMAILJS_PUBLIC_KEY  = 'doZX5MoMRlcKpTjOD';
  const EMAILJS_SERVICE_ID  = 'service_ixsw4t8';
  const EMAILJS_TEMPLATE_ID = 'template_6lpa9fr';

  if (typeof emailjs !== 'undefined') {
    emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
  }

  const contactForm = document.getElementById('contactForm');
  const formLoading = document.getElementById('formLoading');
  const formSuccess = document.getElementById('formSuccess');
  const formError   = document.getElementById('formError');
  const submitBtn   = document.getElementById('submitBtn');

  function showStatus(el) {
    [formLoading, formSuccess, formError].forEach(e => {
      if (e) e.classList.remove('visible');
    });
    if (el) el.classList.add('visible');
  }

  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();

      const name    = (contactForm.querySelector('#name')?.value || '').trim();
      const email   = (contactForm.querySelector('#email')?.value || '').trim();
      const message = (contactForm.querySelector('#message')?.value || '').trim();

      // Basic validation
      if (!name || !email || !message) {
        showStatus(formError);
        if (formError) formError.textContent = '⚠ Please fill in Name, Email and Message.';
        return;
      }

      // Email format check
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        showStatus(formError);
        if (formError) formError.textContent = '⚠ Please enter a valid email address.';
        return;
      }

      showStatus(formLoading);
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Sending…';
      }

      const businessName  = (contactForm.querySelector('#business_name')?.value || '').trim();
      const projectType   = (contactForm.querySelector('#project_type')?.value || '');

      const templateParams = {
        from_name:     name,
        business_name: businessName || 'Not provided',
        from_email:    email,
        project_type:  projectType  || 'Not specified',
        message:       message,
        reply_to:      email,
        // Legacy fields kept for template compatibility
        budget:        'N/A',
        from_phone:    'N/A',
        phone:         'N/A',
        subject:       'New Project Inquiry — MAHESH BUILDS',
      };

      if (typeof emailjs === 'undefined') {
        // EmailJS not loaded
        setTimeout(() => {
          showStatus(formError);
          if (formError) formError.textContent = '⚠ Message service unavailable. Please email directly.';
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="bi bi-send"></i> Send Message';
          }
        }, 600);
        return;
      }

      emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
        .then(() => {
          showStatus(formSuccess);
          contactForm.reset();
        })
        .catch((err) => {
          console.error('EmailJS error:', err);
          showStatus(formError);
          if (formError) formError.textContent = '✖ Something went wrong. Please try again or reach out via Instagram.';
        })
        .finally(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="bi bi-send"></i> Send Message';
          }
        });
    });
  }

})();
