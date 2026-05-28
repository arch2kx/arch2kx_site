document.documentElement.classList.remove('preload');
const DEFAULT_PAGE = 'about';
document.addEventListener('DOMContentLoaded', () => {
    const darkToggle = document.getElementById('dark-toggle');
    darkToggle?.addEventListener('click', () => {
        const html = document.documentElement;
        html.classList.toggle('dark');
        localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
    });
    let initialPageShown = false;
    function showPage(pageId) {
        const next = document.getElementById(pageId);
        if (!next)
            return;
        document.querySelectorAll('.page').forEach(p => {
            p.classList.remove('active', 'no-animate');
        });
        const skipAnimation = initialPageShown || pageId === 'fun-stuff';
        if (skipAnimation) {
            next.classList.add('no-animate');
        }
        void next.offsetWidth;
        next.classList.add('active');
        initialPageShown = true;
        document.querySelectorAll('.nav-btn').forEach(btn => {
            const btnPage = btn.dataset.page;
            btn.classList.toggle('active', btnPage === pageId);
        });
    }
    const pageLinks = document.querySelectorAll('[data-page]');
    pageLinks.forEach(el => {
        el.addEventListener('click', (e) => {
            e.preventDefault();
            const pageId = el.dataset.page;
            if (!pageId)
                return;
            history.pushState({ page: pageId }, '', '/' + pageId);
            showPage(pageId);
        });
    });
    window.addEventListener('popstate', (e) => {
        const state = e.state;
        showPage(state?.page || DEFAULT_PAGE);
    });
    const redirect = sessionStorage.getItem('spa-redirect');
    if (redirect) {
        sessionStorage.removeItem('spa-redirect');
        const pageId = redirect.replace(/^\//, '').split('/')[0];
        if (pageId && document.getElementById(pageId)) {
            history.replaceState({ page: pageId }, '', '/' + pageId);
            showPage(pageId);
        }
        else {
            showPage(DEFAULT_PAGE);
        }
    }
    else {
        const path = location.pathname.replace(/^\//, '').split('/')[0];
        if (path && document.getElementById(path)) {
            showPage(path);
        }
        else {
            showPage(DEFAULT_PAGE);
        }
    }
});
export {};
//# sourceMappingURL=theme.js.map