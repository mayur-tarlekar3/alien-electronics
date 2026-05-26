import axios from 'axios';

const getContextPath = () => {
  return window.location.pathname.startsWith('/shopping-cart') ? '/shopping-cart' : '';
};

export const API_BASE_URL = window.location.port === '5173' 
  ? 'http://localhost:8080/shopping-cart' 
  : getContextPath();

const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Response interceptor to handle session timeout
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.data.message === 'Session Expired, Login Again!' || error.response.status === 401)) {
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const login = (username, password, usertype) => {
  return api.get('/LoginSrv', {
    params: { username, password, usertype }
  });
};

export const logout = () => {
  localStorage.removeItem('user');
  return api.get('/LogoutSrv');
};

export const getProducts = (params) => {
  return api.get('/GetProductsSrv', { params });
};

export const addProduct = (formData) => {
  return api.post('/AddProductSrv', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const updateProduct = (formData) => {
  return api.post('/UpdateProductSrv', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const sendContactMessage = (name, email, comments) => {
  return api.post('/fansMessage', null, {
    params: { name, email, comments }
  });
};

export const removeProduct = (prodid) => {
  return api.get('/RemoveProductSrv', { params: { prodid } });
};

export const getCart = () => {
  return api.get('/GetCartSrv');
};

export const addToCart = (pid, pqty) => {
  return api.get('/AddtoCart', { params: { pid, pqty } });
};

export const updateCart = (pid, pqty) => {
  return api.get('/UpdateToCart', { params: { pid, pqty } });
};

export const getOrders = () => {
  return api.get('/GetOrdersSrv');
};

export const checkout = (amount) => {
  return api.get('/OrderServlet', { params: { amount } });
};

export const getAllOrdersAdmin = () => {
  return api.get('/GetAllOrdersSrv');
};

export const shipOrder = (orderid, prodid, userid, amount) => {
  return api.get('/ShipmentServlet', { params: { orderid, prodid, userid, amount } });
};

export default api;
