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

  // Determine card height based on variant
  const getCardHeight = () => {
    if (isListView) return 'auto';
    // Use consistent height for all cards in grid view
    return '100%';
  };

  // Determine image height based on variant
  const getImageHeight = () => {
    if (isListView) return 150;
    switch (variant) {
      case 'compact': return 160;
      case 'featured': return 220;
      default: return 200;
    }
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
        
        {/* Content Section */}
        <CardContent sx={{ 
          flex: 1,
          p: 2.5,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          height: isListView ? 'auto' : undefined
        }}>
          {/* Header Info */}
          <Box sx={{ flex: '1 1 auto', minHeight: 0 }}>
            <Typography 
              variant={variant === 'compact' ? 'subtitle1' : 'h6'} 
              sx={{ 
                fontWeight: 600, 
                mb: 1,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                color: '#2d3748',
                lineHeight: 1.3
              }}
            >
              {product.title}
            </Typography>
            
            {/* Category and Condition */}
            <Stack direction="row" spacing={1} sx={{ mb: 1.5, flexWrap: 'wrap', gap: 0.5 }}>
              {product.category && (
                <Chip
                  label={product.category}
                  size="small"
                  variant="outlined"
                  sx={{ 
                    fontSize: '10px',
                    height: '20px',
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
                    fontSize: '10px',
                    height: '20px',
                    borderColor: '#10b981', 
                    color: '#10b981'
                  }}
                />
              )}
            </Stack>
            
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
              <Typography 
                variant="body2" 
                color="text.secondary" 
                sx={{ 
                  mb: 1.5,
                  display: '-webkit-box',
                  WebkitLineClamp: isListView ? 2 : 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  lineHeight: 1.4,
                  fontSize: '13px'
                }}
              >
                {product.description}
              </Typography>
            )}
          </Box>

          {/* Footer - Price and Actions */}
          <Box sx={{ mt: 'auto', pt: 2, flex: '0 0 auto' }}>
            {/* Price Section */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 1.5 }}>
              <Box>
                <Typography 
                  variant={variant === 'featured' ? 'h5' : 'h6'} 
                  sx={{ 
                    fontWeight: 700, 
                    color: '#667eea',
                    lineHeight: 1.2
                  }}
                >
                  ${product.price}
                </Typography>
                {product.type === 'rent' && product.rentPricePerDay && (
                  <Typography variant="caption" color="text.secondary" sx={{ fontSize: '11px' }}>
                    ${product.rentPricePerDay}/day
                  </Typography>
                )}
              </Box>
              
              {product.rating && (
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Rating value={product.rating} readOnly size="small" sx={{ fontSize: '1rem' }} />
                  <Typography variant="caption" sx={{ ml: 0.5, fontSize: '11px' }}>
                    ({product.rating})
                  </Typography>
                </Box>
              )}
            </Box>
            
            {/* Action Buttons */}
            {showActions && (
              <Stack direction={isListView ? 'row' : 'column'} spacing={1}>
                <Button
                  variant="contained"
                  size="small"
                  fullWidth
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/product/${product._id}`);
                  }}
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    textTransform: 'none',
                    fontWeight: 600,
                    py: isListView ? 0.75 : 1,
                    borderRadius: 2,
                    fontSize: '12px',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                      transform: 'translateY(-1px)',
                    }
                  }}
                >
                  View Details
                </Button>
                
                {product.type !== 'rent' && !isListView && (
                  <Button
                    variant="outlined"
                    size="small"
                    fullWidth
                    startIcon={<ShoppingCart sx={{ fontSize: 16 }} />}
                    onClick={handleAddToCart}
                    sx={{
                      borderColor: '#667eea',
                      color: '#667eea',
                      textTransform: 'none',
                      fontWeight: 500,
                      py: 0.75,
                      borderRadius: 2,
                      fontSize: '12px',
                      '&:hover': {
                        background: 'rgba(102, 126, 234, 0.05)',
                        borderColor: '#764ba2',
                        color: '#764ba2'
                      }
                    }}
                  >
                    Add to Cart
                  </Button>
                )}
              </Stack>
            )}
          </Box>
        </CardContent>
      </Card>
    </Grow>
  );
};

export default ProductCard;
