// ============================
// Year in Footer
// ============================
document.getElementById('year').textContent = new Date().getFullYear();

// Force scroll to top after page reload
window.onload = () => {
  window.scrollTo(0, 0);
};

// ============================
// Mobile nav (simple show/hide)
// ============================
const toggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.main-nav');
if (toggle) {
  toggle.addEventListener('click', () => {
    nav.style.display = nav.style.display === 'flex' ? 'none' : 'flex';
  });
}

// ============================
// Smooth scroll for internal links
// ============================
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ============================
// Stat count‑up Helper Function
// ============================
function animateStat(el) {
  const target = parseInt(el.getAttribute('data-target'), 10);
  if (isNaN(target)) return;
  let count = 0;
  const delay = 400;
  const update = () => {
    if (count < target) {
      count++;
      el.textContent = count;
      setTimeout(update, delay);
    } else {
      el.textContent = target + "+";
    }
  };
  update();
}

// ============================
// ON-LOAD ANIMATIONS (Triggered after boot screen)
// ============================
function initOnLoadAnimations() {

  const grid = document.querySelector('.grid-overlay');
  if (grid) {
    const dropCount = 40;
    for (let i = 0; i < dropCount; i++) {
      const drop = document.createElement('div');
      if (Math.random() > 0.5) {
        drop.classList.add('drop', 'vertical');
        const col = Math.floor(Math.random() * (window.innerWidth / 40)) * 40;
        drop.style.left = `${col}px`;
        drop.style.animationDuration = (Math.random() * 3 + 2) + 's';
      } else {
        drop.classList.add('drop', 'horizontal');
        const row = Math.floor(Math.random() * (window.innerHeight / 40)) * 40;
        drop.style.top = `${row}px`;
        drop.style.animationDuration = (Math.random() * 3 + 2) + 's';
      }
      drop.style.animationDelay = (Math.random() * 3) + 's';
      grid.appendChild(drop);
    }
  }

  const io = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        const statEl = e.target.querySelector('.stat-num');
        if (statEl) animateStat(statEl);
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('.stat-card, .reveal, .tl-item').forEach(el => io.observe(el));

  if (window.gsap) {
    const tl = gsap.timeline();
    tl.from('.brand', { y:-20, opacity:0, duration:0.4, ease:'power2.out' })
      .from('.nav-link', { y:-10, opacity:0, stagger:0.05, duration:0.3 }, '<0.05')
      .from('.hero-badge', { y:10, opacity:0, duration:0.35 }, '-=0.1')
      .from('.hero-title', { y:14, opacity:0, duration:0.45, ease:'power2.out' }, '-=0.05')
      .from('.hero-sub', { y:10, opacity:0, duration:0.35 }, '-=0.2')
      .from('.hero-ctas .btn', { y:8, opacity:0, stagger:0.08, duration:0.3 }, '-=0.2')
      .from('.stat-card', { y:10, opacity:0, stagger:0.06, duration:0.3 }, '-=0.15');

    gsap.utils.toArray('.section').forEach((sec, i) => {
      if (i === 0) return;
      const head = sec.querySelector('.sec-head h2, .sec-head h1, h1.dynamic-fade');
      if (!head) return;
      gsap.from(head, {
        scrollTrigger: { trigger: sec, start: 'top 80%' },
        y: 14, opacity: 0, duration: 0.4
      });
    });
  }
}

// ============================
// Modals
// ============================
function openModal(id){
  const m = document.getElementById(id);
  if (!m) return;
  m.classList.add('show');
  m.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal(m){
  m.classList.remove('show');
  m.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('.card').forEach(card => {
  card.addEventListener('click', () => openModal(card.dataset.modal));
  card.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openModal(card.dataset.modal);
    }
  });
});

document.querySelectorAll('.modal').forEach(m => {
  m.addEventListener('click', e => { if (e.target === m) closeModal(m); });
  m.querySelector('.modal-close').addEventListener('click', () => closeModal(m));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && m.classList.contains('show')) closeModal(m);
  });
});

// ============================
// Subtle hover tilt for cards
// ============================
document.querySelectorAll('.card').forEach(card => {
  let rAF = null;
  function onMove(e){
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rx = (y - 0.5) * -6;
    const ry = (x - 0.5) * 10;
    if (rAF) cancelAnimationFrame(rAF);
    rAF = requestAnimationFrame(() => {
      card.style.transform = `translateY(-6px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    });
  }
  function reset(){
    card.style.transform = 'translateY(0)';
  }
  card.addEventListener('mousemove', onMove);
  card.addEventListener('mouseleave', reset);
});

// ============================
// Highlight active nav on scroll
// ============================
const sections = [...document.querySelectorAll('section[id]')];
const navLinks = [...document.querySelectorAll('.nav-link')];
window.addEventListener('scroll', () => {
  const pos = window.scrollY + 120;
  let current = sections[0].id;
  for (const s of sections) {
    if (pos >= s.offsetTop) current = s.id;
  }
  navLinks.forEach(l => {
    const active = l.getAttribute('href').slice(1) === current;
    l.style.opacity = active ? '1' : '0.7';
  });
});

// ============================
// Toggle Academics Section
// ============================
const academicsBtn = document.getElementById('toggle-academics');
if (academicsBtn) {
  academicsBtn.addEventListener('click', function () {
    const section = document.getElementById('academics-section');
    const btn = this;

    if (section.classList.contains('collapsed')) {
      section.classList.remove('collapsed');
      section.classList.add('expanded');
      btn.textContent = '❌ Hide Education';
      section.scrollIntoView({ behavior: 'smooth' });
    } else {
      section.classList.remove('expanded');
      section.classList.add('collapsed');
      btn.textContent = '🎓 View Education';
    }
  });
}

// ============================
// Contact Form Submission (Simple Popup)
// ============================
const contactForm = document.getElementById('contact-form');
const formBtn = document.getElementById('form-btn');
const successOverlay = document.getElementById('success-overlay');

if (contactForm) {
  contactForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const originalBtnText = formBtn.textContent;
    formBtn.textContent = 'Sending...';
    formBtn.disabled = true;

    const formData = new FormData(contactForm);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData
      });

      const data = await response.json();

      if (data.success) {
        successOverlay.classList.add('show');
        contactForm.reset();

        setTimeout(() => {
            successOverlay.classList.remove('show');
            formBtn.textContent = originalBtnText;
            formBtn.disabled = false;
        }, 3000);

      } else {
        alert("Something went wrong. Please try again.");
        formBtn.textContent = originalBtnText;
        formBtn.disabled = false;
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert("An error occurred. Please check your internet connection.");
      formBtn.textContent = originalBtnText;
      formBtn.disabled = false;
    }
  });
}
