import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { RestaurantService } from '../restaurants/restaurant.service';

async function seedRestaurants() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const restaurantService = app.get(RestaurantService);

  const restaurants = [
    {
      name: 'Mie Gacoan',
      description: 'Restaurant mie pedas terbaik dengan berbagai level kepedasan',
      image: '/mie-gacoan-restaurant.jpg',
      category: 'Noodles',
      rating: 4.8,
      address: 'Jl. Sudirman No. 123, Jakarta',
      phone: '081234567890',
      openingTime: '10:00',
      closingTime: '22:00',
      status: 'active',
    },
    {
      name: 'Mixue Ice Cream',
      description: 'Es krim dan minuman segar dengan harga terjangkau',
      image: '/mixue-ice-cream-shop.jpg',
      category: 'Desserts',
      rating: 4.6,
      address: 'Jl. Thamrin No. 45, Jakarta',
      phone: '081234567891',
      openingTime: '09:00',
      closingTime: '23:00',
      status: 'active',
    },
    {
      name: 'Geprek Bensu',
      description: 'Ayam geprek dengan sambal pedas khas yang menggugah selera',
      image: '/geprek-chicken-restaurant.jpg',
      category: 'Indonesian',
      rating: 4.7,
      address: 'Jl. Gatot Subroto No. 78, Jakarta',
      phone: '081234567892',
      openingTime: '10:00',
      closingTime: '22:00',
      status: 'active',
    },
    {
      name: 'Coffee Academy',
      description: 'Kopi spesialti dan berbagai menu cafe premium',
      image: '/coffee-academy-cafe.jpg',
      category: 'Cafe',
      rating: 4.9,
      address: 'Jl. Senopati No. 12, Jakarta',
      phone: '081234567893',
      openingTime: '07:00',
      closingTime: '22:00',
      status: 'active',
    },
    {
      name: 'Kebab Turki Baba Rafi',
      description: 'Kebab premium dengan daging pilihan dan saus spesial',
      image: '/kebab-food-stall.jpg',
      category: 'Middle Eastern',
      rating: 4.5,
      address: 'Jl. Mangga Besar No. 56, Jakarta',
      phone: '081234567894',
      openingTime: '11:00',
      closingTime: '23:00',
      status: 'active',
    },
    {
      name: 'Bakso Malang Cak Eko',
      description: 'Bakso sapi asli dengan kuah yang gurih dan nikmat',
      image: '/bakso-meatballs.jpg',
      category: 'Indonesian',
      rating: 4.7,
      address: 'Jl. Veteran No. 89, Jakarta',
      phone: '081234567895',
      openingTime: '09:00',
      closingTime: '21:00',
      status: 'active',
    },
    {
      name: "Otty's Cafe",
      description: 'Cafe cozy dengan berbagai menu western dan asian fusion',
      image: '/ottys-cafe-interior.jpg',
      category: 'Cafe',
      rating: 4.6,
      address: 'Jl. Kemang Raya No. 34, Jakarta',
      phone: '081234567896',
      openingTime: '08:00',
      closingTime: '22:00',
      status: 'active',
    },
    {
      name: 'Ayam Gepuk Pak Gembus',
      description: 'Ayam gepuk dengan bumbu rempah khas yang menggugah selera',
      image: '/geprek-chicken-restaurant.jpg',
      category: 'Indonesian',
      rating: 4.5,
      address: 'Jl. Kuningan No. 67, Jakarta',
      phone: '081234567897',
      openingTime: '10:00',
      closingTime: '22:00',
      status: 'active',
    },
  ];

  console.log('🌱 Seeding restaurants...');
  
  for (const restaurant of restaurants) {
    try {
      await restaurantService.create(restaurant);
      console.log(`✅ Created: ${restaurant.name}`);
    } catch (error) {
      console.error(`❌ Failed to create ${restaurant.name}:`, error.message);
    }
  }

  console.log('✨ Restaurant seeding completed!');
  await app.close();
}

seedRestaurants()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error seeding restaurants:', error);
    process.exit(1);
  });

