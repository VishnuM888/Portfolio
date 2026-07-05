document.addEventListener('DOMContentLoaded', () => {
    const loader = document.querySelector('.loader');
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const progressBar = document.querySelector('.scroll-progress');
    const typingText = document.querySelector('.typing-text');
    const scrollIndicator = document.querySelector('.scroll-indicator');
    const themeToggle = document.getElementById('themeToggle');
    const backToTop = document.querySelector('.back-to-top');

    const hideLoader = () => {
        if (!loader) return;
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.style.display = 'none';
            document.body.classList.add('loaded');
        }, 400);
    };

    hideLoader();

    window.addEventListener('load', () => {
        setTimeout(() => {
            hideLoader();
        }, 300);
    });

    const updateNavbar = () => {
        if (window.scrollY > 40) {
            navbar.style.background = 'rgba(6, 8, 22, 0.95)';
            navbar.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)';
        } else {
            navbar.style.background = 'rgba(6, 8, 22, 0.9)';
            navbar.style.boxShadow = 'none';
        }
        backToTop.classList.toggle('visible', window.scrollY > 600);
    };

    updateNavbar();
    window.addEventListener('scroll', updateNavbar, { passive: true });

    const updateProgressBar = () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = `${progress}%`;
    };

    window.addEventListener('scroll', updateProgressBar, { passive: true });
    updateProgressBar();

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');

    const setActiveLink = () => {
        let current = '';
        sections.forEach(section => {
            const offset = section.offsetTop - 120;
            if (window.scrollY >= offset) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${current}`);
        });
    };

    setActiveLink();
    window.addEventListener('scroll', setActiveLink, { passive: true });

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

    const animateCounters = () => {
        const counters = document.querySelectorAll('.stat-card h4');
        counters.forEach(counter => {
            const target = Number(counter.textContent.replace('+', ''));
            const increment = target / 120;
            let current = 0;

            const update = () => {
                if (current < target) {
                    current += increment;
                    counter.textContent = `${Math.floor(current)}+`;
                    requestAnimationFrame(update);
                } else {
                    counter.textContent = `${target}+`;
                }
            };

            const counterObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        update();
                        observer.disconnect();
                    }
                });
            }, { threshold: 0.6 });

            counterObserver.observe(counter);
        });
    };

    animateCounters();

    const typeText = () => {
        if (!typingText) return;
        const roles = JSON.parse(typingText.dataset.roles || '[]');
        let roleIndex = 0;
        let charIndex = 0;
        let deleting = false;

        const tick = () => {
            const currentText = roles[roleIndex] || '';
            if (!deleting) {
                typingText.textContent = currentText.slice(0, charIndex + 1);
                charIndex += 1;
                if (charIndex === currentText.length) {
                    deleting = true;
                    setTimeout(tick, 1400);
                    return;
                }
            } else {
                typingText.textContent = currentText.slice(0, charIndex - 1);
                charIndex -= 1;
                if (charIndex === 0) {
                    deleting = false;
                    roleIndex = (roleIndex + 1) % roles.length;
                }
            }
            setTimeout(tick, deleting ? 40 : 70);
        };

        if (roles.length) {
            tick();
        }
    };

    typeText();

    const contactForm = document.querySelector('.contact-form');
    const formStatus = document.querySelector('.form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const button = contactForm.querySelector('button[type="submit"]');
            const originalText = button.innerHTML;
            const formAction = contactForm.getAttribute('action');

            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
            button.disabled = true;
            if (formStatus) {
                formStatus.textContent = 'Sending your message...';
                formStatus.className = 'form-status';
            }

            try {
                const response = await fetch(formAction, {
                    method: 'POST',
                    body: new FormData(contactForm),
                    headers: { Accept: 'application/json' }
                });
                if (!response.ok) throw new Error('Unable to send message');
                if (formStatus) {
                    formStatus.textContent = 'Thanks! Your message has been sent.';
                    formStatus.className = 'form-status success';
                }
                button.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
                button.style.background = 'var(--secondary)';
                contactForm.reset();
            } catch (error) {
                if (formStatus) {
                    formStatus.textContent = 'Sorry, something went wrong. Please try again.';
                    formStatus.className = 'form-status error';
                }
                button.innerHTML = '<i class="fas fa-exclamation-circle"></i> Try Again';
                button.style.background = '#ef4444';
            } finally {
                setTimeout(() => {
                    button.innerHTML = originalText;
                    button.disabled = false;
                    button.style.background = '';
                }, 1800);
            }
        });
    }

    themeToggle?.addEventListener('click', () => {
        document.body.classList.toggle('light-mode');
        const icon = themeToggle.querySelector('i');
        icon.className = document.body.classList.contains('light-mode') ? 'fas fa-sun' : 'fas fa-moon';
    });

    if (scrollIndicator) {
        scrollIndicator.style.opacity = '1';
    }

    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function (event) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = event.clientX - rect.left - size / 2;
            const y = event.clientY - rect.top - size / 2;
            ripple.style.width = `${size}px`;
            ripple.style.height = `${size}px`;
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            ripple.classList.add('ripple');
            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });
});