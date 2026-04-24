document.addEventListener("DOMContentLoaded", () => {
    // --- Global Stars Generation ---
    const starsContainer = document.createElement('div');
    starsContainer.classList.add('stars-bg-container');
    document.body.prepend(starsContainer);

    for (let i = 0; i < 150; i++) {
        const star = document.createElement('div');
        star.classList.add('star');
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        star.style.animationDelay = `${Math.random() * 4}s`;
        star.style.animationDuration = `${2 + Math.random() * 4}s`;
        starsContainer.appendChild(star);
    }

    const cards = document.querySelectorAll('.glass-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -5;
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)';
        });
    });

    // --- Smart Navbar Scroll Logic ---
    const nav = document.querySelector('nav');
    let lastScrollY = window.scrollY;

    window.addEventListener('scroll', () => {
        if (window.scrollY === 0) {
            nav.classList.remove('scrolled');
            nav.classList.remove('hidden');
        } else {
            nav.classList.add('scrolled');
            if (window.scrollY > lastScrollY && window.scrollY > 80) {
                nav.classList.add('hidden');
            } else {
                nav.classList.remove('hidden');
            }
        }
        lastScrollY = window.scrollY;
    });

    // --- Scroll Reveal Animation Logic ---
    const reveals = document.querySelectorAll('.reveal');
    const revealOnScroll = new IntersectionObserver(function(entries, observer) {
        entries.forEach(entry => {
            if (entry.intersectionRatio >= 0.15) {
                entry.target.classList.add('active');
            } else if (entry.intersectionRatio < 0.05) {
                entry.target.classList.remove('active');
            }
        });
    }, { threshold: [0.05, 0.15], rootMargin: "0px 0px -50px 0px" });

    reveals.forEach(reveal => {
        revealOnScroll.observe(reveal);
    });
    // --- Portfolio Filtering Logic ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            portfolioItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filter === 'all' || category === filter) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 400);
                }
            });
        });
    });

    // --- Hybrid Window-Based Scroll Controller ---
    class FullPageScrollController {
        constructor() {
            // Sections that participate in the 'glide' slider
            this.snapSections = document.querySelectorAll('.hero, .services-section, .help-section, .tech-stack-section, .recent-projects-section, .about-section, .work-experience');
            if (this.snapSections.length === 0) return;
            
            this.currentIndex = 0;
            this.isAnimating = false;
            this.touchStartY = 0;
            this.duration = 1000; // 1 second glide

            this.init();
        }

        init() {
            // Handle Mouse Wheel
            window.addEventListener('wheel', (e) => this.handleWheel(e), { passive: false });

            // Handle Keyboard
            window.addEventListener('keydown', (e) => this.handleKeydown(e));

            // Handle Touch
            window.addEventListener('touchstart', (e) => this.touchStartY = e.touches[0].clientY);
            window.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });

            // Sync index on manual scroll (scrollbar dragging)
            window.addEventListener('scroll', () => {
                if (this.isAnimating) return;
                const scrollPos = window.scrollY;
                let closestIndex = 0;
                let minDiff = Infinity;

                this.snapSections.forEach((section, index) => {
                    const diff = Math.abs(scrollPos - section.offsetTop);
                    if (diff < minDiff) {
                        minDiff = diff;
                        closestIndex = index;
                    }
                });
                this.currentIndex = closestIndex;
            });
        }

        handleWheel(e) {
            if (this.isAnimating) {
                e.preventDefault();
                return;
            }

            const currentSection = this.snapSections[this.currentIndex];
            const nextSection = this.snapSections[this.currentIndex + 1];
            const prevSection = this.snapSections[this.currentIndex - 1];

            if (e.deltaY > 0) {
                // Scroll Down
                if (nextSection) {
                    const distanceToNext = nextSection.offsetTop - window.scrollY;
                    // If we are at the top of a slide and the next one is close (adjacent slider sections)
                    if (distanceToNext > 50 && distanceToNext < window.innerHeight * 1.1) {
                        e.preventDefault();
                        this.next();
                        return;
                    }
                }
            } else if (e.deltaY < 0) {
                // Scroll Up
                if (prevSection) {
                    const distanceToPrev = window.scrollY - prevSection.offsetTop;
                    // If we are near a snap point and scrolling up towards it
                    if (distanceToPrev > 50 && distanceToPrev < window.innerHeight * 1.1) {
                        e.preventDefault();
                        this.prev();
                        return;
                    }
                }
            }
        }

        handleTouchMove(e) {
            if (this.isAnimating) {
                e.preventDefault();
                return;
            }

            const touchEndY = e.touches[0].clientY;
            const deltaY = this.touchStartY - touchEndY;

            if (Math.abs(deltaY) > 50) {
                const nextSection = this.snapSections[this.currentIndex + 1];
                const prevSection = this.snapSections[this.currentIndex - 1];

                if (deltaY > 0) {
                    // Swipe Down (Scroll Down)
                    if (nextSection) {
                        const distanceToNext = nextSection.offsetTop - window.scrollY;
                        if (distanceToNext > 0 && distanceToNext < window.innerHeight * 1.2) {
                            e.preventDefault();
                            this.next();
                        }
                    }
                } else {
                    // Swipe Up (Scroll Up)
                    if (prevSection) {
                        const distanceToPrev = window.scrollY - prevSection.offsetTop;
                        if (distanceToPrev > 0 && distanceToPrev < window.innerHeight * 1.2) {
                            e.preventDefault();
                            this.prev();
                        }
                    }
                }
                this.touchStartY = touchEndY;
            }
        }

        handleKeydown(e) {
            if (this.isAnimating) return;

            const nextSection = this.snapSections[this.currentIndex + 1];
            const prevSection = this.snapSections[this.currentIndex - 1];

            if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
                if (nextSection) {
                    const distanceToNext = nextSection.offsetTop - window.scrollY;
                    if (distanceToNext > 0 && distanceToNext < window.innerHeight * 1.2) {
                        e.preventDefault();
                        this.next();
                    }
                }
            } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
                if (prevSection) {
                    const distanceToPrev = window.scrollY - prevSection.offsetTop;
                    if (distanceToPrev > 0 && distanceToPrev < window.innerHeight * 1.2) {
                        e.preventDefault();
                        this.prev();
                    }
                }
            }
        }

        next() {
            if (this.currentIndex < this.snapSections.length - 1) {
                this.currentIndex++;
                this.scrollToIndex(this.currentIndex);
            }
        }

        prev() {
            if (this.currentIndex > 0) {
                this.currentIndex--;
                this.scrollToIndex(this.currentIndex);
            }
        }

        scrollToIndex(index, duration = this.duration) {
            this.isAnimating = true;
            const targetY = this.snapSections[index].offsetTop;
            const startY = window.scrollY;
            const distance = targetY - startY;
            let startTime = null;

            const easeInOutQuad = (t, b, c, d) => {
                t /= d / 2;
                if (t < 1) return c / 2 * t * t + b;
                t--;
                return -c / 2 * (t * (t - 2) - 1) + b;
            };

            const animation = (currentTime) => {
                if (!startTime) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const run = easeInOutQuad(timeElapsed, startY, distance, duration);
                
                window.scrollTo(0, run);

                if (timeElapsed < duration) {
                    requestAnimationFrame(animation);
                } else {
                    window.scrollTo(0, targetY);
                    this.isAnimating = false;
                }
            };

            requestAnimationFrame(animation);
        }
    }

    // Initialize the controller
    new FullPageScrollController();
});

// --- Footer: Dark Cosmic Flowing Fabric Animation ---
(function () {
    const canvas = document.getElementById('footer-wave-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let time = 0;
    let noiseCanvas = null;

    function buildNoiseTexture(w, h) {
        noiseCanvas = document.createElement('canvas');
        noiseCanvas.width = w;
        noiseCanvas.height = h;
        const nc = noiseCanvas.getContext('2d');
        const img = nc.createImageData(w, h);
        for (let i = 0; i < img.data.length; i += 4) {
            const v = Math.random() * 20;
            img.data[i]     = v;
            img.data[i + 1] = v;
            img.data[i + 2] = v;
            img.data[i + 3] = 255;
        }
        nc.putImageData(img, 0, 0);
    }

    function resize() {
        canvas.width  = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        buildNoiseTexture(canvas.width, canvas.height);
    }

    // Compute wave Y displacement at a given x position
    function waveDisp(x, w, h, t) {
        const n = x / w;
        const a = Math.sin(n * Math.PI * 1.8 + t * 0.20) * h * 0.11;
        const b = Math.sin(n * Math.PI * 2.9 - t * 0.13) * h * 0.055;
        const c = Math.sin(n * Math.PI * 4.1 + t * 0.28) * h * 0.028;
        return a + b + c;
    }

    // Build spine points across the canvas
    function buildSpine(w, h, t, res) {
        const center = h * 0.5;
        const pts = [];
        for (let i = 0; i <= res; i++) {
            const x = (i / res) * w;
            pts.push({ x, y: center + waveDisp(x, w, h, t) });
        }
        return pts;
    }

    function drawFrame() {
        const w = canvas.width;
        const h = canvas.height;
        const res = 400;
        const spine = buildSpine(w, h, time, res);
        const thick = h * 0.44; // total ribbon height

        // ── 1. Void-black base ────────────────────────────────────────
        ctx.fillStyle = '#010103';
        ctx.fillRect(0, 0, w, h);

        // ── 2. Subtle grain overlay ───────────────────────────────────
        if (noiseCanvas) {
            ctx.globalAlpha = 0.028;
            ctx.drawImage(noiseCanvas, 0, 0, w, h);
            ctx.globalAlpha = 1;
        }

        // ── 3. Ribbon body — deep void with faint depth ───────────────
        ctx.beginPath();
        for (let i = 0; i < spine.length; i++) {
            const p = spine[i];
            if (i === 0) ctx.moveTo(p.x, p.y - thick * 0.5);
            else         ctx.lineTo(p.x, p.y - thick * 0.5);
        }
        for (let i = spine.length - 1; i >= 0; i--) {
            ctx.lineTo(spine[i].x, spine[i].y + thick * 0.5);
        }
        ctx.closePath();
        const bodyGrad = ctx.createLinearGradient(0, 0, 0, h);
        bodyGrad.addColorStop(0,    'rgba(1,1,4,0)');
        bodyGrad.addColorStop(0.28, 'rgba(5,5,12,0.88)');
        bodyGrad.addColorStop(0.5,  'rgba(8,8,18,0.96)');
        bodyGrad.addColorStop(0.72, 'rgba(5,5,12,0.88)');
        bodyGrad.addColorStop(1,    'rgba(1,1,4,0)');
        ctx.fillStyle = bodyGrad;
        ctx.fill();

        // ── 4. Mid-tone satin sheen — wide soft band ──────────────────
        const sheenWidth = thick * 0.28;
        ctx.beginPath();
        for (let i = 0; i < spine.length; i++) {
            const p = spine[i];
            if (i === 0) ctx.moveTo(p.x, p.y - sheenWidth);
            else         ctx.lineTo(p.x, p.y - sheenWidth);
        }
        for (let i = spine.length - 1; i >= 0; i--) {
            ctx.lineTo(spine[i].x, spine[i].y + sheenWidth);
        }
        ctx.closePath();
        const sheenGrad = ctx.createLinearGradient(0, 0, w, 0);
        sheenGrad.addColorStop(0,    'rgba(140,150,175,0)');
        sheenGrad.addColorStop(0.12, 'rgba(155,165,190,0.06)');
        sheenGrad.addColorStop(0.38, 'rgba(175,185,210,0.16)');
        sheenGrad.addColorStop(0.5,  'rgba(185,195,218,0.20)');
        sheenGrad.addColorStop(0.62, 'rgba(175,185,210,0.16)');
        sheenGrad.addColorStop(0.88, 'rgba(155,165,190,0.06)');
        sheenGrad.addColorStop(1,    'rgba(140,150,175,0)');
        ctx.fillStyle = sheenGrad;
        ctx.fill();

        // ── 5. Sharp silvery-white crest highlight ────────────────────
        const crest = thick * 0.045;
        ctx.beginPath();
        for (let i = 0; i < spine.length; i++) {
            const p = spine[i];
            if (i === 0) ctx.moveTo(p.x, p.y - crest);
            else         ctx.lineTo(p.x, p.y - crest);
        }
        for (let i = spine.length - 1; i >= 0; i--) {
            ctx.lineTo(spine[i].x, spine[i].y + crest);
        }
        ctx.closePath();
        const crestGrad = ctx.createLinearGradient(0, 0, w, 0);
        crestGrad.addColorStop(0,    'rgba(210,218,240,0)');
        crestGrad.addColorStop(0.18, 'rgba(218,226,248,0.22)');
        crestGrad.addColorStop(0.40, 'rgba(232,238,255,0.68)');
        crestGrad.addColorStop(0.50, 'rgba(240,244,255,0.80)');
        crestGrad.addColorStop(0.60, 'rgba(232,238,255,0.68)');
        crestGrad.addColorStop(0.82, 'rgba(218,226,248,0.22)');
        crestGrad.addColorStop(1,    'rgba(210,218,240,0)');
        ctx.fillStyle = crestGrad;
        ctx.fill();

        // ── 6. Second ripple — secondary wave, fainter ────────────────
        const spine2 = buildSpine(w, h, time * 0.7 + 3.14, res);
        const thick2 = thick * 0.3;
        ctx.beginPath();
        for (let i = 0; i < spine2.length; i++) {
            const p = spine2[i];
            if (i === 0) ctx.moveTo(p.x, p.y - thick2 * 0.5);
            else         ctx.lineTo(p.x, p.y - thick2 * 0.5);
        }
        for (let i = spine2.length - 1; i >= 0; i--) {
            ctx.lineTo(spine2[i].x, spine2[i].y + thick2 * 0.5);
        }
        ctx.closePath();
        const body2Grad = ctx.createLinearGradient(0, 0, 0, h);
        body2Grad.addColorStop(0,   'rgba(3,3,8,0)');
        body2Grad.addColorStop(0.5, 'rgba(6,6,14,0.6)');
        body2Grad.addColorStop(1,   'rgba(3,3,8,0)');
        ctx.fillStyle = body2Grad;
        ctx.fill();

        // Faint crest on ripple 2
        const crest2 = thick2 * 0.08;
        ctx.beginPath();
        for (let i = 0; i < spine2.length; i++) {
            const p = spine2[i];
            if (i === 0) ctx.moveTo(p.x, p.y - crest2);
            else         ctx.lineTo(p.x, p.y - crest2);
        }
        for (let i = spine2.length - 1; i >= 0; i--) {
            ctx.lineTo(spine2[i].x, spine2[i].y + crest2);
        }
        ctx.closePath();
        const crest2Grad = ctx.createLinearGradient(0, 0, w, 0);
        crest2Grad.addColorStop(0,   'rgba(190,200,225,0)');
        crest2Grad.addColorStop(0.3, 'rgba(200,210,235,0.10)');
        crest2Grad.addColorStop(0.5, 'rgba(210,220,245,0.22)');
        crest2Grad.addColorStop(0.7, 'rgba(200,210,235,0.10)');
        crest2Grad.addColorStop(1,   'rgba(190,200,225,0)');
        ctx.fillStyle = crest2Grad;
        ctx.fill();

        // ── 7. Top & bottom fade-to-black vignettes ───────────────────
        const topFade = ctx.createLinearGradient(0, 0, 0, h * 0.32);
        topFade.addColorStop(0, 'rgba(1,1,3,1)');
        topFade.addColorStop(1, 'rgba(1,1,3,0)');
        ctx.fillStyle = topFade;
        ctx.fillRect(0, 0, w, h * 0.32);

        const botFade = ctx.createLinearGradient(0, h * 0.68, 0, h);
        botFade.addColorStop(0, 'rgba(1,1,3,0)');
        botFade.addColorStop(1, 'rgba(1,1,3,1)');
        ctx.fillStyle = botFade;
        ctx.fillRect(0, h * 0.68, w, h * 0.32);

        time += 0.004; // glacially slow for the satin effect
        requestAnimationFrame(drawFrame);
    }

    resize();
    window.addEventListener('resize', () => { resize(); });
    drawFrame();
})();
