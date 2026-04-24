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
});
