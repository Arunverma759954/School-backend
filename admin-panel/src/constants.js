export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://school-backend-4-gbr5.onrender.com/api';
export const API_IMAGE_URL = import.meta.env.VITE_API_IMAGE_URL || 'https://school-backend-4-gbr5.onrender.com';
export const WEBSITE_URL = import.meta.env.VITE_WEBSITE_URL || 'https://school-web-rho-drab.vercel.app';

// ✅ FIXED: Handles Cloudinary URLs, Render backend paths, and relative paths correctly
export const getImageUrl = (src) => {
    if (!src) return '';

    // Case 1: Already a full URL (Cloudinary, http, data:) → use directly
    if (src.startsWith('http') || src.startsWith('data:')) return src;

    // Case 2: Relative path like /uploads/Gallery/... → prepend Render backend URL
    if (src.startsWith('/')) return `${API_IMAGE_URL}${src}`;

    // Case 3: Legacy flat filename → assume it's in /uploads/
    return `${API_IMAGE_URL}/uploads/${src}`;
};

// Error handler for images - show a grey placeholder on failure
export const getFallbackImageUrl = (e, src) => {
    // Only run once to avoid infinite loop
    if (e.target.getAttribute('data-fallback-applied')) return;
    e.target.setAttribute('data-fallback-applied', 'true');

    // Use a simple grey SVG placeholder
    e.target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='150' viewBox='0 0 200 150'%3E%3Crect width='200' height='150' fill='%23e2e8f0'/%3E%3Ctext x='100' y='75' text-anchor='middle' dominant-baseline='middle' font-family='sans-serif' font-size='12' fill='%2394a3b8'%3EImage Not Found%3C/text%3E%3C/svg%3E`;
};

console.log('Final API_BASE_URL resolved to:', API_BASE_URL);
