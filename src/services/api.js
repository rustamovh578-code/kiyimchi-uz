// Production da Render backend URL, dev da Vite proxy
const API_BASE = import.meta.env.VITE_API_URL || '/api';

const TOKEN_KEY = 'kiyimchi_token';

function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
    if (token) {
        localStorage.setItem(TOKEN_KEY, token);
    } else {
        localStorage.removeItem(TOKEN_KEY);
    }
}

async function request(url, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };
    if (token) {
        headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE}${url}`, {
        ...options,
        headers,
    });

    const data = await res.json();

    if (!res.ok) {
        throw new Error(data.error || 'Server xatosi');
    }

    return data;
}

// ============ Auth ============
export const authAPI = {
    login: (phone, password) =>
        request('/auth/login', { method: 'POST', body: JSON.stringify({ phone, password }) }),

    register: (name, phone, password) =>
        request('/auth/register', { method: 'POST', body: JSON.stringify({ name, phone, password }) }),

    me: () => request('/auth/me'),
};

// ============ Products ============
export const productsAPI = {
    getAll: (params = {}) => {
        const query = new URLSearchParams();
        Object.entries(params).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '') {
                query.set(key, value);
            }
        });
        const qs = query.toString();
        return request(`/products${qs ? '?' + qs : ''}`);
    },

    getById: (id) => request(`/products/${id}`),
};

// ============ Categories ============
export const categoriesAPI = {
    getAll: () => request('/categories'),
};

// ============ Orders ============
export const ordersAPI = {
    getMyOrders: () => request('/orders'),

    create: (orderData) =>
        request('/orders', { method: 'POST', body: JSON.stringify(orderData) }),
};

// ============ Admin ============
export const adminAPI = {
    getStats: () => request('/admin/stats'),

    getProducts: () => request('/admin/products'),
    createProduct: (product) =>
        request('/admin/products', { method: 'POST', body: JSON.stringify(product) }),
    updateProduct: (id, product) =>
        request(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(product) }),
    deleteProduct: (id) =>
        request(`/admin/products/${id}`, { method: 'DELETE' }),

    getOrders: () => request('/admin/orders'),
    updateOrderStatus: (id, status) =>
        request(`/admin/orders/${id}`, { method: 'PUT', body: JSON.stringify({ status }) }),

    getCustomers: () => request('/admin/customers'),
};
