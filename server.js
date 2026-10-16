const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// View Engine Setup (EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// In-Memory Database (For demonstration)
const db = {
  menu: [
    { id: 1, name: 'Truffle Wagyu Burger', category: 'Mains', price: 28, description: 'A5 Wagyu beef patty, black truffle aioli, aged cheddar.', available: true },
    { id: 2, name: 'Pan-Seared Salmon', category: 'Mains', price: 24, description: 'Crispy skin salmon, lemon dill butter sauce, asparagus.', available: true },
    { id: 3, name: 'Burrata Caprese', category: 'Starters', price: 16, description: 'Fresh burrata, heirloom tomatoes, basil pesto, balsamic reduction.', available: true },
    { id: 4, name: 'Matcha Tiramisu', category: 'Desserts', price: 12, description: 'Japanese green tea infused ladyfingers with cream mascarpone.', available: true }
  ],
  reservations: [],
  orders: []
};

// --- VIEW ROUTES ---

// Home Page
app.get('/', (req, res) => {
  res.render('index', { title: 'Gourmet Haven | Fine Dining' });
});

// Menu Page
app.get('/menu', (req, res) => {
  res.render('menu', { title: 'Our Menu', menu: db.menu });
});

// Reservation Page
app.get('/reserve', (req, res) => {
  res.render('reserve', { title: 'Reserve a Table' });
});

// Admin Dashboard
app.get('/admin', (req, res) => {
  res.render('admin', { 
    title: 'Admin Dashboard', 
    reservations: db.reservations, 
    orders: db.orders, 
    menu: db.menu 
  });
});

// --- BACKEND API ROUTES ---

// API: Get Menu Items
app.get('/api/menu', (req, res) => {
  res.json({ success: true, data: db.menu });
});

// API: Create Reservation
app.post('/api/reservations', (req, res) => {
  const { name, email, phone, guests, date, time } = req.body;
  
  if (!name || !email || !guests || !date || !time) {
    return res.status(400).json({ success: false, message: 'Please fill in all required fields.' });
  }

  const reservation = {
    id: 'RES-' + Date.now(),
    name,
    email,
    phone,
    guests,
    date,
    time,
    status: 'Confirmed',
    createdAt: new Date().toISOString()
  };

  db.reservations.push(reservation);
  res.status(201).json({ success: true, message: 'Table reserved successfully!', data: reservation });
});

// API: Place Order
app.post('/api/orders', (req, res) => {
  const { items, customerName, tableNumber } = req.body;
  
  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Order items cannot be empty.' });
  }

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  const order = {
    id: 'ORD-' + Date.now(),
    customerName: customerName || 'Guest',
    tableNumber: tableNumber || 'Takeaway',
    items,
    total,
    status: 'Pending',
    createdAt: new Date().toISOString()
  };

  db.orders.push(order);
  res.status(201).json({ success: true, message: 'Order placed successfully!', data: order });
});

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});