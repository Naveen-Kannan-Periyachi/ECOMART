import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Chip,
  Container,
  Paper,
  Stack,
  IconButton,
  Skeleton
} from '@mui/material';
import { 
  ShoppingCart, 
  Favorite, 
  TrendingUp, 
  LocalOffer,
  StarRate,
  ArrowForward,
  Category,
  Security,
  Support
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../features/productSlice';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, loading } = useSelector(state => state.products);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    dispatch(fetchProducts({ limit: 6 }));
  }, [dispatch]);

  useEffect(() => {
    if (products.length > 0) {
      setFeaturedProducts(products.slice(0, 6));
    }
  }, [products]);

  const features = [
    {
      icon: <ShoppingCart sx={{ fontSize: 40, color: '#667eea' }} />,
      title: 'Buy Products',
      description: 'Find amazing deals on quality products from trusted sellers'
    },
    {
      icon: <LocalOffer sx={{ fontSize: 40, color: '#764ba2' }} />,
      title: 'Sell Items',
      description: 'Turn your unused items into cash with our easy selling platform'
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: '#f093fb' }} />,
      title: 'Rent & Lend',
      description: 'Rent what you need or earn by lending your valuable items'
    }
  ];

  const benefits = [
    {
      icon: <Security sx={{ fontSize: 32, color: '#667eea' }} />,
      title: 'Secure Transactions',
      description: 'Advanced encryption and secure payment processing'
    },
    {
      icon: <Support sx={{ fontSize: 32, color: '#764ba2' }} />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support for all your needs'
    },
    {
      icon: <Category sx={{ fontSize: 32, color: '#f093fb' }} />,
      title: 'Wide Categories',
      description: 'Electronics, furniture, fashion, sports and much more'
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        py: 8,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="7" cy="7" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Typography variant="h2" component="h1" sx={{
                fontWeight: 800,
                mb: 2,
                background: 'linear-gradient(45deg, #ffffff 30%, #e3f2fd 90%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontSize: { xs: '2.5rem', md: '3.5rem' }
              }}>
                Welcome to EcoMart
              </Typography>
              <Typography variant="h5" sx={{ mb: 4, opacity: 0.9, fontWeight: 300 }}>
                Your all-in-one marketplace for buying, selling, and renting. 
                Discover amazing deals and turn your items into income.
              </Typography>
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <Button 
                  variant="contained" 
                  size="large"
                  sx={{
                    background: 'rgba(255,255,255,0.2)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.3)',
                    color: 'white',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      background: 'rgba(255,255,255,0.3)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => navigate('/products')}
                  endIcon={<ArrowForward />}
                >
                  Start Shopping
                </Button>
                <Button 
                  variant="outlined" 
                  size="large"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    '&:hover': {
                      borderColor: 'white',
                      background: 'rgba(255,255,255,0.1)',
                      transform: 'translateY(-2px)',
                    },
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => navigate('/products/add')}
                >
                  Sell Your Items
                </Button>
              </Stack>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'center',
                '& img': {
                  maxWidth: '100%',
                  height: 'auto'
                }
              }}>
                {/* Placeholder for hero image */}
                <Box sx={{
                  width: 400,
                  height: 300,
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: 3,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}>
                  <Typography variant="h6" sx={{ opacity: 0.7 }}>
                    Hero Image
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" sx={{ mb: 6, fontWeight: 700, color: '#2d3748' }}>
          Why Choose EcoMart?
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Paper sx={{
                p: 4,
                textAlign: 'center',
                height: '100%',
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                border: '1px solid #e2e8f0',
                borderRadius: 3,
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                }
              }}>
                <Box sx={{ mb: 3 }}>
                  {feature.icon}
                </Box>
                <Typography variant="h5" component="h3" sx={{ mb: 2, fontWeight: 600, color: '#2d3748' }}>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Products Section */}
      <Box sx={{ background: '#f8fafc', py: 8 }}>
        <Container maxWidth="lg">
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 6 }}>
            <Typography variant="h3" component="h2" sx={{ fontWeight: 700, color: '#2d3748' }}>
              Featured Products
            </Typography>
            <Button 
              variant="outlined" 
              onClick={() => navigate('/products')}
              endIcon={<ArrowForward />}
              sx={{ 
                borderColor: '#667eea',
                color: '#667eea',
                '&:hover': {
                  borderColor: '#764ba2',
                  color: '#764ba2',
                  background: 'rgba(102, 126, 234, 0.04)'
                }
              }}
            >
              View All
            </Button>
          </Box>
          <Grid container spacing={3}>
            {loading ? (
              // Loading skeletons
              Array.from(new Array(6)).map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card sx={{ height: '100%' }}>
                    <Skeleton variant="rectangular" height={200} />
                    <CardContent>
                      <Skeleton variant="text" height={32} />
                      <Skeleton variant="text" height={20} />
                      <Skeleton variant="text" height={20} width="60%" />
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              featuredProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product._id}>
                  <Card sx={{
                    height: '100%',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      boxShadow: '0 12px 24px rgba(0,0,0,0.15)',
                    }
                  }} onClick={() => navigate(`/product/${product._id}`)}>
                    <CardMedia
                      component="div"
                      sx={{
                        height: 200,
                        background: product.images?.[0] 
                          ? `url(${product.images[0]}) center/cover`
                          : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        position: 'relative'
                      }}
                    >
                      <Box sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        display: 'flex',
                        gap: 1
                      }}>
                        <Chip 
                          label={product.type} 
                          size="small" 
                          sx={{
                            background: product.type === 'sell' ? '#10b981' : '#f59e0b',
                            color: 'white',
                            fontWeight: 600
                          }}
                        />
                        <IconButton sx={{ 
                          background: 'rgba(255,255,255,0.9)',
                          '&:hover': { background: '#fff' }
                        }}>
                          <Favorite sx={{ color: '#f56565' }} />
                        </IconButton>
                      </Box>
                    </CardMedia>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h6" component="h3" sx={{ 
                        fontWeight: 600, 
                        mb: 1,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}>
                        {product.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ 
                        mb: 2,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {product.description}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#667eea' }}>
                          ${product.price}
                          {product.rentPricePerDay && (
                            <Typography component="span" variant="body2" sx={{ color: 'text.secondary', ml: 1 }}>
                              / ${product.rentPricePerDay} per day
                            </Typography>
                          )}
                        </Typography>
                        <Chip 
                          label={product.condition} 
                          size="small" 
                          variant="outlined"
                          sx={{ borderColor: '#10b981', color: '#10b981' }}
                        />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>
        </Container>
      </Box>

      {/* Benefits Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" component="h2" textAlign="center" sx={{ mb: 6, fontWeight: 700, color: '#2d3748' }}>
          Trusted by Thousands
        </Typography>
        <Grid container spacing={4}>
          {benefits.map((benefit, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
                <Box sx={{
                  p: 2,
                  borderRadius: 2,
                  background: 'rgba(102, 126, 234, 0.1)',
                  border: '1px solid rgba(102, 126, 234, 0.2)'
                }}>
                  {benefit.icon}
                </Box>
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1, color: '#2d3748' }}>
                    {benefit.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {benefit.description}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)',
        color: 'white',
        py: 8
      }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 700, mb: 3 }}>
            Ready to Get Started?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Join thousands of users who are already buying, selling, and renting on EcoMart
          </Typography>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="center">
            <Button 
              variant="contained" 
              size="large"
              sx={{
                background: '#667eea',
                px: 4,
                py: 1.5,
                '&:hover': {
                  background: '#764ba2',
                  transform: 'translateY(-2px)',
                }
              }}
              onClick={() => navigate('/register')}
            >
              Sign Up Now
            </Button>
            <Button 
              variant="outlined" 
              size="large"
              sx={{
                borderColor: 'white',
                color: 'white',
                px: 4,
                py: 1.5,
                '&:hover': {
                  borderColor: 'white',
                  background: 'rgba(255,255,255,0.1)',
                  transform: 'translateY(-2px)',
                }
              }}
              onClick={() => navigate('/login')}
            >
              Sign In
            </Button>
          </Stack>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
