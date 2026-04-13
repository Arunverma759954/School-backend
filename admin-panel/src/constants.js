export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://school-backend-3-8r1j.onrender.com/api';
export const API_IMAGE_URL = import.meta.env.VITE_API_IMAGE_URL || 'https://school-backend-3-8r1j.onrender.com';
export const WEBSITE_URL = import.meta.env.VITE_WEBSITE_URL || window.location.origin.replace('admin-', 'web-').replace('admin.', 'www.');

console.log('Final API_BASE_URL resolved to:', API_BASE_URL);
