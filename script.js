/* ==========================================================================
   Ekström Snickeri — One-Pager Script
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Mobile nav toggle ---------- */
  const navToggle = document.getElementById('navToggle');
  const navLinks  = document.getElementById('navLinks');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('active');
      navLinks.classList.toggle('active');
    });

    // Close nav on link click
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
      });
    });
  }

  /* ---------- Sticky nav scroll ---------- */
  const header = document.getElementById('siteHeader');

  function handleHeaderScroll() {
    if (window.scrollY > 80) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }

  window.addEventListener('scroll', handleHeaderScroll, { passive: true });
  handleHeaderScroll();

  /* ---------- IntersectionObserver scroll reveal ---------- */
  const revealElements = document.querySelectorAll('.reveal-up');

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger delay based on sibling position
          const siblings = entry.target.parentElement.querySelectorAll('.reveal-up');
          let siblingIndex = 0;
          siblings.forEach((s, i) => { if (s === entry.target) siblingIndex = i; });

          setTimeout(() => {
            entry.target.classList.add('revealed');
          }, siblingIndex * 80);

          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -60px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show everything
    revealElements.forEach(el => el.classList.add('revealed'));
  }

  /* ---------- Horizontal scroll section ---------- */
  const scrollWrapper = document.querySelector('.horizontal-scroll-wrapper');
  const scrollContent = document.querySelector('.horizontal-scroll-content');

  function isDesktop() {
    return window.innerWidth >= 768;
  }

  function handleHorizontalScroll() {
    if (!scrollWrapper || !scrollContent || !isDesktop()) return;

    const wrapperRect   = scrollWrapper.getBoundingClientRect();
    const wrapperTop    = wrapperRect.top + window.scrollY;
    const wrapperHeight = scrollWrapper.offsetHeight;
    const viewportH     = window.innerHeight;

    // How far the user has scrolled into the wrapper
    const scrolled = window.scrollY - wrapperTop;
    // Total scrollable distance (wrapper height minus one viewport for the sticky)
    const scrollable = wrapperHeight - viewportH;

    if (scrollable <= 0) return;

    // Progress 0 → 1
    const progress = Math.min(Math.max(scrolled / scrollable, 0), 1);

    // How far to translate: content width minus viewport width
    const contentWidth = scrollContent.scrollWidth;
    const trackWidth   = scrollContent.parentElement.offsetWidth;
    const maxTranslate = contentWidth - trackWidth;

    scrollContent.style.transform = `translateX(-${progress * maxTranslate}px)`;
  }

  window.addEventListener('scroll', handleHorizontalScroll, { passive: true });
  window.addEventListener('resize', handleHorizontalScroll, { passive: true });
  handleHorizontalScroll();

  /* ---------- Contact form ---------- */
  const form = document.getElementById('contactForm');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const btn = form.querySelector('.btn-submit');
      const originalText = btn.textContent;

      btn.textContent = 'Tack för din förfrågan!';
      btn.style.background = 'var(--color-accent)';
      btn.disabled = true;

      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.disabled = false;
        form.reset();
      }, 3000);
    });
  }

  /* ---------- Smooth scroll for anchor links ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;

      const target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        const headerHeight = header.offsetHeight;
        const targetPos = target.getBoundingClientRect().top + window.scrollY - headerHeight;

        window.scrollTo({
          top: targetPos,
          behavior: 'smooth'
        });
      }
    });
  });

});
