// =====================================================
//   DANIEL DEV — PORTFOLIO
// =====================================================

// ── DARK/LIGHT MODE ──────────────────────────────
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Recuperar tema do localStorage ou preferência do sistema
function initTheme() {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const theme = savedTheme || (prefersDark ? 'dark' : 'light');
  
  html.setAttribute('data-theme', theme);
  updateThemeIcon(theme);
}

function updateThemeIcon(theme) {
  themeToggle.querySelector('.theme-icon').textContent = theme === 'dark' ? '☀️' : '🌙';
}

themeToggle.addEventListener('click', () => {
  const currentTheme = html.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  html.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  updateThemeIcon(newTheme);
});

// Iniciar tema na página
initTheme();


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

document.querySelectorAll('a, button, .skill-card, .tag, .cert-card').forEach(el => {
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


// ── PARTICULAS NO FUNDO (OTIMIZADO PARA MOBILE) ───
const canvas = document.getElementById('bg-canvas');
const ctx    = canvas.getContext('2d');

function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener('resize', resize);

// Detectar mobile e reduzir quantidade de partículas
const isMobile = window.innerWidth < 768;
const particleCount = isMobile ? 20 : 55;

const pts = Array.from({ length: particleCount }, () => ({
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


// ── GLOW NOS SKILL CARDS & CERT CARDS ────────────
document.querySelectorAll('.skill-card, .cert-card').forEach(c => {
  c.addEventListener('mousemove', e => {
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', ((e.clientX - r.left) / r.width  * 100) + '%');
    c.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100) + '%');
  });
});




// ── FILTROS DE PROJETOS ───────────────────────────
const filterBtns = document.querySelectorAll('.filter-btn');
const projectCards = document.querySelectorAll('.project-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // Atualizar botão ativo
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const filter = btn.dataset.filter;

    projectCards.forEach(card => {
      const categories = card.dataset.categories.split(' ');
      const match = filter === 'all' || categories.includes(filter);

      if (match) {
        card.classList.remove('hidden');
        // Re-trigger reveal animation
        card.classList.remove('visible');
        setTimeout(() => card.classList.add('visible'), 30);
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// Garantir glow nos project cards também
document.querySelectorAll('.project-card').forEach(c => {
  c.addEventListener('mousemove', e => {
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', ((e.clientX - r.left) / r.width  * 100) + '%');
    c.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100) + '%');
  });
});

const form   = document.getElementById('contact-form');
const btn    = document.getElementById('form-btn');
const status = document.getElementById('form-status');

// Elementos do formulário
const nomeInput = document.getElementById('nome');
const emailInput = document.getElementById('email');
const msgInput = document.getElementById('mensagem');

const erroNome = document.getElementById('erro-nome');
const erroEmail = document.getElementById('erro-email');
const erroMsg = document.getElementById('erro-msg');

// Funções de validação
function validarNome(value) {
  return value.trim().length >= 3;
}

function validarEmail(value) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(value);
}

function validarMensagem(value) {
  return value.trim().length >= 10;
}

// Mostrar erro no campo
function mostrarErro(input, errorEl, mensagem) {
  input.classList.add('error');
  errorEl.textContent = mensagem;
}

// Limpar erro do campo
function limparErro(input, errorEl) {
  input.classList.remove('error');
  errorEl.textContent = '';
}

// Validação em tempo real
nomeInput.addEventListener('blur', () => {
  if (!validarNome(nomeInput.value)) {
    mostrarErro(nomeInput, erroNome, 'Nome deve ter no mínimo 3 caracteres');
  } else {
    limparErro(nomeInput, erroNome);
  }
});

emailInput.addEventListener('blur', () => {
  if (!validarEmail(emailInput.value)) {
    mostrarErro(emailInput, erroEmail, 'Email inválido');
  } else {
    limparErro(emailInput, erroEmail);
  }
});

msgInput.addEventListener('blur', () => {
  if (!validarMensagem(msgInput.value)) {
    mostrarErro(msgInput, erroMsg, 'Mensagem deve ter no mínimo 10 caracteres');
  } else {
    limparErro(msgInput, erroMsg);
  }
});

// Limpar erro ao digitar
nomeInput.addEventListener('input', () => {
  if (nomeInput.classList.contains('error')) {
    limparErro(nomeInput, erroNome);
  }
});

emailInput.addEventListener('input', () => {
  if (emailInput.classList.contains('error')) {
    limparErro(emailInput, erroEmail);
  }
});

msgInput.addEventListener('input', () => {
  if (msgInput.classList.contains('error')) {
    limparErro(msgInput, erroMsg);
  }
});

// Envio do formulário
if (form) {
  let lastSubmit = 0; // ── RATE LIMIT ──

  form.addEventListener('submit', async function(e) {
    e.preventDefault();

    // ── RATE LIMIT: bloqueia reenvios em menos de 15 segundos ──
    const now = Date.now();
    if (now - lastSubmit < 15000) {
      const restante = Math.ceil((15000 - (now - lastSubmit)) / 1000);
      status.textContent = `Aguarde ${restante}s antes de enviar novamente.`;
      status.style.cssText = 'margin-top:.8rem;font-size:.75rem;color:#facc15;letter-spacing:1px;text-align:center;';
      return;
    }

    // Validar todos os campos
    let temErros = false;

    if (!validarNome(nomeInput.value)) {
      mostrarErro(nomeInput, erroNome, 'Nome deve ter no mínimo 3 caracteres');
      temErros = true;
    } else {
      limparErro(nomeInput, erroNome);
    }

    if (!validarEmail(emailInput.value)) {
      mostrarErro(emailInput, erroEmail, 'Email inválido');
      temErros = true;
    } else {
      limparErro(emailInput, erroEmail);
    }

    if (!validarMensagem(msgInput.value)) {
      mostrarErro(msgInput, erroMsg, 'Mensagem deve ter no mínimo 10 caracteres');
      temErros = true;
    } else {
      limparErro(msgInput, erroMsg);
    }

    // Se houver erros, não enviar
    if (temErros) return;

    // Feedback: desativa botao enquanto envia
    btn.disabled = true;
    btn.classList.add('loading');
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
        lastSubmit = Date.now(); // ── RATE LIMIT: registra timestamp do envio ──
        // SUCESSO
        btn.disabled = false;
        btn.classList.remove('loading');
        btn.textContent = 'Mensagem enviada! ✓';
        btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
        status.textContent = 'Obrigado! Vou te responder em breve.';
        status.style.cssText = 'margin-top:.8rem;font-size:.75rem;color:#22c55e;letter-spacing:1px;text-align:center;';
        form.reset();

        // Reabilitar botão após 3 segundos
        setTimeout(() => {
          btn.textContent = 'Enviar mensagem →';
          btn.style.background = '';
        }, 3000);
      } else {
        throw new Error('Falha no envio');
      }

    } catch (err) {
      // ERRO
      btn.disabled = false;
      btn.classList.remove('loading');
      btn.textContent = 'Tente novamente';
      btn.style.background = '';
      status.textContent = 'Algo deu errado. Tenta pelo WhatsApp!';
      status.style.cssText = 'margin-top:.8rem;font-size:.75rem;color:#ff3ea5;letter-spacing:1px;text-align:center;';
      console.error('Erro ao enviar:', err);
    }
  });
}