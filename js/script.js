document.addEventListener('DOMContentLoaded', () => {
    // --- INTRO LOADER (Pantalla de Carga 3D Avanzada) ---
    const loader = document.getElementById('intro-loader');
    const loaderProgress = document.querySelector('.loader-progress');
    const percentDisplay = document.querySelector('.progress-percent');
    const detailDisplay = document.querySelector('.progress-detail');
    
    if (loader && loaderProgress) {
        let progress = 0;
        const interval = setInterval(() => {
            // Carga mucho más rápida (incrementos entre 2% y 15%)
            progress += Math.random() * 15 + 2; 
            
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
                
                if (detailDisplay) detailDisplay.textContent = "ACCESS GRANTED";
                
                // Pequeña pausa al 100% para leer "SYSTEM READY"
                setTimeout(() => {
                    loader.classList.add('loaded');
                }, 400); // Reducido de 800ms a 400ms
            }
            
            loaderProgress.style.width = `${progress}%`;
            if (percentDisplay) {
                percentDisplay.textContent = `${Math.floor(progress)}%`;
            }
            
            if (detailDisplay && progress < 100) {
                if (progress < 30) detailDisplay.textContent = "LOADING KERNEL...";
                else if (progress < 50) detailDisplay.textContent = "VERIFYING BIOMETRICS...";
                else if (progress < 70) detailDisplay.textContent = "ENCRYPTING CONNECTION...";
                else if (progress < 90) detailDisplay.textContent = "ESTABLISHING UPLINK...";
                else detailDisplay.textContent = "FINALIZING...";
            }
            
        }, 80); // Intervalo reducido de 150ms a 80ms para más fluidez

        // Fallback de seguridad reducido a 3.5 segundos
        setTimeout(() => {
            if (!loader.classList.contains('loaded')) {
                clearInterval(interval);
                loader.classList.add('loaded');
            }
        }, 3500);
    } else if (loader) {
        // Si no encuentra la barra de progreso, quitar el loader inmediatamente
        loader.classList.add('loaded');
    }

    // Canvas Particle Network Animation
    const canvas = document.getElementById('bg-canvas');
    const ctx = canvas.getContext('2d');
    
    let width, height;
    let particles = [];
    
    const resizeCanvas = () => {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    };
    
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 242, 255, 0.2)';
            ctx.fill();
        }
    }

    const initParticles = () => {
        particles = [];
        const particleCount = Math.floor(width * height / 15000); // Responsive count
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    };

    const animateParticles = () => {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach((p, index) => {
            p.update();
            p.draw();
            
            // Draw connections
            for (let j = index + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(112, 0, 255, ${0.1 - distance/1000})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        });
        
        requestAnimationFrame(animateParticles);
    };

    initParticles();
    animateParticles();


    // Custom Cursor
    const cursor = document.getElementById('cursor-follower');
    // ... rest of existing code ...
    
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    const interactiveElements = document.querySelectorAll('a, button, .project-card-compact, .timeline-item, .social-icon');
    
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.classList.add('hovered');
        });
        el.addEventListener('mouseleave', () => {
            cursor.classList.remove('hovered');
        });
    });

    // Intersection Observer for Fade In Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.content-section, .project-card-compact, .timeline-item');
    
    animatedElements.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
        observer.observe(el);
    });

    // --- EFECTO TILT DESACTIVADO ---
    // VanillaTilt.init(document.querySelectorAll("[data-tilt]"), {
    //     max: 10,
    //     speed: 400,
    //     glare: true,
    //     "max-glare": 0.3
    // });

    // Glitch Text Effect
    const glitchText = document.querySelector('.glitch-text');
    if (glitchText) {
        const originalText = glitchText.getAttribute('data-text');
        const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/';
        
        glitchText.addEventListener('mouseover', () => {
            let iterations = 0;
            const interval = setInterval(() => {
                glitchText.innerText = originalText
                    .split('')
                    .map((letter, index) => {
                        if(index < iterations) {
                            return originalText[index];
                        }
                        return chars[Math.floor(Math.random() * chars.length)]
                    })
                    .join('');
                
                if(iterations >= originalText.length) {
                    clearInterval(interval);
                }
                
                iterations += 1 / 3;
            }, 30);
        });
    }

    // Active Navigation Link on Scroll
    const sections = document.querySelectorAll('.content-section');
    const navLinks = document.querySelectorAll('.nav-item');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // Descargar CV (Imprimir a PDF)
    const downloadBtn = document.getElementById('download-cv-btn');
    if (downloadBtn) {
        downloadBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.print();
        });
    }

    // Modal de Contacto Logic
    const openContactBtn = document.getElementById('open-contact-btn');
    const contactModal = document.getElementById('contact-modal');
    const closeContactBtn = document.querySelector('.modal-close');
    const modalOverlay = document.querySelector('.modal-overlay');

    if (openContactBtn && contactModal) {
        openContactBtn.addEventListener('click', (e) => {
            e.preventDefault();
            contactModal.classList.add('active');
        });

        const closeModal = () => {
            contactModal.classList.remove('active');
        };

        if (closeContactBtn) {
            closeContactBtn.addEventListener('click', closeModal);
        }

        // Cerrar al hacer click fuera del modal
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });

        // Cerrar con tecla ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && contactModal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    // --- Image Modal Logic (Certificates) ---
    const imageModal = document.getElementById('image-modal');
    const modalImageDisplay = document.getElementById('modal-image-display');
    const closeImageModalBtn = document.querySelector('.image-modal-close');
    const openCertBtns = document.querySelectorAll('.open-cert-modal');

    if (imageModal && modalImageDisplay) {
        const closeImageModal = () => {
            imageModal.classList.remove('active');
            setTimeout(() => {
                modalImageDisplay.src = ''; // Clear src after closing
            }, 300);
        };

        openCertBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                const imagePath = btn.getAttribute('data-image');
                if (imagePath) {
                    modalImageDisplay.src = imagePath;
                    imageModal.classList.add('active');
                }
            });
        });

        if (closeImageModalBtn) {
            closeImageModalBtn.addEventListener('click', closeImageModal);
        }

        imageModal.addEventListener('click', (e) => {
            if (e.target === imageModal) {
                closeImageModal();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && imageModal.classList.contains('active')) {
                closeImageModal();
            }
        });
    }
});
