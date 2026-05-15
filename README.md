# 🏔️ Chalets de la Grande Ourse — Site officiel

Site vitrine premium pour la location du chalet d'exception à La Plagne Montalbert.

---

## 📋 CONFIGURATION RAPIDE (5 minutes)

Toutes les valeurs à personnaliser sont dans **`script.js`** tout en haut du fichier, dans l'objet `CONFIG`.

### 1. Email et WhatsApp

Ouvre `script.js` et remplace les 3 valeurs suivantes :

```javascript
email: 'contact@exemple.com',                   // ← ton email
whatsapp: '33612345678',                        // ← ton numéro SANS le +
whatsappDisplay: '+33 6 12 34 56 78',           // ← affichage joli
```

### 2. EmailJS (pour recevoir les demandes par mail)

EmailJS permet d'envoyer les demandes du formulaire directement dans ta boîte mail, **sans avoir de serveur** (gratuit jusqu'à 200 emails/mois, largement suffisant).

**Étapes** :

1. Va sur [https://www.emailjs.com](https://www.emailjs.com) et crée un compte gratuit
2. Dans **Email Services**, ajoute ton service email (Gmail, Outlook, etc.) → tu obtiens un `Service ID`
3. Dans **Email Templates**, crée un nouveau template avec ces variables :
   - `{{name}}` — Nom du client
   - `{{email}}` — Email du client
   - `{{phone}}` — Téléphone
   - `{{arrival}}` — Date d'arrivée
   - `{{departure}}` — Date de départ
   - `{{guests}}` — Nombre de voyageurs
   - `{{message}}` — Message du client
   - `{{to_email}}` — Ton email
   
   Tu peux faire un template du style :
   ```
   Objet : Nouvelle demande de réservation — {{name}}
   
   Nouvelle demande reçue depuis le site :
   
   Nom : {{name}}
   Email : {{email}}
   Téléphone : {{phone}}
   
   Dates : du {{arrival}} au {{departure}}
   Voyageurs : {{guests}}
   
   Message :
   {{message}}
   ```
   
   → tu obtiens un `Template ID`

4. Dans **Account → General**, récupère ta `Public Key`

5. Remplace dans `script.js` :

```javascript
emailjs: {
  publicKey: 'xxxxxxxxxxxxxxxxx',
  serviceId: 'service_xxxxxxxx',
  templateId: 'template_xxxxxxxx'
}
```

**Note** : Tant que tu n'as pas configuré EmailJS, le formulaire fonctionne quand même via un fallback `mailto:` qui ouvre le client mail du visiteur avec sa demande pré-remplie.

### 3. Dates indisponibles

Pour bloquer des dates dans le calendrier (séjours déjà réservés), édite la liste dans `script.js` :

```javascript
unavailableDates: [
  { from: '2026-12-20', to: '2027-01-03' },   // Vacances de Noël
  { from: '2027-02-07', to: '2027-02-14' },   // Vacances de février
  '2027-03-15',                                // Date unique
]
```

---

## 🚀 DÉPLOIEMENT SUR GITHUB PAGES

1. Crée un nouveau repo sur GitHub (ex: `chalets-grande-ourse`)
2. Upload tous les fichiers (HTML, CSS, JS, dossier images)
3. **Settings → Pages** → Branch : `main` → Folder : `/ (root)` → Save
4. Le site sera en ligne sous quelques minutes à l'adresse :
   `https://ton-username.github.io/chalets-grande-ourse/`

### Nom de domaine personnalisé (optionnel mais recommandé)

Pour un site premium, je te conseille fortement un domaine personnalisé du type :
- `chaletsdelagrandeourse.com`
- `grandeourse-laplagne.com`

→ Achète chez Namecheap, OVH ou Cloudflare (~10€/an)
→ Dans GitHub Pages, **Custom domain** → renseigne ton domaine
→ Chez ton registrar, ajoute un enregistrement CNAME pointant vers `ton-username.github.io`

---

## 📸 GESTION DES PHOTOS

Toutes les photos sont dans le dossier `images/`. Pour les remplacer :

1. Garde les **mêmes noms de fichiers** pour ne rien casser
2. Format recommandé : **JPG**, qualité 80%, largeur 1800px max (équilibre qualité/poids)
3. Tu peux compresser tes photos sur [https://squoosh.app](https://squoosh.app) avant upload

Pour ajouter de nouvelles photos à la galerie :
- Ajoute le fichier dans `images/`
- Dans `index.html`, copie une `<div class="swiper-slide">` et ajuste le `src` et le `alt`

---

## ✏️ MODIFIER LES TEXTES

Tous les textes bilingues utilisent l'attribut `data-fr` et `data-en` :

```html
<span data-fr="Salle à manger" data-en="Dining room">Salle à manger</span>
```

Pour modifier un texte, change **les deux versions** (FR et EN) ainsi que le texte affiché par défaut.

---

## 💰 MODIFIER LES TARIFS

Dans `index.html`, cherche la section **PRICING**. Tu peux ajuster :
- Le prix "à partir de" dans le titre de section
- Les trois cartes (basse saison / haute saison / été)
- Pour ajouter une 4ème période, copie un `<div class="price-card">` et ajuste `.pricing-grid { grid-template-columns: repeat(4, 1fr); }` dans `style.css`

---

## 🎨 PERSONNALISATION VISUELLE

Toutes les couleurs sont en haut de `style.css` dans `:root`. Les principales :

- `--c-bg: #f6f2eb` — fond principal (lin)
- `--c-ink: #1a1814` — texte foncé
- `--c-accent: #b8763e` — cuivre brossé (couleur d'accent)

---

## 📦 STACK TECHNIQUE

- **GSAP + ScrollTrigger** — animations cinématiques
- **Lenis** — smooth scroll
- **Swiper.js** — galerie photo
- **Flatpickr** — calendrier de réservation (en FR)
- **EmailJS** — envoi de mail sans backend
- **Lucide Icons** — pictogrammes
- **Fraunces + Inter Tight** — typographie éditoriale

Tout est en **CDN**, aucune installation requise. Le site fonctionne sur n'importe quel hébergement statique (GitHub Pages, Netlify, Vercel, OVH, etc.).

---

## 🤝 SUPPORT

Pour toute modification ou évolution du site, n'hésite pas à demander.
