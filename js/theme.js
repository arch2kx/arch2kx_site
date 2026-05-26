if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.classList.add('dark');
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('dark-toggle').addEventListener('click', () => {
    const html = document.documentElement;
    html.classList.toggle('dark');
    localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
  });

  function showPage(pageId) {
    const next = document.getElementById(pageId);
    if (!next) return;
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    void next.offsetWidth;
    next.classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.page === pageId);
    });
  }

  document.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', e => {
      e.preventDefault();
      const pageId = el.dataset.page;
      history.pushState({ page: pageId }, '', '/' + pageId);
      showPage(pageId);
    });
  });

  window.addEventListener('popstate', e => {
    showPage(e.state?.page || 'about');
  });

  // Handle redirect from 404.html (direct navigation to /about, /projects, etc.)
  const redirect = sessionStorage.getItem('spa-redirect');
  if (redirect) {
    sessionStorage.removeItem('spa-redirect');
    const pageId = redirect.replace(/^\//, '').split('/')[0];
    if (pageId && document.getElementById(pageId)) {
      history.replaceState({ page: pageId }, '', '/' + pageId);
      showPage(pageId);
    } else {
      showPage('about');
    }
  } else {
    const path = location.pathname.replace(/^\//, '').split('/')[0];
    if (path && document.getElementById(path)) {
      showPage(path);
    } else {
      showPage('about');
    }
  }
});
