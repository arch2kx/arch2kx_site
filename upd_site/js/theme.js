if (localStorage.getItem('theme') === 'dark') {
  document.documentElement.classList.add('dark');
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('dark-toggle').addEventListener('click', () => {
    const html = document.documentElement;
    html.classList.toggle('dark');
    localStorage.setItem('theme', html.classList.contains('dark') ? 'dark' : 'light');
  });
});
