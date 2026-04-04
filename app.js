'use strict';

    /* ── Navbar scroll shadow ───────────────────────────────────────────── */
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });

    /* ── Active nav link on scroll ──────────────────────────────────────── */
    const sections   = document.querySelectorAll('section[id]');
    const navAnchors = document.querySelectorAll('.nav-links a');

    new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        navAnchors.forEach(a =>
          a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id)
        );
      });
    }, { rootMargin: '-40% 0px -55% 0px' }).observe
      && sections.forEach(s =>
        new IntersectionObserver(entries => {
          entries.forEach(e => {
            if (!e.isIntersecting) return;
            navAnchors.forEach(a =>
              a.classList.toggle('active', a.getAttribute('href') === '#' + e.target.id)
            );
          });
        }, { rootMargin: '-40% 0px -55% 0px' }).observe(s)
      );

    /* ── Hamburger / mobile drawer ──────────────────────────────────────── */
    const hamburger  = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobile-menu');

    hamburger.addEventListener('click', () => {
      const open = mobileMenu.classList.toggle('open');
      hamburger.classList.toggle('open', open);
      hamburger.setAttribute('aria-expanded', String(open));
    });
    document.querySelectorAll('.mob-link').forEach(link =>
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      })
    );

    /* ── Scroll reveal ──────────────────────────────────────────────────── */
    const revealIO = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const siblings = [...entry.target.parentElement.querySelectorAll('[data-reveal]')];
        const idx      = siblings.indexOf(entry.target);
        entry.target.style.transitionDelay = (idx * 85) + 'ms';
        entry.target.classList.add('visible');
        revealIO.unobserve(entry.target);
      });
    }, { threshold: 0.1 });
    document.querySelectorAll('[data-reveal]').forEach(el => revealIO.observe(el));

    /* ── Animated counters ──────────────────────────────────────────────── */
    function animateCount(el, target, duration) {
      const start = performance.now();
      (function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        const e = 1 - Math.pow(1 - p, 3);          // ease-out cubic
        el.textContent = Math.floor(e * target);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      })(start);
    }

    const counterIO = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        animateCount(e.target, parseInt(e.target.dataset.count, 10), 1400);
        counterIO.unobserve(e.target);
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('[data-count]').forEach(el => counterIO.observe(el));

    /* ── Back to top ────────────────────────────────────────────────────── */
    const backTop = document.getElementById('back-top');
    window.addEventListener('scroll', () =>
      backTop.classList.toggle('visible', window.scrollY > 400),
      { passive: true }
    );
    backTop.addEventListener('click', () =>
      window.scrollTo({ top: 0, behavior: 'smooth' })
    );

    /* ── Contact form ───────────────────────────────────────────────────── */
    const contactForm = document.getElementById('contact-form');
    const formMsg     = document.getElementById('form-msg');

    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      formMsg.className = 'form-msg';
      formMsg.textContent = '';

      const name  = document.getElementById('cf-name').value.trim();
      const email = document.getElementById('cf-email').value.trim();
      const msg   = document.getElementById('cf-msg').value.trim();

      if (!name || !email || !msg) {
        formMsg.className = 'form-msg error';
        formMsg.textContent = 'Please fill in all fields.';
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        formMsg.className = 'form-msg error';
        formMsg.textContent = 'Please enter a valid email address.';
        return;
      }

      // Mailto fallback — no backend required
      const subject = encodeURIComponent('Portfolio contact from ' + name);
      const body    = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + msg);
      window.location.href = 'mailto:ebube@ebubethedev.online?subject=' + subject + '&body=' + body;

      formMsg.className = 'form-msg success';
      formMsg.textContent = 'Opening your mail client… Thanks for reaching out!';
      contactForm.reset();
    });

    async function getRepoCount() {
        const username = 'thisisebube';
        try {
          const response = await fetch(`https://api.github.com/users/${username}`);
          if (!response.ok) throw new Error('Network response was not ok');
          const data  = await response.json();
          const count = data.public_repos;
          const el    = document.getElementById('github-repo-count');
          animateCount(el, count, 1200);
        } catch (error) {
          console.error('Error fetching GitHub data:', error);
          document.getElementById('github-repo-count').innerText = '—';
        }
      }
      getRepoCount();
