/* ============================================
   CHALETS DE LA GRANDE OURSE — Script principal
   ============================================ */

// ====================================================
//  CONFIG — Modifie ces valeurs depuis ce fichier
// ====================================================
const CONFIG = {
  // Adresse email où tu reçois les demandes de réservation
  email: 'pi.beaulier@gmail.com',
  
  // Numéro WhatsApp au format international SANS le +
  // Exemple : "33612345678" pour +33 6 12 34 56 78
  whatsapp: '33607499945',
  
  // Affichage joli du numéro WhatsApp (avec espaces)
  whatsappDisplay: '+33 6 07 49 99 45',
  
  // EmailJS — Crée un compte gratuit sur https://emailjs.com
  // Puis remplace les 3 valeurs ci-dessous (cf. README)
  emailjs: {
    publicKey: 'TON_PUBLIC_KEY',                         // <-- À REMPLACER
    serviceId: 'TON_SERVICE_ID',                         // <-- À REMPLACER
    templateId: 'TON_TEMPLATE_ID'                        // <-- À REMPLACER
  },
  
  // Dates INDISPONIBLES (format AAAA-MM-JJ ou plages)
  // Les dates listées ici seront grisées dans le calendrier
  unavailableDates: [
    // Exemple : { from: '2026-12-20', to: '2027-01-03' }, // Vacances de Noël
    // Exemple : '2026-02-14',
  ]
};

// ====================================================
//  INJECTION DES VALEURS DE CONFIG DANS LE DOM
// ====================================================
document.addEventListener('DOMContentLoaded', () => {
  // Remplace [EMAIL] et [WHATSAPP] dans le HTML
  document.querySelectorAll('a[href="mailto:[EMAIL]"]').forEach(a => {
    a.href = `mailto:${CONFIG.email}?subject=Demande de réservation — Chalets de la Grande Ourse`;
  });
  document.querySelectorAll('a[href="https://wa.me/[WHATSAPP]"]').forEach(a => {
    a.href = `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent('Bonjour, je suis intéressé(e) par une réservation aux Chalets de la Grande Ourse.')}`;
  });
  document.querySelectorAll('*').forEach(el => {
    if (el.children.length === 0 && el.textContent.includes('[EMAIL]')) {
      el.textContent = el.textContent.replace('[EMAIL]', CONFIG.email);
    }
    if (el.children.length === 0 && el.textContent.includes('[+33 WHATSAPP]')) {
      el.textContent = el.textContent.replace('[+33 WHATSAPP]', CONFIG.whatsappDisplay);
    }
  });
});

// ====================================================
//  LOADER
// ====================================================
window.addEventListener('load', () => {
  setTimeout(() => {
    const loader = document.getElementById('loader');
    loader.classList.add('gone');
    document.querySelector('.hero').classList.add('loaded');
    
    setTimeout(() => {
      loader.style.display = 'none';
    }, 800);
  }, 2400);
});

// ====================================================
//  SCROLL (100% natif, pas de smooth)
// ====================================================
let lenis = null;

// Scroll natif rapide sur les liens d'ancre
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo(0, top);
      // Fermer menu mobile si ouvert
      document.getElementById('mobileMenu').classList.remove('open');
      document.getElementById('menuBurger').classList.remove('open');
      document.body.classList.remove('lock');
    }
  });
});

// ====================================================
//  NAVIGATION — Comportement au scroll
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

burger.addEventListener('click', () => {
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
  
  document.querySelectorAll('[data-fr]').forEach(el => {
    const text = el.dataset[lang];
    if (text) {
      el.innerHTML = text;
    }
  });
  
  // Mise à jour du toggle
  if (lang === 'en') {
    langToggle.classList.add('en');
    langToggle.querySelector('.lang-current').textContent = 'EN';
    langToggle.querySelector('.lang-alt').textContent = 'FR';
  } else {
    langToggle.classList.remove('en');
    langToggle.querySelector('.lang-current').textContent = 'FR';
    langToggle.querySelector('.lang-alt').textContent = 'EN';
  }
  
  // Sauvegarde
  localStorage.setItem('grandeourse_lang', lang);
}

langToggle.addEventListener('click', () => {
  translatePage(currentLang === 'fr' ? 'en' : 'fr');
});

// Restaure la langue choisie
const savedLang = localStorage.getItem('grandeourse_lang');
if (savedLang === 'en') {
  translatePage('en');
}

// ====================================================
//  LUCIDE ICONS
// ====================================================
if (typeof lucide !== 'undefined') {
  lucide.createIcons();
}

// ====================================================
//  GSAP — Animations au scroll
// ====================================================
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
  
  // (Lenis désactivé — GSAP utilise le scroll natif directement)
  
  // Compteurs animés
  document.querySelectorAll('.stat-num[data-target]').forEach(el => {
    const target = parseInt(el.dataset.target);
    ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      onEnter: () => {
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
  
  // Titres de section : reveal
  gsap.utils.toArray('.section-tag, .section-title, .manifesto-tag').forEach(el => {
    gsap.from(el, {
      y: 40,
      opacity: 0,
      duration: 1,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: el,
        start: 'top 88%'
      }
    });
  });
  
  // Manifesto : reveal mot par mot
  const manifestoText = document.querySelector('.manifesto-text');
  if (manifestoText) {
    gsap.from(manifestoText, {
      y: 50,
      opacity: 0,
      duration: 1.4,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: manifestoText,
        start: 'top 85%'
      }
    });
  }
  
  // Spaces : alternance reveal
  gsap.utils.toArray('.space').forEach((space, i) => {
    const img = space.querySelector('.space-img');
    const txt = space.querySelector('.space-text');
    const isLeft = space.classList.contains('space-left');
    
    gsap.from(img, {
      x: isLeft ? -60 : 60,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: space,
        start: 'top 75%'
      }
    });
    
    gsap.from(txt, {
      x: isLeft ? 60 : -60,
      opacity: 0,
      duration: 1.2,
      delay: 0.15,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: space,
        start: 'top 75%'
      }
    });
  });
  
  // Amenities : reveal en cascade
  gsap.from('.amenity', {
    y: 30,
    opacity: 0,
    duration: 0.6,
    stagger: 0.04,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.amenities-grid',
      start: 'top 80%'
    }
  });
  
  // Location rows
  gsap.from('.loc-row', {
    y: 30,
    opacity: 0,
    duration: 0.8,
    stagger: 0.12,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.location-rows',
      start: 'top 80%'
    }
  });
  gsap.from('.location-text > p', {
    y: 30,
    opacity: 0,
    duration: 1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.location-text',
      start: 'top 80%'
    }
  });
  
  // Pricing cards
  gsap.from('.price-card', {
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.15,
    ease: 'power3.out',
    scrollTrigger: {
      trigger: '.pricing-grid',
      start: 'top 80%'
    }
  });
  
  // Testimonials
  gsap.from('.testimonial', {
    y: 40,
    opacity: 0,
    duration: 0.9,
    stagger: 0.12,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.testimonials-grid',
      start: 'top 80%'
    }
  });
  gsap.from('.testimonials-rating', {
    y: 20,
    opacity: 0,
    duration: 0.8,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.testimonials-rating',
      start: 'top 88%'
    }
  });
  
  // Hero parallax sur l'image
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
  
  // Booking form
  gsap.from('.booking-form, .booking-contact, .booking-left > p', {
    y: 30,
    opacity: 0,
    duration: 1,
    stagger: 0.1,
    ease: 'power2.out',
    scrollTrigger: {
      trigger: '.booking',
      start: 'top 75%'
    }
  });
}

// ====================================================
//  SWIPER — Galerie
// ====================================================
window.addEventListener('load', () => {
  if (typeof Swiper === 'undefined') return;
  
  const swiper = new Swiper('.gallery-swiper', {
    slidesPerView: 'auto',
    spaceBetween: 20,
    centeredSlides: false,
    grabCursor: true,
    loop: true,
    speed: 800,
    pagination: {
      el: '.swiper-pagination',
      clickable: true
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev'
    },
    breakpoints: {
      640: { spaceBetween: 30 },
      1024: { spaceBetween: 40 }
    }
  });
});

// ====================================================
//  FLATPICKR — Calendrier de réservation
// ====================================================
window.addEventListener('load', () => {
  if (typeof flatpickr === 'undefined') return;
  
  // Construction du tableau de dates indisponibles
  const disable = CONFIG.unavailableDates || [];
  
  const baseConfig = {
    locale: 'fr',
    dateFormat: 'd/m/Y',
    minDate: 'today',
    disable: disable,
    showMonths: window.innerWidth > 768 ? 2 : 1,
    monthSelectorType: 'static'
  };
  
  const arrivalPicker = flatpickr('#arrival', {
    ...baseConfig,
    onChange: function(selectedDates, dateStr) {
      if (selectedDates[0]) {
        const minDeparture = new Date(selectedDates[0]);
        minDeparture.setDate(minDeparture.getDate() + 1);
        departurePicker.set('minDate', minDeparture);
      }
    }
  });
  
  const departurePicker = flatpickr('#departure', {
    ...baseConfig
  });
});

// ====================================================
//  FORMULAIRE — Envoi via EmailJS
// ====================================================
const form = document.getElementById('bookingForm');
const formStatus = document.getElementById('formStatus');

// Initialise EmailJS
if (typeof emailjs !== 'undefined' && CONFIG.emailjs.publicKey !== 'TON_PUBLIC_KEY') {
  emailjs.init({ publicKey: CONFIG.emailjs.publicKey });
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const submit = form.querySelector('.form-submit');
  const originalText = submit.querySelector('span').textContent;
  
  // Validation simple
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
  
  // Si EmailJS est configuré, on envoie
  if (CONFIG.emailjs.publicKey !== 'TON_PUBLIC_KEY' && typeof emailjs !== 'undefined') {
    try {
      await emailjs.send(CONFIG.emailjs.serviceId, CONFIG.emailjs.templateId, {
        arrival,
        departure,
        guests,
        name,
        email,
        phone: phone || 'Non renseigné',
        message: message || 'Pas de message',
        to_email: CONFIG.email
      });
      
      formStatus.className = 'form-status success';
      formStatus.textContent = currentLang === 'fr' 
        ? '✓ Demande envoyée ! Nous revenons vers vous sous 24h.' 
        : '✓ Request sent! We\'ll get back to you within 24h.';
      form.reset();
    } catch (err) {
      console.error('EmailJS error:', err);
      formStatus.className = 'form-status error';
      formStatus.textContent = currentLang === 'fr' 
        ? 'Erreur lors de l\'envoi. Contactez-nous directement par email ou WhatsApp.' 
        : 'Error sending request. Please contact us directly by email or WhatsApp.';
    }
  } else {
    // Fallback : ouvre le client mail avec les infos pré-remplies
    const subject = `Demande de réservation — ${name}`;
    const body = `Bonjour,

Je souhaite réserver les Chalets de la Grande Ourse :

• Arrivée : ${arrival}
• Départ : ${departure}
• Nombre de voyageurs : ${guests}

Mes coordonnées :
• Nom : ${name}
• Email : ${email}
• Téléphone : ${phone || 'Non renseigné'}

Message :
${message || '(aucun)'}

Cordialement,
${name}`;
    
    const mailtoLink = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
    
    formStatus.className = 'form-status success';
    formStatus.textContent = currentLang === 'fr' 
      ? '✓ Votre client mail va s\'ouvrir avec votre demande pré-remplie.' 
      : '✓ Your email client will open with your pre-filled request.';
  }
  
  submit.disabled = false;
  submit.querySelector('span').textContent = originalText;
});
