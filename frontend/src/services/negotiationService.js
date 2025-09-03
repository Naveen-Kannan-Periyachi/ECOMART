import axios from 'axios';
import config from '../config/config.js';

const API_URL = config.API_URL;

// Create axios instance with auth interceptor
const negotiationAPI = axios.create({
  baseURL: `${API_URL}/negotiations`,
});

// Add auth token to requests
negotiationAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export class NegotiationService {
  // Start a new negotiation
  static async startNegotiation(productId, proposedPrice, message = '') {
    try {
      const response = await negotiationAPI.post('/', {
        productId,
        proposedPrice,
        message
      });
      return response.data;
    } catch (error) {
      console.error('Error starting negotiation:', error);
      throw error;
    }
  }

  // Get user's negotiations
  static async getNegotiations(params = {}) {
    try {
      const response = await negotiationAPI.get('/', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching negotiations:', error);
      throw error;
    }
  }

  // Get specific negotiation details
  static async getNegotiation(negotiationId) {
    try {
      const response = await negotiationAPI.get(`/${negotiationId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching negotiation:', error);
      throw error;
    }
  }

  // Respond to a negotiation
  static async respondToNegotiation(negotiationId, action, data = {}) {
    try {
      const response = await negotiationAPI.patch(`/${negotiationId}/respond`, {
        action,
        ...data
      });
      return response.data;
    } catch (error) {
      console.error('Error responding to negotiation:', error);
      throw error;
    }
  }

  // Accept negotiation
  static async acceptNegotiation(negotiationId, message = '') {
    return this.respondToNegotiation(negotiationId, 'accept', { message });
  }

  // Reject negotiation
  static async rejectNegotiation(negotiationId, message = '') {
    return this.respondToNegotiation(negotiationId, 'reject', { message });
  }

  // Make counter offer
  static async makeCounterOffer(negotiationId, counterOffer, message = '') {
    return this.respondToNegotiation(negotiationId, 'counter', { counterOffer, message });
  }

  // Cancel negotiation
  static async cancelNegotiation(negotiationId) {
    try {
      const response = await negotiationAPI.delete(`/${negotiationId}`);
      return response.data;
    } catch (error) {
      console.error('Error cancelling negotiation:', error);
      throw error;
    }
  }

  // Get product negotiation statistics
  static async getProductNegotiationStats(productId) {
    try {
      const response = await negotiationAPI.get(`/product/${productId}/stats`);
      return response.data;
    } catch (error) {
      console.error('Error fetching product negotiation stats:', error);
      throw error;
    }
  }

  // Helper methods for formatting
  static formatNegotiationStatus(status) {
    const statusMap = {
      PENDING: { label: 'Pending', color: 'warning', icon: '⏳' },
      ACCEPTED: { label: 'Accepted', color: 'success', icon: '✅' },
      REJECTED: { label: 'Rejected', color: 'error', icon: '❌' },
      COUNTER_OFFERED: { label: 'Counter Offered', color: 'info', icon: '🔄' },
      EXPIRED: { label: 'Expired', color: 'default', icon: '⏰' }
    };
    return statusMap[status] || { label: status, color: 'default', icon: '❓' };
  }

  static calculateSavings(originalPrice, currentPrice) {
    const savings = originalPrice - currentPrice;
    const percentage = Math.round((savings / originalPrice) * 100);
    return { savings, percentage };
  }

  static getTimeRemaining(expiresAt) {
    const now = new Date();
    const expires = new Date(expiresAt);
    const diffMs = expires - now;
    
    if (diffMs <= 0) return { expired: true, text: 'Expired' };
    
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
      return { expired: false, text: `${days}d ${hours}h remaining` };
    } else if (hours > 0) {
      return { expired: false, text: `${hours}h remaining` };
    } else {
      const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      return { expired: false, text: `${minutes}m remaining` };
    }
  }

  static formatPriceChange(oldPrice, newPrice) {
    const difference = newPrice - oldPrice;
    const percentage = Math.round((difference / oldPrice) * 100);
    
    return {
      difference,
      percentage,
      isIncrease: difference > 0,
      isDecrease: difference < 0,
      formatted: difference > 0 ? `+$${difference}` : `-$${Math.abs(difference)}`
    };
  }

  // Validation helpers
  static validateNegotiationData(productPrice, proposedPrice) {
    const errors = [];
    
    if (!proposedPrice || proposedPrice <= 0) {
      errors.push('Proposed price must be greater than 0');
    }
    
    if (proposedPrice >= productPrice) {
      errors.push('Proposed price must be less than the original price');
    }
    
    if (proposedPrice < productPrice * 0.1) {
      errors.push('Proposed price seems too low (less than 10% of original price)');
    }
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  static getSuggestedPrices(originalPrice) {
    return [
      { label: '10% off', price: Math.round(originalPrice * 0.9) },
      { label: '15% off', price: Math.round(originalPrice * 0.85) },
      { label: '20% off', price: Math.round(originalPrice * 0.8) },
      { label: '25% off', price: Math.round(originalPrice * 0.75) },
    ];
  }
}

export default NegotiationService;
