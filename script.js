// =====================================================
//   DANIEL DEV — PORTFOLIO
//   script.js
// =====================================================

// ── CURSOR PERSONALIZADO ──────────────────────────
const cursor = document.getElementById('cursor');
const ring   = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX;
  my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top  = my + 'px';
});

(function animRing() {
  rx += (mx - rx) * .12;
  ry += (my - ry) * .12;
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animRing);
})();

document.querySelectorAll('a, button, .skill-card, .tag').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.width  = '20px';
    cursor.style.height = '20px';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.width  = '12px';
    cursor.style.height = '12px';
  });
});


// ── SMOOTH SCROLL DA NAV ─────────────────────────
document.querySelectorAll('.nav-anchor').forEach(link => {
  link.addEventListener('click', e => {
    const href = link.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        const navH = document.querySelector('nav').offsetHeight;
        window.scrollTo({
          top: target.getBoundingClientRect().top + window.scrollY - navH - 16,
          behavior: 'smooth'
        });
      }
    }
  });
});


// ── PARTICULAS NO FUNDO ───────────────────────────
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

const pts = Array.from({ length: 55 }, () => ({
  x:  Math.random() * canvas.width,
  y:  Math.random() * canvas.height,
  vx: (Math.random() - .5) * .3,
  vy: (Math.random() - .5) * .3,
  r:  Math.random() * 1.5 + .5,
  a:  Math.random()
}));

(function drawParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  pts.forEach(p => {
    p.x += p.vx; p.y += p.vy;
    if (p.x < 0) p.x = canvas.width;
    if (p.x > canvas.width)  p.x = 0;
    if (p.y < 0) p.y = canvas.height;
    if (p.y > canvas.height) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(124,58,237,${p.a * .4})`;
    ctx.fill();
  });
  for (let i = 0; i < pts.length; i++) {
    for (let j = i + 1; j < pts.length; j++) {
      const dx = pts[i].x - pts[j].x;
      const dy = pts[i].y - pts[j].y;
      const d  = Math.sqrt(dx * dx + dy * dy);
      if (d < 120) {
        ctx.beginPath();
        ctx.moveTo(pts[i].x, pts[i].y);
        ctx.lineTo(pts[j].x, pts[j].y);
        ctx.strokeStyle = `rgba(124,58,237,${.15 * (1 - d / 120)})`;
        ctx.lineWidth = .5;
        ctx.stroke();
      }
    }
  }
  requestAnimationFrame(drawParticles);
})();


// ── REVEAL AO SCROLLAR ───────────────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) e.target.classList.add('visible');
  });
}, { threshold: .15 });

document.querySelectorAll('.reveal').forEach(r => revealObserver.observe(r));

setTimeout(() => {
  document.querySelectorAll('#hero .reveal').forEach(el => el.classList.add('visible'));
}, 100);


// ── SKILL BARS ANIMADAS ──────────────────────────
const skillObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const fill = e.target.querySelector('.skill-fill');
      const pct  = e.target.dataset.fill;
      if (fill && pct) fill.style.width = pct + '%';
    }
  });
}, { threshold: .5 });

document.querySelectorAll('.skill-card').forEach(c => skillObserver.observe(c));


// ── EFEITO 3D NO CARD DO ABOUT ───────────────────
const card3d = document.getElementById('card3d');
if (card3d) {
  card3d.addEventListener('mousemove', e => {
    const r = card3d.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width  - .5;
    const y = (e.clientY - r.top)  / r.height - .5;
    card3d.style.transform = `perspective(800px) rotateY(${x * 18}deg) rotateX(${-y * 18}deg) scale(1.03)`;
  });
  card3d.addEventListener('mouseleave', () => {
    card3d.style.transform = '';
  });
}


// ── GLOW NOS SKILL CARDS ─────────────────────────
document.querySelectorAll('.skill-card').forEach(c => {
  c.addEventListener('mousemove', e => {
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', ((e.clientX - r.left) / r.width  * 100) + '%');
    c.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100) + '%');
  });
});


// ── FORMULARIO WEB3FORMS ─────────────────────────
const form   = document.getElementById('contact-form');
const btn    = document.getElementById('form-btn');
const status = document.getElementById('form-status');

if (form) {
  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // Feedback: desativa botao enquanto envia
    btn.disabled = true;
    btn.textContent = 'Enviando...';
    status.textContent = '';
    status.className = '';

    const data = new FormData(form);

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: data
      });

      const json = await res.json();

      if (json.success) {
        // SUCESSO
        btn.textContent = 'Mensagem enviada!';
        btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
        status.textContent = 'Obrigado! Vou te responder em breve.';
        status.style.cssText = 'margin-top:.8rem;font-size:.75rem;color:#22c55e;letter-spacing:1px;text-align:center;';
        form.reset();
      } else {
        throw new Error('Falha no envio');
      }

    } catch (err) {
      // ERRO
      btn.disabled = false;
      btn.textContent = 'Tente novamente';
      btn.style.background = '';
      status.textContent = 'Algo deu errado. Tenta pelo WhatsApp!';
      status.style.cssText = 'margin-top:.8rem;font-size:.75rem;color:#ff3ea5;letter-spacing:1px;text-align:center;';
    }
  });
}