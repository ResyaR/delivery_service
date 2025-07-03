# Delivery Service API

API backend berbasis NestJS, PostgreSQL, JWT Auth, dan dokumentasi Swagger.

## Fitur Utama
- Register user
- Login user (JWT access token & refresh token)
- Refresh token (dapatkan access token baru)
- Proteksi endpoint dengan JWT
- Dokumentasi Swagger di `/docs`


## Struktur Folder & Penjelasan

```
src/
  app.module.ts         # Root module aplikasi
  main.ts               # Entry point aplikasi NestJS
  swagger.ts            # Konfigurasi Swagger (dokumentasi API)
  app.controller.ts     # (Opsional) Controller utama (umumnya untuk health check)
  app.service.ts        # (Opsional) Service utama
  auth/                 # Modul autentikasi (register, login, refresh, logout, proteksi JWT)
    auth.module.ts         # Module untuk auth
    auth.controller.ts     # Controller endpoint auth
    auth.service.ts        # Service logic auth
    jwt-auth.guard.ts      # Guard untuk proteksi endpoint dengan JWT
    jwt.strategy.ts        # Strategy validasi JWT
  users/                # Modul user/profile
    user.module.ts          # Module untuk user
    user.controller.ts      # (Sudah tidak digunakan, bisa dihapus)
    user.service.ts         # Service logic user
    user.entity.ts          # Entity user (mapping ke database)
    dto/                    # Data Transfer Object (validasi input user)
      update-profile.dto.ts   # DTO untuk update profil user
      update-avatar.dto.ts    # DTO untuk update avatar user
```

### Penjelasan Tiap Folder/File

- **auth/**: Semua logic terkait autentikasi, otorisasi, dan proteksi endpoint. Termasuk login, register, refresh token, logout, dan guard JWT.
  - `auth.controller.ts`: Mendefinisikan endpoint terkait auth.
  - `auth.service.ts`: Logic bisnis autentikasi (register, login, validasi user, dsb).
  - `jwt-auth.guard.ts`: Guard untuk proteksi endpoint dengan JWT.
  - `jwt.strategy.ts`: Strategy validasi JWT dan ekstraksi user dari token.

- **users/**: Semua logic terkait user dan profil.
  - `user.service.ts`: Logic bisnis user (get/update profile, dsb).
  - `user.entity.ts`: Entity user untuk mapping ke database.
  - `dto/`: DTO untuk validasi dan struktur data input user.
    - `update-profile.dto.ts`: DTO update profil user.
    - `update-avatar.dto.ts`: DTO update avatar user.

- **app.module.ts**: Root module aplikasi, menggabungkan semua module lain.
- **main.ts**: Entry point aplikasi NestJS.
- **swagger.ts**: Konfigurasi Swagger untuk dokumentasi API.
- **app.controller.ts/app.service.ts**: (Opsional) Controller/service utama, biasanya untuk health check atau endpoint global.

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
