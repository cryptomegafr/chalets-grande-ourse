/* ============================================
   CHALET ASTRO — Script principal
   ============================================ */

// ====================================================
//  CONFIG
// ====================================================
const CONFIG = {
  email: 'pi.beaulier@gmail.com',
  whatsapp: '33607499945',
  whatsappDisplay: '+33 6 07 49 99 45',
  
  // Google Form
  googleForm: {
    url: 'https://docs.google.com/forms/d/e/1FAIpQLScR2qUOkDtkO_idBX5n64fmyV-ngLVzm34uoDXO8xrabn1KYw/formResponse',
    fields: {
      arrival: 'entry.158284135',
      departure: 'entry.1682083791',
      guests: 'entry.1246072192',
      name: 'entry.663396809',
      email: 'entry.748993058',
      phone: 'entry.861333173',
      message: 'entry.1865057151'
    }
  },
  
  // Dates indisponibles
  unavailableDates: []
};

// ====================================================
//  INJECTION DES VALEURS DANS LE DOM
// ====================================================
document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('a[href="mailto:[EMAIL]"]').forEach(function(a) {
    a.href = 'mailto:' + CONFIG.email + '?subject=Demande de réservation — Chalet ASTRO';
  });
  document.querySelectorAll('a[href="https://wa.me/[WHATSAPP]"]').forEach(function(a) {
    a.href = 'https://wa.me/' + CONFIG.whatsapp + '?text=' + encodeURIComponent('Bonjour, je suis intéressé(e) par une réservation du chalet ASTRO.');
  });
  document.querySelectorAll('*').forEach(function(el) {
    if (el.children.length === 0 && el.textContent.includes('[EMAIL]')) {
      el.textContent = el.textContent.replace('[EMAIL]', CONFIG.email);
    }
    if (el.children.length === 0 && el.textContent.includes('[+33 WHATSAPP]')) {
      el.textContent = el.textContent.replace('[+33 WHATSAPP]', CONFIG.whatsappDisplay);
    }
  });
});

// ====================================================
//  LOADER (robuste)
// ====================================================
function hideLoader() {
  const loader = document.getElementById('loader');
  if (!loader || loader.classList.contains('gone')) return;
  loader.classList.add('gone');
  const heroEl = document.querySelector('.hero');
  if (heroEl) heroEl.classList.add('loaded');
  setTimeout(function() { loader.style.display = 'none'; }, 800);
}
document.addEventListener('DOMContentLoaded', function() {
  setTimeout(hideLoader, 2000);
});
window.addEventListener('load', function() {
  setTimeout(hideLoader, 500);
});
setTimeout(hideLoader, 4000);

// ====================================================
//  SCROLL natif
// ====================================================
document.querySelectorAll('a[href^="#"]').forEach(function(link) {
  link.addEventListener('click', function(e) {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - 80;
      window.scrollTo(0, top);
      document.getElementById('mobileMenu').classList.remove('open');
      document.getElementById('menuBurger').classList.remove('open');
      document.body.classList.remove('lock');
    }
  });
});

// ====================================================
//  NAVIGATION au scroll
// ====================================================
const nav = document.getElementById('nav');
const hero = document.querySelector('.hero');

function updateNav() {
  const scrolled = window.scrollY > 50;
  const pastHero = hero ? window.scrollY > (hero.offsetHeight - 80) : false;
  nav.classList.toggle('scrolled', scrolled);
  nav.classList.toggle('hero-mode', !pastHero);
}
updateNav();
window.addEventListener('scroll', updateNav, { passive: true });

// ====================================================
//  MENU MOBILE
// ====================================================
const burger = document.getElementById('menuBurger');
const mobileMenu = document.getElementById('mobileMenu');
burger.addEventListener('click', function() {
  burger.classList.toggle('open');
  mobileMenu.classList.toggle('open');
  document.body.classList.toggle('lock');
});

// ====================================================
//  TOGGLE FR / EN
// ====================================================
const langToggle = document.getElementById('langToggle');
let currentLang = 'fr';

function translatePage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-fr]').forEach(function(el) {
    const text = el.dataset[lang];
    if (text) el.innerHTML = text;
  });
  if (lang === 'en') {
    langToggle.classList.add('en');
    langToggle.querySelector('.lang-current').textContent = 'EN';
    langToggle.querySelector('.lang-alt').textContent = 'FR';
  } else {
    langToggle.classList.remove('en');
    langToggle.querySelector('.lang-current').textContent = 'FR';
    langToggle.querySelector('.lang-alt').textContent = 'EN';
  }
  localStorage.setItem('grandeourse_lang', lang);
}

langToggle.addEventListener('click', function() {
  translatePage(currentLang === 'fr' ? 'en' : 'fr');
});

const savedLang = localStorage.getItem('grandeourse_lang');
if (savedLang === 'en') translatePage('en');

// ====================================================
//  LUCIDE ICONS
// ====================================================
if (typeof lucide !== 'undefined') lucide.createIcons();

// ====================================================
//  ANIMATIONS GSAP
// ====================================================
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  
  // Compteurs
  document.querySelectorAll('.stat-num[data-target]').forEach(function(el) {
    const target = parseInt(el.dataset.target);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: function() {
        gsap.to({ val: 0 }, {
          val: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: function() {
            el.textContent = Math.round(this.targets()[0].val);
          }
        });
      },
      once: true
    });
  });
  
  // Reveal des titres
  gsap.utils.toArray('.section-tag, .section-title, .manifesto-tag').forEach(function(el) {
    gsap.from(el, {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });
  
  // Manifesto
  const manifestoText = document.querySelector('.manifesto-text');
  if (manifestoText) {
    gsap.from(manifestoText, {
      y: 50,
      opacity: 0,
      duration: 1.4,
      ease: 'power3.out',
      scrollTrigger: { trigger: manifestoText, start: 'top 85%' }
    });
  }
  
  // Spaces
  gsap.utils.toArray('.space').forEach(function(space) {
    const img = space.querySelector('.space-img');
    const txt = space.querySelector('.space-text');
    const isLeft = space.classList.contains('space-left');
    gsap.from(img, {
      x: isLeft ? -60 : 60,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: { trigger: space, start: 'top 75%' }
    });
    gsap.from(txt, {
      x: isLeft ? 60 : -60,
      opacity: 0,
      duration: 1.2,
      delay: 0.15,
      ease: 'power3.out',
      scrollTrigger: { trigger: space, start: 'top 75%' }
    });
  });
  
  // Amenities
  gsap.from('.amenity', {
    y: 30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.04,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.amenities-grid', start: 'top 80%' }
  });
  
  // Location
  gsap.from('.loc-row', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.location-rows', start: 'top 80%' }
  });
  gsap.from('.location-text > p', {
    y: 30,
    opacity: 0,
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.location-text', start: 'top 80%' }
  });
  
  // Pricing
  gsap.from('.price-card', {
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: { trigger: '.pricing-grid', start: 'top 80%' }
  });
  
  // Testimonials
  gsap.from('.testimonial', {
    y: 40,
    opacity: 0,
    duration: 0.9,
    stagger: 0.12,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.testimonials-grid', start: 'top 80%' }
  });
  gsap.from('.testimonials-rating', {
    y: 20,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.testimonials-rating', start: 'top 88%' }
  });
  
  // Hero parallax
  gsap.to('.hero-image', {
    yPercent: 15,
    ease: 'none',
    scrollTrigger: {
      trigger: '.hero',
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  });
  
  // Booking
  gsap.from('.booking-form, .booking-contact, .booking-left > p', {
    y: 30,
    opacity: 0,
    duration: 1,
    stagger: 0.1,
    ease: 'power2.out',
    scrollTrigger: { trigger: '.booking', start: 'top 75%' }
  });
}

// ====================================================
//  SWIPER GALERIE
// ====================================================
window.addEventListener('load', function() {
  if (typeof Swiper === 'undefined') return;
  new Swiper('.gallery-swiper', {
    slidesPerView: 'auto',
    spaceBetween: 20,
    grabCursor: true,
    loop: true,
    speed: 800,
    pagination: { el: '.swiper-pagination', clickable: true },
    navigation: { nextEl: '.swiper-button-next', prevEl: '.swiper-button-prev' },
    breakpoints: {
      640: { spaceBetween: 30 },
      1024: { spaceBetween: 40 }
    }
  });
});

// ====================================================
//  FLATPICKR CALENDRIER
// ====================================================
window.addEventListener('load', function() {
  if (typeof flatpickr === 'undefined') return;
  
  const baseConfig = {
    locale: 'fr',
    dateFormat: 'd/m/Y',
    minDate: 'today',
    disable: CONFIG.unavailableDates || [],
    showMonths: window.innerWidth > 768 ? 2 : 1,
    monthSelectorType: 'static'
  };
  
  let departurePicker = null;
  
  const arrivalPicker = flatpickr('#arrival', Object.assign({}, baseConfig, {
    onChange: function(selectedDates) {
      if (selectedDates[0] && departurePicker) {
        const minDep = new Date(selectedDates[0]);
        minDep.setDate(minDep.getDate() + 1);
        departurePicker.set('minDate', minDep);
      }
    }
  }));
  
  departurePicker = flatpickr('#departure', baseConfig);
});

// ====================================================
//  FORMULAIRE — envoi vers Google Form
// ====================================================
const form = document.getElementById('bookingForm');
const formStatus = document.getElementById('formStatus');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  
  const submit = form.querySelector('.form-submit');
  const originalText = submit.querySelector('span').textContent;
  
  const arrival = document.getElementById('arrival').value;
  const departure = document.getElementById('departure').value;
  const guests = document.getElementById('guests').value;
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const phone = document.getElementById('phone').value;
  const message = document.getElementById('message').value;
  
  if (!arrival || !departure || !guests || !name || !email) {
    formStatus.className = 'form-status error';
    formStatus.textContent = currentLang === 'fr' 
      ? 'Merci de remplir tous les champs obligatoires.' 
      : 'Please fill in all required fields.';
    return;
  }
  
  submit.disabled = true;
  submit.querySelector('span').textContent = currentLang === 'fr' ? 'Envoi en cours...' : 'Sending...';
  formStatus.className = 'form-status';
  formStatus.textContent = '';
  
  // Envoi vers Google Form
  const formData = new FormData();
  formData.append(CONFIG.googleForm.fields.arrival, arrival);
  formData.append(CONFIG.googleForm.fields.departure, departure);
  formData.append(CONFIG.googleForm.fields.guests, guests);
  formData.append(CONFIG.googleForm.fields.name, name);
  formData.append(CONFIG.googleForm.fields.email, email);
  formData.append(CONFIG.googleForm.fields.phone, phone || '');
  formData.append(CONFIG.googleForm.fields.message, message || '');
  
  fetch(CONFIG.googleForm.url, {
    method: 'POST',
    mode: 'no-cors',
    body: formData
  }).then(function() {
    formStatus.className = 'form-status success';
    formStatus.textContent = currentLang === 'fr' 
      ? '✓ Demande envoyée ! Pierre vous recontactera sous 24h.' 
      : '✓ Request sent! Pierre will contact you within 24h.';
    form.reset();
    submit.disabled = false;
    submit.querySelector('span').textContent = originalText;
  }).catch(function() {
    formStatus.className = 'form-status error';
    formStatus.textContent = currentLang === 'fr' 
      ? 'Erreur d\'envoi. Contactez-nous par email ou WhatsApp.' 
      : 'Send error. Please contact us by email or WhatsApp.';
    submit.disabled = false;
    submit.querySelector('span').textContent = originalText;
  });
});
