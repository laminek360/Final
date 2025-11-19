/* script.js
   Handles navigation buttons, simple contact form action, and the Daily Fact widget.
   Daily Fact logic:
     - Uses localStorage to cache fact per date (so the same daily fact persists for the day)
     - API used: https://uselessfacts.jsph.pl/random.json?language=en
*/

document.addEventListener('DOMContentLoaded', function () {
  setupAppCards();
  initDailyFactWidget();
});

// Make the app-card buttons navigate to the specified HTML
function setupAppCards() {
  document.querySelectorAll('.app-card').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-target');
      if (target) window.location.href = target;
    });
  });
}

// Contact form: opens mail client with filled fields
function handleContact(e) {
  e.preventDefault();
  const form = e.target;
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const message = form.message.value.trim();
  const subject = encodeURIComponent(`Message from portfolio: ${name}`);
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  window.location.href = `mailto:lamine.kane@example.com?subject=${subject}&body=${body}`;
}

// expose for inline onsubmit:
window.handleContact = handleContact;

/* ---------------- Daily Fact widget ---------------- */

const FACT_API = 'https://uselessfacts.jsph.pl/random.json?language=en';
const FACT_KEY = 'lk_daily_fact';         // storage key for fact object
const FACT_DATE_KEY = 'lk_daily_fact_date';

function todayString() {
  const d = new Date();
  return d.getFullYear() + '-' + (d.getMonth()+1).toString().padStart(2,'0') + '-' + d.getDate().toString().padStart(2,'0');
}

function initDailyFactWidget() {
  const factEl = document.querySelector('#daily-fact .fact-text');
  const btn = document.getElementById('new-fact-btn');

  if (!factEl) return; // widget not present

  // Load cached fact if date matches
  const cachedDate = localStorage.getItem(FACT_DATE_KEY);
  const cachedFact = localStorage.getItem(FACT_KEY);

  if (cachedDate === todayString() && cachedFact) {
    factEl.textContent = cachedFact;
  } else {
    fetchAndStoreFact(factEl);
  }

  btn.addEventListener('click', () => {
    // force fetch new fact (and set today's cached)
    fetchAndStoreFact(factEl);
  });
}

function fetchAndStoreFact(factEl) {
  factEl.textContent = 'Fetching a fresh fact…';
  fetch(FACT_API)
    .then(resp => {
      if (!resp.ok) throw new Error('Network response not ok');
      return resp.json();
    })
    .then(data => {
      // API returns { text: "..." } among other fields
      const factText = data.text || data.fact || 'Could not parse fact.';
      // Save daily fact + date
      localStorage.setItem(FACT_KEY, factText);
      localStorage.setItem(FACT_DATE_KEY, todayString());
      factEl.textContent = factText;
    })
    .catch(err => {
      console.error('Fact fetch failed', err);
      // fallback: try to use cached but if none, a generic message
      const cached = localStorage.getItem(FACT_KEY);
      factEl.textContent = cached || 'Could not load fact. Please try again later.';
    });
}
