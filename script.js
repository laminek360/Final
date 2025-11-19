// Theme toggle
document.getElementById('themeToggle')?.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  document.documentElement.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
});

// Simple API fetch demo (AJAX)
(async () => {
  const el = document.getElementById('quote');
  if (!el) return;
  try {
    const res = await fetch('https://api.quotable.io/random');
    const data = await res.json();
    el.textContent = `"${data.content}" — ${data.author}`;
  } catch {
    el.textContent = 'Could not load quote.';
  }
})();
