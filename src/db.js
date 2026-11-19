import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';
const SQLite = isWeb ? null : require('expo-sqlite');
const db = isWeb ? null : SQLite.openDatabaseSync('paelito_local.db');

// Fallback em memória apenas para visualização no navegador (--web)
const memoryStore = {
  initialized: false,
  users: [],
  products: [],
  orders: [],
};

function seedMemoryStore() {
  if (memoryStore.initialized) return;
  memoryStore.initialized = true;

  memoryStore.users = [
    { id: 1, name: 'Administrador ABADEUS', email: 'admin@abadeus.com.br', password: 'ADM123', role: 'ADMIN' },
    { id: 2, name: 'Voluntário Fila Drive-Thru', email: 'voluntario@abadeus.com.br', password: 'VOL123', role: 'VOLUNTEER' },
    { id: 3, name: 'Parceiro Ponto de Venda', email: 'parceiro@abadeus.com.br', password: 'PAR123', role: 'PARTNER' },
    { id: 4, name: 'Maria Clara Silveira', email: 'mariaclara.silveira@email.com', password: '123456', role: 'BUYER' },
  ];

  memoryStore.products = [
    { id: 1, name: 'Paella Tradicional Individual', description: 'Porção individual (450g) ideal para 1 pessoa.', price: 45.0, stock_limit: 300 },
    { id: 2, name: 'Paella Família Solidária', description: 'Porção generosa para compartilhar (até 4 pessoas).', price: 120.0, stock_limit: 150 },
    { id: 3, name: 'Combo Paelito + Churros', description: '1 Porção Individual + 4 Minichurros artesanais.', price: 65.0, stock_limit: 100 },
    { id: 4, name: 'Paella Veggie', description: 'Mix de cogumelos frescos, alcachofras e pimentões.', price: 40.0, stock_limit: 80 },
  ];

  memoryStore.orders = [
    {
      id: 1,
      order_number: 'PAEL-1001',
      user_id: 4,
      buyer_name: 'Maria Clara Silveira',
      product_name: 'Paella Família Solidária',
      quantity: 1,
      total_amount: 120.0,
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
    db.runSync(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Administrador ABADEUS', 'admin@abadeus.com.br', 'ADM123', 'ADMIN']
    );
    db.runSync(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Voluntário Fila Drive-Thru', 'voluntario@abadeus.com.br', 'VOL123', 'VOLUNTEER']
    );
    db.runSync(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Parceiro Ponto de Venda', 'parceiro@abadeus.com.br', 'PAR123', 'PARTNER']
    );
    db.runSync(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Maria Clara Silveira', 'mariaclara.silveira@email.com', '123456', 'BUYER']
    );

    db.runSync(
      'INSERT INTO products (name, description, price, stock_limit) VALUES (?, ?, ?, ?)',
      ['Paella Tradicional Individual', 'Porção individual (450g) ideal para 1 pessoa.', 45.0, 300]
    );
    db.runSync(
      'INSERT INTO products (name, description, price, stock_limit) VALUES (?, ?, ?, ?)',
      ['Paella Família Solidária', 'Porção generosa para compartilhar (até 4 pessoas).', 120.0, 150]
    );
    db.runSync(
      'INSERT INTO products (name, description, price, stock_limit) VALUES (?, ?, ?, ?)',
      ['Combo Paelito + Churros', '1 Porção Individual + 4 Minichurros artesanais.', 65.0, 100]
    );
    db.runSync(
      'INSERT INTO products (name, description, price, stock_limit) VALUES (?, ?, ?, ?)',
      ['Paella Veggie', 'Mix de cogumelos frescos, alcachofras e pimentões.', 40.0, 80]
    );

    db.runSync(
      `INSERT INTO orders (order_number, user_id, buyer_name, product_name, quantity, total_amount, status, picked_up, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ['PAEL-1001', 4, 'Maria Clara Silveira', 'Paella Família Solidária', 1, 120.0, 'PAID', 0, new Date().toISOString()]
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
    throw new Error('Estoque insuficiente para este produto.');
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
    if (!order) throw new Error('Pedido não encontrado no banco local.');
    if (order.status !== 'PAID') throw new Error('Este pedido ainda não consta como PAGO.');
    if (order.picked_up === 1) {
      throw new Error(`Retirada duplicada bloqueada! Pedido já retirado às ${order.picked_up_at}`);
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
    throw new Error('Pedido não encontrado no banco local.');
  }
  if (order.status !== 'PAID') {
    throw new Error('Este pedido ainda não consta como PAGO.');
  }
  if (order.picked_up === 1) {
    throw new Error(`Retirada duplicada bloqueada! Pedido já retirado às ${order.picked_up_at}`);
  }

  const nowFormatted = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  db.runSync(
    'UPDATE orders SET picked_up = 1, picked_up_at = ? WHERE id = ?',
    [nowFormatted, order.id]
  );

  return db.getFirstSync('SELECT * FROM orders WHERE id = ?', [order.id]);
}