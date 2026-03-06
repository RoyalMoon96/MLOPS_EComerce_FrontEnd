# E-Commerce Frontend

Frontend for the microservices e-commerce project built with a SPA architecture.

## Tech Stack

* HTML
* JavaScript (Vanilla)
* Bootstrap
* Vite
* AWS S3 (static hosting)
* CloudFront (CDN)
* GitHub Actions (CI/CD)

---

# Project Structure

```
src/
  components/   # reusable UI components
  pages/        # application pages
  services/     # API calls
  router/       # SPA router
  styles/       # global styles
```

---

# Run Locally

Install dependencies:

```
npm install
```

Run development server:

```
npm run dev
```

Build project:

```
npm run build
```

---

# Environment Variables

Create a `.env` file:

```
VITE_API_URL=https://api.mybackend.com
VITE_USE_MOCK=true
VITE_ROUTE_PRODUCTS=/products
VITE_ROUTE_ORDERS=/orders
```

---

# Branch Strategy

```
feature/*  →  dev  →  main
```

* `feature/*` → development branches
* `dev` → integration branch
* `main` → production (protected)

---

# Deployment

The application is automatically deployed using **GitHub Actions**.

Pipeline flow:

```
GitHub → Build (Vite) → Deploy → AWS S3 → CloudFront
```
