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
  
  // ============================================
  // 🗓️ DIMANCHES RÉSERVÉS (semaines bloquées)
  // ============================================
  // Ajoute ici les dimanches déjà réservés au format 'YYYY-MM-DD'
  // Le dimanche bloqué = la SEMAINE qui commence ce jour-là est réservée
  // Exemple : '2026-12-27' = semaine du 27/12 au 03/01 est réservée
  bookedSundays: [
    // '2026-12-27',
    // '2027-01-03',
  ],
  
  // ============================================
  // 💰 GRILLE TARIFAIRE — Prix par semaine (7 nuits)
  // ============================================
  // Chaque entrée : la semaine commençant le dimanche YYYY-MM-DD
  // coûte X euros pour 7 nuits (du dimanche au dimanche suivant)
  // Si une semaine n'est PAS dans cette liste, le prix defaultWeeklyPrice est utilisé
  //
  // Tarifs définis par périodes :
  //   - 20 déc → 2 janv  : 1 250 €/jour = 8 750 €/sem (Noël/Nouvel An)
  //   - 3 janv → 6 fév   : 930 €/jour   = 6 510 €/sem (Janvier basse)
  //   - 7 fév → 27 fév   : 1 250 €/jour = 8 750 €/sem (Vacances février)
  //   - 28 fév → 4 avr   : 930 €/jour   = 6 510 €/sem (Fin saison ski)
  //   - Reste de l'année : 500 €/jour   = 3 500 €/sem (par défaut)
  weeklyPrices: {
    // === SAISON SKI 2026-2027 ===
    '2026-12-20': 8750,  // Noël/Nouvel An
    '2026-12-27': 8750,  // Noël/Nouvel An
    '2027-01-03': 6510,  // Janvier basse saison
    '2027-01-10': 6510,  // Janvier basse saison
    '2027-01-17': 6510,  // Janvier basse saison
    '2027-01-24': 6510,  // Janvier basse saison
    '2027-01-31': 6510,  // Janvier basse saison
    '2027-02-07': 8750,  // Vacances de février
    '2027-02-14': 8750,  // Vacances de février
    '2027-02-21': 8750,  // Vacances de février
    '2027-02-28': 6510,  // Fin de saison ski
    '2027-03-07': 6510,  // Fin de saison ski
    '2027-03-14': 6510,  // Fin de saison ski
    '2027-03-21': 6510,  // Fin de saison ski
    '2027-03-28': 6510,  // Fin de saison ski
    '2027-04-04': 6510,  // Fin de saison ski
  },
  
  // Prix par défaut si la semaine n'est pas dans la grille (500€/jour × 7)
  defaultWeeklyPrice: 3500,
  
  // Devise (€ par défaut)
  currency: '€'
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
//  SWIPER GALERIES (Chalet + Environnement)
// ====================================================
window.addEventListener('load', function() {
  if (typeof Swiper === 'undefined') return;
  
  // Galerie principale (Le chalet)
  new Swiper('.gallery-swiper', {
    slidesPerView: 'auto',
    spaceBetween: 20,
    grabCursor: true,
    loop: true,
    speed: 800,
    pagination: { 
      el: '.gallery-swiper .swiper-pagination', 
      clickable: true 
    },
    navigation: { 
      nextEl: '.gallery-swiper .swiper-button-next', 
      prevEl: '.gallery-swiper .swiper-button-prev' 
    },
    breakpoints: {
      640: { spaceBetween: 30 },
      1024: { spaceBetween: 40 }
    }
  });
  
  // Galerie environnement (paysages)
  if (document.querySelector('.environment-swiper')) {
    new Swiper('.environment-swiper', {
      slidesPerView: 'auto',
      spaceBetween: 20,
      grabCursor: true,
      loop: true,
      speed: 800,
      pagination: { 
        el: '.environment-swiper .swiper-pagination', 
        clickable: true 
      },
      navigation: { 
        nextEl: '.environment-swiper .swiper-button-next', 
        prevEl: '.environment-swiper .swiper-button-prev' 
      },
      breakpoints: {
        640: { spaceBetween: 30 },
        1024: { spaceBetween: 40 }
      }
    });
  }
});

// ====================================================
//  CALENDRIER CUSTOM — Dimanche à dimanche
// ====================================================
(function() {
  const calGrid = document.getElementById('calGrid');
  const calTitle = document.getElementById('calTitle');
  const calPrev = document.getElementById('calPrev');
  const calNext = document.getElementById('calNext');
  const arrivalInput = document.getElementById('arrival');
  const departureInput = document.getElementById('departure');
  const priceSummary = document.getElementById('priceSummary');
  
  if (!calGrid) return;
  
  const MOIS_FR = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
                   'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
  const MOIS_EN = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];
  const JOURS_FR = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
  const JOURS_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  
  let currentDate = new Date();
  currentDate.setDate(1);
  
  // Limite mini : mois actuel
  const minMonth = new Date();
  minMonth.setDate(1);
  minMonth.setHours(0, 0, 0, 0);
  
  // État de sélection
  let arrivalDate = null;
  let departureDate = null;
  
  // Helpers
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function formatISO(d) {
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }
  function formatDisplay(d) {
    return pad(d.getDate()) + '/' + pad(d.getMonth() + 1) + '/' + d.getFullYear();
  }
  function formatLong(d, lang) {
    const mois = lang === 'en' ? MOIS_EN : MOIS_FR;
    return d.getDate() + ' ' + mois[d.getMonth()].toLowerCase() + ' ' + d.getFullYear();
  }
  function isSunday(d) { return d.getDay() === 0; }
  function isSameDay(d1, d2) {
    return d1 && d2 &&
      d1.getFullYear() === d2.getFullYear() &&
      d1.getMonth() === d2.getMonth() &&
      d1.getDate() === d2.getDate();
  }
  function isBefore(d1, d2) {
    return d1.getTime() < d2.getTime();
  }
  function isBooked(date) {
    if (!isSunday(date)) return false;
    return CONFIG.bookedSundays.indexOf(formatISO(date)) !== -1;
  }
  function getWeeklyPrice(sundayDate) {
    const iso = formatISO(sundayDate);
    return CONFIG.weeklyPrices[iso] || CONFIG.defaultWeeklyPrice;
  }
  function formatPrice(p) {
    return p.toLocaleString('fr-FR') + ' ' + CONFIG.currency;
  }
  
  // Rendu du calendrier
  function renderCalendar() {
    const lang = document.documentElement.lang === 'en' ? 'en' : 'fr';
    const mois = lang === 'en' ? MOIS_EN : MOIS_FR;
    const jours = lang === 'en' ? JOURS_EN : JOURS_FR;
    
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    calTitle.textContent = mois[month] + ' ' + year;
    
    // Boutons navigation
    const prevDate = new Date(year, month - 1, 1);
    calPrev.disabled = prevDate < minMonth;
    
    // Grille
    calGrid.innerHTML = '';
    
    // En-têtes jours (lundi → dimanche)
    jours.forEach(function(j) {
      const d = document.createElement('div');
      d.className = 'calendar-weekday';
      d.textContent = j;
      calGrid.appendChild(d);
    });
    
    // Premier jour du mois (en mode lundi = 0)
    const firstDay = new Date(year, month, 1);
    let startCol = firstDay.getDay() - 1; // dim = 0 → -1 = 6
    if (startCol < 0) startCol = 6;
    
    // Cases vides
    for (let i = 0; i < startCol; i++) {
      const empty = document.createElement('div');
      empty.className = 'calendar-day empty';
      calGrid.appendChild(empty);
    }
    
    // Jours du mois
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let d = 1; d <= daysInMonth; d++) {
      const date = new Date(year, month, d);
      const dayEl = document.createElement('div');
      dayEl.className = 'calendar-day';
      
      const numSpan = document.createElement('span');
      numSpan.textContent = d;
      dayEl.appendChild(numSpan);
      
      const isPast = isBefore(date, today);
      const sunday = isSunday(date);
      
      if (isPast) dayEl.classList.add('past');
      
      if (sunday) {
        dayEl.classList.add('sunday');
        
        // Prix sous le numéro
        const priceSpan = document.createElement('span');
        priceSpan.className = 'day-price';
        const weeklyPrice = getWeeklyPrice(date);
        // Formatage : 8750 → "8,7k"  / 3500 → "3,5k"  / 6510 → "6,5k"
        const priceInK = (weeklyPrice / 1000).toFixed(1).replace('.', ',');
        priceSpan.textContent = priceInK + 'k' + CONFIG.currency;
        dayEl.appendChild(priceSpan);
        
        // Réservé ?
        if (isBooked(date)) {
          dayEl.classList.add('booked');
        }
        
        // États de sélection
        if (arrivalDate && isSameDay(date, arrivalDate)) {
          dayEl.classList.add('selected-arrival');
        }
        if (departureDate && isSameDay(date, departureDate)) {
          dayEl.classList.add('selected-departure');
        }
        if (arrivalDate && departureDate &&
            isBefore(arrivalDate, date) && isBefore(date, departureDate)) {
          dayEl.classList.add('in-range');
        }
        
        // Click handler (seulement si pas passé et pas réservé)
        if (!isPast && !isBooked(date)) {
          dayEl.addEventListener('click', function() {
            handleSundayClick(date);
          });
        }
      } else if (arrivalDate && departureDate &&
                 isBefore(arrivalDate, date) && isBefore(date, departureDate)) {
        // Jours en semaine entre arrivée et départ
        dayEl.classList.add('in-range');
      }
      
      calGrid.appendChild(dayEl);
    }
  }
  
  // Gestion clic sur dimanche
  function handleSundayClick(date) {
    // Cas 1 : aucune date sélectionnée → c'est l'arrivée
    if (!arrivalDate) {
      arrivalDate = date;
      departureDate = null;
    }
    // Cas 2 : arrivée déjà sélectionnée mais pas de départ
    else if (arrivalDate && !departureDate) {
      // Si on reclique sur la même date OU avant → on réinitialise avec cette nouvelle arrivée
      if (isSameDay(date, arrivalDate) || isBefore(date, arrivalDate)) {
        arrivalDate = date;
        departureDate = null;
      } else {
        // Vérifier qu'il n'y a pas de semaine réservée entre les deux
        if (hasBookedWeekBetween(arrivalDate, date)) {
          arrivalDate = date;
          departureDate = null;
        } else {
          departureDate = date;
        }
      }
    }
    // Cas 3 : les deux étaient sélectionnés → reset et nouvelle arrivée
    else {
      arrivalDate = date;
      departureDate = null;
    }
    
    // Mettre à jour les champs cachés
    arrivalInput.value = arrivalDate ? formatDisplay(arrivalDate) : '';
    departureInput.value = departureDate ? formatDisplay(departureDate) : '';
    
    renderCalendar();
    updatePriceSummary();
  }
  
  // Vérifie s'il y a une semaine bloquée entre 2 dimanches
  function hasBookedWeekBetween(start, end) {
    const cur = new Date(start);
    while (cur < end) {
      if (isBooked(cur)) return true;
      cur.setDate(cur.getDate() + 7);
    }
    return false;
  }
  
  // Calcul + affichage du récap prix
  function updatePriceSummary() {
    if (!arrivalDate || !departureDate) {
      priceSummary.style.display = 'none';
      return;
    }
    
    // Nombre de nuits = différence en jours
    const ms = departureDate - arrivalDate;
    const nights = Math.round(ms / (1000 * 60 * 60 * 24));
    const weeks = nights / 7;
    
    // Total : somme des prix de chaque semaine couverte
    let total = 0;
    const cur = new Date(arrivalDate);
    while (cur < departureDate) {
      total += getWeeklyPrice(cur);
      cur.setDate(cur.getDate() + 7);
    }
    
    const lang = document.documentElement.lang === 'en' ? 'en' : 'fr';
    
    // Affichage
    document.getElementById('psPeriod').textContent = 
      formatLong(arrivalDate, lang) + ' → ' + formatLong(departureDate, lang);
    
    const nightsLabel = nights + ' ' + (lang === 'en' ? 'nights' : (nights > 1 ? 'nuits' : 'nuit'));
    const nightlyAvg = Math.round(total / nights);
    document.getElementById('psNightsLabel').textContent = nightsLabel + ' × ' + formatPrice(nightlyAvg);
    document.getElementById('psNightsValue').textContent = formatPrice(total);
    document.getElementById('psTotal').textContent = formatPrice(total);
    
    priceSummary.style.display = 'block';
    
    // Animation d'apparition
    priceSummary.style.animation = 'none';
    priceSummary.offsetHeight; // reflow
    priceSummary.style.animation = 'fadeIn 0.4s ease';
  }
  
  // Navigation
  calPrev.addEventListener('click', function() {
    currentDate.setMonth(currentDate.getMonth() - 1);
    renderCalendar();
  });
  calNext.addEventListener('click', function() {
    currentDate.setMonth(currentDate.getMonth() + 1);
    renderCalendar();
  });
  
  // Rendu initial
  renderCalendar();
  
  // Réagir au changement de langue
  const langToggle = document.getElementById('langToggle');
  if (langToggle) {
    langToggle.addEventListener('click', function() {
      setTimeout(function() {
        renderCalendar();
        updatePriceSummary();
      }, 50);
    });
  }
})();

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
