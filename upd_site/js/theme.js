if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.classList.add('dark');
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('dark-toggle').addEventListener('click', () => {
    const html = document.documentElement;
    html.classList.toggle('dark');
    localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
  });

  document.querySelectorAll('.nav-btn').forEach(link => {
    link.addEventListener('click', e => {
      if (link.classList.contains('active')) return;
      e.preventDefault();
      const href = link.getAttribute('href');
      const main = document.querySelector('main');
      main.classList.add('leaving');
      setTimeout(() => { window.location.href = href; }, 200);
    });
  });
});
