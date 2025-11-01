/* ==========================
   Joostenberg Deli Website JS
   WEDE Part 3 – Functionality & SEO Enhancements
   ========================== */

/* =============================
      MOBILE NAVIGATION
============================= */
const menuBtn = document.querySelector('.menu-btn');
const navList = document.querySelector('nav ul');
if (menuBtn) {
  menuBtn.addEventListener('click', () => navList.classList.toggle('open'));
}

/* =============================
      ACTIVE NAV LINK
============================= */
const here = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('nav a').forEach(a => {
  const href = a.getAttribute('href');
  if ((here === '' && href === 'index.html') || href === here) {
    a.classList.add('active');
  }
});

/* =============================
      OPEN NOW BADGE
============================= */
function setOpenStatus() {
  const badge = document.querySelector('[data-open-badge]');
  if (!badge) return;
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours() + now.getMinutes() / 60;
  const open = hour >= 8 && hour < 17;
  const openToday = (day >= 0 && day <= 6);
  badge.textContent = (openToday && open) ? 'Open now' : 'Closed';
  badge.className = 'badge ' + ((openToday && open) ? 'open' : 'closed');
}
setOpenStatus();

/* =============================
      ACCORDION FEATURE
============================= */
document.querySelectorAll('.accordion-header').forEach(header => {
  header.addEventListener('click', () => {
    header.classList.toggle('active');
    const panel = header.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + "px";
    }
  });
});

/* =============================
      IMAGE LIGHTBOX GALLERY
============================= */
const images = document.querySelectorAll('.gallery img');
const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
document.body.appendChild(lightbox);

images.forEach(image => {
  image.addEventListener('click', () => {
    lightbox.classList.add('active');
    const img = document.createElement('img');
    img.src = image.src;
    while (lightbox.firstChild) {
      lightbox.removeChild(lightbox.firstChild);
    }
    lightbox.appendChild(img);
  });
});

lightbox.addEventListener('click', e => {
  if (e.target !== e.currentTarget) return;
  lightbox.classList.remove('active');
});

/* =============================
      PRODUCT SEARCH/FILTER
============================= */
const searchInput = document.querySelector('#product-search');
if (searchInput) {
  searchInput.addEventListener('input', e => {
    const searchTerm = e.target.value.toLowerCase();
    document.querySelectorAll('.product-card').forEach(card => {
      const name = card.querySelector('h3').textContent.toLowerCase();
      card.style.display = name.includes(searchTerm) ? '' : 'none';
    });
  });
}

/* =============================
      BOOKING CALENDAR
============================= */
function Calendar(el) {
  if (!el) return;
  const head = el.querySelector('.cal-head');
  const grid = el.querySelector('.grid');
  const title = head.querySelector('[data-title]');
  let view = new Date(); view.setDate(1);
  let selected = null;

  function draw() {
    grid.innerHTML = '';
    const month = view.getMonth(), year = view.getFullYear();
    title.textContent = view.toLocaleString('default', { month: 'long', year: 'numeric' });
    const startDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dows = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dows.forEach(d => { const div = document.createElement('div'); div.className = 'dow'; div.textContent = d; grid.appendChild(div); });
    for (let i = 0; i < startDay; i++) { const s = document.createElement('div'); grid.appendChild(s); }
    for (let d = 1; d <= daysInMonth; d++) {
      const cell = document.createElement('div');
      cell.className = 'day';
      cell.textContent = d;
      cell.setAttribute('role', 'button');
      cell.addEventListener('click', () => {
        selected = new Date(year, month, d);
        grid.querySelectorAll('.day').forEach(x => x.classList.remove('selected'));
        cell.classList.add('selected');
        const field = document.querySelector('#booking-date');
        if (field) field.value = selected.toISOString().split('T')[0];
      });
      grid.appendChild(cell);
    }
  }
  head.querySelector('[data-prev]').onclick = () => { view.setMonth(view.getMonth() - 1); draw(); };
  head.querySelector('[data-next]').onclick = () => { view.setMonth(view.getMonth() + 1); draw(); };
  draw();
}
Calendar(document.querySelector('.calendar'));

/* =============================
      FORM VALIDATION + AJAX SIMULATION
============================= */
function showError(input, message) {
  let error = input.nextElementSibling;
  if (!error || !error.classList.contains('error-msg')) {
    error = document.createElement('span');
    error.className = 'error-msg';
    input.parentNode.insertBefore(error, input.nextSibling);
  }
  error.textContent = message;
}

function clearError(input) {
  const error = input.nextElementSibling;
  if (error && error.classList.contains('error-msg')) error.textContent = '';
}

/* Enquiry Form */
const enquiryForm = document.querySelector('#enquiry-form');
if (enquiryForm) {
  enquiryForm.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    const name = enquiryForm.querySelector('[name="name"]');
    const email = enquiryForm.querySelector('[name="email"]');
    const subject = enquiryForm.querySelector('[name="subject"]');
    if (!name.value.trim()) { showError(name, 'Please enter your name'); valid = false; } else clearError(name);
    if (!email.value.includes('@')) { showError(email, 'Enter a valid email'); valid = false; } else clearError(email);
    if (!subject.value.trim()) { showError(subject, 'Enter a subject'); valid = false; } else clearError(subject);

    if (valid) {
      alert(`Thanks, ${name.value}! We’ll get back to you at ${email.value} about “${subject.value}”.`);
      enquiryForm.reset();
    }
  });
}

/* Booking Form */
const bookingForm = document.querySelector('#booking-form');
if (bookingForm) {
  bookingForm.addEventListener('submit', e => {
    e.preventDefault();
    let valid = true;
    const people = bookingForm.querySelector('[name="people"]');
    const date = bookingForm.querySelector('[name="date"]');
    const time = bookingForm.querySelector('[name="time"]');
    const email = bookingForm.querySelector('[name="email"]');
    if (!people.value || people.value <= 0) { showError(people, 'Enter number of people'); valid = false; } else clearError(people);
    if (!date.value) { showError(date, 'Select a date'); valid = false; } else clearError(date);
    if (!time.value) { showError(time, 'Select a time'); valid = false; } else clearError(time);
    if (!email.value.includes('@')) { showError(email, 'Enter a valid email'); valid = false; } else clearError(email);

    if (valid) {
      alert(`Booking received for ${people.value} people on ${date.value} at ${time.value}. Confirmation will be sent to ${email.value}.`);
      bookingForm.reset();
    }
  });
}

/* =============================
      SMOOTH FADE ANIMATION
============================= */
document.querySelectorAll('.fade-in').forEach(el => {
  el.style.opacity = 0;
  el.style.transition = 'opacity 1s ease-in-out';
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        observer.unobserve(entry.target);
      }
    });
  });
  observer.observe(el);
});