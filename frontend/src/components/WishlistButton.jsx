import React, { useState, useEffect, useCallback } from 'react';
import { 
  IconButton, 
  Tooltip, 
  Badge,
  CircularProgress,
  Snackbar,
  Alert
} from '@mui/material';
import {
  FavoriteOutlined as FavoriteOutlinedIcon,
  Favorite as FavoriteIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import api from '../services/api';

const WishlistButton = ({ 
  productId, 
  size = 'medium',
  showBadge = false,
  onWishlistChange = null 
}) => {
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  
  const { user } = useSelector((state) => state.auth);

  const checkWishlistStatus = useCallback(async () => {
    try {
      const response = await api.get(`/wishlist/check/${productId}`);
      setIsInWishlist(response.data.data.isInWishlist);
    } catch (error) {
      console.error('Error checking wishlist status:', error);
    }
  }, [productId]);

  // Check if product is in wishlist on component mount
  useEffect(() => {
    if (user && productId) {
      checkWishlistStatus();
    }
  }, [user, productId, checkWishlistStatus]);

  const handleWishlistToggle = async (event) => {
    event.preventDefault();
    event.stopPropagation();

    if (!user) {
      setSnackbar({
        open: true,
        message: 'Please login to add items to wishlist',
        severity: 'warning'
      });
      return;
    }

    if (loading) return;

    setLoading(true);

    try {
      if (isInWishlist) {
        // Remove from wishlist
        await api.delete(`/wishlist/remove/${productId}`);
        setIsInWishlist(false);
        setSnackbar({
          open: true,
          message: 'Removed from wishlist',
          severity: 'success'
        });
      } else {
        // Add to wishlist
        await api.post('/wishlist/add', { productId });
        setIsInWishlist(true);
        setSnackbar({
          open: true,
          message: 'Added to wishlist',
          severity: 'success'
        });
      }

      // Notify parent component of wishlist change
      if (onWishlistChange) {
        onWishlistChange(productId, !isInWishlist);
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
      setSnackbar({
        open: true,
        message: error.response?.data?.message || 'Error updating wishlist',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  if (!user) {
    return null; // Don't show wishlist button for non-authenticated users
  }

  const iconColor = isInWishlist ? 'error' : 'default';
  const tooltipTitle = isInWishlist ? 'Remove from wishlist' : 'Add to wishlist';

  const WishlistIcon = () => {
    if (loading) {
      return <CircularProgress size={size === 'small' ? 16 : 20} />;
    }
    return isInWishlist ? <FavoriteIcon /> : <FavoriteOutlinedIcon />;
  };

  return (
    <>
      <Tooltip title={tooltipTitle} placement="top">
        <IconButton
          onClick={handleWishlistToggle}
          color={iconColor}
          size={size}
          disabled={loading}
          sx={{
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'scale(1.1)',
              backgroundColor: 'rgba(255, 20, 147, 0.1)'
            },
            '& .MuiSvgIcon-root': {
              transition: 'all 0.2s ease-in-out'
            }
          }}
        >
          {showBadge ? (
            <Badge 
              variant="dot" 
              color="error"
              invisible={!isInWishlist}
            >
              <WishlistIcon />
            </Badge>
          ) : (
            <WishlistIcon />
          )}
        </IconButton>
      </Tooltip>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleSnackbarClose} 
          severity={snackbar.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default WishlistButton;