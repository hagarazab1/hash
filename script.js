document.addEventListener("DOMContentLoaded", () => {
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
            // At the top
            nav.classList.remove('scrolled');
            nav.classList.remove('hidden');
        } else {
            // Scrolled out of the top
            nav.classList.add('scrolled');
            
            // Check scroll direction
            if (window.scrollY > lastScrollY && window.scrollY > 80) {
                // Scrolling down and past the threshold
                nav.classList.add('hidden');
            } else {
                // Scrolling up
                nav.classList.remove('hidden');
            }
        }
        lastScrollY = window.scrollY;
    });
});

