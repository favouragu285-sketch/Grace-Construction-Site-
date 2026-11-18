const numbers = document.querySelectorAll(".num");
const stats = document.querySelector(".container");
const duration = 1600;
const animations = new Map();

function resetCounters() {
    numbers.forEach((count) => {
        const animation = animations.get(count);
        if (animation) {
            cancelAnimationFrame(animation);
            animations.delete(count);
        }
        count.textContent = "00";
    });
}

function animateCounters() {
    numbers.forEach((count) => {
        const target = Number(count.getAttribute("num"));
        const previousAnimation = animations.get(count);
        if (previousAnimation) {
            cancelAnimationFrame(previousAnimation);
        }

        const start = performance.now();
        const animate = (now) => {
            const progress = Math.min((now - start) / duration, 1);
            count.textContent = String(Math.floor(progress * target));

            if (progress < 1) {
                animations.set(count, requestAnimationFrame(animate));
            } else {
                count.textContent = String(target);
                animations.delete(count);
            }
        };

        animations.set(count, requestAnimationFrame(animate));
    });
}

if (stats && numbers.length) {
    if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    animateCounters();
                } else {
                    resetCounters();
                }
            });
        }, { threshold: 0.3 });

        observer.observe(stats);
    } else {
        animateCounters();
    }
}
