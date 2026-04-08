// Simple carousel for wiki images
document.addEventListener('DOMContentLoaded', () => {
    const containers = document.querySelectorAll('.wiki-doc-right');
    containers.forEach(container => {
        // allow opt-in via data-carousel attribute or multiple images present
        const imgs = Array.from(container.querySelectorAll('img'));
        const data = container.getAttribute('data-images');
        if (data && imgs.length === 0) {
            // build images from comma-separated list
            data.split(',').map(s => s.trim()).filter(Boolean).forEach(src => {
                const img = document.createElement('img');
                img.className = 'wiki-doc-image';
                img.src = src;
                container.appendChild(img);
            });
        }

        const allImgs = Array.from(container.querySelectorAll('img'));
        if (allImgs.length <= 1) return; // nothing to rotate

        // set up carousel behavior
        container.classList.add('carousel');
        const intervalMs = parseInt(container.getAttribute('data-interval')) || 5000;

        let current = 0;
        allImgs.forEach((img, i) => {
            if (i === 0) {
                img.classList.add('active');
                img.classList.remove('hidden');
            } else {
                img.classList.add('hidden');
                img.classList.remove('active');
            }
            // make sure images are not reported as layout items
            img.style.position = 'absolute';
        });

        setInterval(() => {
            const prev = current;
            current = (current + 1) % allImgs.length;
            allImgs[prev].classList.remove('active');
            allImgs[prev].classList.add('hidden');
            allImgs[current].classList.remove('hidden');
            // force reflow then activate to apply transition
            void allImgs[current].offsetWidth;
            allImgs[current].classList.add('active');
        }, intervalMs);
    });
});

// Helper: initialize carousels that may be added later dynamically
window.initWikiImageCarousels = function() {
    document.querySelectorAll('.wiki-doc-right.carousel').forEach(c => c.classList.remove('carousel'));
    // re-run DOMContentLoaded handler logic
    const evt = new Event('DOMContentLoaded');
    document.dispatchEvent(evt);
}
