// Main JS: small enhancements, no dependencies
(function () {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Mobile nav toggle
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.site-nav');
  if (toggle && nav) {
    toggle.addEventListener('click', () => {
      const collapsed = nav.getAttribute('data-collapsed') === 'true';
      nav.setAttribute('data-collapsed', (!collapsed).toString());
      toggle.setAttribute('aria-expanded', (!collapsed).toString());
    });
  }

  // Password visibility
  const togglePass = document.getElementById('togglePass');
  const passInput = document.getElementById('password');
  if (togglePass && passInput) {
    togglePass.addEventListener('click', () => {
      const isPw = passInput.getAttribute('type') === 'password';
      passInput.setAttribute('type', isPw ? 'text' : 'password');
      togglePass.innerHTML = isPw ? '<i class="ri-eye-off-line"></i>' : '<i class="ri-eye-line"></i>';
    });
  }

  // Fake submit handlers (prevent page reload)
  function fakeSubmit(formId) {
    const form = document.getElementById(formId);
    if (!form) return;
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const btn = form.querySelector('button[type="submit"]');
      const original = btn?.innerHTML || '';
      if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="ri-check-line"></i> Terkirim';
      }
      setTimeout(() => {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = original;
        }
        form.reset();
        alert('Ini hanya tampilan UI. Tidak ada data yang dikirim.');
      }, 900);
    });
  }

  fakeSubmit('subscribe-form');
  fakeSubmit('contact-form');
  fakeSubmit('login-form');

  // Page transition: fade-out before navigation
  const supportsReduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!supportsReduce) {
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (!a) return;
      const url = a.getAttribute('href');
      const target = a.getAttribute('target');
      if (!url || url.startsWith('#') || url.startsWith('mailto:') || target === '_blank') return;
      const isSameOrigin = a.origin === window.location.origin;
      if (!isSameOrigin) return;
      // Only intercept same-origin navigations
      e.preventDefault();
      document.body.classList.add('page-exiting');
      setTimeout(() => { window.location.href = url; }, 180);
    });
  }

  // Fancy animated background dots
  const canvas = document.getElementById('bg');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    const DPR = Math.min(2, window.devicePixelRatio || 1);
    let w, h; const dots = []; const DOTS = 48;

    function resize() {
      w = canvas.clientWidth; h = canvas.clientHeight;
      canvas.width = Math.floor(w * DPR); canvas.height = Math.floor(h * DPR);
    }
    window.addEventListener('resize', resize, { passive: true });
    resize();

    for (let i = 0; i < DOTS; i++) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 2 + Math.random() * 3,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
      });
    }

    function step() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      ctx.globalAlpha = 0.6;
      ctx.fillStyle = '#7c3aed';
      for (const d of dots) {
        d.x += d.vx; d.y += d.vy;
        if (d.x < 0 || d.x > canvas.width) d.vx *= -1;
        if (d.y < 0 || d.y > canvas.height) d.vy *= -1;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r * DPR, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // connect nearby dots
      ctx.strokeStyle = 'rgba(99,102,241,.25)';
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist2 = dx*dx + dy*dy;
          if (dist2 < (160 * DPR) ** 2) {
            ctx.globalAlpha = 0.25;
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }
})();
