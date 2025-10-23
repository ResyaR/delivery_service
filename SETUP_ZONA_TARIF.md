# Setup Sistem Zona Tarif

Sistem zona tarif menggantikan perhitungan dengan multiplier per kota menjadi **tarif tetap antar zona** (seperti JNE/J&T).

## 🗺️ Sistem Zona

Indonesia dibagi menjadi **5 zona**:

| Zona | Wilayah | Provinsi |
|------|---------|----------|
| **1** | Jawa & Bali | DKI Jakarta, Jawa Barat, Jawa Tengah, DI Yogyakarta, Jawa Timur, Banten, Bali |
| **2** | Sumatera | Aceh, Sumatera Utara, Sumatera Barat, Riau, Jambi, Sumatera Selatan, Bengkulu, Lampung, Kepulauan Bangka Belitung, Kepulauan Riau |
| **3** | Kalimantan | Kalimantan Barat, Kalimantan Tengah, Kalimantan Selatan, Kalimantan Timur, Kalimantan Utara |
| **4** | Sulawesi & Nusa Tenggara | Sulawesi Utara, Sulawesi Tengah, Sulawesi Selatan, Sulawesi Tenggara, Gorontalo, Sulawesi Barat, Nusa Tenggara Barat, Nusa Tenggara Timur |
| **5** | Maluku & Papua | Maluku, Maluku Utara, Papua, Papua Barat, Papua Tengah, Papua Pegunungan, Papua Selatan, Papua Barat Daya |

## 📊 Contoh Tarif Antar Zona (per kg)

| Dari → Ke | Zona 1 | Zona 2 | Zona 3 | Zona 4 | Zona 5 |
|-----------|--------|--------|--------|--------|--------|
| **Zona 1** | Rp 8.000 | Rp 12.000 | Rp 15.000 | Rp 18.000 | Rp 30.000 |
| **Zona 2** | Rp 12.000 | Rp 10.000 | Rp 17.000 | Rp 20.000 | Rp 32.000 |
| **Zona 3** | Rp 15.000 | Rp 17.000 | Rp 12.000 | Rp 18.000 | Rp 28.000 |
| **Zona 4** | Rp 18.000 | Rp 20.000 | Rp 18.000 | Rp 14.000 | Rp 25.000 |
| **Zona 5** | Rp 30.000 | Rp 32.000 | Rp 28.000 | Rp 25.000 | Rp 20.000 |

*Note: Tarif di atas untuk layanan REGULER. Ekonomis 25% lebih murah, Express 50% lebih mahal.*

---

## 🚀 Langkah-Langkah Setup

### 1. Jalankan Migration
Migration akan:
- Menambah kolom `zone` di tabel `ongkir_cities`
- Menambah kolom `rate_per_km` di tabel `ongkir_services`
- Membuat tabel `ongkir_zone_tariffs` dengan 75 kombinasi tarif (5 zona × 5 zona × 3 layanan)

```bash
cd backend
npm run migration:run
```

### 2. Assign Zona ke Semua Kota
Script ini akan otomatis assign zona ke setiap kota berdasarkan provinsinya:

```bash
npm run assign:zones
```

**Output yang diharapkan:**
```
🔌 Connecting to database...
✅ Connected!

🌍 Assigning zones to cities...
   ✓ Updated DKI Jakarta to Zone 1
   ✓ Updated Jawa Barat to Zone 1
   ✓ Updated Jawa Tengah to Zone 1
   ...
   ✓ Updated Papua to Zone 5

✅ Zone assignment completed!
👋 Done!
```

### 3. Verifikasi Database
Cek apakah zona sudah ter-assign:

```sql
-- Cek distribusi zona
SELECT zone, COUNT(*) as total_cities 
FROM ongkir_cities 
GROUP BY zone 
ORDER BY zone;

-- Cek kota tanpa zona (harus 0)
SELECT COUNT(*) FROM ongkir_cities WHERE zone IS NULL;

-- Cek tarif zona (harus 75 rows)
SELECT COUNT(*) FROM ongkir_zone_tariffs;
```

### 4. Test Calculator
Buka admin panel → Cek Ongkir:
1. Pilih kota asal (contoh: Jakarta)
2. Pilih kota tujuan (contoh: Palembang)
3. Input berat: 1 kg
4. Pilih layanan: Ekonomis
5. Klik "Cek Ongkir"

**Hasil yang diharapkan:**
```
Estimasi Biaya Pengiriman: Rp 6.840

Asal: Ponorogo, Jawa Timur [Zona 1]
Tujuan: Palembang, Sumatera Selatan [Zona 2]
Tarif Zona: Rp 9.000 (Zona 1 → Zona 2, Ekonomis)
Berat: 1 kg
Subtotal: Rp 9.000
Faktor Layanan: 0.8x (Ekonomis lebih murah)
Total: Rp 6.840
```

---

## 🔧 Troubleshooting

### Error: "City zone not configured"
**Solusi:** Jalankan `npm run assign:zones` lagi

### Error: "Zone tariff not found"
**Solusi:** 
1. Cek apakah migration sudah dijalankan: `npm run migration:run`
2. Cek database: `SELECT COUNT(*) FROM ongkir_zone_tariffs;` (harus 75)

### Frontend masih pakai formula lama
**Solusi:** 
- Frontend sudah diupdate untuk pakai API `/ongkir/calculate-zone`
- Clear cache browser atau hard refresh (Ctrl+Shift+R)

---

## 📝 Formula Perhitungan

### Sistem Lama (Multiplier):
```
Total = (Base Rate × Berat) × Multiplier Asal × Multiplier Tujuan × Multiplier Layanan
```

### Sistem Baru (Zona):
```
Total = (Tarif Zona per kg × Berat) × Multiplier Layanan
```

**Keuntungan Sistem Zona:**
✅ Lebih akurat (seperti JNE/J&T)
✅ Tarif tetap, tidak bergantung formula
✅ Mudah dikelola (75 kombinasi vs ribuan kombinasi kota)
✅ Transparan untuk customer

---

## 🎯 Next Steps (Opsional)

1. **Customize Tarif Zona:**
   Edit langsung di database tabel `ongkir_zone_tariffs`

2. **Tambah Layanan Baru:**
   Jangan lupa tambahkan tarif zona untuk layanan baru di `ongkir_zone_tariffs`

3. **Override Tarif untuk Rute Spesifik:**
   Bisa bikin tabel `ongkir_city_tariffs` untuk tarif khusus antar kota tertentu

---

## 📞 Support

Jika ada masalah, cek:
1. Log backend: `npm run start:dev`
2. Console browser (F12)
3. Database query langsung

