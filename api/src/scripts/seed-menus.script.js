"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const menu_service_1 = require("../menus/menu.service");
async function seedMenus() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const menuService = app.get(menu_service_1.MenuService);
    const menus = [
        { restaurantId: 1, name: 'Mie Gacoan Level 0', description: 'Mie tanpa pedas', price: 15000, image: '/food/mie-ayam-noodles.jpg', category: 'Noodles', availability: true },
        { restaurantId: 1, name: 'Mie Gacoan Level 3', description: 'Mie pedas level menengah', price: 18000, image: '/food/mie-ayam-noodles.jpg', category: 'Noodles', availability: true },
        { restaurantId: 1, name: 'Mie Gacoan Level 5', description: 'Mie pedas level tertinggi', price: 20000, image: '/food/mie-ayam-noodles.jpg', category: 'Noodles', availability: true },
        { restaurantId: 1, name: 'Es Teh Manis', description: 'Teh manis dingin segar', price: 5000, image: '/beverages-drinks.jpg', category: 'Beverages', availability: true },
        { restaurantId: 1, name: 'Pangsit Goreng', description: 'Pangsit goreng renyah', price: 12000, image: '/food/mie-ayam-noodles.jpg', category: 'Snacks', availability: true },
        { restaurantId: 2, name: 'Ice Cream Cone', description: 'Es krim vanilla lembut', price: 8000, image: '/ice-cream-dessert.png', category: 'Ice Cream', availability: true },
        { restaurantId: 2, name: 'Boba Brown Sugar', description: 'Minuman boba dengan brown sugar', price: 15000, image: '/beverages-drinks.jpg', category: 'Beverages', availability: true },
        { restaurantId: 2, name: 'Strawberry Sundae', description: 'Es krim strawberry dengan topping', price: 12000, image: '/ice-cream-dessert.png', category: 'Ice Cream', availability: true },
        { restaurantId: 2, name: 'Taro Ice Cream', description: 'Es krim rasa taro', price: 10000, image: '/ice-cream-dessert.png', category: 'Ice Cream', availability: true },
        { restaurantId: 3, name: 'Ayam Geprek Original', description: 'Ayam geprek dengan sambal level 1', price: 22000, image: '/food/rendang.jpg', category: 'Main Course', availability: true },
        { restaurantId: 3, name: 'Ayam Geprek Keju', description: 'Ayam geprek dengan keju mozarella', price: 28000, image: '/food/rendang.jpg', category: 'Main Course', availability: true },
        { restaurantId: 3, name: 'Ayam Geprek Sambal Matah', description: 'Ayam geprek dengan sambal matah khas Bali', price: 25000, image: '/food/rendang.jpg', category: 'Main Course', availability: true },
        { restaurantId: 3, name: 'Nasi Putih', description: 'Nasi putih hangat', price: 5000, image: '/food/nasi-gudeg.jpg', category: 'Sides', availability: true },
        { restaurantId: 3, name: 'Es Jeruk', description: 'Jus jeruk segar', price: 8000, image: '/beverages-drinks.jpg', category: 'Beverages', availability: true },
        { restaurantId: 4, name: 'Cappuccino', description: 'Kopi espresso dengan susu steam', price: 35000, image: '/coffee-academy-cafe.jpg', category: 'Coffee', availability: true },
        { restaurantId: 4, name: 'Latte', description: 'Espresso dengan susu lebih banyak', price: 38000, image: '/coffee-academy-cafe.jpg', category: 'Coffee', availability: true },
        { restaurantId: 4, name: 'Americano', description: 'Espresso dengan air panas', price: 30000, image: '/coffee-academy-cafe.jpg', category: 'Coffee', availability: true },
        { restaurantId: 4, name: 'Croissant', description: 'Roti croissant butter premium', price: 25000, image: '/food/kue-lapis.jpg', category: 'Pastry', availability: true },
        { restaurantId: 4, name: 'Tiramisu', description: 'Dessert Italia klasik', price: 45000, image: '/food/tiramisu.jpg', category: 'Dessert', availability: true },
        { restaurantId: 5, name: 'Kebab Ayam Original', description: 'Kebab ayam dengan saus spesial', price: 20000, image: '/kebab-food-stall.jpg', category: 'Main Course', availability: true },
        { restaurantId: 5, name: 'Kebab Sapi Premium', description: 'Kebab daging sapi pilihan', price: 28000, image: '/kebab-food-stall.jpg', category: 'Main Course', availability: true },
        { restaurantId: 5, name: 'Kebab Keju', description: 'Kebab dengan extra keju mozarella', price: 25000, image: '/kebab-food-stall.jpg', category: 'Main Course', availability: true },
        { restaurantId: 5, name: 'French Fries', description: 'Kentang goreng renyah', price: 12000, image: '/food/sate-ayam.jpg', category: 'Sides', availability: true },
        { restaurantId: 6, name: 'Bakso Komplit', description: 'Bakso dengan mie, tahu, dan siomay', price: 25000, image: '/bakso-meatballs.jpg', category: 'Main Course', availability: true },
        { restaurantId: 6, name: 'Bakso Urat', description: 'Bakso dengan urat sapi', price: 28000, image: '/bakso-meatballs.jpg', category: 'Main Course', availability: true },
        { restaurantId: 6, name: 'Bakso Tahu', description: 'Bakso dengan tahu isi', price: 22000, image: '/bakso-meatballs.jpg', category: 'Main Course', availability: true },
        { restaurantId: 6, name: 'Es Jeruk Peras', description: 'Jus jeruk peras segar', price: 8000, image: '/beverages-drinks.jpg', category: 'Beverages', availability: true },
        { restaurantId: 7, name: 'Nasi Goreng Spesial', description: 'Nasi goreng dengan ayam dan telur', price: 32000, image: '/food/nasi-gudeg.jpg', category: 'Main Course', availability: true },
        { restaurantId: 7, name: 'Spaghetti Carbonara', description: 'Pasta dengan saus creamy carbonara', price: 42000, image: '/food/sate-ayam.jpg', category: 'Main Course', availability: true },
        { restaurantId: 7, name: 'Chicken Wings', description: 'Sayap ayam crispy dengan saus BBQ', price: 35000, image: '/food/rendang.jpg', category: 'Snacks', availability: true },
        { restaurantId: 7, name: 'Iced Chocolate', description: 'Coklat dingin dengan whipped cream', price: 28000, image: '/beverages-drinks.jpg', category: 'Beverages', availability: true },
        { restaurantId: 8, name: 'Ayam Gepuk Original', description: 'Ayam gepuk dengan bumbu rempah', price: 25000, image: '/food/rendang.jpg', category: 'Main Course', availability: true },
        { restaurantId: 8, name: 'Ayam Gepuk Sambal Ijo', description: 'Ayam gepuk dengan sambal hijau pedas', price: 27000, image: '/food/rendang.jpg', category: 'Main Course', availability: true },
        { restaurantId: 8, name: 'Nasi + Lauk', description: 'Paket nasi dengan lauk lengkap', price: 30000, image: '/food/nasi-gudeg.jpg', category: 'Main Course', availability: true },
    ];
    console.log('🌱 Seeding menus...');
    for (const menu of menus) {
        try {
            await menuService.create(menu);
            console.log(`✅ Created: ${menu.name} (Restaurant ${menu.restaurantId})`);
        }
        catch (error) {
            console.error(`❌ Failed to create ${menu.name}:`, error.message);
        }
    }
    console.log('✨ Menu seeding completed!');
    await app.close();
}
seedMenus()
    .then(() => process.exit(0))
    .catch((error) => {
    console.error('Error seeding menus:', error);
    process.exit(1);
});
//# sourceMappingURL=seed-menus.script.js.map