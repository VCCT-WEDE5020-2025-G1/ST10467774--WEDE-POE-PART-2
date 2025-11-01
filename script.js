/* ==========================
   Joostenberg Deli Website JS
   WEDE Part 3 – Functionality & SEO Enhancements
   ========================== */

/* MOBILE NAVIGATION */
const menuBtn = document.querySelector('.menu-btn');
const navList = document.querySelector('nav ul');
if (menuBtn) {
  menuBtn.addEventListener('click', () => navList.classList.toggle('open'));
}

/* ACTIVE NAV LINK HIGHLIGHT */
const here = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('nav a').forEach(a => {
  const href = a.getAttribute('href');
  if ((here === '' && href === 'index.html') || href === here) {
    a.classList.add('active');
  }
});

/* OPENING HOURS HELPER */
function setOpenStatus() {
  const badge = document.querySelector('[data-open-badge]');
  if (!badge) return;
  const now = new Date();
  const day = now.getDay();
  const hour = now.getHours() + now.getMinutes() / 60;
  const open = hour >= 8 && hour < 17;
  const openToday = day >= 0 && day <= 6;
  badge.textContent = (openToday && open) ? 'Open now' : 'Closed';
  badge.className = 'badge ' + ((openToday && open) ? 'open' : 'closed');
}
setOpenStatus();

/* ==========================
   INTERACTIVE ELEMENTS
   ========================== */

/* Accordion (e.g., FAQ or product info sections) */
document.querySelectorAll('.accordion-header').forEach(header => {
  header.addEventListener('click', () => {
    header.classList.toggle('active');
    const panel = header.nextElementSibling;
    if (panel.style.maxHeight) {
      panel.style.maxHeight = null;
    } else {
      panel.style.maxHeight = panel.scrollHeight + 'px';
    }
  });
});

/* Modal Popup (e.g., special offers or events) */
const modal = document.querySelector('.modal');
const openModalBtn = document.querySelector('.open-modal');
const closeModalBtn = document.querySelector('.close-modal');
if (openModalBtn && modal) {
  openModalBtn.addEventListener('click', () => modal.classList.add('show'));
  closeModalBtn.addEventListener('click', () => modal.classList.remove('show'));
  window.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('show'); });
}

/* Gallery Lightbox */
const galleryImages = document.querySelectorAll('.gallery img');
const lightbox = document.createElement('div');
lightbox.id = 'lightbox';
document.body.appendChild(lightbox);
galleryImages.forEach(img => {
  img.addEventListener('click', () => {
    lightbox.classList.add('active');
    const imgEl = document.createElement('img');
    imgEl.src = img.src;
    lightbox.innerHTML = '';
    lightbox.appendChild(imgEl);
  });
});
lightbox.addEventListener('click', () => lightbox.classList.remove('active'));

/* ==========================
   DYNAMIC CONTENT (Products)
   ========================== */
const products = [
  { name: 'Red Wine', price: 120, category: 'Wines' },
  { name: 'Farmhouse Cheese', price: 90, category: 'Cheeses' },
  { name: 'Charcuterie Platter', price: 150, category: 'Charcuterie' },
  { name: 'Baked Sourdough', price: 60, category: 'Baked goods' }
];

const productContainer = document.querySelector('#product-list');
if (productContainer) {
  function displayProducts(filter = '') {
    productContainer.innerHTML = '';
    products
      .filter(p => p.category.toLowerCase().includes(filter.toLowerCase()))
      .forEach(p => {
        const item = document.createElement('div');
        item.className = 'product-item fade-in';
        item.innerHTML = `<h4>${p.name}</h4><p>R${p.price}</p><small>${p.category}</small>`;
        productContainer.appendChild(item);
      });
  }
  displayProducts();

  const filterSelect = document.querySelector('#filter-category');
  if (filterSelect) {
    filterSelect.addEventListener('change', e => displayProducts(e.target.value));
  }
}

/* ==========================
   FORM VALIDATION & AJAX
   ========================== */

/* Validate email format */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* Generic form validation handler */
function handleForm(formId, successMsg) {
  const form = document.querySelector(formId);
  if (!form) return;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = new FormData(form);
    const name = data.get('name');
    const email = data.get('email');
    const errors = [];

    if (!name.trim()) errors.push('Name is required.');
    if (!email.trim() || !isValidEmail(email)) errors.push('Valid email required.');

    const errorBox = form.querySelector('.form-errors');
    if (errorBox) errorBox.innerHTML = '';
    if (errors.length > 0) {
      if (errorBox) errorBox.innerHTML = errors.map(e => `<p>${e}</p>`).join('');
      return;
    }

    // AJAX-style feedback
    setTimeout(() => {
      alert(successMsg.replace('{name}', name));
      form.reset();
    }, 500);
  });
}

handleForm('#enquiry-form', 'Thanks, {name}! Your enquiry has been received.');
handleForm('#booking-form', 'Booking confirmed, {name}! We’ll get back to you soon.');

/* ==========================
   CALENDAR WIDGET
   ========================== */
function Calendar(el) {
  if (!el) return;
  const head = el.querySelector('.cal-head');
  const grid = el.querySelector('.grid');
  const title = head.querySelector('[data-title]');
  let view = new Date();
  view.setDate(1);
  let selected = null;

  function draw() {
    grid.innerHTML = '';
    const month = view.getMonth(), year = view.getFullYear();
    title.textContent = view.toLocaleString('default', { month: 'long', year: 'numeric' });
    const startDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const dows = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    dows.forEach(d => {
      const div = document.createElement('div');
      div.className = 'dow';
      div.textContent = d;
      grid.appendChild(div);
    });

    for (let i = 0; i < startDay; i++) {
      const s = document.createElement('div');
      grid.appendChild(s);
    }

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

  head.querySelector('[data-prev]').onclick = () => {
    view.setMonth(view.getMonth() - 1);
    draw();
  };
  head.querySelector('[data-next]').onclick = () => {
    view.setMonth(view.getMonth() + 1);
    draw();
  };
  draw();
}

Calendar(document.querySelector('.calendar'));
