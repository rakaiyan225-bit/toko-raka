const mongoose = require('mongoose');
require('dotenv').config();

const Product = require('./models/Product');
const Customer = require('./models/Customer');
const Order = require('./models/Order');

const connectDB = require('./config/db');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await Product.deleteMany({});
    await Customer.deleteMany({});
    await Order.deleteMany({});

    console.log('Data cleared...');

    // Seed Products
    const products = await Product.insertMany([
      {
        name: 'Kaos Oversize Hitam Clover',
        description: 'Kaos oversize hitam premium dengan logo Clover. Bahan cotton combed 30s yang nyaman dipakai sehari-hari.',
        price: 89000,
        category: 'Kaos',
        image: '/uploads/kaos-oversize-hitam.jpg',
        stock: 150,
        sizes: ['S', 'M', 'L', 'XL', 'XXL'],
        rating: 4.8,
        sold: 1200,
        isActive: true,
      },
      {
        name: 'Kaos Putih Basic Ladsclub',
        description: 'Kaos putih basic dengan desain minimalis Ladsclub. Bahan cotton combed 24s premium.',
        price: 75000,
        category: 'Kaos',
        image: '/uploads/kaos-putih-basic.jpg',
        stock: 200,
        sizes: ['S', 'M', 'L', 'XL'],
        rating: 4.9,
        sold: 980,
        isActive: true,
      },
      {
        name: 'Hoodie Hitam Clover Club',
        description: 'Hoodie hitam dengan desain eksklusif Clover Club. Bahan fleece tebal premium.',
        price: 199000,
        category: 'Hoodie',
        image: '/uploads/hoodie-hitam-clover.jpg',
        stock: 80,
        sizes: ['S', 'M', 'L', 'XL'],
        rating: 4.7,
        sold: 2100,
        isActive: true,
      },
      {
        name: 'Hoodie Putih Clover Ladsclub',
        description: 'Hoodie putih dengan branding Clover Ladsclub. Bahan baby terry yang lembut.',
        price: 199000,
        category: 'Hoodie',
        image: '/uploads/hoodie-putih-clover.jpg',
        stock: 65,
        sizes: ['S', 'M', 'L', 'XL'],
        rating: 4.8,
        sold: 1500,
        isActive: true,
      },
      {
        name: 'Hoodie Clover Black',
        description: 'Hoodie premium full hitam dengan embroidery Clover. Edisi terbatas.',
        price: 289000,
        category: 'Hoodie',
        image: '/uploads/hoodie-clover-black.jpg',
        stock: 40,
        sizes: ['M', 'L', 'XL'],
        rating: 4.9,
        sold: 850,
        isActive: true,
      },
      {
        name: 'Jaket Bomber Clover',
        description: 'Jaket bomber dengan desain Clover. Bahan parasut premium anti air.',
        price: 350000,
        category: 'Jaket',
        image: '/uploads/jaket-bomber-clover.jpg',
        stock: 30,
        sizes: ['M', 'L', 'XL'],
        rating: 4.6,
        sold: 600,
        isActive: true,
      },
    ]);

    console.log(`${products.length} products seeded`);

    // Seed Customers
    const customers = await Customer.insertMany([
      {
        name: 'Ahmad Ramadhan',
        email: 'ahmad.ramadhan@email.com',
        phone: '0812-3456-7890',
        totalOrders: 12,
        totalSpent: 2450000,
        status: 'Aktif',
      },
      {
        name: 'Siti Nurhaliza',
        email: 'siti.nurhaliza@email.com',
        phone: '0813-9876-5432',
        totalOrders: 8,
        totalSpent: 1820000,
        status: 'Aktif',
      },
      {
        name: 'Dimas Pratama',
        email: 'dimas.pratama@email.com',
        phone: '0814-2234-5566',
        totalOrders: 5,
        totalSpent: 950000,
        status: 'Aktif',
      },
      {
        name: 'Rina Amelia',
        email: 'rina.amelia@email.com',
        phone: '0815-6677-8899',
        totalOrders: 15,
        totalSpent: 3120000,
        status: 'Aktif',
      },
    ]);

    console.log(`${customers.length} customers seeded`);

    // Seed Orders
    const orders = [
      {
        orderId: '#CLD10042',
        customer: {
          name: 'Ahmad Ramadhan',
          email: 'ahmad.ramadhan@email.com',
          phone: '0812-3456-7890',
          address: 'Jl. Merdeka No. 10, Jakarta',
        },
        items: [
          {
            product: products[2]._id, // Hoodie Hitam Clover Club
            quantity: 1,
            size: 'L',
            price: 199000,
          },
        ],
        totalAmount: 199000,
        shippingCost: 15000,
        paymentMethod: 'Transfer Bank',
        status: 'Selesai',
        createdAt: new Date('2024-09-15'),
      },
      {
        orderId: '#CLD10041',
        customer: {
          name: 'Siti Nurhaliza',
          email: 'siti.nurhaliza@email.com',
          phone: '0813-9876-5432',
          address: 'Jl. Sudirman No. 25, Bandung',
        },
        items: [
          {
            product: products[0]._id, // Kaos Oversize Hitam Clover
            quantity: 1,
            size: 'M',
            price: 89000,
          },
        ],
        totalAmount: 89000,
        shippingCost: 15000,
        paymentMethod: 'DANA',
        status: 'Dikirim',
        createdAt: new Date('2024-09-14'),
      },
      {
        orderId: '#CLD10040',
        customer: {
          name: 'Dimas Pratama',
          email: 'dimas.pratama@email.com',
          phone: '0814-2234-5566',
          address: 'Jl. Gatot Subroto No. 15, Surabaya',
        },
        items: [
          {
            product: products[1]._id, // Kaos Putih Basic Ladsclub
            quantity: 1,
            size: 'L',
            price: 75000,
          },
        ],
        totalAmount: 75000,
        shippingCost: 15000,
        paymentMethod: 'GoPay',
        status: 'Diproses',
        createdAt: new Date('2024-09-13'),
      },
      {
        orderId: '#CLD10039',
        customer: {
          name: 'Rina Amelia',
          email: 'rina.amelia@email.com',
          phone: '0815-6677-8899',
          address: 'Jl. Ahmad Yani No. 30, Semarang',
        },
        items: [
          {
            product: products[3]._id, // Hoodie Putih Clover Ladsclub
            quantity: 1,
            size: 'M',
            price: 199000,
          },
        ],
        totalAmount: 199000,
        shippingCost: 15000,
        paymentMethod: 'ShopeePay',
        status: 'Selesai',
        createdAt: new Date('2024-09-12'),
      },
    ];

    // Insert orders directly (bypass the pre-save hook since we set orderId manually)
    await Order.insertMany(orders);

    console.log(`${orders.length} orders seeded`);
    console.log('Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedData();
