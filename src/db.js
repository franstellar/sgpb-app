import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabaseSync('paelito_local.db');

export function initLocalDatabase() {
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

  // Seeder Local: popula na primeira vez que o app abre
  const userCount = db.getFirstSync('SELECT COUNT(*) as count FROM users');
  if (userCount.count === 0) {
    // 1. Administrador exigido no quadro negro (ADM123)
    db.runSync(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Administrador ABADEUS', 'ADMINISTRADOR', 'ADM123', 'ADMIN']
    );

    // 2. Comprador padrão para teste rápido
    db.runSync(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Apoiador Solidário', 'comprador@email.com', '123456', 'BUYER']
    );

    // 3. Produtos da identidade visual Paelito
    db.runSync(
      'INSERT INTO products (name, description, price, stock_limit) VALUES (?, ?, ?, ?)',
      ['Paella Individual', 'Porção individual (450g) ideal para 1 pessoa.', 45.0, 300]
    );
    db.runSync(
      'INSERT INTO products (name, description, price, stock_limit) VALUES (?, ?, ?, ?)',
      ['Paella Familiar', 'Porção generosa para compartilhar (até 3 pessoas).', 120.0, 150]
    );
    db.runSync(
      'INSERT INTO products (name, description, price, stock_limit) VALUES (?, ?, ?, ?)',
      ['Combo Especial', '2 Paellas Familiares + 1 Individual com desconto.', 260.0, 50]
    );

    // 4. Pedido de exemplo já pago para testar a validação de retirada no painel Admin
    db.runSync(
      `INSERT INTO orders (order_number, user_id, buyer_name, product_name, quantity, total_amount, status, picked_up, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ['PAEL-1001', 2, 'Apoiador Solidário', 'Paella Familiar', 1, 120.0, 'PAID', 0, new Date().toISOString()]
    );
  }
}

export function loginUser(loginInput, password) {
  return db.getFirstSync(
    'SELECT * FROM users WHERE (UPPER(email) = UPPER(?) OR UPPER(name) = UPPER(?)) AND password = ?',
    [loginInput.trim(), loginInput.trim(), password.trim()]
  );
}

export function registerBuyer(name, email, password) {
  const result = db.runSync(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
    [name.trim(), email.trim(), password.trim(), 'BUYER']
  );
  return db.getFirstSync('SELECT * FROM users WHERE id = ?', [result.lastInsertRowId]);
}

export function getProducts() {
  return db.getAllSync('SELECT * FROM products');
}

export function createOrderOffline(user, product, quantity) {
  if (product.stock_limit < quantity) {
    throw new Error('Estoque insuficiente para este produto.');
  }

  const orderNumber = 'PAEL-' + Math.floor(1000 + Math.random() * 9000);
  const totalAmount = product.price * quantity;

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
  return db.getAllSync('SELECT * FROM orders WHERE user_id = ? ORDER BY id DESC', [userId]);
}

export function getAllOrders() {
  return db.getAllSync('SELECT * FROM orders ORDER BY id DESC');
}

export function validateOrderPickup(orderNumber) {
  const order = db.getFirstSync(
    'SELECT * FROM orders WHERE UPPER(order_number) = UPPER(?)',
    [orderNumber.trim()]
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