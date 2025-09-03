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
  Tooltip
} from '@mui/material';
import {
  TrendingUp as TrendingIcon,
  Visibility as ViewIcon,
  Star as StarIcon,
  WhatshotRounded as HotIcon
} from '@mui/icons-material';
import { getTrendingProducts, logActivity } from '../features/recommendationsSlice';
import { getProductImageUrl } from '../utils/imageUtils';
import ProductCard from './ui/ProductCard';

const TrendingProducts = ({ showTitle = true, maxItems = 8 }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { trendingProducts, trendingLoading, error } = useSelector((state) => state.recommendations);
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getTrendingProducts(maxItems));
  }, [dispatch, maxItems]);

  const handleProductClick = (product) => {
    // Log activity if user is authenticated
    if (isAuthenticated && user?._id) {
      dispatch(logActivity({
        productId: product._id,
        action: 'viewed',
        metadata: {
          referrer: 'trending',
          section: 'trending_products'
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

  const getTrendRank = (index) => {
    if (index < 3) return 'hot';
    if (index < 6) return 'warm';
    return 'normal';
  };

  const getTrendColor = (rank) => {
    switch (rank) {
      case 'hot': return 'error';
      case 'warm': return 'warning';
      default: return 'success';
    }
  };

  const getTrendIcon = (rank) => {
    switch (rank) {
      case 'hot': return <HotIcon />;
      case 'warm': return <TrendingIcon />;
      default: return <StarIcon />;
    }
  };

  if (trendingLoading) {
    return (
      <Box sx={{ py: 4 }}>
        {showTitle && (
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3 }}>
            <TrendingIcon color="primary" />
            Trending Now
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
          <Button color="inherit" size="small" onClick={() => dispatch(getTrendingProducts(maxItems))}>
            Retry
          </Button>
        }
      >
        Unable to load trending products: {error}
      </Alert>
    );
  }

  if (!trendingProducts || trendingProducts.length === 0) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        {showTitle && (
          <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 3, justifyContent: 'center' }}>
            <TrendingIcon color="primary" />
            Trending Now
          </Typography>
        )}
        <Typography variant="body1" color="text.secondary">
          No trending products available at the moment.
        </Typography>
      </Box>
    );
  }

  const displayProducts = trendingProducts.slice(0, maxItems);

  return (
    <Box sx={{ py: 4 }}>
      {showTitle && (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <TrendingIcon color="primary" />
            Trending Now
          </Typography>
          <Chip 
            label={`${displayProducts.length} Hot Items`} 
            color="error" 
            size="small" 
            icon={<HotIcon />}
          />
        </Box>
      )}

      <div className="product-grid-container" data-product-grid>
        {displayProducts.map((product, index) => (
          <ProductCard 
            key={product._id}
            product={product} 
            variant="trending"
            showActions={true}
            trendingRank={index + 1}
            onClick={() => handleProductClick(product)}
          />
        ))}
      </div>

      <Box sx={{ mt: 3, textAlign: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          Trending products based on recent activity and engagement
        </Typography>
      </Box>
    </Box>
  );
};

export default memo(TrendingProducts);
