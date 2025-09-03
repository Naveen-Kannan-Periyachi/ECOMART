import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Rating,
  Grow
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  ShoppingCart,
  LocationOn,
  Visibility
} from '@mui/icons-material';
import { addToCart } from '../../features/cartSlice';
import { getProductBackgroundImage } from '../../utils/imageUtils';

const ProductCard = ({ 
  product, 
  isListView = false, 
  index = 0, 
  showActions = true,
  variant = 'default' // 'default', 'compact', 'featured'
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  const [isFavorite, setIsFavorite] = React.useState(false);

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!user) {
      navigate('/login');
      return;
    }
    
    dispatch(addToCart({
      productId: product._id,
      title: product.title,
      price: product.price,
      image: product.images?.[0],
      quantity: 1
    }));
  };

  return (
    <Grow 
      in={true} 
      timeout={800} 
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Card 
        className={`product-card ${isListView ? 'product-card-list' : ''}`}
        onClick={handleCardClick}
        sx={{ 
          cursor: 'pointer',
          '&:hover .product-image': {
            transform: 'scale(1.05)'
          }
        }}
      >
        {/* Image Section */}
        <div className="product-image-container">
          <img
            className="product-image"
            src={getProductBackgroundImage(product.images)}
            alt={product.title}
            loading="lazy"
          />

          {/* Status Badges */}
          <div className="product-status-badges">
            {product.type && (
              <div className={`product-status-badge product-status-${product.type}`}>
                {product.type.toUpperCase()}
              </div>
            )}
            {product.status && product.status !== 'available' && (
              <div className={`product-status-badge product-status-${product.status}`}>
                {product.status.toUpperCase()}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          {showActions && (
            <div className="product-quick-actions">
              <IconButton
                className="product-quick-action"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsFavorite(!isFavorite);
                }}
                size="small"
              >
                {isFavorite ? <Favorite /> : <FavoriteBorder />}
              </IconButton>
              
              {product.type !== 'rent' && (
                <IconButton
                  className="product-quick-action"
                  onClick={handleAddToCart}
                  size="small"
                >
                  <ShoppingCart />
                </IconButton>
              )}
            </div>
          )}

          {/* Views Badge */}
          {product.views && (
            <Box sx={{
              position: 'absolute',
              bottom: 12,
              left: 12,
              display: 'flex',
              alignItems: 'center',
              background: 'rgba(0,0,0,0.7)',
              color: 'white',
              px: 1,
              py: 0.5,
              borderRadius: 1,
              fontSize: '12px',
              zIndex: 2
            }}>
              <Visibility sx={{ fontSize: 12, mr: 0.5 }} />
              {product.views}
            </Box>
          )}
        </div>
        
        {/* Content Section */}
        <CardContent className="product-card-content">
          {/* Header */}
          <div className="product-card-header">
            <Typography className="product-title">
              {product.title}
            </Typography>
            
            {/* Tags */}
            <div className="product-tags">
              {product.category && (
                <Chip
                  className="product-chip"
                  label={product.category}
                  size="small"
                  variant="outlined"
                  sx={{ 
                    borderColor: '#667eea', 
                    color: '#667eea'
                  }}
                />
              )}
              {product.condition && (
                <Chip
                  className="product-chip"
                  label={product.condition}
                  size="small"
                  variant="outlined"
                  sx={{ 
                    borderColor: '#10b981', 
                    color: '#10b981'
                  }}
                />
              )}
            </div>
          </div>

          {/* Body */}
          <div className="product-card-body">
            {/* Location */}
            {product.location && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <LocationOn sx={{ fontSize: 14, color: 'text.secondary', mr: 0.5 }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '12px' }}>
                  {product.location}
                </Typography>
              </Box>
            )}
            
            {/* Description */}
            {variant !== 'compact' && product.description && (
              <Typography className="product-description">
                {product.description}
              </Typography>
            )}

            {/* Rating */}
            {product.rating && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Rating value={product.rating} readOnly size="small" sx={{ fontSize: '1rem' }} />
                <Typography variant="caption" sx={{ ml: 0.5, fontSize: '11px' }}>
                  ({product.rating})
                </Typography>
              </Box>
            )}
          </div>

          {/* Footer */}
          <div className="product-card-footer">
            {/* Price Section */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 2 }}>
              <Box>
                <Typography className="product-price">
                  ${product.price}
                </Typography>
                {product.type === 'rent' && product.rentPricePerDay && (
                  <Typography className="product-price-secondary">
                    ${product.rentPricePerDay}/day
                  </Typography>
                )}
              </Box>
            </Box>
            
            {/* Action Buttons */}
            {showActions && (
              <div className="product-actions">
                <Button
                  className="product-button-primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/product/${product._id}`);
                  }}
                >
                  View Details
                </Button>
                
                {product.type !== 'rent' && !isListView && (
                  <Button
                    className="product-button-secondary"
                    onClick={handleAddToCart}
                  >
                    Add to Cart
                  </Button>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Grow>
  );
};

export default ProductCard;
