document.addEventListener('DOMContentLoaded', () => {
    // Registrando os plugins do GSAP
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    // 1. Loading Screen
    const loader = document.getElementById('loader');
    window.addEventListener('load', () => {
        gsap.to(loader, {
            opacity: 0,
            duration: 1,
            ease: "power2.out",
            onComplete: () => {
                loader.style.display = 'none';
                initHeroAnimations();
            }
        });
    });

    // 2. Custom Cursor
    const cursor = document.getElementById('cursor-follower');
    
    // Atualiza a posição do cursor e o fundo interativo
    window.addEventListener('mousemove', (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.15,
            ease: 'power2.out'
        });

        // Parallax interativo para a imagem de fundo da galáxia
        const moveX = (e.clientX - window.innerWidth / 2) * 0.02;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.02;
        
        gsap.to('body', {
            backgroundPosition: `calc(50% + ${moveX}px) calc(50% + ${moveY}px)`,
            duration: 1.5,
            ease: 'power1.out'
        });
    });

    // Efeitos de hover em links e botões
    const hoverElements = document.querySelectorAll('a, button, .card');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('cursor-hover'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('cursor-hover'));
    });

    // 3. Smooth Scroll para os links do menu
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                gsap.to(window, {
                    duration: 1.5,
                    scrollTo: { y: target, offsetY: 80 },
                    ease: "power3.inOut"
                });
            }
            
            // Fecha menu mobile se estiver aberto
            if (navMenu.classList.contains('mobile-active')) {
                toggleMobileMenu();
            }
        });
    });

    // 4. Menu Mobile
    const mobileBtn = document.getElementById('mobile-menu-btn');
    const navMenu = document.getElementById('nav-menu');

    function toggleMobileMenu() {
        navMenu.classList.toggle('mobile-active');
        // Animação do botão sanduíche (simulada via CSS no original)
        // Mas podemos animar a altura do menu via GSAP se quisermos:
        if(navMenu.classList.contains('mobile-active')) {
            gsap.fromTo(navMenu, {opacity: 0, y: -20}, {opacity: 1, y: 0, duration: 0.3});
        }
    }

    mobileBtn.addEventListener('click', toggleMobileMenu);

    // 5. Botão de explorar no hero
    const exploreBtn = document.getElementById('explore-btn');
    if (exploreBtn) {
        exploreBtn.addEventListener('click', () => {
            gsap.to(window, {
                duration: 1.5,
                scrollTo: { y: '#beginner', offsetY: 80 },
                ease: "power3.inOut"
            });
        });
    }

    // 6. Canvas Starfield (Deep Space Background)
    initCanvasStarfield();

    // 7. Scroll Animations (GSAP)
    initScrollAnimations();

    // 8. FAQ Accordion
    initFAQ();
});

function initHeroAnimations() {
    // Animação inicial ao carregar a página
    const tl = gsap.timeline();
    
    tl.from('.hero-tag', { opacity: 0, y: 20, duration: 0.8, ease: "power2.out" })
      .from('.hero-title', { opacity: 0, y: 30, duration: 1, ease: "power3.out" }, "-=0.4")
      .from('.hero-subtitle', { opacity: 0, y: 20, duration: 0.8 }, "-=0.6")
      .from('.btn-primary', { opacity: 0, scale: 0.8, duration: 0.5 }, "-=0.4")
      .from('.hero-visual', { opacity: 0, scale: 0.5, duration: 1.5, ease: "back.out(1.2)" }, "-=1");
}

function initCanvasStarfield() {
    const canvas = document.getElementById('space-canvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let width, height;
    let stars = [];

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
        initStars();
    }

    function initStars() {
        stars = [];
        const numStars = window.innerWidth < 768 ? 400 : 800; // Menos estrelas no mobile para performance
        for (let i = 0; i < numStars; i++) {
            stars.push({
                x: Math.random() * width,
                y: Math.random() * height,
                radius: Math.random() * 1.5,
                alpha: Math.random(),
                velocity: Math.random() * 0.05,
                color: Math.random() > 0.8 ? '#00e5ff' : '#ffffff'
            });
        }
    }

    function draw() {
        ctx.clearRect(0, 0, width, height);
        
        stars.forEach(star => {
            ctx.beginPath();
            ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${star.color === '#00e5ff' ? '0, 229, 255' : '255, 255, 255'}, ${star.alpha})`;
            ctx.fill();

            // Move as estrelas muito lentamente para cima (efeito parallax contínuo)
            star.y -= star.velocity;
            
            // Cintilação suave
            star.alpha += (Math.random() - 0.5) * 0.05;
            if (star.alpha < 0) star.alpha = 0;
            if (star.alpha > 1) star.alpha = 1;

            // Reposiciona se sair da tela
            if (star.y < 0) {
                star.y = height;
                star.x = Math.random() * width;
            }
        });

        requestAnimationFrame(draw);
    }

    window.addEventListener('resize', resize);
    resize();
    draw();

    // Efeito parallax no canvas atrelado ao scroll
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        gsap.to(canvas, {
            y: scrollY * 0.3, // Velocidade do parallax
            duration: 0.5,
            ease: "none"
        });
    });
}

function initScrollAnimations() {
    // Fade up para textos e cards
    const fadeElements = gsap.utils.toArray('.text-content, .card, .step, .physics-item');
    
    fadeElements.forEach(el => {
        gsap.from(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power2.out"
        });
    });

    // Distorção na seção "O que são" (Gravity Well)
    const gravityCard = document.querySelector('.gravity-card');
    if (gravityCard) {
        gsap.to(gravityCard, {
            scrollTrigger: {
                trigger: '#what-are',
                start: "top center",
                end: "bottom center",
                scrub: 1
            },
            scale: 1.05,
            boxShadow: "0 0 80px rgba(0, 229, 255, 0.4)",
            ease: "none"
        });
    }

    // Animação da Timeline
    const timelineItems = gsap.utils.toArray('.timeline-content');
    timelineItems.forEach((item, i) => {
        const isEven = i % 2 === 0;
        gsap.from(item, {
            scrollTrigger: {
                trigger: item,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            x: isEven ? 50 : -50,
            opacity: 0,
            duration: 1,
            ease: "power2.out"
        });
    });

    // Contador Animado (Estatísticas)
    const statsSection = document.getElementById('stats');
    const numbers = document.querySelectorAll('.stat-number');
    let animated = false;

    if (statsSection) {
        ScrollTrigger.create({
            trigger: statsSection,
            start: "top 80%",
            onEnter: () => {
                if (!animated) {
                    numbers.forEach(num => {
                        const target = parseInt(num.getAttribute('data-target'));
                        // Simplificação para números muito grandes: contar até 100 e adicionar sufixo, 
                        // Mas como temos números variados, usamos o GSAP
                        
                        let duration = 2.5;
                        let formatter = (val) => Math.floor(val).toLocaleString('pt-BR');
                        
                        // Para 100 milhões, etc
                        if (target >= 1000000) {
                            gsap.to({ val: 0 }, {
                                val: target / 1000000,
                                duration: duration,
                                ease: "power2.out",
                                onUpdate: function() {
                                    num.innerHTML = Math.floor(this.targets()[0].val) + "M+";
                                }
                            });
                        } else {
                            gsap.to({ val: 0 }, {
                                val: target,
                                duration: duration,
                                ease: "power2.out",
                                onUpdate: function() {
                                    num.innerHTML = formatter(this.targets()[0].val);
                                }
                            });
                        }
                    });
                    animated = true;
                }
            }
        });
    }
}

function initFAQ() {
    const questions = document.querySelectorAll('.faq-question');
    
    questions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isActive = question.classList.contains('active');

            // Fechar todas as outras
            document.querySelectorAll('.faq-question').forEach(q => {
                q.classList.remove('active');
                q.nextElementSibling.style.maxHeight = null;
            });

            if (!isActive) {
                question.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + "px";
            }
        });
    });
}