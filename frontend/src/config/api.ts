// Base URL for API
// Production (via Cloudflare Tunnel): https://api.alzera.web.id
// Development (local): http://localhost:5000
// Override: VITE_API_URL environment variable

const getApiUrl = () => {
  // Priority 1: Environment variable (VITE_API_URL)
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }
  
  // Priority 2: Auto-detect based on hostname
  const hostname = window.location.hostname;
  
  // Production: via Cloudflare tunnel
  if (hostname === 'alzera.web.id' || hostname === 'www.alzera.web.id') {
    return 'https://api.alzera.web.id';
  }
  
  // Development: localhost
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return 'http://localhost:5000';
  }
  
  // Fallback
  return 'http://localhost:5000';
};

export const API_BASE_URL = getApiUrl();

// API Endpoints
export const API_ENDPOINTS = {
  health: `${API_BASE_URL}/api/health`,
  contact: `${API_BASE_URL}/api/contact`,
  auth: {
    login: `${API_BASE_URL}/api/auth/login`,
    me: `${API_BASE_URL}/api/auth/me`,
  },
  profile: `${API_BASE_URL}/api/profile`,
  theme: `${API_BASE_URL}/api/theme`,
  services: `${API_BASE_URL}/api/services`,
  projects: `${API_BASE_URL}/api/projects`,
  team: `${API_BASE_URL}/api/team`,
  testimonials: `${API_BASE_URL}/api/testimonials`,
  pricing: `${API_BASE_URL}/api/pricing`,
  upload: `${API_BASE_URL}/api/upload`,
  heroCards: `${API_BASE_URL}/api/hero-cards`,
};

// Debug logging
console.log('[API Config] Hostname:', window.location.hostname);
console.log('[API Config] API_BASE_URL:', API_BASE_URL);
