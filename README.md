# Delivery Service API

API backend profesional berbasis NestJS, PostgreSQL, JWT Auth, dan dokumentasi Swagger. Cocok untuk aplikasi mobile (Android Studio) maupun web.

## Fitur Utama
- Register user
- Login user (JWT access token & refresh token)
- Refresh token (dapatkan access token baru)
- Proteksi endpoint dengan JWT
- Dokumentasi Swagger di `/docs`

## Struktur Folder
```
src/
  app.module.ts
  main.ts
  swagger.ts
  auth/
    auth.module.ts
    auth.controller.ts
    auth.service.ts
  users/
    user.module.ts
    user.controller.ts
    user.service.ts
    user.entity.ts
```

## Konfigurasi Environment
Buat file `.env` di folder `backend/`:
```
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=yourpassword
DB_DATABASE=delivery_service
```

## Menjalankan Project
1. Install dependencies:
   ```
   npm install
   ```
2. Jalankan server:
   ```
   npm run start:dev
   ```
3. Buka dokumentasi API di: [http://localhost:3000/docs](http://localhost:3000/docs)

## Contoh Request
### Register
```
POST /auth/register
{
  "username": "userbaru",
  "password": "passwordku"
}
```

### Login
```
POST /auth/login
{
  "username": "userbaru",
  "password": "passwordku"
}
```
Response:
```
{
  "access_token": "...",
  "refresh_token": "...",
  "refresh_token_expires_in": 2592000
}
```

### Refresh Token
```
POST /auth/refresh
{
  "refresh_token": "..."
}
```

## Catatan
- Access token berlaku 15 menit
- Refresh token berlaku 30 hari
- Semua endpoint dapat dicoba langsung di Swagger UI

---

> Dibuat dengan NestJS, TypeORM, PostgreSQL, JWT, dan Swagger
