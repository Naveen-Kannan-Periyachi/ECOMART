import React, { useEffect, useState, memo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
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
  Pagination,
  Paper,
  Divider,
  Alert,
  Fade,
  Slide,
  Skeleton,
  Stack,
  Tooltip,
  Card,
  CardContent,
  CardMedia,
  Chip
} from '@mui/material';
import {
  FilterList,
  GridView,
  ViewList,
  Favorite,
  FavoriteBorder,
  ShoppingCart,
  Share,
  LocationOn,
  Star,
  TrendingUp
} from '@mui/icons-material';
import { getProducts } from '../features/productsSlice';
import ProductCard from '../components/ui/ProductCard';

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
  const location = useLocation();
  const { products, loading, total, totalPages } = useSelector((state) => state.products);

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
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography variant="h3" sx={{ 
            fontWeight: 700, 
            mb: 2,
            fontSize: { xs: '2rem', md: '3rem' },
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Browse Products
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{
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
        <Paper sx={{ 
          p: 3, 
          mb: 4, 
          background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 3
        }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ 
              fontWeight: 600, 
              display: 'flex', 
              alignItems: 'center',
              color: '#2d3748'
            }}>
              <FilterList sx={{ mr: 1, color: '#667eea' }} />
              Filters
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <Button
                variant="outlined"
                size="small"
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
            
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
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
            
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
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
            
            <Grid item xs={12} sm={6} md={2}>
              <FormControl fullWidth size="small">
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
            
            <Grid item xs={6} sm={3} md={1.5}>
              <TextField
                fullWidth
                label="Min Price"
                name="minPrice"
                type="number"
                value={filters.minPrice}
                onChange={handleFilterChange}
                size="small"
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
            
            <Grid item xs={6} sm={3} md={1.5}>
              <TextField
                fullWidth
                label="Max Price"
                name="maxPrice"
                type="number"
                value={filters.maxPrice}
                onChange={handleFilterChange}
                size="small"
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

          <Divider sx={{ my: 3, opacity: 0.6 }} />
          
          <Fade in timeout={1500}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                <strong style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>{total || 0}</strong> products found
              </Typography>
              
              <FormControl size="small" sx={{ minWidth: 200 }}>
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
        </Fade>
      ) : products.length === 0 ? (
        <Fade in timeout={800}>
          <Alert 
            severity="info" 
            sx={{ 
              py: 6, 
              textAlign: 'center',
              fontSize: '16px',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.05) 0%, rgba(147, 51, 234, 0.05) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.1)',
              borderRadius: 3
            }}
          >
            <Typography variant="h5" sx={{ 
              mb: 2, 
              fontWeight: 600,
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              No products found
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Try adjusting your filters or search terms to discover more products
            </Typography>
          </Alert>
        </Fade>
      ) : (
        <Fade in timeout={600}>
          <Box>
            {/* Grid Layout with consistent card heights */}
            <Box 
              className="product-grid-container"
              data-product-grid
              sx={{
                display: 'grid',
                gridTemplateColumns: {
                  xs: '1fr',
                  sm: viewMode === 'list' ? '1fr' : 'repeat(2, 1fr)',
                  md: viewMode === 'list' ? '1fr' : 'repeat(3, 1fr)',
                  lg: viewMode === 'list' ? '1fr' : 'repeat(4, 1fr)'
                },
                gap: { xs: 2, sm: 2.5, md: 3, lg: 3.5 },
                width: '100%',
                alignItems: 'stretch'
              }}
            >
              {products.map((product) => (
                <Box key={product._id} sx={{ display: 'flex', width: '100%' }}>
                  <ProductCard 
                    product={product} 
                    isListView={viewMode === 'list'}
                    sx={{
                      height: '100%',
                      width: '100%',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  />
                </Box>
              ))}
            </Box>

            {/* Pagination */}
            {totalPages > 1 && (
              <Slide in direction="up" timeout={1000}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  mt: 6,
                  mb: 2
                }}>
                  <Paper sx={{ 
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
            )}
          </Box>
        </Fade>
      )}
    </Container>
  );
};

export default memo(ProductList);