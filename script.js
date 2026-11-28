/* ==========================================
   ACCROBICTECH | INTERACTIVE SCRIPT
   Theme toggle, typing animation, scroll reveal,
   parallax & micro-interactions
   ========================================== */

(function () {
  // ------------------------------------------
  // 1. Mobile Navigation Menu
  // ------------------------------------------
  const menuButton = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuButton && navLinks) {
    menuButton.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(isOpen));
    });

    document.querySelectorAll('.nav-links a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        menuButton.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ------------------------------------------
  // 2. Footer Year
  // ------------------------------------------
  const yearEl = document.getElementById('year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  // ------------------------------------------
  // 3. Dark / Light Theme Toggle
  // ------------------------------------------
  const themeToggle = document.getElementById('theme-toggle');
  const root = document.documentElement;

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (themeToggle) {
      const nextLabel =
        theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode';
      themeToggle.setAttribute('aria-label', nextLabel);
    }
  }

  const initialTheme = root.getAttribute('data-theme') || 'dark';
  applyTheme(initialTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      try {
        localStorage.setItem('accrobic-theme', next);
      } catch (e) {}
    });
  }

  // ------------------------------------------
  // 4. Button Click Ripple Feedback (0.3s)
  // ------------------------------------------
  document.querySelectorAll('.btn, .nav-cta').forEach((button) => {
    button.addEventListener('click', (event) => {
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement('span');
      ripple.className = 'btn-ripple';
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
      button.appendChild(ripple);
      setTimeout(() => ripple.remove(), 320);
    });
  });

  // ------------------------------------------
  // 5. Scroll Reveal (IntersectionObserver)
  // ------------------------------------------
  const revealElements = document.querySelectorAll('[data-reveal]');
  if (revealElements.length) {
    if (!('IntersectionObserver' in window)) {
      revealElements.forEach((el) => el.classList.add('revealed'));
    } else {
      const revealObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('revealed');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -30px 0px',
        }
      );

      revealElements.forEach((el) => revealObserver.observe(el));
    }
  }

  // ------------------------------------------
  // 8. Scroll Progress Bar, Header & Active Nav
  // ------------------------------------------
  const scrollProgress = document.querySelector('.scroll-progress');
  const siteHeader = document.querySelector('.site-header');
  const sections = document.querySelectorAll('main section[id]');
  const anchorNavLinks = document.querySelectorAll('.nav-links a[href^="#"]');
  let ticking = false;

  function onScroll() {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight =
      document.documentElement.scrollHeight - window.innerHeight;

    if (scrollProgress && docHeight > 0) {
      const pct = Math.min(100, Math.max(0, (scrollTop / docHeight) * 100));
      scrollProgress.style.width = `${pct}%`;
    }

    if (siteHeader) {
      siteHeader.classList.toggle('scrolled', scrollTop > 24);
    }

    if (sections.length && anchorNavLinks.length) {
      let currentId = '';
      sections.forEach((section) => {
        const top = section.offsetTop - 160;
        if (scrollTop >= top) {
          currentId = section.getAttribute('id') || '';
        }
      });

      anchorNavLinks.forEach((link) => {
        const target = link.getAttribute('href').slice(1);
        link.classList.toggle('active', target === currentId);
      });
    }

    ticking = false;
  }

  window.addEventListener(
    'scroll',
    () => {
      if (!ticking) {
        window.requestAnimationFrame(onScroll);
        ticking = true;
      }
    },
    { passive: true }
  );

  onScroll();
})();
