// Base URL for API (Default ke local backend, atau disetel via VITE_API_URL)
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

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
};
