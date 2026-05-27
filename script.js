// ===== Mobile menu =====
const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', () => {
        const isOpen = mainNav.classList.toggle('is-open');
        menuToggle.classList.toggle('is-open', isOpen);
        menuToggle.setAttribute('aria-expanded', String(isOpen));
        menuToggle.setAttribute('aria-label', isOpen ? 'Fechar menu' : 'Abrir menu');
    });

    mainNav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            mainNav.classList.remove('is-open');
            menuToggle.classList.remove('is-open');
            menuToggle.setAttribute('aria-expanded', 'false');
        });
    });
}

// ===== FAQ accordion (only one open at a time) =====
document.querySelectorAll('.faq-item').forEach((item) => {
    item.addEventListener('toggle', () => {
        if (item.open) {
            document.querySelectorAll('.faq-item').forEach((other) => {
                if (other !== item) other.open = false;
            });
        }
    });
});

// ===== Contact form -> WhatsApp =====
const contatoForm = document.getElementById('contatoForm');
if (contatoForm) {
    contatoForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const data = new FormData(contatoForm);
        const nome = (data.get('nome') || '').toString().trim();
        const telefone = (data.get('telefone') || '').toString().trim();
        const assunto = (data.get('assunto') || '').toString().trim();
        const mensagem = (data.get('mensagem') || '').toString().trim();

        if (!nome || !telefone) {
            contatoForm.reportValidity();
            return;
        }

        const text =
            `Olá, GerontoVidas! Meu nome é ${nome}.\n` +
            `Telefone: ${telefone}\n` +
            `Interesse: ${assunto}` +
            (mensagem ? `\n\n${mensagem}` : '');

        const url = `https://wa.me/5561999270028?text=${encodeURIComponent(text)}`;
        window.open(url, '_blank', 'noopener');
    });
}

// ===== Footer year =====
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

// ===== Reveal on scroll =====
const revealTargets = document.querySelectorAll(
    '.section-header, .modalidade, .esp, .dif, .avga-list li, .doctor-card, .faq-item, .contato-form, .contato-list, .sobre-content, .sobre-visual, .hero-meta li'
);
revealTargets.forEach((el) => el.classList.add('fade-in'));

if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    io.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.12, rootMargin: '0px 0px -60px 0px' }
    );
    revealTargets.forEach((el) => io.observe(el));
} else {
    revealTargets.forEach((el) => el.classList.add('is-visible'));
}

// ===== Header shadow on scroll =====
const header = document.querySelector('.site-header');
if (header) {
    const onScroll = () => {
        if (window.scrollY > 8) header.classList.add('is-scrolled');
        else header.classList.remove('is-scrolled');
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
}

// ===== Match heights between doctor cards (Marcela / Aniele) =====
// Garante que ambos os cards tenham a mesma altura em qualquer viewport,
// mesmo no mobile (single column grid), aplicando min-height = maior altura.
const doctorCards = document.querySelectorAll('.doctor-card');
if (doctorCards.length > 1) {
    const matchDoctorCardHeights = () => {
        doctorCards.forEach((c) => { c.style.minHeight = ''; });
        // forca reflow antes de medir
        let maxH = 0;
        doctorCards.forEach((c) => { maxH = Math.max(maxH, c.offsetHeight); });
        doctorCards.forEach((c) => { c.style.minHeight = maxH + 'px'; });
    };

    // dispara apos carregamento das fontes (que afetam altura)
    if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(matchDoctorCardHeights);
    } else {
        window.addEventListener('load', matchDoctorCardHeights);
    }

    // reajusta em resize (orientacao mobile, breakpoint mudando)
    let resizeTimer = null;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(matchDoctorCardHeights, 100);
    }, { passive: true });
}
