import React, { useEffect, useState, memo } from 'react';
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
  Skeleton,
  Fade,
  Slide,
  Grow,
  Zoom,
  Avatar,
  Divider,
  TextField,
  Rating
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
  Support,
  FavoriteBorder,
  PersonalVideo,
  Explore,
  Recommend,
  Feedback,
  RateReview,
  Send,
  ThumbUp
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getProducts } from '../features/productsSlice';
import ProductCard from '../components/ui/ProductCard';

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, loading } = useSelector(state => state.products);
  const { isAuthenticated } = useSelector(state => state.auth);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [feedback, setFeedback] = useState({
    rating: 0,
    comment: '',
    category: ''
  });
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);

  useEffect(() => {
    dispatch(getProducts({ limit: 6 }));
  }, [dispatch]);

  useEffect(() => {
    if (products.length > 0) {
      setFeaturedProducts(products.slice(0, 6));
    }
  }, [products]);

  const features = [
    {
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
    }
  ];

  const benefits = [
    {
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
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.05) 50%, transparent 60%)',
        }
      }}>
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in timeout={1000}>
                <Typography variant="h2" component="h1" sx={{
                  fontWeight: 800,
                  mb: 3,
                  fontSize: { xs: '2.5rem', md: '3.5rem' },
                  background: 'linear-gradient(45deg, #ffffff 30%, #e3f2fd 90%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  Welcome to EcoMart
                </Typography>
              </Fade>
              
              <Slide in direction="up" timeout={1200}>
                <Typography variant="h5" sx={{ 
                  mb: 4, 
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
                  <Box sx={{
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
                    <Typography variant="h4" sx={{ 
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
                    <Box sx={{
                      position: 'absolute',
                      top: 20,
                      right: 20,
                      background: 'rgba(255,255,255,0.2)',
                      borderRadius: '50%',
                      p: 2,
                    }}>
                      <ShoppingCart sx={{ color: 'white', fontSize: 24 }} />
                    </Box>
                    
                    <Box sx={{
                      position: 'absolute',
                      bottom: 30,
                      left: 30,
                      background: 'rgba(255,255,255,0.2)',
                      borderRadius: '50%',
                      p: 2,
                    }}>
                      <TrendingUp sx={{ color: 'white', fontSize: 24 }} />
                    </Box>
                  </Box>
                </Box>
              </Zoom>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Fade in timeout={800}>
          <Typography variant="h3" component="h2" textAlign="center" sx={{ 
            mb: 8, 
            fontWeight: 800,
            fontSize: { xs: '2.5rem', md: '3rem' },
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Why Choose EcoMart?
          </Typography>
        </Fade>
        
        <Grid container spacing={5}>
          {features.map((feature, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Grow in timeout={1200 + index * 200}>
                <Paper sx={{
                  p: 5,
                  textAlign: 'center',
                  height: '100%',
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,0.9) 100%)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: 4,
                  backdropFilter: 'blur(20px)',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
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
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                  },
                  '&:hover::before': {
                    opacity: 1
                  }
                }}>
                  <Box sx={{ 
                    mb: 4,
                    display: 'inline-block',
                    p: 2,
                    borderRadius: 3,
                    background: feature.gradient,
                    color: 'white',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.1)'
                  }}>
                    {feature.icon}
                  </Box>
                  
                  <Typography variant="h5" component="h3" sx={{ 
                    mb: 3, 
                    fontWeight: 700, 
                    color: '#2d3748',
                    fontSize: '1.5rem'
                  }}>
                    {feature.title}
                  </Typography>
                  
                  <Typography variant="body1" sx={{
                    color: 'text.secondary',
                    lineHeight: 1.7,
                    fontSize: '1rem'
                  }}>
                    {feature.description}
                  </Typography>
                </Paper>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Products Section */}
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
              <Typography variant="h3" component="h2" sx={{ 
                fontWeight: 800,
                fontSize: { xs: '2rem', md: '3rem' },
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Featured Products
              </Typography>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/products')}
                endIcon={<ArrowForward />}
                sx={{ 
                  borderColor: '#667eea',
                  color: '#667eea',
                  fontWeight: 600,
                  px: 4,
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: 'none',
                  borderWidth: '2px',
                  transition: 'all 0.3s ease',
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
              // Loading skeletons
              Array.from(new Array(6)).map((_, index) => (
                <Grow in timeout={800 + index * 100} key={index}>
                  <Card className="product-card" sx={{ 
                    minHeight: 380,
                    maxHeight: 380,
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: 3,
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
                  }}>
                    <Skeleton 
                      variant="rectangular" 
                      height={160} 
                      sx={{ 
                        borderRadius: '0',
                        flexShrink: 0
                      }} 
                    />
                    <CardContent sx={{ 
                      p: 2, 
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between'
                    }}>
                      {/* Header Section */}
                      <Box>
                        <Skeleton variant="text" height={24} sx={{ mb: 1 }} />
                        <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                          <Skeleton variant="rectangular" width={60} height={18} sx={{ borderRadius: 1 }} />
                          <Skeleton variant="rectangular" width={50} height={18} sx={{ borderRadius: 1 }} />
                        </Box>
                        <Skeleton variant="text" height={14} sx={{ mb: 0.5 }} />
                        <Skeleton variant="text" height={14} width="60%" sx={{ mb: 1 }} />
                      </Box>
                      
                      {/* Footer Section */}
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Skeleton variant="text" height={20} width="40%" />
                        <Skeleton variant="rectangular" height={24} width={60} sx={{ borderRadius: 1 }} />
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

      {/* Benefits Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Slide in direction="up" timeout={800}>
          <Typography variant="h3" component="h2" textAlign="center" sx={{ 
            mb: 8, 
            fontWeight: 800,
            fontSize: { xs: '2.5rem', md: '3rem' },
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Trusted by Thousands
          </Typography>
        </Slide>
        
        <Grid container spacing={6}>
          {benefits.map((benefit, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Grow in timeout={1200 + index * 200}>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: 3,
                  p: 3,
                  borderRadius: 3,
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    background: 'rgba(102, 126, 234, 0.02)',
                    transform: 'translateY(-4px)'
                  }
                }}>
                  <Box sx={{
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
                    <Typography variant="h6" sx={{ 
                      fontWeight: 700, 
                      mb: 1.5, 
                      color: '#2d3748',
                      fontSize: '1.25rem'
                    }}>
                      {benefit.title}
                    </Typography>
                    <Typography variant="body1" sx={{
                      color: 'text.secondary',
                      lineHeight: 1.7,
                      fontSize: '1rem'
                    }}>
                      {benefit.description}
                    </Typography>
                  </Box>
                </Box>
              </Grow>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section / Feedback Section */}
      {isAuthenticated ? (
        /* Website Feedback Section for Authenticated Users */
        <Box sx={{ py: 8, background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
          <Container maxWidth="lg">
            <Fade in timeout={800}>
              <Box sx={{ textAlign: 'center', mb: 6 }}>
                <Typography variant="h3" sx={{ 
                  fontWeight: 800, 
                  mb: 2,
                  fontSize: { xs: '2rem', md: '2.5rem' },
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>
                  <Feedback sx={{ fontSize: 'inherit', mr: 2, verticalAlign: 'middle' }} />
                  Share Your Experience
                </Typography>
                <Typography variant="h6" sx={{ 
                  color: 'text.secondary',
                  fontWeight: 400,
                  maxWidth: '600px',
                  mx: 'auto'
                }}>
                  Help us improve EcoMart! Share your feedback and let us know how we're doing
                </Typography>
              </Box>
            </Fade>

            <Grid container spacing={4} justifyContent="center">
              {/* Feedback Form */}
              <Grid item xs={12} md={8}>
                <Slide in direction="up" timeout={1000}>
                  <Paper sx={{ 
                    p: 4, 
                    borderRadius: 3, 
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.05)'
                  }}>
                    {!feedbackSubmitted ? (
                      <Stack spacing={3}>
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2, color: '#2d3748' }}>
                            Rate Your Experience
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            How would you rate your overall experience with EcoMart?
                          </Typography>
                          <Rating
                            value={feedback.rating}
                            onChange={(event, newValue) => {
                              setFeedback(prev => ({ ...prev, rating: newValue }));
                            }}
                            size="large"
                            sx={{ fontSize: '2.5rem' }}
                          />
                        </Box>

                        <Divider />

                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#2d3748' }}>
                            Tell us more about your experience
                          </Typography>
                          <TextField
                            fullWidth
                            multiline
                            rows={4}
                            placeholder="Share your thoughts, suggestions, or any issues you've encountered..."
                            value={feedback.comment}
                            onChange={(e) => setFeedback(prev => ({ ...prev, comment: e.target.value }))}
                            sx={{
                              '& .MuiOutlinedInput-root': {
                                borderRadius: 2,
                                '&:hover fieldset': {
                                  borderColor: '#667eea',
                                },
                                '&.Mui-focused fieldset': {
                                  borderColor: '#667eea',
                                },
                              },
                            }}
                          />
                        </Box>

                        <Box>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#2d3748' }}>
                            Feedback Category
                          </Typography>
                          <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                            {['User Interface', 'Product Quality', 'Customer Service', 'Performance', 'Features', 'General'].map((category) => (
                              <Chip
                                key={category}
                                label={category}
                                clickable
                                variant={feedback.category === category ? 'filled' : 'outlined'}
                                color={feedback.category === category ? 'primary' : 'default'}
                                onClick={() => setFeedback(prev => ({ ...prev, category }))}
                                sx={{
                                  borderRadius: 2,
                                  fontWeight: 500,
                                  '&:hover': {
                                    backgroundColor: feedback.category === category ? undefined : 'rgba(102, 126, 234, 0.1)',
                                  }
                                }}
                              />
                            ))}
                          </Stack>
                        </Box>

                        <Box sx={{ textAlign: 'center', pt: 2 }}>
                          <Button
                            variant="contained"
                            size="large"
                            startIcon={<Send />}
                            disabled={!feedback.rating || !feedback.comment.trim()}
                            onClick={() => setFeedbackSubmitted(true)}
                            sx={{
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              px: 4,
                              py: 2,
                              borderRadius: 2,
                              textTransform: 'none',
                              fontSize: '1rem',
                              fontWeight: 600,
                              boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
                              '&:hover': {
                                background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                                transform: 'translateY(-2px)',
                                boxShadow: '0 6px 20px rgba(102, 126, 234, 0.4)'
                              },
                              '&:disabled': {
                                background: 'linear-gradient(135deg, #cbd5e0 0%, #a0aec0 100%)',
                                color: 'white'
                              }
                            }}
                          >
                            Submit Feedback
                          </Button>
                        </Box>
                      </Stack>
                    ) : (
                      <Box sx={{ textAlign: 'center', py: 4 }}>
                        <ThumbUp sx={{ fontSize: 60, color: '#10b981', mb: 2 }} />
                        <Typography variant="h4" sx={{ fontWeight: 700, mb: 2, color: '#2d3748' }}>
                          Thank You!
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                          Your feedback has been submitted successfully.
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                          We appreciate you taking the time to help us improve EcoMart. 
                          Your input helps us create a better experience for everyone!
                        </Typography>
                        <Button
                          variant="outlined"
                          onClick={() => {
                            setFeedbackSubmitted(false);
                            setFeedback({ rating: 0, comment: '', category: '' });
                          }}
                          sx={{ mt: 3, borderColor: '#667eea', color: '#667eea' }}
                        >
                          Submit Another Review
                        </Button>
                      </Box>
                    )}
                  </Paper>
                </Slide>
              </Grid>

              {/* Quick Actions & Info */}
              <Grid item xs={12} md={4}>
                <Stack spacing={3}>
                  <Slide in direction="up" timeout={1200}>
                    <Paper sx={{ 
                      p: 3, 
                      borderRadius: 3, 
                      background: 'linear-gradient(135deg, #10b98115 0%, #10b98108 100%)',
                      border: '1px solid #10b98120'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <RateReview sx={{ color: '#10b981', fontSize: 28, mr: 1 }} />
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748' }}>
                          Why Your Feedback Matters
                        </Typography>
                      </Box>
                      <Stack spacing={2}>
                        <Typography variant="body2" color="text.secondary">
                          🚀 <strong>Improve Features:</strong> Help us prioritize new features and improvements
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          🐛 <strong>Fix Issues:</strong> Report bugs and usability problems
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ⭐ <strong>Better Experience:</strong> Shape the future of EcoMart
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          🤝 <strong>Community Driven:</strong> Build a platform that works for everyone
                        </Typography>
                      </Stack>
                    </Paper>
                  </Slide>

                  <Slide in direction="up" timeout={1400}>
                    <Paper sx={{ 
                      p: 3, 
                      borderRadius: 3, 
                      background: 'linear-gradient(135deg, #667eea15 0%, #667eea08 100%)',
                      border: '1px solid #667eea20'
                    }}>
                      <Typography variant="h6" sx={{ fontWeight: 700, color: '#2d3748', mb: 2 }}>
                        Quick Actions
                      </Typography>
                      <Stack spacing={2}>
                        <Button 
                          variant="outlined" 
                          fullWidth
                          startIcon={<Category />}
                          onClick={() => navigate('/products')}
                          sx={{ 
                            borderColor: '#667eea', 
                            color: '#667eea',
                            textTransform: 'none',
                            fontWeight: 500
                          }}
                        >
                          Browse Products
                        </Button>
                        <Button 
                          variant="outlined" 
                          fullWidth
                          startIcon={<ShoppingCart />}
                          onClick={() => navigate('/product/new')}
                          sx={{ 
                            borderColor: '#f59e0b', 
                            color: '#f59e0b',
                            textTransform: 'none',
                            fontWeight: 500
                          }}
                        >
                          Sell Your Items
                        </Button>
                      </Stack>
                    </Paper>
                  </Slide>
                </Stack>
              </Grid>
            </Grid>
          </Container>
        </Box>
      ) : (
        /* Original CTA Section for Non-Authenticated Users */
        <Box sx={{
          background: 'linear-gradient(135deg, #2d3748 0%, #4a5568 100%)',
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
            background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="7" cy="7" r="1"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }
        }}>
          <Container maxWidth="md" sx={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <Zoom in timeout={800}>
              <Typography variant="h3" sx={{ 
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
                  sx={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    px: 6,
                    py: 2.5,
                    borderRadius: 3,
                    textTransform: 'none',
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
                    transition: 'all 0.4s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                      transform: 'translateY(-4px)',
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
                    transition: 'all 0.4s ease',
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
          </Container>
        </Box>
      )}
    </Box>
  );
};

export default memo(Home);
