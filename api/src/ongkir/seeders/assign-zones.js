"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignZonesToCities = assignZonesToCities;
const provinceToZone = {
    'DKI Jakarta': 1,
    'Jawa Barat': 1,
    'Jawa Tengah': 1,
    'DI Yogyakarta': 1,
    'Jawa Timur': 1,
    'Banten': 1,
    'Bali': 1,
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
    'Kalimantan Barat': 3,
    'Kalimantan Tengah': 3,
    'Kalimantan Selatan': 3,
    'Kalimantan Timur': 3,
    'Kalimantan Utara': 3,
    'Sulawesi Utara': 4,
    'Sulawesi Tengah': 4,
    'Sulawesi Selatan': 4,
    'Sulawesi Tenggara': 4,
    'Gorontalo': 4,
    'Sulawesi Barat': 4,
    'Nusa Tenggara Barat': 4,
    'Nusa Tenggara Timur': 4,
    'Maluku': 5,
    'Maluku Utara': 5,
    'Papua': 5,
    'Papua Barat': 5,
    'Papua Tengah': 5,
    'Papua Pegunungan': 5,
    'Papua Selatan': 5,
    'Papua Barat Daya': 5,
};
async function assignZonesToCities(dataSource) {
    console.log('🌍 Assigning zones to cities...');
    try {
        for (const [province, zone] of Object.entries(provinceToZone)) {
            const result = await dataSource.query('UPDATE ongkir_cities SET zone = $1 WHERE province = $2', [zone, province]);
            console.log(`   ✓ Updated ${province} to Zone ${zone}`);
        }
        const unzoned = await dataSource.query('SELECT DISTINCT province FROM ongkir_cities WHERE zone IS NULL');
        if (unzoned.length > 0) {
            console.log('\n⚠️  Provinces without zones:');
            unzoned.forEach((row) => {
                console.log(`   - ${row.province}`);
            });
        }
        console.log('\n✅ Zone assignment completed!');
    }
    catch (error) {
        console.error('❌ Error assigning zones:', error);
        throw error;
    }
}
//# sourceMappingURL=assign-zones.js.map