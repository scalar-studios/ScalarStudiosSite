(function buildTOC(){
    const tocList = document.getElementById('toc-list');
    if(!tocList) return;
    const content = document.querySelector('.wiki-content');
    if(!content) return;
    const headings = content.querySelectorAll('h2');
    headings.forEach(h => {
        if(!h.id) {
            h.id = h.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g,'-');
        }
        const a = document.createElement('a');
        a.href = '#'+h.id;
        a.className = 'toc-link';
        a.textContent = h.textContent.trim();
        tocList.appendChild(a);
    });

    const links = Array.from(tocList.querySelectorAll('.toc-link'));
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            const id = entry.target.id;
            const link = tocList.querySelector(`a[href="#${id}"]`);
            if(entry.isIntersecting) {
                links.forEach(l=>l.classList.remove('active'));
                if(link) link.classList.add('active');
            }
        });
    }, { root: null, rootMargin: '-40% 0px -40% 0px', threshold: 0 });

    headings.forEach(h => observer.observe(h));

    tocList.addEventListener('click', e => {
        if(e.target.tagName === 'A') {
            e.preventDefault();
            const target = document.querySelector(e.target.getAttribute('href'));
            if(target) target.scrollIntoView({behavior:'smooth', block:'start'});
            history.replaceState(null, '', e.target.getAttribute('href'));
        }
    });
})();
