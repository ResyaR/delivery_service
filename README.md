# Delivery Service API

API backend berbasis NestJS, PostgreSQL, JWT Auth, dan dokumentasi Swagger.


## Fitur Utama
- Register & login user (JWT access & refresh token, pakai email)
- Refresh token (dapatkan access token baru)
- Proteksi endpoint dengan JWT
- Manajemen profil user (GET/PUT profile, avatar upload)
- Delivery API: kirim sekarang, jadwal pengantaran, titip beli (proxy shopping)
- Dokumentasi Swagger di `/docs`, response error lengkap


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
  delivery/             # Modul delivery (fitur logistik)
    delivery.module.ts      # Module delivery
    delivery.controller.ts  # Controller endpoint delivery
    delivery.service.ts     # Service logic delivery
    dto/                    # DTO delivery (create, response, enum)
      create-delivery.dto.ts
      delivery-type.enum.ts
      delivery-response.dto.ts
  users/                # Modul user/profile
    user.module.ts          # Module untuk user
    user.controller.ts      # Controller user (profile, avatar)
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
3. Buka dokumentasi API di: [http://217.138.219.221:33370/docs/#/](http://217.138.219.221:33370/docs/#/)

## Contoh Request

## Contoh Request
### Register
```
POST /auth/register
{
  "email": "user@email.com",
  "password": "passwordku"
}
```

### Login
```
POST /auth/login
{
  "email": "user@email.com",
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

### Kirim Sekarang
```
POST /delivery/kirim-sekarang
{
  "pickupLocation": "Jl. Merdeka No.1",
  "dropoffLocation": "Jl. Sudirman No.2",
  "barang": { "itemName": "Dokumen", "scale": "Ringan" },
  "type": "KIRIM_SEKARANG"
}
```

### Jadwal Pengantaran
```
POST /delivery/jadwal
{
  "pickupLocation": "Jl. Merdeka No.1",
  "dropoffLocation": "Jl. Sudirman No.2",
  "barang": { "itemName": "Paket", "scale": "Sedang" },
  "jadwal": "2025-07-08T10:00:00Z",
  "type": "JADWAL"
}
```

### Titip Beli
```
POST /delivery/titip-beli
{
  "pickupLocation": "Toko Indomaret",
  "dropoffLocation": "Jl. Sudirman No.2",
  "titipDeskripsi": "Beli 2 botol air mineral dan 1 snack",
  "type": "TITIP_BELI"
}
```

## Catatan
- Access token berlaku 15 menit
- Refresh token berlaku 30 hari
- Semua endpoint dapat dicoba langsung di Swagger UI

---

> Dibuat dengan NestJS, TypeORM, PostgreSQL, JWT, dan Swagger
