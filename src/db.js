import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';
const SQLite = isWeb ? null : require('expo-sqlite');
const db = isWeb ? null : SQLite.openDatabaseSync('paelito_local.db');

// Fallback em memória para visualização no navegador (--web)
const memoryStore = {
  initialized: false,
  users: [],
  products: [],
  orders: [],
};

const INITIAL_USERS = [
  { id: 1, name: 'Administrador ABADEUS', email: 'admin@abadeus.com.br', password: 'ADM123', role: 'ADMIN' },
  { id: 2, name: 'Voluntário drive-thru', email: 'voluntario@abadeus.com.br', password: 'VOL123', role: 'VOLUNTEER' },
  { id: 3, name: 'Parceiro ponto de venda', email: 'parceiro@abadeus.com.br', password: 'PAR123', role: 'PARTNER' },
  { id: 4, name: 'Cliente', email: 'cliente@email.com', password: '123456', role: 'BUYER' },
];

const INITIAL_PRODUCTS = [
  // Paellas de frutos do mar
  { id: 1, name: 'Paella de frutos do mar (individual)', description: 'Camarão, lula e mexilhão (450g)', price: 50.0, stock_limit: 200 },
  { id: 2, name: 'Paella de frutos do mar (2 pessoas)', description: 'Camarão, lula e mexilhão (900g)', price: 95.0, stock_limit: 120 },
  { id: 3, name: 'Paella de frutos do mar (4 pessoas)', description: 'Camarão, lula e mexilhão (1,8kg)', price: 180.0, stock_limit: 80 },

  // Paellas de carnes
  { id: 4, name: 'Paella de carnes (individual)', description: 'Frango, lombo suíno e linguiça (450g)', price: 45.0, stock_limit: 200 },
  { id: 5, name: 'Paella de carnes (2 pessoas)', description: 'Frango, lombo suíno e linguiça (900g)', price: 85.0, stock_limit: 120 },
  { id: 6, name: 'Paella de carnes (4 pessoas)', description: 'Frango, lombo suíno e linguiça (1,8kg)', price: 160.0, stock_limit: 80 },

  // Paellas veggie
  { id: 7, name: 'Paella veggie (individual)', description: 'Cogumelos frescos, alcachofras e pimentões (450g)', price: 40.0, stock_limit: 100 },
  { id: 8, name: 'Paella veggie (2 pessoas)', description: 'Cogumelos frescos, alcachofras e pimentões (900g)', price: 75.0, stock_limit: 60 },
  { id: 9, name: 'Paella veggie (4 pessoas)', description: 'Cogumelos frescos, alcachofras e pimentões (1,8kg)', price: 140.0, stock_limit: 40 },

  // Combos Paelito
  { id: 10, name: 'Combo Paelito frutos do mar', description: 'Porção individual + 4 minichurros artesanais + refrigerante lata ou água', price: 65.0, stock_limit: 100 },
  { id: 11, name: 'Combo Paelito carnes', description: 'Porção individual + 4 minichurros artesanais + refrigerante lata ou água', price: 60.0, stock_limit: 100 },
  { id: 12, name: 'Combo Paelito veggie', description: 'Porção individual + 4 minichurros artesanais + refrigerante lata ou água', price: 55.0, stock_limit: 80 },

  // Bebidas
  { id: 13, name: 'Refrigerante lata (350mL)', description: 'Coca-Cola, Pepsi ou Guaraná', price: 6.0, stock_limit: 200 },
  { id: 14, name: 'Refrigerante 600mL', description: 'Coca-Cola, Pepsi ou Guaraná', price: 9.0, stock_limit: 150 },
  { id: 15, name: 'Refrigerante 2L', description: 'Coca-Cola, Pepsi ou Guaraná', price: 14.0, stock_limit: 120 },
  { id: 16, name: 'Água mineral', description: 'Com/sem gás', price: 4.0, stock_limit: 200 },
  { id: 17, name: 'Suco integral', description: 'Garrafa 300mL', price: 8.0, stock_limit: 150 },
];

function seedMemoryStore() {
  if (memoryStore.initialized) return;
  memoryStore.initialized = true;

  memoryStore.users = INITIAL_USERS.map((u) => ({ ...u }));
  memoryStore.products = INITIAL_PRODUCTS.map((p) => ({ ...p }));

  memoryStore.orders = [
    {
      id: 1,
      order_number: 'PAEL-1001',
      user_id: 4,
      buyer_name: 'Cliente',
      product_name: 'Paella de carnes (4 pessoas)',
      quantity: 1,
      total_amount: 160.0,
      status: 'PAID',
      picked_up: 0,
      picked_up_at: null,
      created_at: new Date().toISOString(),
    },
  ];
}

export function initLocalDatabase() {
  if (isWeb) {
    seedMemoryStore();
    return;
  }

  db.execSync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      price REAL NOT NULL,
      stock_limit INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      order_number TEXT UNIQUE NOT NULL,
      user_id INTEGER NOT NULL,
      buyer_name TEXT NOT NULL,
      product_name TEXT NOT NULL,
      quantity INTEGER NOT NULL,
      total_amount REAL NOT NULL,
      status TEXT NOT NULL,
      picked_up INTEGER DEFAULT 0,
      picked_up_at TEXT,
      created_at TEXT NOT NULL
    );
  `);

  const userCount = db.getFirstSync('SELECT COUNT(*) as count FROM users');
  if (userCount.count === 0) {
    for (const user of INITIAL_USERS) {
      db.runSync(
        'INSERT INTO users (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)',
        [user.id, user.name, user.email, user.password, user.role]
      );
    }

    for (const prod of INITIAL_PRODUCTS) {
      db.runSync(
        'INSERT INTO products (id, name, description, price, stock_limit) VALUES (?, ?, ?, ?, ?)',
        [prod.id, prod.name, prod.description, prod.price, prod.stock_limit]
      );
    }

    db.runSync(
      `INSERT INTO orders (order_number, user_id, buyer_name, product_name, quantity, total_amount, status, picked_up, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ['PAEL-1001', 4, 'Cliente', 'Paella de carnes (4 pessoas)', 1, 160.0, 'PAID', 0, new Date().toISOString()]
    );
  }
}

export function loginUser(loginInput, password) {
  const cleanLogin = loginInput.trim().toUpperCase();
  const cleanPass = password.trim();

  if (isWeb) {
    seedMemoryStore();
    return (
      memoryStore.users.find(
        (u) =>
          (u.email.toUpperCase() === cleanLogin || u.name.toUpperCase() === cleanLogin) &&
          u.password === cleanPass
      ) || null
    );
  }

  return db.getFirstSync(
    'SELECT * FROM users WHERE (UPPER(email) = UPPER(?) OR UPPER(name) = UPPER(?)) AND password = ?',
    [cleanLogin, cleanLogin, cleanPass]
  );
}

export function registerBuyer(name, email, password) {
  const cleanName = name.trim();
  const cleanEmail = email.trim();
  const cleanPass = password.trim();

  if (isWeb) {
    seedMemoryStore();
    const newUser = {
      id: memoryStore.users.length + 1,
      name: cleanName,
      email: cleanEmail,
      password: cleanPass,
      role: 'BUYER',
    };
    memoryStore.users.push(newUser);
    return newUser;
  }

  const result = db.runSync(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [cleanName, cleanEmail, cleanPass, 'BUYER']
  );
  return db.getFirstSync('SELECT * FROM users WHERE id = ?', [result.lastInsertRowId]);
}

export function getProducts() {
  if (isWeb) {
    seedMemoryStore();
    return memoryStore.products;
  }
  return db.getAllSync('SELECT * FROM products');
}

export function createOrderOffline(user, product, quantity) {
  if (product.stock_limit < quantity) {
    throw new Error('Estoque insuficiente para este produto no momento');
  }

  const orderNumber = 'PAEL-' + Math.floor(1000 + Math.random() * 9000);
  const totalAmount = product.price * quantity;

  if (isWeb) {
    seedMemoryStore();
    const targetProd = memoryStore.products.find((p) => p.id === product.id);
    if (targetProd) targetProd.stock_limit -= quantity;

    memoryStore.orders.unshift({
      id: memoryStore.orders.length + 1,
      order_number: orderNumber,
      user_id: user.id,
      buyer_name: user.name,
      product_name: product.name,
      quantity,
      total_amount: totalAmount,
      status: 'PAID',
      picked_up: 0,
      picked_up_at: null,
      created_at: new Date().toISOString(),
    });
    return orderNumber;
  }

  db.runSync(
    'UPDATE products SET stock_limit = stock_limit - ? WHERE id = ?',
    [quantity, product.id]
  );

  db.runSync(
    `INSERT INTO orders (order_number, user_id, buyer_name, product_name, quantity, total_amount, status, picked_up, created_at)
     VALUES (?, ?, ?, ?, ?, ?, 'PAID', 0, ?)`,
    [orderNumber, user.id, user.name, product.name, quantity, totalAmount, new Date().toISOString()]
  );

  return orderNumber;
}

export function getUserOrders(userId) {
  if (isWeb) {
    seedMemoryStore();
    return memoryStore.orders.filter((o) => o.user_id === userId);
  }
  return db.getAllSync('SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC', [userId]);
}

export function getAllOrders() {
  if (isWeb) {
    seedMemoryStore();
    return memoryStore.orders;
  }
  return db.getAllSync('SELECT * FROM orders ORDER BY id DESC');
}

export function validateOrderPickup(orderNumber) {
  const cleanCode = orderNumber.trim().toUpperCase();

  if (isWeb) {
    seedMemoryStore();
    const order = memoryStore.orders.find((o) => o.order_number.toUpperCase() === cleanCode);
    if (!order) throw new Error('Pedido não encontrado no banco local');
    if (order.status !== 'PAID') throw new Error('Este pedido ainda não consta como pago');
    if (order.picked_up === 1) {
      throw new Error(`Retirada duplicada bloqueada: pedido já retirado às ${order.picked_up_at}`);
    }
    order.picked_up = 1;
    order.picked_up_at = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return order;
  }

  const order = db.getFirstSync(
    'SELECT * FROM orders WHERE UPPER(order_number) = UPPER(?)',
    [cleanCode]
  );

  if (!order) {
    throw new Error('Pedido não encontrado no banco local');
  }
  if (order.status !== 'PAID') {
    throw new Error('Este pedido ainda não consta como pago');
  }
  if (order.picked_up === 1) {
    throw new Error(`Retirada duplicada bloqueada: pedido já retirado às ${order.picked_up_at}`);
  }

  const nowFormatted = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  db.runSync(
    'UPDATE orders SET picked_up = 1, picked_up_at = ? WHERE id = ?',
    [nowFormatted, order.id]
  );

  return db.getFirstSync('SELECT * FROM orders WHERE id = ?', [order.id]);
}