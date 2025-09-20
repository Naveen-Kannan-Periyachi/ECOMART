import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Tooltip,
  Stack,
  Rating,
  Grow
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  ShoppingCart,
  Share,
  LocationOn,
  Star,
  TrendingUp,
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

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      navigate('/login');
      return;
    }

    dispatch(addToCart({
      id: product._id,
      title: product.title,
      price: product.price,
      image: product.images?.[0],
      type: product.type,
      rentPricePerDay: product.rentPricePerDay
    }));
  };

  const toggleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handleShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (navigator.share) {
      navigator.share({
        title: product.title,
        text: product.description,
        url: `${window.location.origin}/product/${product._id}`,
      });
    } else {
      navigator.clipboard.writeText(`${window.location.origin}/product/${product._id}`);
    }
  };

  const handleCardClick = () => {
    navigate(`/product/${product._id}`);
  };

  // Use consistent height for all cards in grid view
  const getCardHeight = () => {
    if (isListView) return 'auto';
    // Consistent 380px height for all grid cards
    return '380px';
  };

  // Determine image height based on layout
  const getImageHeight = () => {
    if (isListView) return 150;
    // Fixed image height for consistent card layout
    return 180;
  };

  return (
    <Grow 
      in={true} 
      timeout={800} 
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      <Card 
        onClick={handleCardClick}
        sx={{ 
          height: getCardHeight(),
          minHeight: isListView ? 'auto' : '380px',
          maxHeight: isListView ? 'none' : '380px',
          display: 'flex',
          flexDirection: isListView ? 'row' : 'column',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          border: '1px solid #e2e8f0',
          borderRadius: 3,
          overflow: 'hidden',
          position: 'relative',
          cursor: 'pointer',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-8px)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.12)',
            '& .product-image': {
              transform: 'scale(1.05)'
            },
            '& .action-buttons': {
              transform: 'translateY(0)',
              opacity: 1
            },
            '& .hover-overlay': {
              opacity: 1
            }
          }
        }}
      >
        {/* Image Section */}
        <CardMedia
          component="div"
          className="product-image"
          sx={{
            height: getImageHeight(),
            width: isListView ? 200 : '100%',
            flexShrink: 0,
            position: 'relative',
            background: getProductBackgroundImage(product.images),
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '14px',
            fontWeight: 500,
            transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
            overflow: 'hidden'
          }}
        >
          {!product.images?.[0] && (
            <Typography variant="body2" color="inherit">
              No Image
            </Typography>
          )}
          
          {/* Hover Overlay */}
          <Box 
            className="hover-overlay"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.4) 100%)',
              opacity: 0,
              transition: 'opacity 0.3s ease'
            }} 
          />
          
          {/* Top Actions */}
          {showActions && (
            <Box sx={{
              position: 'absolute',
              top: 12,
              right: 12,
              display: 'flex',
              flexDirection: 'column',
              gap: 1,
              zIndex: 2
            }}>
              <Tooltip title={isFavorite ? 'Remove from wishlist' : 'Add to wishlist'}>
                <IconButton 
                  size="small"
                  onClick={toggleWishlist}
                  sx={{ 
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    '&:hover': { 
                      background: '#fff',
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  {isFavorite ? 
                    <Favorite sx={{ color: '#f56565', fontSize: 18 }} /> : 
                    <FavoriteBorder sx={{ fontSize: 18 }} />
                  }
                </IconButton>
              </Tooltip>
              
              <Tooltip title="Share">
                <IconButton 
                  size="small"
                  onClick={handleShare}
                  sx={{ 
                    background: 'rgba(255,255,255,0.95)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    '&:hover': { 
                      background: '#fff',
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  <Share sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            </Box>
          )}

          {/* Product Type Badge */}
          <Chip 
            label={product.type?.toUpperCase() || 'SALE'} 
            size="small" 
            sx={{
              position: 'absolute',
              top: 12,
              left: 12,
              background: product.type === 'sell' ? '#10b981' : 
                         product.type === 'rent' ? '#f59e0b' : '#6366f1',
              color: 'white',
              fontWeight: 600,
              fontSize: '11px',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
              zIndex: 2
            }}
          />

          {/* Status Badge */}
          {product.status && product.status !== 'available' && (
            <Chip 
              label={product.status.toUpperCase()} 
              size="small" 
              sx={{
                position: 'absolute',
                top: 12,
                left: product.type ? 100 : 12,
                background: product.status === 'sold' ? '#ef4444' : '#f59e0b',
                color: 'white',
                fontWeight: 600,
                fontSize: '11px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                zIndex: 2
              }}
            />
          )}

          {/* Quick Actions - Bottom Right */}
          {showActions && (
            <Box 
              className="action-buttons"
              sx={{
                position: 'absolute',
                bottom: 12,
                right: 12,
                display: 'flex',
                gap: 1,
                transform: 'translateY(10px)',
                opacity: 0,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                zIndex: 2
              }}
            >
              {product.type !== 'rent' && (
                <Tooltip title="Quick Add to Cart">
                  <IconButton
                    size="small"
                    onClick={handleAddToCart}
                    sx={{
                      background: 'rgba(102, 126, 234, 0.95)',
                      color: 'white',
                      backdropFilter: 'blur(10px)',
                      '&:hover': {
                        background: '#667eea',
                        transform: 'scale(1.1)'
                      }
                    }}
                  >
                    <ShoppingCart sx={{ fontSize: 16 }} />
                  </IconButton>
                </Tooltip>
              )}
            </Box>
          )}

          {/* Additional Info Overlay */}
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
        </CardMedia>
        
        {/* Content Section - Height constrained for consistent card size */}
        <CardContent sx={{ 
          flex: 1,
          p: 2,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          height: isListView ? 'auto' : 'calc(100% - 180px)', // Fixed content height
          maxHeight: isListView ? 'none' : 'calc(100% - 180px)',
          overflow: 'hidden'
        }}>
          {/* Header Info */}
          <Box sx={{ flex: '0 0 auto', minHeight: 0, mb: 1 }}>
            <Typography 
              variant={variant === 'compact' ? 'subtitle1' : 'h6'} 
              sx={{ 
                fontWeight: 600, 
                mb: 0.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                color: '#2d3748',
                lineHeight: 1.2,
                fontSize: '1rem'
              }}
            >
              {product.title}
            </Typography>
            
            {/* Category and Condition */}
            <Stack direction="row" spacing={0.5} sx={{ mb: 1, flexWrap: 'wrap', gap: 0.5, minHeight: '24px' }}>
              {product.category && (
                <Chip
                  label={product.category}
                  size="small"
                  variant="outlined"
                  sx={{ 
                    fontSize: '9px',
                    height: '18px',
                    borderColor: '#667eea', 
                    color: '#667eea'
                  }}
                />
              )}
              {product.condition && (
                <Chip
                  label={product.condition}
                  size="small"
                  variant="outlined"
                  sx={{ 
                    fontSize: '9px',
                    height: '18px',
                    borderColor: '#10b981', 
                    color: '#10b981'
                  }}
                />
              )}
            </Stack>
            
            {/* Location */}
            {product.location && (
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5, minHeight: '16px' }}>
                <LocationOn sx={{ fontSize: 12, color: 'text.secondary', mr: 0.5 }} />
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '11px' }}>
                  {product.location}
                </Typography>
              </Box>
            )}
          </Box>

          {/* Description Section */}
          <Box sx={{ flex: '1 1 auto', minHeight: 0, mb: 1, overflow: 'hidden' }}>
            {/* Description - Limited lines for consistent height */}
            {variant !== 'compact' && product.description && (
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  display: '-webkit-box',
                  WebkitLineClamp: 1, // Reduce to 1 line to prevent overlap
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  lineHeight: 1.3,
                  fontSize: '12px',
                  height: '15.6px', // Fixed height for 1 line
                  mb: 0
                }}
              >
                {product.description}
              </Typography>
            )}
          </Box>

          {/* Footer - Price and Actions - Fixed at bottom */}
          <Box sx={{ mt: 'auto', pt: 1, flex: '0 0 auto' }}>
            {/* Price Section */}
            <Box sx={{ mb: 1 }}>
              <Typography 
                variant={variant === 'featured' ? 'h5' : 'h6'} 
                sx={{ 
                  fontWeight: 700, 
                  color: '#667eea',
                  lineHeight: 1.1,
                  fontSize: '1.1rem',
                  mb: 0.5
                }}
              >
                ${product.price}
              </Typography>
              {product.type === 'rent' && product.rentPricePerDay && (
                <Typography variant="caption" color="text.secondary" sx={{ fontSize: '10px', lineHeight: 1 }}>
                  ${product.rentPricePerDay}/day
                </Typography>
              )}
              
              {product.rating && (
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                  <Rating value={product.rating} readOnly size="small" sx={{ fontSize: '0.8rem' }} />
                  <Typography variant="caption" sx={{ ml: 0.5, fontSize: '9px' }}>
                    ({product.rating})
                  </Typography>
                </Box>
              )}
            </Box>
            
            {/* Action Buttons - Same row for grid, responsive for list */}
            {showActions && (
              <Box sx={{ display: 'flex', gap: 0.5, flexDirection: isListView ? 'row' : 'row' }}>
                <Button
                  variant="contained"
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/product/${product._id}`);
                  }}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    textTransform: 'none',
                    fontWeight: 600,
                    py: 0.5,
                    px: isListView ? 1.5 : 1,
                    borderRadius: 2,
                    fontSize: '10px',
                    minHeight: '28px',
                    flex: 1,
                    '&:hover': {
                      background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                      transform: 'translateY(-1px)',
                    }
                  }}
                >
                  View Details
                </Button>
                
                {product.type !== 'rent' && (
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<ShoppingCart sx={{ fontSize: 12 }} />}
                    onClick={handleAddToCart}
                    sx={{
                      borderColor: '#667eea',
                      color: '#667eea',
                      textTransform: 'none',
                      fontWeight: 500,
                      py: 0.5,
                      px: isListView ? 1.5 : 1,
                      borderRadius: 2,
                      fontSize: '10px',
                      minHeight: '28px',
                      flex: 1,
                      '&:hover': {
                        background: 'rgba(102, 126, 234, 0.05)',
                        borderColor: '#764ba2',
                        color: '#764ba2'
                      }
                    }}
                  >
                    {isListView ? 'Add to Cart' : 'Cart'}
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </CardContent>
      </Card>
    </Grow>
  );
};

export default ProductCard;
