import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Container,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Grid,
} from '@mui/material';
import { getProducts } from '../features/productsSlice';

const categories = [
  'Electronics',
  'Furniture',
  'Fashion',
  'Books',
  'Sports',
  'Others',
];

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);

  const [filters, setFilters] = useState({
    search: '',
    category: '',
    type: '',
    minPrice: '',
    maxPrice: '',
  });

  useEffect(() => {
    dispatch(getProducts(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
  <Container maxWidth={false} sx={{ minHeight: '100vh', p: 0, bgcolor: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <Box sx={{ 
        py: 2, 
        px: 3,
        flexGrow: 1,
        display: 'flex',
        flexDirection: 'column'
      }}>
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            color: '#1976d2'
          }}>
          Browse Products
        </Typography>

        {/* Filters */}
        <Box 
          display="flex" 
          flexWrap="wrap" 
          gap={2} 
          sx={{ 
            mb: 4,
            p: 2,
            bgcolor: 'rgba(255,255,255,0.95)',
            borderRadius: 2,
            boxShadow: 3,
            animation: 'fadeIn 0.8s',
          }}>
          <Box sx={{ 
            flexBasis: { xs: '100%', sm: '30%', md: '25%' },
            flexGrow: 1
          }}>
            <TextField
              fullWidth
              label="Search Products"
              name="search"
              value={filters.search}
              onChange={handleFilterChange}
              size="small"
              sx={{ bgcolor: '#f8f9fa' }}
            />
          </Box>
          <Box sx={{ 
            flexBasis: { xs: '100%', sm: '15%', md: '15%' }
          }}>
            <FormControl fullWidth size="small">
              <InputLabel>Category</InputLabel>
              <Select
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                sx={{ bgcolor: '#f8f9fa' }}
              >
                <MenuItem value="">All</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ flexBasis: { xs: '100%', sm: '15%' } }}>
            <FormControl fullWidth>
              <InputLabel>Type</InputLabel>
              <Select
                name="type"
                value={filters.type}
                onChange={handleFilterChange}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="sell">Sell</MenuItem>
                <MenuItem value="rent">Rent</MenuItem>
                <MenuItem value="buy">Buy</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box sx={{ flexBasis: { xs: '100%', sm: '15%' } }}>
            <TextField
              fullWidth
              label="Min Price"
              name="minPrice"
              type="number"
              value={filters.minPrice}
              onChange={handleFilterChange}
            />
          </Box>
          <Box sx={{ flexBasis: { xs: '100%', sm: '15%' } }}>
            <TextField
              fullWidth
              label="Max Price"
              name="maxPrice"
              type="number"
              value={filters.maxPrice}
              onChange={handleFilterChange}
            />
          </Box>
        </Box>

        {/* Product Grid */}
  <Grid container columns={12} spacing={3} sx={{ flexGrow: 1, mt: 0, animation: 'fadeIn 1s' }}>
          {loading ? (
            <Grid xs={12}>
              <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <Typography>Loading...</Typography>
              </Box>
            </Grid>
          ) : (
            products.map((product) => (
              <Grid key={product._id} xs={12} sm={6} md={4} lg={3} xl={2}>
                <Card 
                  sx={{ 
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    background: 'linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)',
                    boxShadow: '0 4px 24px 0 rgba(31,38,135,0.12)',
                    borderRadius: 3,
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    animation: 'fadeIn 0.8s',
                    '&:hover': {
                      transform: 'translateY(-4px) scale(1.02)',
                      boxShadow: '0 8px 32px 0 rgba(31,38,135,0.18)',
                    }
                  }}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={
                      (product.images && product.images[0]?.startsWith('http'))
                        ? product.images[0]
                        : (product.images && product.images[0]?.startsWith('/uploads'))
                        ? `http://localhost:5001${product.images[0]}`
                        : 'https://placehold.co/200x200/e0e0e0/939393?text=No+Image'
                    }
                    alt={product.title}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://placehold.co/200x200/e0e0e0/939393?text=No+Image';
                    }}
                    sx={{
                      objectFit: 'cover',
                      bgcolor: '#f8f9fa'
                    }}
                  />
                  <CardContent sx={{ flexGrow: 1, p: 2 }}>
                    <Typography variant="h6" noWrap sx={{ fontWeight: 'medium' }}>
                      {product.title}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      <Chip
                        label={product.type.toUpperCase()}
                        color="primary"
                        size="small"
                        sx={{ mr: 1 }}
                      />
                      <Chip
                        label={product.category}
                        color="secondary"
                        size="small"
                      />
                    </Box>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        mt: 1,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        height: '40px'
                      }}>
                      {product.description}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      color="primary" 
                      sx={{ 
                        mt: 2,
                        fontWeight: 'bold'
                      }}>
                      ${product.price}
                      {product.type === 'rent' &&
                        <Typography 
                          component="span" 
                          variant="body2" 
                          color="text.secondary">
                          {` / $${product.rentPricePerDay} per day`}
                        </Typography>
                      }
                    </Typography>
                    <Button
                      component={Link}
                      to={`/product/${product._id}`}
                      variant="contained"
                      fullWidth
                      sx={{ 
                        mt: 2,
                        textTransform: 'none',
                        fontWeight: 'bold'
                      }}
                    >
                      View Details
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))
          )}
        </Grid>
      </Box>
    </Container>
  );
};

export default ProductList;
