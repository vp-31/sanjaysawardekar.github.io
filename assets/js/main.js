/* ═══════════════════════════════════════════════════════════════════════
   SANJAY TANAJI SAWARDEKAR — PORTFOLIO WEBSITE
   JavaScript: Animations, Counter, Navigation, Forms
   ═══════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── DOM Ready ────────────────────────────────────────────────────── */
  document.addEventListener('DOMContentLoaded', function () {
    initScrollReveal();
    initYearsCounter();
    initMobileNav();
    initScrollToTop();
    initContactForm();
    initSmoothScroll();
    revealVisibleElements();
  });

  /* ── Scroll Reveal ────────────────────────────────────────────────── */
  function initScrollReveal() {
    window.addEventListener('scroll', revealVisibleElements, { passive: true });
  }

  function revealVisibleElements() {
    const reveals = document.querySelectorAll('.reveal:not(.visible)');
    const windowHeight = window.innerHeight;
    const revealPoint = 120;

    reveals.forEach(function (el) {
      const top = el.getBoundingClientRect().top;
      if (top < windowHeight - revealPoint) {
        el.classList.add('visible');
      }
    });
  }

  /* ── 38 Years Counter Animation ───────────────────────────────────── */
  function initYearsCounter() {
    const counterEl = document.querySelector('.years-number[data-count]');
    if (!counterEl) return;

    let animated = false;

    function animateCounter() {
      if (animated) return;
      const rect = counterEl.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      if (rect.top < windowHeight - 50) {
        animated = true;
        const target = parseInt(counterEl.getAttribute('data-count'), 10);
        const duration = 2000;
        const startTime = performance.now();

        function updateCounter(timestamp) {
          const elapsed = timestamp - startTime;
          const progress = Math.min(elapsed / duration, 1);
          // Ease-out cubic
          const eased = 1 - Math.pow(1 - progress, 3);
          const current = Math.floor(eased * target);
          counterEl.textContent = current;
          if (progress < 1) {
            requestAnimationFrame(updateCounter);
          } else {
            counterEl.textContent = target;
          }
        }
        requestAnimationFrame(updateCounter);
      }
    }

    window.addEventListener('scroll', animateCounter, { passive: true });
    // Trigger on load too
    animateCounter();
  }

  /* ── Mobile Navigation Active State ────────────────────────────────── */
  function initMobileNav() {
    const mobileLinks = document.querySelectorAll('.mobile-nav a[data-page]');
    const currentPage = getCurrentPage();

    mobileLinks.forEach(function (link) {
      if (link.getAttribute('data-page') === currentPage) {
        link.classList.add('active');
      }
    });
  }

  function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';

    switch (page) {
      case '': return 'home';
      case 'index.html': return 'home';
      case 'about.html': return 'about';
      case 'services.html': return 'services';
      case 'contact.html': return 'contact';
      default: return 'home';
    }
  }

  /* ── Scroll to Top Button ──────────────────────────────────────────── */
  function initScrollToTop() {
    const btn = document.querySelector('.scroll-top');
    if (!btn) return;

    window.addEventListener('scroll', function () {
      if (window.scrollY > 500) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, { passive: true });

    btn.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ── Smooth Scroll for Anchor Links ────────────────────────────────── */
  function initSmoothScroll() {
    document.addEventListener('click', function (e) {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const targetId = link.getAttribute('href');
      if (targetId === '#') return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();
      const navHeight = window.innerWidth > 768 ? 70 : 60;
      const top = targetEl.getBoundingClientRect().top + window.pageYOffset - navHeight;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  }

  /* ── Contact Form ──────────────────────────────────────────────────── */
  function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const successMsg = document.getElementById('form-success');

    form.addEventListener('submit', function (e) {
      e.preventDefault();

      // Basic validation
      const name = form.querySelector('#name')?.value?.trim();
      const phone = form.querySelector('#phone')?.value?.trim();
      const service = form.querySelector('#service')?.value;
      const message = form.querySelector('#message')?.value?.trim();

      if (!name || !phone) {
        shakeElement(form);
        return;
      }

      // Phone validation (Indian mobile)
      const phoneClean = phone.replace(/[\s\-\(\)]/g, '');
      if (phoneClean.length < 10) {
        const phoneField = form.querySelector('#phone');
        if (phoneField) shakeElement(phoneField);
        return;
      }

      // Submit to Formspree
      const formData = new FormData(form);
      const submitBtn = form.querySelector('.form-submit');
      const originalText = submitBtn.textContent;
      submitBtn.textContent = 'पाठवत आहे / Sending...';
      submitBtn.disabled = true;

      fetch(form.action, {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      })
        .then(function (response) {
          if (response.ok) {
            form.style.display = 'none';
            if (successMsg) successMsg.classList.add('show');
          } else {
            throw new Error('Form submission failed');
          }
        })
        .catch(function () {
          submitBtn.textContent = originalText;
          submitBtn.disabled = false;
          alert('Something went wrong. Please try again or call directly at +91 8655577308.');
        });
    });
  }

  function shakeElement(el) {
    el.style.transition = 'transform 0.1s';
    el.style.transform = 'translateX(-5px)';
    setTimeout(function () { el.style.transform = 'translateX(5px)'; }, 100);
    setTimeout(function () { el.style.transform = 'translateX(-3px)'; }, 200);
    setTimeout(function () { el.style.transform = 'translateX(0)'; }, 300);
  }

  /* ── Intersection Observer for deeper reveal support (if available) ── */
  if ('IntersectionObserver' in window) {
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(function (el) {
      observer.observe(el);
    });
  }

})();
