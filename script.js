// Cursor Logic
const cur = document.getElementById('cur'), 
      curR = document.getElementById('curR');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
});

(function animateCursor() {
    cur.style.left = mx + 'px';
    cur.style.top = my + 'px';
    rx += (mx - rx) * 0.13;
    ry += (my - ry) * 0.13;
    curR.style.left = rx + 'px';
    curR.style.top = ry + 'px';
    requestAnimationFrame(animateCursor);
})();

document.querySelectorAll('a, button, .svc-card, .swot-card, .comp-item, .val-item').forEach(el => {
    el.addEventListener('mouseenter', () => {
        cur.style.width = '20px';
        cur.style.height = '20px';
        curR.style.width = '52px';
        curR.style.height = '52px';
    });
    el.addEventListener('mouseleave', () => {
        cur.style.width = '12px';
        cur.style.height = '12px';
        curR.style.width = '38px';
        curR.style.height = '38px';
    });
});

// Progress bar + nav scroll
window.addEventListener('scroll', () => {
    const pb = document.getElementById('pb');
    const nav = document.getElementById('nav');
    pb.style.width = (window.scrollY / (document.body.scrollHeight - window.innerHeight) * 100) + '%';
    nav.classList.toggle('scrolled', window.scrollY > 80);
});

// Reveal Animation
const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('visible');
    });
}, { threshold: 0.1 });

document.querySelectorAll('.reveal').forEach(r => observer.observe(r));

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const target = document.querySelector(a.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth' });
    });
});

// Slideshow
let cur_s = 0, total = 10, autoT, progT, progV = 0;
const INTV = 5000;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.ss-dot');
const prog = document.getElementById('ssProg');

function goTo(n) {
    slides[cur_s].classList.remove('active');
    dots[cur_s].classList.remove('active');
    cur_s = (n + total) % total;
    slides[cur_s].classList.add('active');
    dots[cur_s].classList.add('active');
    progV = 0;
    prog.style.width = '0%';
}

function startAuto() {
    clearInterval(autoT);
    clearInterval(progT);
    progV = 0;
    prog.style.width = '0%';
    progT = setInterval(() => {
        progV += 100 / (INTV / 50);
        if (progV > 100) progV = 100;
        prog.style.width = progV + '%';
    }, 50);
    autoT = setInterval(() => {
        goTo(cur_s + 1);
        startAuto();
    }, INTV);
}

document.getElementById('sNext').addEventListener('click', () => { goTo(cur_s + 1); startAuto(); });
document.getElementById('sPrev').addEventListener('click', () => { goTo(cur_s - 1); startAuto(); });

dots.forEach((d, i) => d.addEventListener('click', () => { goTo(i); startAuto(); }));

// Touch swipe for Slideshow
let tx = 0;
const ssStage = document.getElementById('ssStage');
ssStage.addEventListener('touchstart', e => { tx = e.touches[0].clientX; }, { passive: true });
ssStage.addEventListener('touchend', e => {
    const d = tx - e.changedTouches[0].clientX;
    if (Math.abs(d) > 40) {
        goTo(d > 0 ? cur_s + 1 : cur_s - 1);
        startAuto();
    }
});

startAuto();

// Form Handling
const contactForm = document.getElementById('contactForm');
if(contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const b = document.getElementById('subBtn');
        b.textContent = '✓ Enquiry Sent!';
        b.style.background = '#27ae60';
        setTimeout(() => {
            b.textContent = 'Send Enquiry →';
            b.style.background = '';
        }, 3500);
    });
}