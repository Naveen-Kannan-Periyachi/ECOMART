import React, { useEffect, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  Chip,
  Skeleton,
  Alert,
  CircularProgress
} from '@mui/material';
import {
  Visibility as ViewIcon,
  TrendingUp as TrendingIcon,
  ThumbUp as RecommendIcon
} from '@mui/icons-material';
import { getRecommendations, logActivity } from '../features/recommendationsSlice';
import { getProductImageUrl, handleImageError } from '../utils/imageUtils';
import ProductCard from './ui/ProductCard';

const RecommendedProducts = ({ userId, showTitle = true, maxItems = 8, variant = 'recommendations' }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { recommendations, loading, error, metadata } = useSelector((state) => state.recommendations);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && (userId || user?._id)) {
      dispatch(getRecommendations(userId || user._id));
    }
  }, [dispatch, userId, user?._id, isAuthenticated]);

  const handleProductClick = (product) => {
    // Log activity
    if (isAuthenticated && user?._id) {
      dispatch(logActivity({
        productId: product._id,
        action: 'viewed',
        metadata: {
          referrer: 'recommendations',
          section: variant
        }
      }));
    }
    navigate(`/product/${product._id}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(price);
  };

  const getProductImage = (images) => {
    return getProductImageUrl(images);
  };

  if (!isAuthenticated) {
    return null;
  }

  if (loading) {
    return (
      <Box sx={{ py: 4 }}>
        {showTitle && (
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <RecommendIcon color="primary" />
            Recommended for You
          </Typography>
        )}
        <div className="product-grid-container" data-product-grid>
          {Array.from({ length: maxItems }).map((_, index) => (
            <Card key={index} sx={{ height: '100%' }}>
              <Skeleton variant="rectangular" height={200} />
              <CardContent>
                <Skeleton variant="text" height={28} />
                <Skeleton variant="text" height={20} width="60%" />
                <Skeleton variant="text" height={20} width="40%" />
              </CardContent>
            </Card>
          ))}
        </div>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert 
        severity="warning" 
        sx={{ my: 2 }}
        action={
          <Button color="inherit" size="small" onClick={() => dispatch(getRecommendations(userId || user?._id))}>
            Retry
          </Button>
        }
      >
        Unable to load recommendations: {error}
      </Alert>
    );
  }

  if (!recommendations || recommendations.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        {showTitle && (
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, justifyContent: 'center' }}>
            <RecommendIcon color="primary" />
            Recommended for You
          </Typography>
        )}
        <Typography variant="body1" color="text.secondary">
          Start browsing products to get personalized recommendations!
        </Typography>
      </Box>
    );
  }

  const displayProducts = recommendations.slice(0, maxItems);

  return (
    <Box sx={{ py: 4 }}>
      {showTitle && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <RecommendIcon color="primary" />
            Recommended for You
          </Typography>
          {metadata && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {metadata.hasPersonalization && (
                <Chip 
                  label="Personalized" 
                  color="primary" 
                  size="small" 
                  icon={<RecommendIcon />}
                />
              )}
              {metadata.fallback && (
                <Chip 
                  label="Trending" 
                  color="secondary" 
                  size="small" 
                  icon={<TrendingIcon />}
                />
              )}
            </Box>
          )}
        </Box>
      )}

      <div className="product-grid-container" data-product-grid>
        {displayProducts.map((product) => (
          <ProductCard 
            key={product._id}
            product={product} 
            variant="recommended"
            showActions={true}
            onClick={() => handleProductClick(product)}
          />
        ))}
      </div>

      {metadata && metadata.totalActivities > 0 && (
        <Box sx={{ mt: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Based on your {metadata.totalActivities} interactions
            {metadata.userCategories?.length > 0 && (
              <span> in {metadata.userCategories.join(', ')}</span>
            )}
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default memo(RecommendedProducts);
