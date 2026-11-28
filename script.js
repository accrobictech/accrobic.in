/* ==========================================
   ACCROBICTECH | INTERACTIVE SCRIPT
   Theme toggle, typing animation, scroll reveal,
   parallax & micro-interactions
   ========================================== */

(function () {
  const prefersReducedMotion =
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  // 4. Hero Typing Animation
  // ------------------------------------------
  const typedTarget = document.getElementById('hero-typed');
  if (typedTarget && !prefersReducedMotion) {
    const phrases = [
      'impossible to ignore.',
      'built to stand out.',
      'ready to scale.',
      'unforgettable online.',
    ];
    let phraseIndex = 0;
    let charIndex = phrases[0].length;
    let isDeleting = true;

    function tickTyping() {
      const currentPhrase = phrases[phraseIndex];

      if (isDeleting) {
        charIndex = Math.max(0, charIndex - 1);
        typedTarget.textContent = currentPhrase.slice(0, charIndex);

        if (charIndex === 0) {
          isDeleting = false;
          phraseIndex = (phraseIndex + 1) % phrases.length;
          setTimeout(tickTyping, 320);
          return;
        }
        setTimeout(tickTyping, 38);
      } else {
        charIndex = Math.min(currentPhrase.length, charIndex + 1);
        typedTarget.textContent = currentPhrase.slice(0, charIndex);

        if (charIndex === currentPhrase.length) {
          isDeleting = true;
          setTimeout(tickTyping, 2200);
          return;
        }
        setTimeout(tickTyping, 72);
      }
    }

    setTimeout(tickTyping, 2000);
  }

  // ------------------------------------------
  // 5. Button Click Ripple Feedback
  // ------------------------------------------
  document.querySelectorAll('.btn, .nav-cta').forEach((button) => {
    button.addEventListener('click', (event) => {
      if (prefersReducedMotion) return;
      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const ripple = document.createElement('span');
      ripple.className = 'btn-ripple';
      ripple.style.width = `${size}px`;
      ripple.style.height = `${size}px`;
      ripple.style.left = `${event.clientX - rect.left - size / 2}px`;
      ripple.style.top = `${event.clientY - rect.top - size / 2}px`;
      button.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  // ------------------------------------------
  // 6. Hero Art Interactive 3D Tilt
  // ------------------------------------------
  const heroArt = document.querySelector('.hero-art');
  const cardFront = document.querySelector('.card-front');
  const cardBack = document.querySelector('.card-back');

  if (heroArt && cardFront && cardBack && !prefersReducedMotion) {
    heroArt.addEventListener('mousemove', (event) => {
      const rect = heroArt.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;

      cardFront.style.animationPlayState = 'paused';
      cardBack.style.animationPlayState = 'paused';
      cardFront.style.transform = `rotate(${-7 + x * 8}deg) translate(${-15 + x * 18}px, ${5 + y * 14}px)`;
      cardBack.style.transform = `rotate(${12 - x * 6}deg) translate(${70 - x * 16}px, ${-4 - y * 12}px)`;
    });

    heroArt.addEventListener('mouseleave', () => {
      cardFront.style.transform = '';
      cardBack.style.transform = '';
      cardFront.style.animationPlayState = 'running';
      cardBack.style.animationPlayState = 'running';
    });
  }

  // ------------------------------------------
  // 7. Scroll Reveal (IntersectionObserver)
  // ------------------------------------------
  const revealElements = document.querySelectorAll('[data-reveal]');
  if (revealElements.length) {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
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
          threshold: 0.12,
          rootMargin: '0px 0px -40px 0px',
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
