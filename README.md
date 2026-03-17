# Prime Optic

An optical shop e-commerce web app. Customers can browse prescription glasses and sunglasses, build custom pairs with their prescription, book eye exam appointments at physical locations, and place orders online. An admin panel handles products, orders, appointments, and store locations.

---

## Features

### Storefront

- **Home page** — Hero banner, trust highlights (500+ frames, free eye exam, free shipping, 30-day returns), best sellers, shop-by-brand, offers, and category sections
- **Glasses & Sunglasses catalogs** — Filter by gender, frame shape, and material; sort and paginate results
- **Brand catalog** — Dedicated pages for Ray-Ban, Police, Tom Ford, Gucci, Chanel, Cartier, Prada, and Tommy Hilfiger
- **Product detail** — Image slider, color & lens options, full specs & dimensions, blue-light filter add-on, related products, and star ratings
- **Custom Glasses Builder** — Choose a frame, pick a lens type (single vision, progressive, bifocal, high-index, photochromic, anti-reflective), enter your prescription (SPH/CYL/AXIS/ADD per eye), and optionally add a blue-light filter
- **Cart** — Variant-aware (color + blue-light filter), quantity management
- **Checkout** — 3-step flow: contact details → delivery method (store pickup or home delivery) → order confirmation; cash-on-delivery
- **Favorites** — Persistent wishlist
- **Eye Exam Booking** — Book an appointment at any of the five Tirana stores; no account required
- **Post-order Reviews** — Rate purchased items (1–5 stars) after delivery
- **User Profile** — View order history and appointment history

### Admin Panel (role-protected)

- **Product management** — Full CRUD for glasses and sunglasses, with per-store stock levels, media URLs, and flags (new, bestseller, blue-light ready)
- **Order management** — View all orders and move them through the status pipeline: pending → confirmed → preparing → shipped → delivered / cancelled
- **Appointment management** — View all eye exam bookings; accept or decline
- **Sales dashboard** — Revenue and order charts (Recharts) with a time-range selector
- **Store locations** — CRUD for physical store entries

### Internationalisation & Currency

- **Languages:** English, Albanian (Shqip), Italian — persisted to `localStorage`
- **Currencies:** EUR (default), USD, Albanian Lek (ALL) — live rates pulled from ExchangeRate-API (base: EUR) and cached client-side, preference persisted to `localStorage`

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite 7 |
| Routing | React Router 7 |
| Styling | Tailwind CSS 3 + custom design tokens |
| Animations | Framer Motion 12 |
| State management | Zustand 5 |
| Backend / DB | Firebase 11 (Auth, Firestore, Storage) |
| Charts | Recharts 3 |

---

## Getting Started

### Prerequisites

- Node.js 18 or later
- A Firebase project with **Authentication** (Email/Password + Google), **Firestore**, and **Storage** enabled

### 1. Clone & install

```bash
git clone https://github.com/your-org/prime-optic.git
cd prime-optic
npm install
```

### 2. Configure environment variables

Copy the example file and fill in your Firebase credentials:

```bash
cp .env.example .env
```

```env
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

# Exchange rates (ExchangeRate-API)
VITE_EXCHANGE_RATES_API_KEY=...

# Optional — social links (fall back to "primeoptic" handles if omitted)
VITE_INSTAGRAM_URL=https://instagram.com/primeoptic
VITE_TIKTOK_URL=https://tiktok.com/@primeoptic
VITE_FACEBOOK_URL=https://facebook.com/primeoptic
```

### 3. Deploy Firestore security rules

```bash
firebase deploy --only firestore:rules
```

### 4. Run the development server

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### 5. Build for production

```bash
npm run build      # type-check + bundle
npm run preview    # serve the production build locally
```

---

## Firestore Data Model

| Collection | Access |
|---|---|
| `products` | Public read; admin write; authenticated users can update rating fields |
| `reviews` | Public read; authenticated users can create (linked to their `userId`) |
| `appointments` | Anyone can create (guest booking); owner + admin read; admin update/delete |
| `orders` | Anyone can create (guest checkout); owner + admin read; admin update/delete |
| `users` | Users manage their own document; only admins can update roles |
| `stores` | Public read; admin write |

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Type-check and bundle for production |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | Run ESLint |

---

## Granting Admin Access

Admin access is controlled by the `role` field on a user's Firestore document (`users/{uid}`). Set `role: "admin"` on the document to grant admin privileges to a user.
