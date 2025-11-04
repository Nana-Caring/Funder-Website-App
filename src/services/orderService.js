// Order Service for dependents
// Implements: checkout, list, getById, cancel, verifyStore

// Use absolute backend host (consistent with other services) to avoid dev proxy 404s
const API_HOST = 'https://nanacaring-backend.onrender.com';
// The API contract for orders lives under `/api/orders` (see docs).
const ORDERS_BASE = `${API_HOST}/api/orders`;

const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');

const safeJson = async (response) => {
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    const text = await response.text();
    throw new Error(`Unexpected response format (${contentType || 'unknown'}): ${text?.slice(0, 120)}`);
  }
  return response.json();
};

const withAuth = () => {
  const token = getToken();
  if (!token) throw new Error('Authentication required');
  return {
    'Authorization': `Bearer ${token}`,
    Accept: 'application/json',
    'Content-Type': 'application/json'
  };
};

const orderService = {
  // POST /api/orders/checkout - create order from cart
  checkout: async (payload) => {
    const headers = withAuth();

    // Pass the payload directly (supports top-level fulfillmentType, address, paymentMethod, shippingAddress)
    const res = await fetch(`${ORDERS_BASE}/checkout`, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });
    const data = await safeJson(res);
    if (!res.ok || data?.success === false) {
      const msg = data?.message || `HTTP ${res.status}`;
      const err = new Error(msg);
      err.data = data?.data;
      err.status = res.status;
      throw err;
    }
    return data;
  },

  // GET /api/orders?page&limit&status - list orders with pagination
  list: async ({ page = 1, limit = 10, status } = {}) => {
    const headers = withAuth();
    const params = new URLSearchParams();
    if (page) params.set('page', String(page));
    if (limit) params.set('limit', String(limit));
    if (status) params.set('status', status);
    const url = `${ORDERS_BASE}?${params.toString()}`;
    const res = await fetch(url, { headers });
    const raw = await safeJson(res);
    if (!res.ok) {
      throw new Error(raw?.message || `HTTP ${res.status}`);
    }
    // Expecting API shape: { success: true, data: { orders: [...], pagination: {...} } }
    if (raw?.data) return raw;
    // Fallback: normalize array responses
    const orders = Array.isArray(raw) ? raw : (raw?.orders || []);
    return {
      success: true,
      data: {
        orders,
        pagination: {
          currentPage: page,
          totalPages: 1,
          totalOrders: orders.length,
          hasMore: false,
        }
      }
    };
  },

  // GET order by id (fallback to listing if direct endpoint not available)
  getById: async (id) => {
    if (!id) throw new Error('Order id is required');
    const headers = withAuth();
    // Try direct endpoint first
    const direct = await fetch(`${ORDERS_BASE}/${encodeURIComponent(id)}`, { headers });
    if (direct.ok) {
      const data = await safeJson(direct);
      return { success: true, data: data?.data || data };
    }
    // Fallback: fetch list and find
    const list = await orderService.list();
    const found = list?.data?.orders?.find(o => String(o.id || o._id) === String(id) || String(o.reference) === String(id));
    if (!found) throw new Error('Order not found');
    return { success: true, data: found };
  },

  // Attempt cancel (may not be supported by backend)
  cancel: async (id) => {
    if (!id) throw new Error('Order id is required');
    const headers = withAuth();
    const res = await fetch(`${ORDERS_BASE}/${encodeURIComponent(id)}/cancel`, {
      method: 'POST',
      headers
    });
    const data = await safeJson(res);
    if (!res.ok || data?.success === false) {
      throw new Error(data?.message || `HTTP ${res.status}`);
    }
    return data;
  },

  // GET store verification (if supported)
  verifyStore: async (storeCode) => {
    if (!storeCode) throw new Error('Store code is required');
    const headers = withAuth();
    const res = await fetch(`${ORDERS_BASE}/store/${encodeURIComponent(storeCode)}`, { headers });
    const data = await safeJson(res);
    if (!res.ok || data?.success === false) {
      throw new Error(data?.message || `HTTP ${res.status}`);
    }
    return data;
  }
};

export default orderService;
