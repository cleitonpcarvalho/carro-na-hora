# Deploy Checklist — Carro da Hora

## Pre-deploy (do once before anything else)

- [ ] GitHub repo pushed: carro-na-hora (private)
- [ ] Railway account ready at https://railway.app

## Railway Setup Order

### 1. Create New Project
- [ ] Go to railway.app -> New Project
- [ ] Name the project: carro-na-hora

### 2. Add PostgreSQL Database
- [ ] Add Service -> Database -> PostgreSQL
- [ ] Rename service to: carro-na-hora-db
- [ ] Copy the DATABASE_URL or individual DB_* variables

### 3. Deploy Backend
- [ ] Add Service -> GitHub Repo -> carro-na-hora
- [ ] Set Root Directory: backend
- [ ] BEFORE first deploy: add a Volume
  - Mount path: /app/uploads
  - This is CRITICAL — do this before the first deploy
- [ ] Set environment variables in Railway dashboard:
  PORT=3001
  NODE_ENV=production
  DB_HOST= (from PostgreSQL service)
  DB_PORT=5432
  DB_NAME=railway
  DB_USER=postgres
  DB_PASSWORD= (from PostgreSQL service)
  JWT_SECRET= (generate: openssl rand -hex 32)
  JWT_EXPIRES_IN=7d
  UPLOAD_DIR=/app/uploads
  MAX_FILE_SIZE_MB=10
  PUBLIC_URL=https://api.carronahora.com
  CORS_ORIGIN=https://carronahora.com,https://www.carronahora.com,https://admin.carronahora.com,https://api.carronahora.com
  ADMIN_EMAIL=perimetrodeeficacia@gmail.com
  ADMIN_PASSWORD=Carrosdovasco2025@
  RESEND_API_KEY=re_f1KJXw8F_DkGm8dM1941NH81XKg3S7mwE
  RESEND_TO_EMAIL=perimetrodeeficacia@gmail.com
- [ ] Deploy backend
- [ ] Test: GET https://api.carronahora.com/api/health -> {"status":"ok"}

### 4. Run Database Migration
- [ ] POST https://api.carronahora.com/api/auth/setup
  (creates first admin user — only works once)
- [ ] Verify: POST https://api.carronahora.com/api/auth/login
  with credentials -> returns token

### 5. Migrate Vehicle Images to Production
- [ ] Update /backend/src/db/import_vehicles.js:
  Change: const API_BASE = 'http://localhost:3001'
  To:     const API_BASE = 'https://api.carronahora.com'
- [ ] Run: node backend/src/db/import_vehicles.js
- [ ] Verify: GET https://api.carronahora.com/api/vehicles -> 10 vehicles with images

### 6. Deploy Frontend Panel
- [ ] Add Service -> GitHub Repo -> carro-na-hora
- [ ] Set Root Directory: frontend
- [ ] Set environment variables:
  VITE_API_URL=https://api.carronahora.com
  VITE_SITE_URL=https://carronahora.com
- [ ] Deploy
- [ ] Test login at https://admin.carronahora.com

### 7. Deploy Public Site
- [ ] Add Service -> GitHub Repo -> carro-na-hora
- [ ] Set Root Directory: site
- [ ] Set environment variables:
  VITE_ADMIN_API_BASE=https://api.carronahora.com
- [ ] Deploy
- [ ] Test: https://carronahora.com loads with vehicles

### 8. Custom Domains
- [ ] Backend service -> Settings -> Custom Domain: api.carronahora.com
- [ ] Frontend service -> Settings -> Custom Domain: admin.carronahora.com
- [ ] Site service -> Settings -> Custom Domain: carronahora.com
- [ ] Add CNAME records at your DNS provider pointing to Railway domains
- [ ] Wait for SSL certificates (usually 2-5 minutes)

### 9. Post-deploy verification
- [ ] https://carronahora.com loads correctly
- [ ] https://carronahora.com/viaturas shows all 10 vehicles with images
- [ ] https://admin.carronahora.com login works
- [ ] Vehicle creation/edit works in admin panel
- [ ] Contact form sends email via Resend
- [ ] WhatsApp button links work
- [ ] All pages accessible: /, /viaturas, /sobre, /contacto,
      /politica-de-privacidade, /termos-de-uso
- [ ] Update CORS_ORIGIN in Railway backend to include final domains
- [ ] Redeploy backend after CORS update

## Important Notes

NEVER commit .env files to git.
In production all variables are set in Railway dashboard only.

The Volume at /app/uploads must exist before the first backend deploy.
If you deploy without it, images will be lost on every redeploy.

After re-seeding the database in production, run:
POST /api/settings/fix-media-urls (with Bearer token)
to fix any localhost URLs that may have been inserted.
