// Image utility functions for consistent image URL handling
import config from '../config/config.js';

const BASE_URL = config.API_URL.replace('/api', ''); // Remove /api to get base server URL
// Use a data URL for placeholder to avoid external dependency
const PLACEHOLDER_IMAGE = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0iI2Y4ZjlmYSIvPgo8dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmaWxsPSIjNjM2MzYzIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gSW1hZ2U8L3RleHQ+Cjwvc3ZnPg==';

/**
 * Get the full URL for a product image
 * @param {string|Array} images - Single image path or array of image paths
 * @param {number} index - Index of image to get (default: 0)
 * @returns {string} Full image URL
 */
export const getProductImageUrl = (images, index = 0) => {
  // Handle array of images
  if (Array.isArray(images) && images.length > 0) {
    const image = images[index] || images[0];
    if (!image) return PLACEHOLDER_IMAGE;
    
    // Return as-is if it's already a full URL
    if (image.startsWith('http')) {
      return image;
    }
    
    // Construct full URL for relative paths
    return `${BASE_URL}${image}`;
  }
  
  // Handle single image string
  if (typeof images === 'string' && images.length > 0) {
    if (images.startsWith('http')) {
      return images;
    }
    return `${BASE_URL}${images}`;
  }
  
  // Return placeholder if no valid image
  return PLACEHOLDER_IMAGE;
};

/**
 * Get multiple image URLs for gallery/carousel
 * @param {Array} images - Array of image paths
 * @returns {Array} Array of image objects with original and thumbnail URLs
 */
export const getProductImageGallery = (images) => {
  if (!Array.isArray(images) || images.length === 0) {
    return [{
      original: PLACEHOLDER_IMAGE,
      thumbnail: PLACEHOLDER_IMAGE
    }];
  }
  
  return images.map(img => ({
    original: img.startsWith('http') ? img : `${BASE_URL}${img}`,
    thumbnail: img.startsWith('http') ? img : `${BASE_URL}${img}`
  }));
};

/**
 * Get CSS background image URL
 * @param {string|Array} images - Single image path or array of image paths
 * @param {number} index - Index of image to get (default: 0)
 * @returns {string} CSS background image value
 */
export const getProductBackgroundImage = (images, index = 0) => {
  const imageUrl = getProductImageUrl(images, index);
  if (imageUrl === PLACEHOLDER_IMAGE || !imageUrl || imageUrl.startsWith('data:')) {
    return 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)';
  }
  return `url(${imageUrl}) center/cover`;
};

/**
 * Handle image load errors by setting fallback
 * @param {Event} event - Image error event
 */
export const handleImageError = (event) => {
  event.target.src = PLACEHOLDER_IMAGE;
  event.target.onerror = null; // Prevent infinite loop
};
