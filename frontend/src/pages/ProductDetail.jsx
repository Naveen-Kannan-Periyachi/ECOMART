
import React, { useEffect, useState } from 'react';
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
  FavoriteBorder
} from '@mui/icons-material';
import { api } from '../utils/api';
import { addToCart } from '../features/cartSlice';

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
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
      const fetchProduct = async () => {
        try {
          setLoading(true);
          const response = await api.get(`/products/${id}`);
          setProduct(response.data);
          setError(null);
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to load product');
        } finally {
          setLoading(false);
        }
      };
      
      if (id) {
        fetchProduct();
      }
    }, [id]);

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
      
      setChatLoading(true);
      try {
        const response = await api.post('/chat/start', { 
          productId: id 
        });
        navigate(`/chat/${response.data._id}`);
      } catch (err) {
        alert(err.response?.data?.message || 'Failed to start chat');
      } finally {
        setChatLoading(false);
      }
    };

    const handleToggleFavorite = () => {
      if (!user) {
        navigate('/login');
        return;
      }
      setIsFavorite(!isFavorite);
      // TODO: API call to save/remove from favorites
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

    const images = product.images?.length > 0 
      ? product.images.map(img => ({
          original: img.startsWith('http') ? img : `${api.defaults.baseURL}${img}`,
          thumbnail: img.startsWith('http') ? img : `${api.defaults.baseURL}${img}`
        }))
      : [{
          original: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRTBFMEUwIi8+Cjx0ZXh0IHg9IjMwMCIgeT0iMjEwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5Mzk1OTMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPk5vIEltYWdlPC90ZXh0Pgo8L3N2Zz4=',
          thumbnail: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTUwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDE1MCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxNTAiIGhlaWdodD0iMTAwIiBmaWxsPSIjRTBFMEUwIi8+Cjx0ZXh0IHg9Ijc1IiB5PSI1NSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTM5NTkzIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5ObyBJbWFnZTwvdGV4dD4KPHN2Zz4='
        }];

    const seller = product.owner || {};
    const isOwner = user && seller._id === user._id;

    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Left: Images */}
          <Grid item xs={12} lg={7}>
            <Paper 
              elevation={3} 
              sx={{ 
                p: 2, 
                borderRadius: 3,
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                border: '1px solid #e2e8f0'
              }}
            >
              {/* Main Image */}
              <Box sx={{ mb: 2, position: 'relative' }}>
                <img
                  src={images[selectedImageIndex]?.original}
                  alt={product.title}
                  style={{
                    width: '100%',
                    height: '400px',
                    objectFit: 'cover',
                    borderRadius: '12px'
                  }}
                  onError={(e) => {
                    e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAwIiBoZWlnaHQ9IjQwMCIgdmlld0JveD0iMCAwIDYwMCA0MDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI2MDAiIGhlaWdodD0iNDAwIiBmaWxsPSIjRTBFMEUwIi8+Cjx0ZXh0IHg9IjMwMCIgeT0iMjEwIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMjAiIGZpbGw9IiM5Mzk1OTMiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkltYWdlIEVycm9yPC90ZXh0Pgo8L3N2Zz4=';
                  }}
                />
                
                {/* Image Actions */}
                <Box sx={{ position: 'absolute', top: 16, right: 16, display: 'flex', gap: 1 }}>
                  <IconButton
                    onClick={handleShare}
                    sx={{
                      background: 'rgba(255,255,255,0.9)',
                      '&:hover': { background: '#fff' }
                    }}
                  >
                    <Share />
                  </IconButton>
                  <IconButton
                    onClick={handleToggleFavorite}
                    sx={{
                      background: 'rgba(255,255,255,0.9)',
                      '&:hover': { background: '#fff' }
                    }}
                  >
                    {isFavorite ? <Favorite sx={{ color: '#f56565' }} /> : <FavoriteBorder />}
                  </IconButton>
                </Box>
              </Box>
              
              {/* Thumbnail Images */}
              {images.length > 1 && (
                <Grid container spacing={1}>
                  {images.map((image, index) => (
                    <Grid item xs={3} sm={2} key={index}>
                      <Box
                        component="img"
                        src={image.thumbnail}
                        alt={`${product.title} ${index + 1}`}
                        onClick={() => setSelectedImageIndex(index)}
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
                            transform: 'scale(1.05)'
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
            <Stack spacing={3}>
              {/* Product Info */}
              <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Chip 
                    label={product.type?.toUpperCase()} 
                    color="primary" 
                    sx={{ fontWeight: 600 }}
                  />
                  <Chip 
                    label={product.status?.toUpperCase()} 
                    color={product.status === 'available' ? 'success' : 
                           product.status === 'sold' ? 'error' : 'warning'} 
                    sx={{ fontWeight: 600 }}
                  />
                  {product.views && (
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                      <Visibility sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="caption">{product.views} views</Typography>
                    </Box>
                  )}
                </Box>

                <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: '#2d3748' }}>
                  {product.title}
                </Typography>

                <Typography variant="h5" sx={{ 
                  fontWeight: 700, 
                  color: '#667eea', 
                  mb: 2,
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

                <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
                  {product.description}
                </Typography>

                <Grid container spacing={2} sx={{ mb: 3 }}>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Category</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{product.category}</Typography>
                  </Grid>
                  <Grid item xs={6}>
                    <Typography variant="subtitle2" color="text.secondary">Condition</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>{product.condition}</Typography>
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="text.secondary">Location</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                      <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>{product.location}</Typography>
                    </Box>
                  </Grid>
                </Grid>

                {/* Action Buttons */}
                {!isOwner && (
                  <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
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
                        '&:hover': {
                          background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                          transform: 'translateY(-2px)',
                        }
                      }}
                    >
                      {buying ? 'Processing...' : 'Buy Now'}
                    </Button>
                    
                    <Button
                      variant="outlined"
                      size="large"
                      fullWidth
                      startIcon={<Chat />}
                      onClick={handleNegotiate}
                      disabled={chatLoading}
                      sx={{
                        borderColor: '#667eea',
                        color: '#667eea',
                        py: 1.5,
                        fontWeight: 600,
                        borderWidth: 2,
                        '&:hover': {
                          borderColor: '#764ba2',
                          color: '#764ba2',
                          borderWidth: 2,
                          background: 'rgba(102, 126, 234, 0.04)',
                          transform: 'translateY(-2px)',
                        }
                      }}
                    >
                      {chatLoading ? 'Loading...' : 'Negotiate Price'}
                    </Button>
                  </Stack>
                )}

                {isOwner && (
                  <Alert severity="info" sx={{ mt: 2 }}>
                    This is your product listing
                  </Alert>
                )}
              </Paper>

              {/* Seller Info */}
              <Card elevation={3} sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                    <Person sx={{ mr: 1 }} />
                    Seller Information
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar sx={{ mr: 2, bgcolor: '#667eea' }}>
                      {seller.name?.charAt(0)?.toUpperCase()}
                    </Avatar>
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                        {seller.name}
                      </Typography>
                      <Rating value={4.5} readOnly size="small" />
                    </Box>
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  <Stack spacing={1}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Email sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
                      <Typography variant="body2">{seller.email}</Typography>
                    </Box>
                    
                    {seller.phone && (
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <Phone sx={{ fontSize: 16, color: 'text.secondary', mr: 1 }} />
                        <Typography variant="body2">{seller.phone}</Typography>
                      </Box>
                    )}
                  </Stack>

                  {!isOwner && (
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<Chat />}
                      onClick={handleNegotiate}
                      disabled={chatLoading}
                      sx={{ mt: 2 }}
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
    );
  };


export default ProductDetail;
