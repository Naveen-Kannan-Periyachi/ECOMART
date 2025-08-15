
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Container, Grid, Paper, Typography, Box, Button, Chip, CircularProgress, Alert } from '@mui/material';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import { api } from '../utils/api';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [buying, setBuying] = useState(false);
    const [chatLoading, setChatLoading] = useState(false);

    useEffect(() => {
      setLoading(true);
      api.get(`/products/${id}`)
        .then(res => setProduct(res.data))
        .catch(err => setError(err.response?.data?.message || err.message))
        .finally(() => setLoading(false));
    }, [id]);

    const handleBuyNow = async () => {
      if (!user) {
        navigate('/login', { state: { from: `/product/${id}` } });
        return;
      }
      setBuying(true);
      try {
        const res = await api.post('/orders', { products: [id] });
        navigate(`/orders/${res.data._id}`);
      } catch (err) {
        alert(err.response?.data?.message || err.message);
      } finally {
        setBuying(false);
      }
    };

    const handleNegotiate = async () => {
      if (!user) {
        navigate('/login', { state: { from: `/product/${id}` } });
        return;
      }
      setChatLoading(true);
      try {
        const res = await api.post('/chat/start', { productId: id });
        navigate(`/chat/${res.data._id}`);
      } catch (err) {
        alert(err.response?.data?.message || err.message);
      } finally {
        setChatLoading(false);
      }
    };

    if (loading) return <Box display="flex" justifyContent="center" alignItems="center" height="60vh"><CircularProgress /></Box>;
    if (error) return <Alert severity="error">{error}</Alert>;
    if (!product) return null;

    const images = product.images?.map(img => ({ original: img, thumbnail: img })) || [];
    const seller = product.owner || {};

    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
  <Grid container spacing={4} sx={{ animation: 'fadeIn 1s' }}>
          {/* Left: Images */}
          <Grid item xs={12} md={7}>
            <Paper elevation={2} sx={{ p: 2, background: 'linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)', boxShadow: '0 4px 24px 0 rgba(31,38,135,0.12)', borderRadius: 3, animation: 'fadeIn 0.8s' }}>
              {images.length > 0 ? (
                <ImageGallery items={images} showPlayButton={false} showFullscreenButton useBrowserFullscreen={false} />
              ) : (
                <Box sx={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'grey.100' }}>
                  <Typography>No images available</Typography>
                </Box>
              )}
            </Paper>
          </Grid>
          {/* Right: Details */}
          <Grid item xs={12} md={5}>
            <Paper elevation={2} sx={{ p: 3, position: 'sticky', top: 32, background: 'linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)', boxShadow: '0 4px 24px 0 rgba(31,38,135,0.12)', borderRadius: 3, animation: 'fadeIn 0.8s' }}>
              <Typography variant="h4" gutterBottom>{product.title}</Typography>
              <Box sx={{ mb: 2 }}>
                <Chip label={product.type?.toUpperCase()} color="primary" sx={{ mr: 1 }} />
                <Chip label={product.status?.toUpperCase()} color={product.status === 'available' ? 'success' : product.status === 'sold' ? 'error' : 'warning'} />
              </Box>
              <Typography variant="h5" color="primary" gutterBottom>
                ${product.price} {product.type === 'rent' && <span style={{ fontSize: 16 }}>/ day</span>}
              </Typography>
              <Typography variant="body1" paragraph>{product.description}</Typography>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1"><strong>Category:</strong> {product.category}</Typography>
                <Typography variant="subtitle1"><strong>Condition:</strong> {product.condition}</Typography>
                <Typography variant="subtitle1"><strong>Location:</strong> {product.location}</Typography>
              </Box>
              <Paper variant="outlined" sx={{ p: 2, mb: 3, background: 'rgba(255,255,255,0.85)', borderRadius: 2, boxShadow: '0 2px 8px rgba(31,38,135,0.10)', animation: 'fadeIn 0.8s' }}>
                <Typography variant="h6" gutterBottom>Seller Information</Typography>
                <Typography><strong>Name:</strong> {seller.name}</Typography>
                <Typography><strong>Email:</strong> {seller.email}</Typography>
                <Typography><strong>Phone:</strong> {seller.phone}</Typography>
              </Paper>
              <Box sx={{ display: 'flex', gap: 2 }}>
                <Button variant="contained" fullWidth onClick={handleBuyNow} disabled={buying} sx={{
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(102,126,234,0.15)',
                  transition: 'background 0.3s, transform 0.2s',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #764ba2 0%, #667eea 100%)',
                    transform: 'scale(1.05)',
                  },
                }}>
                  {buying ? 'Processing...' : 'Buy Now'}
                </Button>
                <Button variant="contained" fullWidth onClick={handleNegotiate} disabled={chatLoading} sx={{
                  background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
                  color: '#222',
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(31,38,135,0.10)',
                  transition: 'background 0.3s, transform 0.2s',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #38f9d7 0%, #43e97b 100%)',
                    transform: 'scale(1.05)',
                  },
                }}>
                  {chatLoading ? 'Loading...' : 'Negotiate Price'}
                </Button>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    );
  };


export default ProductDetail;
