import React, { useState, useEffect, useCallback } from 'react';
import {
  Container,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  IconButton,
  TextField,
  Box,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Rating,
  Skeleton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Snackbar
} from '@mui/material';
import {
  DeleteOutline as DeleteIcon,
  ShoppingCart as CartIcon,
  Edit as EditIcon
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const WishlistPage = () => {
  const [wishlistData, setWishlistData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    type: '',
    minPrice: '',
    maxPrice: '',
    status: 'available',
    sortBy: 'newest'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [editingNotes, setEditingNotes] = useState(null);
  const [notesValue, setNotesValue] = useState('');
  const [clearDialog, setClearDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const fetchWishlist = useCallback(async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams({
        ...filters,
        page: currentPage,
        limit: 12
      });

      const response = await api.get(`/wishlist/filtered?${queryParams}`);
      setWishlistData(response.data.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      showSnackbar('Error loading wishlist', 'error');
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    fetchWishlist();
  }, [user, navigate, fetchWishlist]);

  const removeFromWishlist = async (productId) => {
    try {
      await api.delete(`/wishlist/remove/${productId}`);
      showSnackbar('Item removed from wishlist', 'success');
      fetchWishlist();
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      showSnackbar('Error removing item', 'error');
    }
  };

  const updateNotes = async (productId, notes) => {
    try {
      await api.put(`/wishlist/notes/${productId}`, { notes });
      showSnackbar('Notes updated successfully', 'success');
      setEditingNotes(null);
      setNotesValue('');
      fetchWishlist();
    } catch (error) {
      console.error('Error updating notes:', error);
      showSnackbar('Error updating notes', 'error');
    }
  };

  const clearWishlist = async () => {
    try {
      await api.delete('/wishlist/clear');
      showSnackbar('Wishlist cleared successfully', 'success');
      setClearDialog(false);
      fetchWishlist();
    } catch (error) {
      console.error('Error clearing wishlist:', error);
      showSnackbar('Error clearing wishlist', 'error');
    }
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({ ...prev, [field]: value }));
    setCurrentPage(1);
  };

  const handleEditNotes = (productId, currentNotes) => {
    setEditingNotes(productId);
    setNotesValue(currentNotes || '');
  };

  const handleSaveNotes = () => {
    if (editingNotes) {
      updateNotes(editingNotes, notesValue);
    }
  };

  const handleCancelEditNotes = () => {
    setEditingNotes(null);
    setNotesValue('');
  };

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const getImageUrl = (images) => {
    if (!images || images.length === 0) return '/placeholder-image.jpg';
    const image = images[0];
    return image.startsWith('http') ? image : `http://localhost:5001${image}`;
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Wishlist
        </Typography>
        <Box 
          className="product-grid-container"
          data-product-grid
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(4, 1fr)'
            },
            gap: { xs: 2, sm: 2.5, md: 3, lg: 3.5 },
            width: '100%',
            alignItems: 'stretch'
          }}
        >
          {[...Array(6)].map((_, index) => (
            <Card key={index} sx={{ height: '380px' }}>
              <Skeleton variant="rectangular" height={180} />
              <CardContent>
                <Skeleton variant="text" height={30} />
                <Skeleton variant="text" height={20} />
                <Skeleton variant="text" height={20} />
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>
    );
  }

  const products = wishlistData?.products || [];
  const pagination = wishlistData?.pagination || {};

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" gutterBottom>
          My Wishlist ({pagination.totalProducts || 0} items)
        </Typography>
        {products.length > 0 && (
          <Button
            variant="outlined"
            color="error"
            onClick={() => setClearDialog(true)}
            startIcon={<DeleteIcon />}
          >
            Clear All
          </Button>
        )}
      </Box>

      {/* Filters */}
      {products.length > 0 && (
        <Box mb={3}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Category</InputLabel>
                <Select
                  value={filters.category}
                  label="Category"
                  onChange={(e) => handleFilterChange('category', e.target.value)}
                >
                  <MenuItem value="">All Categories</MenuItem>
                  <MenuItem value="electronics">Electronics</MenuItem>
                  <MenuItem value="clothing">Clothing</MenuItem>
                  <MenuItem value="books">Books</MenuItem>
                  <MenuItem value="home">Home & Garden</MenuItem>
                  <MenuItem value="sports">Sports</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Type</InputLabel>
                <Select
                  value={filters.type}
                  label="Type"
                  onChange={(e) => handleFilterChange('type', e.target.value)}
                >
                  <MenuItem value="">All Types</MenuItem>
                  <MenuItem value="sale">For Sale</MenuItem>
                  <MenuItem value="rent">For Rent</MenuItem>
                  <MenuItem value="exchange">For Exchange</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                label="Min Price"
                type="number"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <TextField
                fullWidth
                size="small"
                label="Max Price"
                type="number"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
              />
            </Grid>

            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
                <InputLabel>Sort By</InputLabel>
                <Select
                  value={filters.sortBy}
                  label="Sort By"
                  onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                >
                  <MenuItem value="newest">Newest First</MenuItem>
                  <MenuItem value="oldest">Oldest First</MenuItem>
                  <MenuItem value="price-low">Price: Low to High</MenuItem>
                  <MenuItem value="price-high">Price: High to Low</MenuItem>
                  <MenuItem value="rating">Highest Rated</MenuItem>
                </Select>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      )}

      {/* Wishlist Items */}
      {products.length === 0 ? (
        <Box textAlign="center" py={8}>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Your wishlist is empty
          </Typography>
          <Typography variant="body2" color="textSecondary" mb={3}>
            Start adding products you love to your wishlist
          </Typography>
          <Button
            variant="contained"
            onClick={() => navigate('/products')}
          >
            Browse Products
          </Button>
        </Box>
      ) : (
        <>
          <Box 
            className="product-grid-container"
            data-product-grid
            sx={{
              display: 'grid',
              gridTemplateColumns: {
                xs: '1fr',
                sm: 'repeat(2, 1fr)',
                md: 'repeat(3, 1fr)',
                lg: 'repeat(4, 1fr)'
              },
              gap: { xs: 2, sm: 2.5, md: 3, lg: 3.5 },
              width: '100%',
              alignItems: 'stretch'
            }}
          >
            {products.map((item) => (
              <Card 
                key={item.product._id} 
                className="product-card"
                sx={{ 
                  height: '380px !important',
                  minHeight: '380px !important',
                  maxHeight: '380px !important',
                  display: 'flex', 
                  flexDirection: 'column',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                  }
                }}
              >
                <CardMedia
                  component="img"
                  height="180"
                  image={getImageUrl(item.product.images)}
                  alt={item.product.title}
                  sx={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/product/${item.product._id}`)}
                />
                
                <CardContent sx={{ 
                  flexGrow: 1, 
                  display: 'flex', 
                  flexDirection: 'column',
                  height: 'calc(100% - 180px)',
                  p: 2
                }}>
                  <Typography
                    variant="h6"
                    gutterBottom
                    sx={{
                      cursor: 'pointer',
                      fontSize: '1rem',
                      fontWeight: 600,
                      lineHeight: 1.2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      mb: 1,
                      '&:hover': { textDecoration: 'underline' }
                    }}
                    onClick={() => navigate(`/product/${item.product._id}`)}
                  >
                    {item.product.title}
                  </Typography>
                  
                  <Box display="flex" alignItems="center" mb={1}>
                    <Rating value={item.product.averageRating || 0} readOnly size="small" />
                    <Typography variant="body2" color="textSecondary" ml={1} sx={{ fontSize: '11px' }}>
                      ({item.product.reviewCount || 0})
                    </Typography>
                  </Box>

                  <Box sx={{ mt: 'auto', pt: 1 }}>
                    <Typography 
                      variant="h6" 
                      color="primary" 
                      sx={{ 
                        fontSize: '1.1rem', 
                        fontWeight: 700, 
                        mb: 1 
                      }}
                    >
                      ${item.product.price}
                    </Typography>

                    <Box mb={1} sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      <Chip
                        label={item.product.category}
                        variant="outlined"
                        size="small"
                        sx={{ fontSize: '9px', height: '18px' }}
                      />
                      <Chip
                        label={item.product.type}
                        variant="outlined"
                        size="small"
                        color="secondary"
                        sx={{ fontSize: '9px', height: '18px' }}
                      />
                    </Box>

                    <Typography variant="body2" color="textSecondary" sx={{ fontSize: '11px', mb: 0.5 }}>
                      By: {item.product.owner?.name}
                    </Typography>

                    <Typography variant="body2" color="textSecondary" sx={{ fontSize: '11px', mb: 1 }}>
                      Added: {new Date(item.addedAt).toLocaleDateString()}
                    </Typography>

                    {/* Notes Section */}
                    {editingNotes === item.product._id ? (
                      <Box mt={1}>
                        <TextField
                          fullWidth
                          multiline
                          rows={1}
                          size="small"
                          placeholder="Add notes..."
                          value={notesValue}
                          onChange={(e) => setNotesValue(e.target.value)}
                          inputProps={{ maxLength: 100 }}
                          sx={{ fontSize: '11px' }}
                        />
                        <Box mt={0.5} display="flex" gap={0.5}>
                          <Button size="small" onClick={handleSaveNotes} sx={{ fontSize: '10px', py: 0.25 }}>
                            Save
                          </Button>
                          <Button size="small" onClick={handleCancelEditNotes} sx={{ fontSize: '10px', py: 0.25 }}>
                            Cancel
                          </Button>
                        </Box>
                      </Box>
                    ) : (
                      <Box mt={1}>
                        {item.notes && (
                          <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 0.5, fontSize: '10px' }}>
                            "{item.notes}"
                          </Typography>
                        )}
                        <Button
                          size="small"
                          startIcon={<EditIcon sx={{ fontSize: '12px' }} />}
                          onClick={() => handleEditNotes(item.product._id, item.notes)}
                          sx={{ fontSize: '10px', py: 0.25 }}
                        >
                          {item.notes ? 'Edit Notes' : 'Add Notes'}
                        </Button>
                      </Box>
                    )}

                    <Box sx={{ display: 'flex', gap: 0.5, mt: 1 }}>
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<CartIcon sx={{ fontSize: '12px' }} />}
                        onClick={() => navigate(`/product/${item.product._id}`)}
                        sx={{ flex: 1, fontSize: '10px', py: 0.5 }}
                      >
                        View
                      </Button>
                      <IconButton
                        color="error"
                        onClick={() => removeFromWishlist(item.product._id)}
                        size="small"
                        sx={{ minWidth: '32px', width: '32px', height: '32px' }}
                      >
                        <DeleteIcon sx={{ fontSize: '16px' }} />
                      </IconButton>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Box display="flex" justifyContent="center" mt={4}>
              <Pagination
                count={pagination.totalPages}
                page={currentPage}
                onChange={(e, page) => setCurrentPage(page)}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      {/* Clear Wishlist Dialog */}
      <Dialog open={clearDialog} onClose={() => setClearDialog(false)}>
        <DialogTitle>Clear Wishlist</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to clear your entire wishlist? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setClearDialog(false)}>Cancel</Button>
          <Button onClick={clearWishlist} color="error" variant="contained">
            Clear All
          </Button>
        </DialogActions>
      </Dialog>

      {/* Snackbar */}
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
    </Container>
  );
};

export default WishlistPage;