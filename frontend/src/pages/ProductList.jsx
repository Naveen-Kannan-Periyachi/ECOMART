import { useEffect, useState, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
<<<<<<< HEAD
import { useLocation } from 'react-router-dom';
=======
import { Link, useNavigate, useLocation } from 'react-router-dom';
>>>>>>> 3af5b2101e6344b36c4887c6476b665044ebd75f
import {
  Container,
  Typography,
  Button,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  IconButton,
<<<<<<< HEAD
  Pagination,
  Paper,
  Divider,
  Alert,
  Fade,
  Grow,
  Slide
} from '@mui/material';
import {
  FilterList,
  GridView,
  ViewList
} from '@mui/icons-material';
import { getProducts } from '../features/productsSlice';
import ProductCard from '../components/ui/ProductCard';
import LoadingSkeleton from '../components/ui/LoadingSkeleton';
=======
  Skeleton,
  Pagination,
  Stack,
  Paper,
  Divider,
  Tooltip,
  Alert,
  Fade
} from '@mui/material';
import {
  Favorite,
  FavoriteBorder,
  ShoppingCart,
  FilterList,
  GridView,
  ViewList,
  Share,
  LocationOn,
  Star,
  TrendingUp
} from '@mui/icons-material';
import { getProducts } from '../features/productsSlice';
import { addToCart } from '../features/cartSlice';
>>>>>>> 3af5b2101e6344b36c4887c6476b665044ebd75f

const categories = [
  'Electronics',
  'Furniture',
  'Fashion',
  'Books',
  'Sports',
  'Others',
];

const conditions = [
  'New',
  'Like New',
  'Good',
  'Fair',
  'Poor'
];

const ProductList = () => {
  const dispatch = useDispatch();
<<<<<<< HEAD
  const location = useLocation();
  const { products, loading, total, totalPages } = useSelector((state) => state.products);
=======
  const navigate = useNavigate();
  const location = useLocation();
  const { products, loading, total, totalPages } = useSelector((state) => state.products);
  const { user } = useSelector((state) => state.auth);
>>>>>>> 3af5b2101e6344b36c4887c6476b665044ebd75f

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    type: '',
    condition: '',
    minPrice: '',
    maxPrice: '',
    location: '',
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [page, setPage] = useState(1);
<<<<<<< HEAD
=======
  const [wishlist, setWishlist] = useState(new Set());
>>>>>>> 3af5b2101e6344b36c4887c6476b665044ebd75f

  useEffect(() => {
    // Get query params from URL
    const searchParams = new URLSearchParams(location.search);
    const urlFilters = {};
    for (const [key, value] of searchParams.entries()) {
      if (value) urlFilters[key] = value;
    }
    
    setFilters(prev => ({ ...prev, ...urlFilters }));
    if (urlFilters.page) setPage(parseInt(urlFilters.page));
  }, [location.search]);

  useEffect(() => {
    const searchParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) searchParams.set(key, value);
    });
    searchParams.set('page', page.toString());
    
    dispatch(getProducts({ ...filters, page, limit: 12 }));
    
    // Update URL without triggering navigation
    const newUrl = `${location.pathname}?${searchParams.toString()}`;
    window.history.replaceState(null, '', newUrl);
  }, [dispatch, filters, page, location.pathname]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPage(1); // Reset to first page when filters change
<<<<<<< HEAD
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      type: '',
      condition: '',
      minPrice: '',
      maxPrice: '',
      location: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    setPage(1);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Fade in timeout={800}>
        <Box className="fade-in-up" sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" className="gradient-text" sx={{ 
            fontWeight: 700, 
            mb: 2,
            fontSize: { xs: '2rem', md: '3rem' }
          }}>
            Browse Products
          </Typography>
          <Typography variant="h6" color="text.secondary" className="fade-in-up stagger-1" sx={{
            maxWidth: '600px',
            mx: 'auto',
            lineHeight: 1.6
          }}>
            Discover amazing deals from thousands of sellers
          </Typography>
        </Box>
      </Fade>

      {/* Filters Section */}
      <Slide in direction="up" timeout={1000}>
        <Paper className="glass-effect shadow-medium" sx={{ 
          p: 3, 
          mb: 4, 
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 3
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" className="fade-in-left" sx={{ 
              fontWeight: 600, 
              display: 'flex', 
              alignItems: 'center',
              color: '#2d3748'
            }}>
              <FilterList className="hover-rotate" sx={{ mr: 1, color: '#667eea' }} />
              Filters
            </Typography>
            
            <Box className="fade-in-right" sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Button
                variant="outlined"
                size="small"
                className="hover-scale"
                onClick={clearFilters}
                sx={{ 
                  textTransform: 'none',
                  borderColor: '#667eea',
                  color: '#667eea',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    borderColor: '#764ba2',
                    color: '#764ba2',
                    background: 'rgba(102, 126, 234, 0.05)',
                    transform: 'scale(1.05)'
                  }
                }}
              >
                Clear All
              </Button>
              
              <Box sx={{ 
                display: 'flex', 
                background: 'rgba(102, 126, 234, 0.1)',
                borderRadius: 2,
                p: 0.5
              }}>
                <IconButton
                  className="hover-scale"
                  onClick={() => setViewMode('grid')}
                  sx={{
                    color: viewMode === 'grid' ? '#667eea' : 'text.secondary',
                    background: viewMode === 'grid' ? 'rgba(102, 126, 234, 0.2)' : 'transparent',
                    borderRadius: 1.5,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(102, 126, 234, 0.3)',
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  <GridView />
                </IconButton>
                <IconButton
                  className="hover-scale"
                  onClick={() => setViewMode('list')}
                  sx={{
                    color: viewMode === 'list' ? '#667eea' : 'text.secondary',
                    background: viewMode === 'list' ? 'rgba(102, 126, 234, 0.2)' : 'transparent',
                    borderRadius: 1.5,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(102, 126, 234, 0.3)',
                      transform: 'scale(1.1)'
                    }
                  }}
                >
                  <ViewList />
                </IconButton>
              </Box>
            </Box>
          </Box>

          <Grow in timeout={1200}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3} className="stagger-animation stagger-1">
                <TextField
                  fullWidth
                  label="Search Products"
                  name="search"
                  value={filters.search}
                  onChange={handleFilterChange}
                  size="small"
                  placeholder="Search by title, description..."
                  className="hover-lift"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.25)'
                      }
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={12} sm={6} md={2} className="stagger-animation stagger-2">
                <FormControl fullWidth size="small" className="hover-lift">
                  <InputLabel>Category</InputLabel>
                  <Select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    label="Category"
                    sx={{
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
                      },
                      '&.Mui-focused': {
                        boxShadow: '0 4px 20px rgba(102, 126, 234, 0.25)'
                      }
                    }}
                  >
                    <MenuItem value="">All Categories</MenuItem>
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2} className="stagger-animation stagger-3">
                <FormControl fullWidth size="small" className="hover-lift">
                  <InputLabel>Type</InputLabel>
                  <Select
                    name="type"
                    value={filters.type}
                    onChange={handleFilterChange}
                    label="Type"
                    sx={{
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
                      }
                    }}
                  >
                    <MenuItem value="">All Types</MenuItem>
                    <MenuItem value="sell">For Sale</MenuItem>
                    <MenuItem value="rent">For Rent</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={12} sm={6} md={2} className="stagger-animation stagger-4">
                <FormControl fullWidth size="small" className="hover-lift">
                  <InputLabel>Condition</InputLabel>
                  <Select
                    name="condition"
                    value={filters.condition}
                    onChange={handleFilterChange}
                    label="Condition"
                    sx={{
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
                      }
                    }}
                  >
                    <MenuItem value="">All Conditions</MenuItem>
                    {conditions.map((condition) => (
                      <MenuItem key={condition} value={condition}>
                        {condition}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              
              <Grid item xs={6} sm={3} md={1.5} className="stagger-animation stagger-5">
                <TextField
                  fullWidth
                  label="Min Price"
                  name="minPrice"
                  type="number"
                  value={filters.minPrice}
                  onChange={handleFilterChange}
                  size="small"
                  className="hover-lift"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
                      }
                    }
                  }}
                />
              </Grid>
              
              <Grid item xs={6} sm={3} md={1.5} className="stagger-animation stagger-6">
                <TextField
                  fullWidth
                  label="Max Price"
                  name="maxPrice"
                  type="number"
                  value={filters.maxPrice}
                  onChange={handleFilterChange}
                  size="small"
                  className="hover-lift"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
                      }
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Grow>

          <Divider sx={{ my: 3, opacity: 0.6 }} />
          
          <Fade in timeout={1500}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary" className="fade-in-left">
                <strong className="gradient-text">{total}</strong> products found
              </Typography>
              
              <FormControl size="small" className="fade-in-right hover-lift" sx={{ minWidth: 200 }}>
                <InputLabel>Sort By</InputLabel>
                <Select
                  name="sortBy"
                  value={filters.sortBy}
                  onChange={handleFilterChange}
                  label="Sort By"
                  sx={{
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
                    }
                  }}
                >
                  <MenuItem value="createdAt">Newest First</MenuItem>
                  <MenuItem value="price">Price: Low to High</MenuItem>
                  <MenuItem value="-price">Price: High to Low</MenuItem>
                  <MenuItem value="title">Name: A to Z</MenuItem>
                  <MenuItem value="-title">Name: Z to A</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Fade>
        </Paper>
      </Slide>

      {/* Products Grid */}
      {loading ? (
        <Fade in>
          <LoadingSkeleton count={12} variant={viewMode} />
        </Fade>
      ) : products.length === 0 ? (
        <Fade in timeout={800}>
          <Alert 
            severity="info" 
            className="glass-effect shadow-medium"
            sx={{ 
              py: 6, 
              textAlign: 'center',
              fontSize: '16px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.1)',
              borderRadius: 3
            }}
          >
            <Typography variant="h5" className="gradient-text" sx={{ mb: 2, fontWeight: 600 }}>
              No products found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Try adjusting your filters or search terms to discover more products
=======
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAddToCart = (product, e) => {
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

  const toggleWishlist = (productId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
      } else {
        newWishlist.add(productId);
      }
      return newWishlist;
    });
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      category: '',
      type: '',
      condition: '',
      minPrice: '',
      maxPrice: '',
      location: '',
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
    setPage(1);
  };

  const ProductCard = ({ product, isListView = false }) => (
    <Card 
      sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: isListView ? 'row' : 'column',
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        border: '1px solid #e2e8f0',
        borderRadius: 3,
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
          borderColor: '#667eea',
        }
      }}
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <CardMedia
        component="div"
        sx={{
          height: isListView ? 150 : 200,
          width: isListView ? 200 : '100%',
          position: 'relative',
          background: product.images?.[0] 
            ? `url(${product.images[0].startsWith('http') 
                ? product.images[0] 
                : `http://localhost:5001${product.images[0]}`}) center/cover`
            : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '14px',
          fontWeight: 500
        }}
      >
        {!product.images?.[0] && 'No Image'}
        
        {/* Overlay with actions */}
        <Box sx={{
          position: 'absolute',
          top: 12,
          right: 12,
          display: 'flex',
          flexDirection: 'column',
          gap: 1
        }}>
          <Tooltip title={wishlist.has(product._id) ? 'Remove from wishlist' : 'Add to wishlist'}>
            <IconButton 
              size="small"
              sx={{ 
                background: 'rgba(255,255,255,0.9)',
                '&:hover': { background: '#fff' }
              }}
              onClick={(e) => toggleWishlist(product._id, e)}
            >
              {wishlist.has(product._id) ? 
                <Favorite sx={{ color: '#f56565', fontSize: 20 }} /> : 
                <FavoriteBorder sx={{ fontSize: 20 }} />
              }
            </IconButton>
          </Tooltip>
          
          <Tooltip title="Share">
            <IconButton 
              size="small"
              sx={{ 
                background: 'rgba(255,255,255,0.9)',
                '&:hover': { background: '#fff' }
              }}
            >
              <Share sx={{ fontSize: 20 }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Product type badge */}
        <Chip 
          label={product.type.toUpperCase()} 
          size="small" 
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            background: product.type === 'sell' ? '#10b981' : 
                       product.type === 'rent' ? '#f59e0b' : '#6366f1',
            color: 'white',
            fontWeight: 600,
            fontSize: '11px'
          }}
        />

        {/* Trending badge for popular items */}
        {product.isPopular && (
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
            fontSize: '12px'
          }}>
            <TrendingUp sx={{ fontSize: 14, mr: 0.5 }} />
            Trending
          </Box>
        )}
      </CardMedia>
      
      <CardContent sx={{ 
        flexGrow: 1, 
        p: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}>
        <Box>
          <Typography variant="h6" sx={{ 
            fontWeight: 600, 
            mb: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            color: '#2d3748'
          }}>
            {product.title}
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Chip
              label={product.category}
              size="small"
              variant="outlined"
              sx={{ borderColor: '#667eea', color: '#667eea', fontSize: '11px' }}
            />
            <Chip
              label={product.condition}
              size="small"
              variant="outlined"
              sx={{ borderColor: '#10b981', color: '#10b981', fontSize: '11px' }}
            />
          </Box>
          
          {product.location && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <LocationOn sx={{ fontSize: 16, color: 'text.secondary', mr: 0.5 }} />
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '13px' }}>
                {product.location}
              </Typography>
            </Box>
          )}
          
          <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: isListView ? 2 : 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.4
            }}>
            {product.description}
          </Typography>
        </Box>

        <Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 2 }}>
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 700, color: '#667eea', mb: 0.5 }}>
                ${product.price}
              </Typography>
              {product.rentPricePerDay && (
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '12px' }}>
                  ${product.rentPricePerDay}/day
                </Typography>
              )}
            </Box>
            
            {product.rating && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Star sx={{ fontSize: 16, color: '#fbbf24', mr: 0.5 }} />
                <Typography variant="body2" sx={{ fontSize: '13px' }}>
                  {product.rating}
                </Typography>
              </Box>
            )}
          </Box>
          
          <Stack direction="row" spacing={1}>
            <Button
              variant="contained"
              size="small"
              fullWidth
              sx={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                textTransform: 'none',
                fontWeight: 600,
                py: 1,
                '&:hover': {
                  background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                }
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/product/${product._id}`);
              }}
            >
              View Details
            </Button>
            
            {product.type !== 'rent' && (
              <Tooltip title="Add to Cart">
                <IconButton
                  size="small"
                  sx={{
                    border: '2px solid #667eea',
                    color: '#667eea',
                    '&:hover': {
                      background: '#667eea',
                      color: 'white'
                    }
                  }}
                  onClick={(e) => handleAddToCart(product, e)}
                >
                  <ShoppingCart sx={{ fontSize: 18 }} />
                </IconButton>
              </Tooltip>
            )}
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, color: '#2d3748', mb: 2 }}>
          Browse Products
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Discover amazing deals from thousands of sellers
        </Typography>
      </Box>

      {/* Filters Section */}
      <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, display: 'flex', alignItems: 'center' }}>
            <FilterList sx={{ mr: 1 }} />
            Filters
          </Typography>
          
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="outlined"
              size="small"
              onClick={clearFilters}
              sx={{ textTransform: 'none' }}
            >
              Clear All
            </Button>
            
            <Box>
              <IconButton
                onClick={() => setViewMode('grid')}
                color={viewMode === 'grid' ? 'primary' : 'default'}
              >
                <GridView />
              </IconButton>
              <IconButton
                onClick={() => setViewMode('list')}
                color={viewMode === 'list' ? 'primary' : 'default'}
              >
                <ViewList />
              </IconButton>
            </Box>
          </Box>
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              fullWidth
              label="Search Products"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              size="small"
              placeholder="Search by title, description..."
            />
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                label="Category"
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Type</InputLabel>
              <Select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
                label="Type"
              >
                <MenuItem value="">All Types</MenuItem>
                <MenuItem value="sell">For Sale</MenuItem>
                <MenuItem value="rent">For Rent</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} sm={6} md={2}>
            <FormControl fullWidth size="small">
              <InputLabel>Condition</InputLabel>
              <Select
                name="condition"
                value={filters.condition}
                onChange={handleFilterChange}
                label="Condition"
              >
                <MenuItem value="">All Conditions</MenuItem>
                {conditions.map((condition) => (
                  <MenuItem key={condition} value={condition}>
                    {condition}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={6} sm={3} md={1.5}>
            <TextField
              fullWidth
              label="Min Price"
              name="minPrice"
              type="number"
              value={filters.minPrice}
              onChange={handleFilterChange}
              size="small"
            />
          </Grid>
          
          <Grid item xs={6} sm={3} md={1.5}>
            <TextField
              fullWidth
              label="Max Price"
              name="maxPrice"
              type="number"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              size="small"
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {total} products found
          </Typography>
          
          <FormControl size="small" sx={{ minWidth: 200 }}>
            <InputLabel>Sort By</InputLabel>
            <Select
              name="sortBy"
              value={filters.sortBy}
              onChange={handleFilterChange}
              label="Sort By"
            >
              <MenuItem value="createdAt">Newest First</MenuItem>
              <MenuItem value="price">Price: Low to High</MenuItem>
              <MenuItem value="-price">Price: High to Low</MenuItem>
              <MenuItem value="title">Name: A to Z</MenuItem>
              <MenuItem value="-title">Name: Z to A</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </Paper>

      {/* Products Grid */}
      {loading ? (
        <Grid container spacing={3}>
          {Array.from(new Array(12)).map((_, index) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
              <Card sx={{ height: 400 }}>
                <Skeleton variant="rectangular" height={200} />
                <CardContent>
                  <Skeleton variant="text" height={32} />
                  <Skeleton variant="text" height={20} />
                  <Skeleton variant="text" height={20} width="60%" />
                  <Box sx={{ mt: 2 }}>
                    <Skeleton variant="rectangular" height={36} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : products.length === 0 ? (
        <Fade in>
          <Alert 
            severity="info" 
            sx={{ 
              py: 4, 
              textAlign: 'center',
              fontSize: '16px'
            }}
          >
            <Typography variant="h6" sx={{ mb: 1 }}>
              No products found
            </Typography>
            <Typography variant="body2">
              Try adjusting your filters or search terms
>>>>>>> 3af5b2101e6344b36c4887c6476b665044ebd75f
            </Typography>
          </Alert>
        </Fade>
      ) : (
<<<<<<< HEAD
        <Fade in timeout={600}>
          <Box>
            {viewMode === 'list' ? (
              <Box className="product-grid-container grid-1-col gap-md">
                {products.map((product, index) => (
                  <ProductCard 
                    key={product._id}
                    product={product} 
                    isListView={true} 
                    index={index}
                    variant="list"
                    showActions={true}
                  />
                ))}
              </Box>
            ) : (
              <Box className="product-grid-container" data-product-grid>
                {products.map((product, index) => (
                  <ProductCard 
                    key={product._id}
                    product={product} 
                    isListView={false} 
                    index={index}
                    variant="default"
                    showActions={true}
                  />
                ))}
              </Box>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <Slide in direction="up" timeout={1000}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mt: 6,
                  mb: 2
                }}>
                  <Paper className="glass-effect shadow-soft" sx={{ 
                    p: 2, 
                    borderRadius: 3,
                    background: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)'
                  }}>
                    <Pagination
                      count={totalPages}
                      page={page}
                      onChange={handlePageChange}
                      color="primary"
                      size="large"
                      showFirstButton
                      showLastButton
                      sx={{
                        '& .MuiPaginationItem-root': {
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          '&:hover': {
                            transform: 'scale(1.1)',
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                          },
                          '&.Mui-selected': {
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)'
                            }
                          }
                        }
                      }}
                    />
                  </Paper>
                </Box>
              </Slide>
=======
        <Fade in>
          <Box>
            <Grid container spacing={3}>
              {products.map((product) => (
                <Grid 
                  item 
                  xs={12} 
                  sm={viewMode === 'list' ? 12 : 6} 
                  md={viewMode === 'list' ? 12 : 4} 
                  lg={viewMode === 'list' ? 12 : 3} 
                  key={product._id}
                >
                  <ProductCard product={product} isListView={viewMode === 'list'} />
                </Grid>
              ))}
            </Grid>

            {/* Pagination */}
            {totalPages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
                <Pagination
                  count={totalPages}
                  page={page}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </Box>
>>>>>>> 3af5b2101e6344b36c4887c6476b665044ebd75f
            )}
          </Box>
        </Fade>
      )}
    </Container>
  );
};

export default memo(ProductList);
