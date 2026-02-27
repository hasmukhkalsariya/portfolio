/**
 * Hasmukh Kalsariya - Portfolio Script
 * Handles animations, dynamic interactions, and UI states.
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Typing Animation ---
    const typedTextSpan = document.querySelector(".typed-text");
    const cursorSpan = document.querySelector(".cursor");

    const textArray = [
        "Backend Specialist",
        "API Integration Expert",
        "Node.js Developer",
        "PHP, Laravel Developer",
        "DevOps Engineer",
        "Cloud Architect"
    ];

    const typingDelay = 100;
    const erasingDelay = 50;
    const newTextDelay = 2000; // Delay between current and next text
    let textArrayIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < textArray[textArrayIndex].length) {
            if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
            typedTextSpan.textContent += textArray[textArrayIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        }
        else {
            cursorSpan.classList.remove("typing");
            setTimeout(erase, newTextDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            if (!cursorSpan.classList.contains("typing")) cursorSpan.classList.add("typing");
            typedTextSpan.textContent = textArray[textArrayIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        }
        else {
            cursorSpan.classList.remove("typing");
            textArrayIndex++;
            if (textArrayIndex >= textArray.length) textArrayIndex = 0;
            setTimeout(type, typingDelay + 1100);
        }
    }

    // Start typing effect
    if (textArray.length) setTimeout(type, newTextDelay + 250);

    // --- 2. Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

    function checkReveal() {
        const windowHeight = window.innerHeight;
        const elementVisible = 100; // px threshold before reveal

        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;

            if (elementTop < windowHeight - elementVisible) {
                element.classList.add('active');
            }
        });
    }

    // Trigger on load and scroll
    window.addEventListener('scroll', checkReveal);
    checkReveal(); // Check initial state

    // --- 3. Navbar scroll effect & active links ---
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Navbar background on scroll
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlighting
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            // Adjust offset to trigger slightly earlier
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // --- 4. Mobile Menu Toggle ---
    const navToggle = document.getElementById('nav-toggle');
    const navLinksContainer = document.querySelector('.nav-links');
    const navLinksElements = document.querySelectorAll('.nav-link, .nav-btn');

    // Close menu when clicking a link
    navLinksElements.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.checked = false;
            navLinksContainer.classList.remove('active');
        });
    });

    // --- 5. Form Submission (Prevent Default & Show Alert) ---
    // const contactForm = document.getElementById('contactForm');

    // if (contactForm) {
    //     contactForm.addEventListener('submit', (e) => {
    //         e.preventDefault();

    //         const btn = contactForm.querySelector('button');
    //         const originalText = btn.innerHTML;

    //         // Loading state
    //         btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
    //         btn.disabled = true;

    //         // Simulate network request
    //         setTimeout(() => {
    //             btn.innerHTML = 'Message Sent! <i class="fas fa-check"></i>';
    //             btn.classList.add('btn-success');
    //             contactForm.reset();

    //             // Reset button after 3 seconds
    //             setTimeout(() => {
    //                 btn.innerHTML = originalText;
    //                 btn.disabled = false;
    //                 btn.classList.remove('btn-success');
    //             }, 3000);

    //         }, 1500);
    //     });
    // }

    const contactForm = document.getElementById('contactForm');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn = contactForm.querySelector('button');
            const originalText = btn.innerHTML;

            btn.innerHTML = 'Sending... <i class="fas fa-spinner fa-spin"></i>';
            btn.disabled = true;

            const formData = new FormData(contactForm);

            try {
                const res = await fetch('http://localhost/corepixel/contactus.php', {
                    method: 'POST',
                    // headers: {
                    //     'Content-Type': 'application/json'
                    // },
                    body: formData,
                    // body: JSON.stringify({
                    //     name: formData.get('name'),
                    //     email: formData.get('email'),
                    //     phone: formData.get('phone'),
                    //     subject: formData.get('subject'),
                    //     message: formData.get('message'),
                    //     to: 'hasmukhkalasariya@gmail.com'
                    // })
                });

                const data = await res.json();

                if (data.success) {
                    btn.innerHTML = 'Message Sent! <i class="fas fa-check"></i>';
                    btn.classList.add('btn-success');
                    contactForm.reset();
                } else {
                    throw new Error('Failed');
                }

            } catch (err) {
                btn.innerHTML = 'Failed! Try again';
                btn.classList.add('btn-danger');
            }

            setTimeout(() => {
                btn.innerHTML = originalText;
                btn.disabled = false;
                btn.classList.remove('btn-success', 'btn-danger');
            }, 3000);
        });
    }

    // --- 6. Custom Particles Background Effect ---
    // A simple, pure JS particle system without external libraries
    function initParticles() {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const container = document.getElementById('particles-js');

        if (!container) return;

        container.appendChild(canvas);

        let width, height;
        let particles = [];

        function resize() {
            width = container.clientWidth;
            height = container.clientHeight;
            canvas.width = width;
            canvas.height = height;
        }

        window.addEventListener('resize', resize);
        resize();

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.size = Math.random() * 2 + 0.1;
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                // Subtle purple/pink colors matching theme
                this.color = `rgba(${Math.random() > 0.5 ? '99, 102, 241' : '236, 72, 153'}, ${Math.random() * 0.3 + 0.1})`;
            }

            update() {
                this.x += this.speedX;
                this.y += this.speedY;

                if (this.x > width) this.x = 0;
                else if (this.x < 0) this.x = width;

                if (this.y > height) this.y = 0;
                else if (this.y < 0) this.y = height;
            }

            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }

        function createParticles() {
            particles = [];
            let particleCount = Math.floor(width * height / 15000); // Responsive count
            if (particleCount > 100) particleCount = 100; // Cap max particles

            for (let i = 0; i < particleCount; i++) {
                particles.push(new Particle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, width, height);

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                // Draw connecting lines
                for (let j = i; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 120) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 - distance / 2400})`;
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateParticles);
        }

        createParticles();
        animateParticles();
    }

    // Initialize custom particles if not on a very low-end device
    if (window.innerWidth > 768) {
        initParticles();
    }

    // --- 7. Theme Toggle ---
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    // Check local storage or system preference
    const currentTheme = localStorage.getItem('theme') ||
        (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark');

    if (currentTheme === 'light') {
        document.body.setAttribute('data-theme', 'light');
        if (themeIcon) themeIcon.classList.replace('fa-sun', 'fa-moon');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            const theme = document.body.getAttribute('data-theme');
            if (theme === 'light') {
                document.body.removeAttribute('data-theme');
                localStorage.setItem('theme', 'dark');
                themeIcon.classList.replace('fa-moon', 'fa-sun');
            } else {
                document.body.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                themeIcon.classList.replace('fa-sun', 'fa-moon');
            }
        });
    }
});
