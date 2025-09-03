// Frontend configuration
const config = {
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:5001/api',
  BASE_URL: import.meta.env.VITE_BASE_URL || 'http://localhost:5173',
  SOCKET_URL: import.meta.env.VITE_SOCKET_URL || 'http://localhost:5001',
  APP_NAME: 'ECOMART',
  APP_VERSION: '1.0.0',
  ITEMS_PER_PAGE: 12,
  MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
  SUPPORTED_IMAGE_FORMATS: ['image/jpeg', 'image/png', 'image/webp'],
};

export default config;