export const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://school-backend-3-8r1j.onrender.com/api';
export const API_IMAGE_URL = import.meta.env.VITE_API_IMAGE_URL || 'https://school-backend-3-8r1j.onrender.com';
export const WEBSITE_URL = import.meta.env.VITE_WEBSITE_URL || 'https://school-web-rho-drab.vercel.app';

export const getImageUrl = (src) => {
    if (!src) return '';
    if (src.startsWith('http') || src.startsWith('data:')) return src;
    
    let path = src;
    
    // Normalize path to backend style
    if (!path.startsWith('/uploads/')) {
        path = `/uploads${path.startsWith('/') ? '' : '/'}${path}`;
    }

    // Step 1: Default to live backend
    return `${API_IMAGE_URL}${path}`;
};

// Error handler for images to try fallbacks
export const getFallbackImageUrl = (e, src) => {
    const fallbacks = [
        'https://school-web-sandy.vercel.app',
        'https://school-web-rho-drab.vercel.app',
        'https://school-web-alpha.vercel.app',
        'https://school-web.vercel.app'
    ];
    
    // If it already failed, try to inject a fallback domain
    let path = src;
    if (path.startsWith('/uploads/Gallery/')) {
        path = path.replace('/uploads/Gallery/', '/Gallery/');
    } else if (path.startsWith('/uploads/')) {
        // do nothing
    }

    // This is used in onError
    const currentAttempt = e.target.getAttribute('data-attempt') || '0';
    const attemptIdx = parseInt(currentAttempt);
    
    if (attemptIdx < fallbacks.length) {
        e.target.setAttribute('data-attempt', (attemptIdx + 1).toString());
        e.target.src = `${fallbacks[attemptIdx]}${path}`;
    } else {
        // Final fallback: hide or show icon
        e.target.style.display = 'none';
    }
};

console.log('Final API_BASE_URL resolved to:', API_BASE_URL);
