<<<<<<< HEAD
import React, { useEffect, useState, memo } from 'react';
=======
import React, { useEffect, useState } from 'react';
>>>>>>> 3af5b2101e6344b36c4887c6476b665044ebd75f
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
<<<<<<< HEAD
  Skeleton,
  Fade,
  Slide,
  Grow,
  Zoom
=======
  Skeleton
>>>>>>> 3af5b2101e6344b36c4887c6476b665044ebd75f
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
<<<<<<< HEAD
  Support,
  FavoriteBorder
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getProducts } from '../features/productsSlice';
import ProductCard from '../components/ui/ProductCard';
import RecommendedProducts from '../components/RecommendedProducts';
import TrendingProducts from '../components/TrendingProducts';
=======
  Support
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../features/productSlice';
>>>>>>> 3af5b2101e6344b36c4887c6476b665044ebd75f

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, loading } = useSelector(state => state.products);
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
<<<<<<< HEAD
    dispatch(getProducts({ limit: 6 }));
=======
    dispatch(fetchProducts({ limit: 6 }));
>>>>>>> 3af5b2101e6344b36c4887c6476b665044ebd75f
  }, [dispatch]);

  useEffect(() => {
    if (products.length > 0) {
      setFeaturedProducts(products.slice(0, 6));
    }
  }, [products]);

  const features = [
    {
<<<<<<< HEAD
      icon: <ShoppingCart sx={{ fontSize: 48, color: '#667eea' }} />,
      title: 'Buy Products',
      description: 'Find amazing deals on quality products from trusted sellers',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    {
      icon: <LocalOffer sx={{ fontSize: 48, color: '#10b981' }} />,
      title: 'Sell Items',
      description: 'Turn your unused items into cash with our easy selling platform',
      gradient: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
    },
    {
      icon: <TrendingUp sx={{ fontSize: 48, color: '#f59e0b' }} />,
      title: 'Rent & Lend',
      description: 'Rent what you need or earn by lending your valuable items',
      gradient: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'
=======
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
>>>>>>> 3af5b2101e6344b36c4887c6476b665044ebd75f
    }
  ];

  const benefits = [
    {
<<<<<<< HEAD
      icon: <Security sx={{ fontSize: 40, color: '#667eea' }} />,
      title: 'Secure Transactions',
      description: 'Advanced encryption and secure payment processing',
      color: '#667eea'
    },
    {
      icon: <Support sx={{ fontSize: 40, color: '#10b981' }} />,
      title: '24/7 Support',
      description: 'Round-the-clock customer support for all your needs',
      color: '#10b981'
    },
    {
      icon: <Category sx={{ fontSize: 40, color: '#f59e0b' }} />,
      title: 'Wide Categories',
      description: 'Electronics, furniture, fashion, sports and much more',
      color: '#f59e0b'
=======
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
>>>>>>> 3af5b2101e6344b36c4887c6476b665044ebd75f
    }
  ];

  return (
    <Box>
      {/* Hero Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
<<<<<<< HEAD
        py: 10,
=======
        py: 8,
>>>>>>> 3af5b2101e6344b36c4887c6476b665044ebd75f
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
<<<<<<< HEAD
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%)',
          animation: 'shimmer 3s infinite'
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in timeout={1000}>
                <Box>
                  <Typography variant="h2" component="h1" className="text-shimmer" sx={{
                    fontWeight: 800,
                    mb: 3,
                    fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4rem' },
                    lineHeight: 1.1,
                    background: 'linear-gradient(45deg, #ffffff 30%, #e3f2fd 90%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent'
                  }}>
                    Welcome to EcoMart
                  </Typography>
                </Box>
              </Fade>
              
              <Slide in direction="up" timeout={1200}>
                <Typography variant="h5" className="fade-in-up stagger-1" sx={{ 
                  mb: 5, 
                  opacity: 0.95, 
                  fontWeight: 400,
                  lineHeight: 1.6,
                  fontSize: { xs: '1.1rem', md: '1.25rem' }
                }}>
                  Your all-in-one marketplace for buying, selling, and renting. 
                  Discover amazing deals and turn your items into income.
                </Typography>
              </Slide>
              
              <Grow in timeout={1500}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3}>
                  <Button 
                    variant="contained" 
                    size="large"
                    className="button-modern hover-glow"
                    sx={{
                      background: 'rgba(255,255,255,0.25)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255,255,255,0.3)',
                      color: 'white',
                      fontWeight: 700,
                      px: 5,
                      py: 2,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        background: 'rgba(255,255,255,0.35)',
                        transform: 'translateY(-4px) scale(1.02)',
                        boxShadow: '0 15px 40px rgba(0,0,0,0.2)'
                      }
                    }}
                    onClick={() => navigate('/products')}
                    endIcon={<ArrowForward className="hover-scale" />}
                  >
                    Start Shopping
                  </Button>
                  <Button 
                    variant="outlined" 
                    size="large"
                    className="button-modern hover-lift"
                    sx={{
                      borderColor: 'rgba(255,255,255,0.7)',
                      color: 'white',
                      fontWeight: 600,
                      px: 5,
                      py: 2,
                      borderRadius: 3,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      borderWidth: '2px',
                      transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        borderColor: 'white',
                        background: 'rgba(255,255,255,0.15)',
                        transform: 'translateY(-4px)',
                        boxShadow: '0 12px 30px rgba(0,0,0,0.15)'
                      }
                    }}
                    onClick={() => navigate('/product/new')}
                  >
                    Sell Your Items
                  </Button>
                </Stack>
              </Grow>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Zoom in timeout={1800}>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'center',
                  position: 'relative'
                }}>
                  <Box className="float glass-effect" sx={{
                    width: { xs: 300, md: 450 },
                    height: { xs: 250, md: 350 },
                    background: 'rgba(255,255,255,0.15)',
                    borderRadius: 4,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255,255,255,0.25)',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
                    position: 'relative',
                    overflow: 'hidden'
                  }}>
                    <Typography variant="h4" className="gradient-text" sx={{ 
                      opacity: 0.8,
                      fontWeight: 600,
                      textAlign: 'center'
                    }}>
                      🌟 EcoMart 🌟<br/>
                      <Typography variant="h6" component="span" sx={{ opacity: 0.7 }}>
                        Marketplace Revolution
                      </Typography>
                    </Typography>
                    
                    {/* Floating elements */}
                    <Box className="float" sx={{
                      position: 'absolute',
                      top: 20,
                      right: 20,
                      background: 'rgba(255,255,255,0.2)',
                      borderRadius: '50%',
                      p: 2,
                      animation: 'float 3s ease-in-out infinite'
                    }}>
                      <ShoppingCart sx={{ color: 'white', fontSize: 24 }} />
                    </Box>
                    
                    <Box className="float" sx={{
                      position: 'absolute',
                      bottom: 30,
                      left: 30,
                      background: 'rgba(255,255,255,0.2)',
                      borderRadius: '50%',
                      p: 2,
                      animation: 'float 3s ease-in-out infinite 1s'
                    }}>
                      <TrendingUp sx={{ color: 'white', fontSize: 24 }} />
                    </Box>
                  </Box>
                </Box>
              </Zoom>
=======
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
>>>>>>> 3af5b2101e6344b36c4887c6476b665044ebd75f
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
<<<<<<< HEAD
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Fade in timeout={800}>
          <Typography variant="h3" component="h2" textAlign="center" className="gradient-text" sx={{ 
            mb: 8, 
            fontWeight: 800,
            fontSize: { xs: '2.5rem', md: '3rem' }
          }}>
            Why Choose EcoMart?
          </Typography>
        </Fade>
        
        <Grid container spacing={5}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Grow in timeout={1200 + index * 200}>
                <Paper className="card-interactive glass-effect" sx={{
                  p: 5,
                  textAlign: 'center',
                  height: '100%',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 4,
                  backdropFilter: 'blur(20px)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '4px',
                    background: feature.gradient,
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  },
                  '&:hover::before': {
                    opacity: 1
                  }
                }}>
                  <Box className="hover-scale" sx={{ 
                    mb: 4,
                    display: 'inline-block',
                    p: 2,
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${feature.gradient.split(' ')[1]} 0%, ${feature.gradient.split(' ')[3]} 100%)`,
                    color: 'white',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                  }}>
                    {feature.icon}
                  </Box>
                  
                  <Typography variant="h5" component="h3" className="fade-in-up" sx={{ 
                    mb: 3, 
                    fontWeight: 700, 
                    color: '#2d3748',
                    fontSize: '1.5rem'
                  }}>
                    {feature.title}
                  </Typography>
                  
                  <Typography variant="body1" className="fade-in-up stagger-1" sx={{
                    color: 'text.secondary',
                    lineHeight: 1.7,
                    fontSize: '1rem'
                  }}>
                    {feature.description}
                  </Typography>
                </Paper>
              </Grow>
=======
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
>>>>>>> 3af5b2101e6344b36c4887c6476b665044ebd75f
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Products Section */}
<<<<<<< HEAD
      <Box sx={{ 
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', 
        py: 10,
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="40" height="40" viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23667eea" fill-opacity="0.03"%3E%3Cpath d="M20 20c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Slide in direction="up" timeout={800}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 8 }}>
              <Typography variant="h3" component="h2" className="gradient-text" sx={{ 
                fontWeight: 800,
                fontSize: { xs: '2rem', md: '3rem' }
              }}>
                Featured Products
              </Typography>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/products')}
                endIcon={<ArrowForward className="hover-scale" />}
                className="button-modern hover-glow"
                sx={{ 
                  borderColor: '#667eea',
                  color: '#667eea',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: 'none',
                  borderWidth: '2px',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    borderColor: '#764ba2',
                    color: '#764ba2',
                    background: 'rgba(102, 126, 234, 0.08)',
                    transform: 'translateY(-2px)',
                    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.2)'
                  }
                }}
              >
                View All
              </Button>
            </Box>
          </Slide>
          
          <div className="product-grid-container" data-product-grid>
            {loading ? (
              // Enhanced loading skeletons
              Array.from(new Array(6)).map((_, index) => (
                <Grow in timeout={800 + index * 100} key={index}>
                  <Card className="loading-skeleton product-card" sx={{ 
                    height: 420, 
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
                  }}>
                    <Skeleton 
                      variant="rectangular" 
                      height={240} 
                      className="loading-skeleton"
                      sx={{ borderRadius: '12px 12px 0 0' }} 
                    />
                    <CardContent sx={{ p: 3 }}>
                      <Skeleton variant="text" height={28} className="loading-skeleton" sx={{ mb: 1 }} />
                      <Skeleton variant="text" height={20} className="loading-skeleton" sx={{ mb: 1 }} />
                      <Skeleton variant="text" height={20} width="60%" className="loading-skeleton" sx={{ mb: 2 }} />
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Skeleton variant="text" height={24} width="40%" className="loading-skeleton" />
                        <Skeleton variant="rectangular" height={24} width={60} className="loading-skeleton" sx={{ borderRadius: 2 }} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grow>
              ))
            ) : (
              featuredProducts.map((product, index) => (
                <ProductCard 
                  key={product._id}
                  product={product} 
                  variant="featured"
                  showActions={true}
                  index={index}
                />
              ))
            )}
          </div>
        </Container>
      </Box>

      {/* Trending Products Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Slide in direction="up" timeout={1200}>
          <Box>
            <TrendingProducts maxItems={8} showTitle={true} />
          </Box>
        </Slide>
      </Container>

      {/* Recommended Products Section - Only for authenticated users */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.03) 0%, rgba(118, 75, 162, 0.03) 100%)', 
        py: 8 
      }}>
        <Container maxWidth="lg">
          <Fade in timeout={1000}>
            <Box>
              <RecommendedProducts maxItems={8} showTitle={true} />
            </Box>
          </Fade>
=======
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
>>>>>>> 3af5b2101e6344b36c4887c6476b665044ebd75f
        </Container>
      </Box>

      {/* Benefits Section */}
<<<<<<< HEAD
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Slide in direction="up" timeout={800}>
          <Typography variant="h3" component="h2" textAlign="center" className="gradient-text" sx={{ 
            mb: 8, 
            fontWeight: 800,
            fontSize: { xs: '2.5rem', md: '3rem' }
          }}>
            Trusted by Thousands
          </Typography>
        </Slide>
        
        <Grid container spacing={6}>
          {benefits.map((benefit, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Grow in timeout={1200 + index * 200}>
                <Box className="hover-lift" sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: 3,
                  p: 3,
                  borderRadius: 3,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    background: 'rgba(102, 126, 234, 0.02)',
                    transform: 'translateY(-4px)'
                  }
                }}>
                  <Box className="hover-scale" sx={{
                    p: 2.5,
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${benefit.color}15 0%, ${benefit.color}08 100%)`,
                    border: `2px solid ${benefit.color}20`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: `linear-gradient(135deg, ${benefit.color}25 0%, ${benefit.color}15 100%)`,
                      borderColor: `${benefit.color}40`,
                      transform: 'scale(1.05)',
                      boxShadow: `0 8px 25px ${benefit.color}20`
                    }
                  }}>
                    {benefit.icon}
                  </Box>
                  <Box>
                    <Typography variant="h6" className="fade-in-left" sx={{ 
                      fontWeight: 700, 
                      mb: 1.5, 
                      color: '#2d3748',
                      fontSize: '1.25rem'
                    }}>
                      {benefit.title}
                    </Typography>
                    <Typography variant="body1" className="fade-in-up" sx={{
                      color: 'text.secondary',
                      lineHeight: 1.7,
                      fontSize: '1rem'
                    }}>
                      {benefit.description}
                    </Typography>
                  </Box>
                </Box>
              </Grow>
=======
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
>>>>>>> 3af5b2101e6344b36c4887c6476b665044ebd75f
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{
        background: 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)',
        color: 'white',
<<<<<<< HEAD
        py: 10,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="7" cy="7" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.03) 50%, transparent 60%)',
          animation: 'shimmer 4s infinite'
        }
      }}>
        <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
          <Zoom in timeout={800}>
            <Typography variant="h3" className="text-shimmer" sx={{ 
              fontWeight: 800, 
              mb: 4,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              background: 'linear-gradient(45deg, #ffffff 30%, #e3f2fd 90%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Ready to Get Started?
            </Typography>
          </Zoom>
          
          <Slide in direction="up" timeout={1200}>
            <Typography variant="h6" sx={{ 
              mb: 6, 
              opacity: 0.95,
              lineHeight: 1.6,
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              maxWidth: '600px',
              mx: 'auto'
            }}>
              Join thousands of users who are already buying, selling, and renting on EcoMart. 
              Start your marketplace journey today!
            </Typography>
          </Slide>
          
          <Grow in timeout={1500}>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} justifyContent="center">
              <Button 
                variant="contained" 
                size="large"
                className="button-modern hover-glow"
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  px: 6,
                  py: 2.5,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 700,
                  boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                    transform: 'translateY(-4px) scale(1.02)',
                    boxShadow: '0 15px 40px rgba(102, 126, 234, 0.4)'
                  }
                }}
                onClick={() => navigate('/register')}
              >
                Sign Up Now
              </Button>
              <Button 
                variant="outlined" 
                size="large"
                className="button-modern hover-lift"
                sx={{
                  borderColor: 'rgba(255,255,255,0.7)',
                  color: 'white',
                  px: 6,
                  py: 2.5,
                  borderRadius: 3,
                  textTransform: 'none',
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  borderWidth: '2px',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  '&:hover': {
                    borderColor: 'white',
                    background: 'rgba(255,255,255,0.15)',
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 30px rgba(255,255,255,0.1)'
                  }
                }}
                onClick={() => navigate('/login')}
              >
                Sign In
              </Button>
            </Stack>
          </Grow>
=======
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
>>>>>>> 3af5b2101e6344b36c4887c6476b665044ebd75f
        </Container>
      </Box>
    </Box>
  );
};

export default memo(Home);
