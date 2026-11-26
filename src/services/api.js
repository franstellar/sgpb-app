import { Platform } from 'react-native';

// Troque pelo IP local da sua máquina (rode `hostname -I` no Linux)
// Se estiver testando no navegador (--web), usa localhost automaticamente
const LOCAL_IP = '192.168.1.15';

export const API_BASE_URL =
  Platform.OS === 'web'
    ? 'http://localhost:8080/api'
    : `http://${LOCAL_IP}:8080/api`;

async function request(path, options = {}) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      signal: controller.signal,
      ...options,
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
      const error = new Error(data?.error || `Erro HTTP ${response.status}`);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (err) {
    if (err.name === 'AbortError') {
      const timeoutErr = new Error('Tempo limite excedido ao conectar com o servidor.');
      timeoutErr.isNetworkError = true;
      throw timeoutErr;
    }
    if (!err.status) {
      err.isNetworkError = true;
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

export const api = {
  // Autenticação e Equipe
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  registerBuyer: ({ name, email, phone, password }) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, phone, password }),
    }),

  listStaff: () => request('/auth/staff'),

  createStaff: (payload) =>
    request('/auth/staff', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Eventos, Produtos e Lotes
  listEvents: () => request('/events'),

  updateEvent: (eventId, payload) =>
    request(`/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  listProducts: (eventId = 1) => request(`/events/${eventId}/products`),

  createProduct: (eventId = 1, payload) =>
    request(`/events/${eventId}/products`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  updateProduct: (productId, payload) =>
    request(`/events/products/${productId}`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    }),

  toggleProduct: (productId) =>
    request(`/events/products/${productId}/toggle`, {
      method: 'PATCH',
    }),

  listBatches: (eventId = 1) => request(`/events/${eventId}/batches`),

  createBatch: (eventId = 1, payload) =>
    request(`/events/${eventId}/batches`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Pedidos e Pagamentos
  listOrders: (userId) =>
    request(userId ? `/orders?userId=${userId}` : '/orders'),

  getOrderItems: (orderId) => request(`/orders/${orderId}/items`),

  getOrderHistory: (orderId) => request(`/orders/${orderId}/history`),

  getOrderByNumber: (orderNumber) =>
    request(`/orders/by-number/${encodeURIComponent(orderNumber)}`),

  createOrder: (payload) =>
    request('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  confirmPayment: (orderId, payload) =>
    request(`/orders/${orderId}/pay`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  cancelOrder: (orderId, adminUserId, justification) =>
    request(`/orders/${orderId}/cancel`, {
      method: 'POST',
      body: JSON.stringify({ adminUserId, justification }),
    }),

  refundOrder: (orderId, adminUserId, justification) =>
    request(`/orders/${orderId}/refund`, {
      method: 'POST',
      body: JSON.stringify({ adminUserId, justification }),
    }),

  getDashboard: () => request('/orders/dashboard'),

  // Retiradas e Sincronização Offline
  getOfflineSyncData: () => request('/pickups/sync-data'),

  validatePickup: (orderNumber, volunteerUserId, validationMethod = 'QR_CODE') =>
    request('/pickups/validate', {
      method: 'POST',
      body: JSON.stringify({ orderNumber, volunteerUserId, validationMethod }),
    }),

  syncOfflinePickups: (validations) =>
    request('/pickups/sync-offline', {
      method: 'POST',
      body: JSON.stringify(validations),
    }),
};