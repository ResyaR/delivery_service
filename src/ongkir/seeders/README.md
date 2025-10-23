# 🗺️ Seeder Kota & Kabupaten Indonesia

## 📊 Data Overview

### Data Seeder Dasar (98 Kota)
File: `cities.seeder.ts`
- **Total**: 98 Kota
- **Coverage**: Semua kota di Indonesia
- **Use case**: Testing, development awal

### Data Seeder Lengkap (300+ Kota + Kabupaten)
File: `complete-cities.seeder.ts`
- **Total**: ~300+ wilayah
- **Kota**: ~98
- **Kabupaten**: ~200+
- **Provinsi**: 34
- **Use case**: Production, data lengkap

## 📋 Detail Coverage

### Indonesia Wilayah
| Region | Provinsi | Kota | Kabupaten | Total |
|--------|----------|------|-----------|-------|
| **Sumatera** | 10 | 28 | 100+ | 128+ |
| **Jawa** | 6 | 30 | 100+ | 130+ |
| **Kalimantan** | 5 | 10 | 40+ | 50+ |
| **Sulawesi** | 6 | 14 | 60+ | 74+ |
| **Bali & Nusa Tenggara** | 3 | 4 | 30+ | 34+ |
| **Maluku & Papua** | 4 | 6 | 50+ | 56+ |
| **TOTAL** | **34** | **~98** | **~400** | **~500** |

## 🚀 Cara Menggunakan

### 1. Seed Kota Saja (98 kota)
```bash
npm run seed:cities
```

### 2. Seed LENGKAP (Kota + Kabupaten)
```bash
npm run seed:cities:complete
```
⚠️ **Recommended untuk production!**

### 3. Seed Semua (Cities + Services)
```bash
npm run seed:all
```

## 📍 Struktur Data

### Format Data
```typescript
{
  province: string;      // e.g., "DKI Jakarta"
  name: string;          // e.g., "Jakarta Selatan"
  type: 'Kota' | 'Kabupaten';
  postalCode: string;    // e.g., "12000"
  multiplier: number;    // e.g., 1.0 (faktor pengali ongkir)
}
```

### Multiplier Logic
Multiplier adalah faktor pengali untuk menghitung tarif ongkir:
- **Jakarta (1.0)**: Base rate tanpa pengali
- **Bandung (1.2)**: 20% lebih mahal dari Jakarta
- **Papua (3.5)**: 3.5x lebih mahal dari Jakarta

Rumus:
```
Total Ongkir = Base Rate × Weight × Service Multiplier × City Multiplier
```

## 🗺️ Sample Data per Provinsi

### Jawa (LENGKAP)
- ✅ **DKI Jakarta**: 5 Kota + 1 Kabupaten
- ✅ **Banten**: 4 Kota + 4 Kabupaten
- ✅ **Jawa Barat**: 9 Kota + 18 Kabupaten
- ✅ **Jawa Tengah**: 6 Kota + 29 Kabupaten
- ✅ **DI Yogyakarta**: 1 Kota + 4 Kabupaten
- ✅ **Jawa Timur**: 9 Kota + 29 Kabupaten

### Sumatera (LENGKAP)
- ✅ **Aceh**: 5 Kota + 18 Kabupaten
- ✅ **Sumatera Utara**: 8 Kota + 25 Kabupaten
- ✅ **Sumatera Barat**: 7 Kota + 12 Kabupaten
- ✅ **Riau**: 2 Kota + 10 Kabupaten
- ✅ **Kepulauan Riau**: 2 Kota + 5 Kabupaten
- ✅ **Jambi**: 2 Kota + 9 Kabupaten
- ✅ **Sumatera Selatan**: 4 Kota + 13 Kabupaten
- ✅ **Bangka Belitung**: 1 Kota + 6 Kabupaten
- ✅ **Bengkulu**: 1 Kota + 9 Kabupaten
- ✅ **Lampung**: 2 Kota + 13 Kabupaten

### Kalimantan (Sample)
- ✅ **Kalimantan Barat**: 2 Kota + 12 Kabupaten
- ✅ **Kalimantan Tengah**: 1 Kota + 13 Kabupaten
- ✅ **Kalimantan Selatan**: 2 Kota + 11 Kabupaten
- ✅ **Kalimantan Timur**: 4 Kota + 6 Kabupaten
- ✅ **Kalimantan Utara**: 2 Kota + 3 Kabupaten

### Sulawesi (Sample)
- ✅ **Sulawesi Utara**: 4 Kota + 11 Kabupaten
- ✅ **Sulawesi Tengah**: 1 Kota + 12 Kabupaten
- ✅ **Sulawesi Selatan**: 3 Kota + 21 Kabupaten
- ✅ **Sulawesi Tenggara**: 2 Kota + 15 Kabupaten
- ✅ **Gorontalo**: 1 Kota + 5 Kabupaten
- ✅ **Sulawesi Barat**: 0 Kota + 6 Kabupaten

### Bali & Nusa Tenggara
- ✅ **Bali**: 1 Kota + 8 Kabupaten
- ✅ **Nusa Tenggara Barat**: 2 Kota + 8 Kabupaten
- ✅ **Nusa Tenggara Timur**: 1 Kota + 21 Kabupaten

### Maluku & Papua
- ✅ **Maluku**: 2 Kota + 9 Kabupaten
- ✅ **Maluku Utara**: 2 Kota + 8 Kabupaten
- ✅ **Papua**: 1 Kota + 28 Kabupaten
- ✅ **Papua Barat**: 1 Kota + 12 Kabupaten

## ⚙️ Database Schema

```sql
CREATE TABLE ongkir_cities (
  id SERIAL PRIMARY KEY,
  province VARCHAR(100) NOT NULL,
  name VARCHAR(100) NOT NULL,
  type VARCHAR(20) NOT NULL,  -- 'Kota' or 'Kabupaten'
  postal_code VARCHAR(10),
  multiplier DECIMAL(5,2) NOT NULL DEFAULT 1.0,
  status VARCHAR(20) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 📝 Notes

1. **Data Source**: Data dikumpulkan dari berbagai sumber resmi
2. **Postal Codes**: Beberapa kode pos mungkin perlu diupdate
3. **Multipliers**: Disesuaikan berdasarkan jarak dan aksesibilitas
4. **Updates**: Data dapat di-update sesuai kebutuhan

## 🔄 Update Data

Untuk menambah atau update data:

1. Edit file `complete-cities.seeder.ts`
2. Jalankan seeder ulang:
```bash
npm run seed:cities:complete
```

## 📞 Support

Jika ada pertanyaan atau menemukan data yang kurang akurat, silakan hubungi tim development.

---

**Last Updated**: October 2025  
**Version**: 2.0 (Complete Cities & Kabupaten)
