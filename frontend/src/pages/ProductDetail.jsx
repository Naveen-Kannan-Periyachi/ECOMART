
import React, { useEffect, useState, useRef, memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Container, 
  Grid, 
  Paper, 
  Typography, 
  Box, 
  Button, 
  Chip, 
  CircularProgress, 
  Alert,
  Card,
  CardContent,
  Avatar,
  Divider,
  IconButton,
  Stack,
  Rating
} from '@mui/material';
import {
  ShoppingCart,
  Chat,
  Phone,
  Email,
  LocationOn,
  Person,
  Visibility,
  Share,
  Favorite,
  FavoriteBorder,
  MonetizationOn
} from '@mui/icons-material';
import { api } from '../utils/api';
import { addToCart } from '../features/cartSlice';
import RecommendedProducts from '../components/RecommendedProducts';
import { logActivity } from '../features/recommendationsSlice';
import { getProductImageGallery, handleImageError } from '../utils/imageUtils';
import NegotiationDialog from '../components/NegotiationDialog';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((state) => state.auth);
    
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [buying, setBuying] = useState(false);
    const [chatLoading, setChatLoading] = useState(false);
    const [negotiationDialogOpen, setNegotiationDialogOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const hasLoggedViewRef = useRef(false);

    useEffect(() => {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const response = await api.get(`/products/${id}`);
          setProduct(response.data);
          setError(null);
          
          // Log activity if user is authenticated and not already logged
          if (user && user._id && !hasLoggedViewRef.current) {
            dispatch(logActivity({
              productId: id,
              action: 'viewed',
              metadata: {
                referrer: 'direct',
                source: 'product_detail_page'
              }
            }));
            hasLoggedViewRef.current = true;
          }
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to load product');
        } finally {
          setLoading(false);
        }
      };
      
      if (id) {
        hasLoggedViewRef.current = false; // Reset flag for new product
        fetchProduct();
      }
    }, [id, user, dispatch]);

    const handleBuyNow = async () => {
      if (!user) {
        navigate('/login', { state: { from: `/product/${id}` } });
        return;
      }
      
      if (product.owner._id === user._id) {
        alert('You cannot buy your own product');
        return;
      }
      
      setBuying(true);
      try {
        const response = await api.post('/orders', { 
          products: [id] 
        });
        
        // Add to cart for immediate feedback
        dispatch(addToCart({
          id: product._id,
          title: product.title,
          price: product.price,
          image: product.images?.[0],
          type: product.type,
          quantity: 1
        }));
        
        navigate(`/orders/${response.data._id}`);
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to create order');
      } finally {
        setBuying(false);
      }
    };

    const handleNegotiate = async () => {
      if (!user) {
        navigate('/login', { state: { from: `/product/${id}` } });
        return;
      }
      
      if (product.owner._id === user._id) {
        alert('You cannot negotiate with yourself');
        return;
      }
      
      setNegotiationDialogOpen(true);
    };

    const handleStartChat = async () => {
      if (!user) {
        navigate('/login', { state: { from: `/product/${id}` } });
        return;
      }
      
      if (product.owner._id === user._id) {
        alert('You cannot chat with yourself');
        return;
      }
      
      setChatLoading(true);
      try {
        const response = await api.post('/chat/start', { 
          productId: id 
        });
        
        // Handle both old and new response formats
        const chatId = response.data._id || response.data.data?._id;
        
        if (!chatId) {
          throw new Error('Invalid chat response format');
        }
        
        navigate(`/chat/${chatId}`);
      } catch (err) {
        console.error('Chat start error:', err);
        const errorMessage = err.response?.data?.message || 
                           err.response?.data?.error || 
                           'Failed to start chat';
        alert(errorMessage);
      } finally {
        setChatLoading(false);
      }
    };

    const handleNegotiationStarted = () => {
      // You can add any success actions here, like showing a success message
      alert('Negotiation started successfully! The seller will be notified.');
    };

    const handleToggleFavorite = async () => {
      if (!user) {
        navigate('/login');
        return;
      }
      
      try {
        // Optimistic update
        setIsFavorite(!isFavorite);
        
        // Make API call to save/remove from favorites
        if (isFavorite) {
          await api.delete(`/users/favorites/${id}`);
        } else {
          await api.post(`/users/favorites/${id}`);
        }
      } catch (error) {
        // Revert optimistic update on error
        setIsFavorite(isFavorite);
        console.error('Error updating favorites:', error);
      }
    };

    const handleShare = async () => {
      if (navigator.share) {
        try {
          await navigator.share({
            title: product.title,
            text: product.description,
            url: window.location.href,
          });
        } catch (err) {
          console.log('Error sharing:', err);
        }
      } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      }
    };

    if (loading) {
      return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
            <CircularProgress size={60} />
          </Box>
        </Container>
      );
    }
    
    if (error) {
      return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button onClick={() => navigate('/products')} variant="contained">
            Back to Products
          </Button>
        </Container>
      );
    }
    
    if (!product) {
      return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
          <Alert severity="warning">Product not found</Alert>
        </Container>
      );
    }

    const images = getProductImageGallery(product.images);

    const seller = product.owner || {};
    const isOwner = user && seller._id === user._id;

    return (
      <>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Grid container spacing={4} sx={{ minHeight: '70vh' }}>
            {/* Left: Images */}
            <Grid item xs={12} lg={7}>
              <Paper 
                elevation={3} 
                sx={{ 
                  p: 3, 
                  borderRadius: 3,
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  border: '1px solid #e2e8f0',
                  height: 'fit-content',
                  position: 'sticky',
                  top: 20
                }}
              >
                {/* Main Image */}
                <Box sx={{ mb: 3, position: 'relative' }}>
                  <img
                    src={images[selectedImageIndex]?.original}
                    alt={product.title}
                    style={{
                      width: '100%',
                      height: '450px',
                      objectFit: 'cover',
                      borderRadius: '12px',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.1)'
                    }}
                    onError={handleImageError}
                  />
                  
                  {/* Image Actions */}
                  <Box sx={{ 
                    position: 'absolute', 
                    top: 16, 
                    right: 16, 
                    display: 'flex', 
                    gap: 1,
                    zIndex: 10
                  }}>
                    <IconButton
                      onClick={handleShare}
                      sx={{
                        background: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        '&:hover': { 
                          background: '#fff',
                          transform: 'scale(1.05)'
                        }
                      }}
                    >
                      <Share />
                    </IconButton>
                    <IconButton
                      onClick={handleToggleFavorite}
                      sx={{
                        background: 'rgba(255,255,255,0.95)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.3)',
                        '&:hover': { 
                          background: '#fff',
                          transform: 'scale(1.05)'
                        }
                      }}
                    >
                      {isFavorite ? <Favorite sx={{ color: '#f56565' }} /> : <FavoriteBorder />}
                    </IconButton>
                  </Box>

                  {/* Product Status Badge */}
                  <Box sx={{ 
                    position: 'absolute', 
                    top: 16, 
                    left: 16,
                    display: 'flex',
                    gap: 1,
                    zIndex: 10
                  }}>
                    <Chip 
                      label={product.type?.toUpperCase()} 
                      sx={{
                        background: product.type === 'sell' ? '#10b981' : 
                                   product.type === 'rent' ? '#f59e0b' : '#6366f1',
                        color: 'white',
                        fontWeight: 600,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }}
                    />
                    <Chip 
                      label={product.status?.toUpperCase()} 
                      sx={{
                        background: product.status === 'available' ? '#10b981' : 
                                   product.status === 'sold' ? '#ef4444' : '#f59e0b',
                        color: 'white',
                        fontWeight: 600,
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                      }}
                    />
                  </Box>
                </Box>
                
                {/* Thumbnail Images */}
                {images.length > 1 && (
                  <Grid container spacing={2}>
                    {images.map((image, index) => (
                      <Grid item xs={3} sm={2} key={index}>
                        <Box
                          component="img"
                          src={image.thumbnail}
                          alt={`${product.title} ${index + 1}`}
                          onClick={() => setSelectedImageIndex(index)}
                          onError={handleImageError}
                          sx={{
                            width: '100%',
                            height: '80px',
                            objectFit: 'cover',
                            borderRadius: 2,
                            cursor: 'pointer',
                            border: selectedImageIndex === index ? '3px solid #667eea' : '2px solid #e2e8f0',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              borderColor: '#667eea',
                              transform: 'scale(1.05)',
                              boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                            }
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                )}
              </Paper>
            </Grid>

            {/* Right: Product Details */}
            <Grid item xs={12} lg={5}>
              <Stack spacing={3} sx={{ height: '100%' }}>
                {/* Product Info */}
                <Paper elevation={3} sx={{ p: 3, borderRadius: 3, flex: 1 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                    {product.views && (
                      <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                        <Visibility sx={{ fontSize: 16, mr: 0.5 }} />
                        <Typography variant="caption">{product.views} views</Typography>
                      </Box>
                    )}
                  </Box>

                  <Typography variant="h4" sx={{ 
                    fontWeight: 700, 
                    mb: 2, 
                    color: '#2d3748',
                    lineHeight: 1.2
                  }}>
                    {product.title}
                  </Typography>

                  <Typography variant="h5" sx={{ 
                    fontWeight: 700, 
                    color: '#667eea', 
                    mb: 3,
                    display: 'flex',
                    alignItems: 'baseline',
                    gap: 1
                  }}>
                    ${product.price}
                    {product.type === 'rent' && product.rentPricePerDay && (
                      <Typography variant="body2" color="text.secondary">
                        (${product.rentPricePerDay}/day)
                      </Typography>
                    )}
                  </Typography>

                  <Typography variant="body1" sx={{ 
                    mb: 3, 
                    lineHeight: 1.7,
                    color: '#4a5568'
                  }}>
                    {product.description}
                  </Typography>

                  <Grid container spacing={3} sx={{ mb: 3 }}>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Category
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {product.category}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Condition
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {product.condition}
                      </Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Location
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {product.location}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Action Buttons */}
                  {!isOwner && (
                    <Stack direction="column" spacing={2}>
                      <Button
                        variant="contained"
                        size="large"
                        fullWidth
                        startIcon={<ShoppingCart />}
                        onClick={handleBuyNow}
                        disabled={buying || product.status !== 'available'}
                        sx={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          py: 1.5,
                          fontWeight: 600,
                          fontSize: '1.1rem',
                          borderRadius: 2,
                          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
                          '&:hover': {
                            background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                            transform: 'translateY(-2px)',
                            boxShadow: '0 12px 40px rgba(102, 126, 234, 0.6)'
                          }
                        }}
                      >
                        {buying ? 'Processing...' : 'Buy Now'}
                      </Button>
                      
                      <Stack direction="row" spacing={2}>
                        <Button
                          variant="outlined"
                          size="large"
                          fullWidth
                          startIcon={<MonetizationOn />}
                          onClick={handleNegotiate}
                          disabled={product.status !== 'available'}
                          sx={{
                            borderColor: '#ff6b6b',
                            color: '#ff6b6b',
                            py: 1.5,
                            fontWeight: 600,
                            borderWidth: 2,
                            borderRadius: 2,
                            '&:hover': {
                              borderColor: '#ff5252',
                              color: '#ff5252',
                              borderWidth: 2,
                              background: 'rgba(255, 107, 107, 0.04)',
                              transform: 'translateY(-1px)'
                            }
                          }}
                        >
                          Negotiate
                        </Button>

                        <Button
                          variant="outlined"
                          size="large"
                          fullWidth
                          startIcon={<Chat />}
                          onClick={handleStartChat}
                          disabled={chatLoading}
                          sx={{
                            borderColor: '#667eea',
                            color: '#667eea',
                            py: 1.5,
                            fontWeight: 600,
                            borderWidth: 2,
                            borderRadius: 2,
                            '&:hover': {
                              borderColor: '#764ba2',
                              color: '#764ba2',
                              borderWidth: 2,
                              background: 'rgba(102, 126, 234, 0.04)',
                              transform: 'translateY(-1px)'
                            }
                          }}
                        >
                          {chatLoading ? 'Loading...' : 'Message'}
                        </Button>
                      </Stack>
                    </Stack>
                  )}

                  {isOwner && (
                    <Alert severity="info" sx={{ mt: 2, borderRadius: 2 }}>
                      This is your product listing
                    </Alert>
                  )}
                </Paper>

                {/* Seller Info */}
                <Card elevation={3} sx={{ borderRadius: 3 }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ 
                      mb: 2, 
                      display: 'flex', 
                      alignItems: 'center',
                      fontWeight: 600
                    }}>
                      <Person sx={{ mr: 1 }} />
                      Seller Information
                    </Typography>
                    
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ 
                        mr: 2, 
                        bgcolor: '#667eea',
                        width: 56,
                        height: 56,
                        fontSize: '1.5rem'
                      }}>
                        {seller.name?.charAt(0)?.toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 0.5 }}>
                          {seller.name}
                        </Typography>
                        <Rating value={4.5} readOnly size="small" />
                      </Box>
                    </Box>

                    <Divider sx={{ my: 2 }} />

                    <Stack spacing={1.5}>
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Email sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
                        <Typography variant="body2">{seller.email}</Typography>
                      </Box>
                      
                      {seller.phone && (
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Phone sx={{ fontSize: 18, color: 'text.secondary', mr: 1 }} />
                          <Typography variant="body2">{seller.phone}</Typography>
                        </Box>
                      )}
                    </Stack>

                    {!isOwner && (
                      <Button
                        variant="outlined"
                        fullWidth
                        startIcon={<Chat />}
                        onClick={handleStartChat}
                        disabled={chatLoading}
                        sx={{ 
                          mt: 2,
                          py: 1,
                          borderRadius: 2,
                          borderWidth: 2,
                          '&:hover': {
                            borderWidth: 2
                          }
                        }}
                      >
                        Contact Seller
                      </Button>
                    )}
                  </CardContent>
                </Card>
              </Stack>
            </Grid>
          </Grid>
        </Container>

      {/* Negotiation Dialog */}
      {product && (
        <NegotiationDialog
          open={negotiationDialogOpen}
          onClose={() => setNegotiationDialogOpen(false)}
          product={product}
          onNegotiationStarted={handleNegotiationStarted}
        />
      )}

      {/* Recommended Products Section */}
      <Box sx={{ background: '#f8fafc', py: 4, mt: 4 }}>
        <Container maxWidth="lg">
          <RecommendedProducts maxItems={4} showTitle={true} />
        </Container>
      </Box>
      </>
    );
};

export default ProductDetail;
