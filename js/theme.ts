document.documentElement.classList.remove('preload');
document.documentElement.style.removeProperty('background-color');
document.documentElement.style.removeProperty('color');
document.documentElement.style.removeProperty('color-scheme');

const DEFAULT_PAGE = 'about';

type PageState = {
  page: string;
} | null;


document.addEventListener('DOMContentLoaded', () => {
  const darkToggle = document.getElementById('dark-toggle') as HTMLButtonElement | null;

  darkToggle?.addEventListener('click', () => {
    const html = document.documentElement;

    html.classList.toggle('dark');

    localStorage.setItem(
      'theme',
      html.classList.contains('dark') ? 'dark' : 'light'
    );
  });

  let initialPageShown = false;

  function showPage(pageId: string) {
    const next = document.getElementById(pageId) as HTMLElement | null;
    if (!next) return;

    document.querySelectorAll<HTMLElement>('.page').forEach(p => {
      p.classList.remove('active', 'no-animate');
    });

    const skipAnimation = initialPageShown || pageId === 'fun-stuff';

    if (skipAnimation) {
      next.classList.add('no-animate');
    }

    void next.offsetWidth;
    next.classList.add('active');

    initialPageShown = true;

    document.querySelectorAll<HTMLElement>('.nav-btn').forEach(btn => {
      const btnPage = btn.dataset.page;
      btn.classList.toggle('active', btnPage === pageId);
    });
  }

  const pageLinks = document.querySelectorAll<HTMLElement>('[data-page]');

  pageLinks.forEach(el => {
    el.addEventListener('click', (e) => {
      e.preventDefault();

      const pageId = el.dataset.page;
      if (!pageId) return;

      history.pushState({ page: pageId }, '', pageId === 'about' ? '/' : '/' + pageId);
      showPage(pageId);
    });
  });

  window.addEventListener('popstate', (e: PopStateEvent) => {
    const state = e.state as PageState;

    showPage(state?.page || DEFAULT_PAGE);
  });

  const redirect = sessionStorage.getItem('spa-redirect');

  if (redirect) {
    sessionStorage.removeItem('spa-redirect');

    const pageId = redirect.replace(/^\//, '').split('/')[0];

    if (pageId && document.getElementById(pageId)) {
      history.replaceState({ page: pageId }, '', pageId === 'about' ? '/' : '/' + pageId);
      showPage(pageId);
    } else {
      showPage(DEFAULT_PAGE);
    }
  } else {
    const path = location.pathname.replace(/^\//, '').split('/')[0];

    if (path && document.getElementById(path)) {
      showPage(path);
    } else {
      showPage(DEFAULT_PAGE);
    }
  }
});
