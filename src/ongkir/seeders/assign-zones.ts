import { DataSource } from 'typeorm';

// Mapping provinsi ke zona
const provinceToZone = {
  // Zona 1: Jawa & Bali
  'DKI Jakarta': 1,
  'Jawa Barat': 1,
  'Jawa Tengah': 1,
  'DI Yogyakarta': 1,
  'Jawa Timur': 1,
  'Banten': 1,
  'Bali': 1,
  
  // Zona 2: Sumatera
  'Aceh': 2,
  'Sumatera Utara': 2,
  'Sumatera Barat': 2,
  'Riau': 2,
  'Jambi': 2,
  'Sumatera Selatan': 2,
  'Bengkulu': 2,
  'Lampung': 2,
  'Kepulauan Bangka Belitung': 2,
  'Kepulauan Riau': 2,
  
  // Zona 3: Kalimantan
  'Kalimantan Barat': 3,
  'Kalimantan Tengah': 3,
  'Kalimantan Selatan': 3,
  'Kalimantan Timur': 3,
  'Kalimantan Utara': 3,
  
  // Zona 4: Sulawesi & Nusa Tenggara
  'Sulawesi Utara': 4,
  'Sulawesi Tengah': 4,
  'Sulawesi Selatan': 4,
  'Sulawesi Tenggara': 4,
  'Gorontalo': 4,
  'Sulawesi Barat': 4,
  'Nusa Tenggara Barat': 4,
  'Nusa Tenggara Timur': 4,
  
  // Zona 5: Maluku & Papua
  'Maluku': 5,
  'Maluku Utara': 5,
  'Papua': 5,
  'Papua Barat': 5,
  'Papua Tengah': 5,
  'Papua Pegunungan': 5,
  'Papua Selatan': 5,
  'Papua Barat Daya': 5,
};

export async function assignZonesToCities(dataSource: DataSource) {
  console.log('🌍 Assigning zones to cities...');
  
  try {
    // Update setiap kota dengan zona berdasarkan provinsinya
    for (const [province, zone] of Object.entries(provinceToZone)) {
      const result = await dataSource.query(
        'UPDATE ongkir_cities SET zone = $1 WHERE province = $2',
        [zone, province]
      );
      console.log(`   ✓ Updated ${province} to Zone ${zone}`);
    }
    
    // Check cities without zones
    const unzoned = await dataSource.query(
      'SELECT DISTINCT province FROM ongkir_cities WHERE zone IS NULL'
    );
    
    if (unzoned.length > 0) {
      console.log('\n⚠️  Provinces without zones:');
      unzoned.forEach((row: any) => {
        console.log(`   - ${row.province}`);
      });
    }
    
    console.log('\n✅ Zone assignment completed!');
  } catch (error) {
    console.error('❌ Error assigning zones:', error);
    throw error;
  }
}

