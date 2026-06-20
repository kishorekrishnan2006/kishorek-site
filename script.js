/* ============================================================
   KISHORE K – PORTFOLIO SCRIPT
   Features: Loader, Particles, Cursor, Typed, Scroll Reveal,
             Skill Bars, Counters, Navbar, Form, Back-to-Top
   ============================================================ */

/* ── 1. LOADING SCREEN ──────────────────────────────────────── */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
    // Kick off hero reveals
    document.querySelectorAll('.hero .reveal').forEach((el, i) => {
      setTimeout(() => el.classList.add('visible'), 200 + i * 120);
    });
  }, 1600);
});

/* ── 2. PARTICLE CANVAS ─────────────────────────────────────── */
(function initParticles() {
  const canvas = document.getElementById('particleCanvas');
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];
  const PARTICLE_COUNT = 80;
  const COLORS = ['rgba(0,212,255,', 'rgba(37,99,235,', 'rgba(124,58,237,'];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  class Particle {
    constructor() { this.reset(); }
    reset() {
      this.x  = Math.random() * W;
      this.y  = Math.random() * H;
      this.vx = (Math.random() - 0.5) * 0.4;
      this.vy = (Math.random() - 0.5) * 0.4;
      this.r  = Math.random() * 1.8 + 0.4;
      this.alpha = Math.random() * 0.5 + 0.1;
      this.color = COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > W) this.vx *= -1;
      if (this.y < 0 || this.y > H) this.vy *= -1;
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = this.color + this.alpha + ')';
      ctx.fill();
    }
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0,212,255,${(1 - dist / 120) * 0.08})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }

  resize();
  window.addEventListener('resize', resize);
  for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());
  animate();
})();

/* ── 3. CUSTOM CURSOR ───────────────────────────────────────── */
(function initCursor() {
  const dot     = document.getElementById('cursorDot');
  const outline = document.getElementById('cursorOutline');
  if (!dot || !outline) return;

  let ox = 0, oy = 0;
  let tx = 0, ty = 0;

  document.addEventListener('mousemove', e => {
    tx = e.clientX; ty = e.clientY;
    dot.style.left = tx + 'px';
    dot.style.top  = ty + 'px';
  });

  function animateOutline() {
    ox += (tx - ox) * 0.12;
    oy += (ty - oy) * 0.12;
    outline.style.left = ox + 'px';
    outline.style.top  = oy + 'px';
    requestAnimationFrame(animateOutline);
  }
  animateOutline();

  // Hover effect on interactive elements
  const hoverables = document.querySelectorAll('a, button, input, textarea, .project-card, .skill-item, .cert-card');
  hoverables.forEach(el => {
    el.addEventListener('mouseenter', () => outline.classList.add('hovered'));
    el.addEventListener('mouseleave', () => outline.classList.remove('hovered'));
  });
})();

/* ── 4. TYPED TEXT EFFECT ───────────────────────────────────── */
(function initTyped() {
  const el     = document.getElementById('typedText');
  const words  = ['Web Developer', 'Software Developer', 'IT Student', 'Linux Enthusiast', 'Problem Solver'];
  let wIdx = 0, cIdx = 0, deleting = false;

  function type() {
    const word = words[wIdx];

    if (deleting) {
      el.textContent = word.substring(0, cIdx--);
      if (cIdx < 0) {
        deleting = false;
        wIdx = (wIdx + 1) % words.length;
        setTimeout(type, 500);
        return;
      }
      setTimeout(type, 60);
    } else {
      el.textContent = word.substring(0, cIdx++);
      if (cIdx > word.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
      setTimeout(type, 90);
    }
  }
  setTimeout(type, 1200);
})();

/* ── 5. STICKY NAVBAR + ACTIVE LINKS ───────────────────────── */
(function initNavbar() {
  const navbar   = document.getElementById('navbar');
  const links    = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  function onScroll() {
    // Sticky glass effect
    navbar.classList.toggle('scrolled', window.scrollY > 60);

    // Active link highlighting
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    links.forEach(l => {
      l.classList.toggle('active', l.getAttribute('href') === '#' + current);
    });

    // Back-to-top
    const btn = document.getElementById('backToTop');
    btn.classList.toggle('visible', window.scrollY > 400);
  }

  window.addEventListener('scroll', onScroll, { passive: true });

  // Hamburger menu
  const hamburger = document.getElementById('hamburger');
  const navLinks  = document.getElementById('navLinks');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    navLinks.classList.toggle('open');
  });

  // Close mobile menu on link click
  links.forEach(l => {
    l.addEventListener('click', () => {
      hamburger.classList.remove('open');
      navLinks.classList.remove('open');
    });
  });
})();

/* ── 6. BACK TO TOP ─────────────────────────────────────────── */
document.getElementById('backToTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ── 7. SCROLL REVEAL ───────────────────────────────────────── */
(function initReveal() {
  const revealEls = document.querySelectorAll('.reveal');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        // Don't unobserve — keeps state clean for re-scrolling
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => io.observe(el));
})();

/* ── 8. SKILL BAR ANIMATION ─────────────────────────────────── */
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill  = entry.target;
        const width = fill.getAttribute('data-width');
        // Small delay so the card reveal finishes first
        setTimeout(() => { fill.style.width = width + '%'; }, 200);
        io.unobserve(fill);
      }
    });
  }, { threshold: 0.5 });

  fills.forEach(f => io.observe(f));
})();

/* ── 9. COUNTER ANIMATION ───────────────────────────────────── */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number');

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = +el.getAttribute('data-target');
      const start  = performance.now();
      const dur    = 1600;

      function tick(now) {
        const progress = Math.min((now - start) / dur, 1);
        // Ease-out
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(ease * target);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.6 });

  counters.forEach(c => io.observe(c));
})();

/* ── 10. PARALLAX ───────────────────────────────────────────── */
(function initParallax() {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    hero.style.backgroundPositionY = y * 0.3 + 'px';
    const frame = hero.querySelector('.image-frame');
    if (frame) frame.style.transform = `translateY(${y * 0.08}px)`;
  }, { passive: true });
})();

/* ── 11. CONTACT FORM ───────────────────────────────────────── */
(function initForm() {
  const form   = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    // Basic validation
    if (!name || !email || !subject || !message) {
      showStatus('Please fill in all fields.', 'error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showStatus('Please enter a valid email address.', 'error');
      return;
    }

    // Send to Web3Forms
    const btn = form.querySelector('button[type="submit"]');
    btn.disabled = true;
    btn.innerHTML = '<i class="bx bx-loader-alt bx-spin"></i> Sending...';

    fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        access_key: '1a2671ba-fa2a-4b49-a717-7f5dc89921d4',
        name: name,
        email: email,
        subject: subject,
        message: message
      
      })
    })
    .then(async (response) => {
      let json = await response.json();
      if (response.status == 200) {
        showStatus('✅ Message sent! I\'ll get back to you soon.', 'success');
        form.reset();
      } else {
        console.log(response);
        showStatus('❌ Error: ' + (json.message || 'Failed to send message.'), 'error');
      }
    })
    .catch(error => {
      console.log(error);
      showStatus('❌ Something went wrong! Please try again.', 'error');
    })
    .finally(() => {
      btn.disabled = false;
      btn.innerHTML = '<i class="bx bx-send"></i> Send Message';
    });
  });

  function showStatus(msg, type) {
    status.textContent  = msg;
    status.className    = 'form-status ' + type;
    setTimeout(() => { status.textContent = ''; status.className = 'form-status'; }, 5000);
  }
})();

/* ── 12. SMOOTH SCROLL FOR ALL ANCHOR LINKS ─────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ── 13. CURSOR HOVER TRACKING (dynamic re-query for cards) ─── */
// Re-attach cursor hover to dynamically relevant elements
document.addEventListener('DOMContentLoaded', () => {
  const outline  = document.getElementById('cursorOutline');
  if (!outline) return;

  document.querySelectorAll('.achievement-card, .about-card, .timeline-content, .contact-link').forEach(el => {
    el.addEventListener('mouseenter', () => outline.classList.add('hovered'));
    el.addEventListener('mouseleave', () => outline.classList.remove('hovered'));
  });
});
