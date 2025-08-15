import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Card,
  CardContent,
  Chip,
  Button,
} from '@mui/material';
import { getDashboardData } from '../features/dashboardSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const { profile, products, summary, loading } = useSelector(
    (state) => state.dashboard
  );
  const { isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getDashboardData());
    }
  }, [dispatch, isAuthenticated]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth={false} sx={{ 
      height: '100vh', 
      p: 0,
      bgcolor: '#f5f5f5',
      overflow: 'auto'
    }}>
      <Box sx={{ 
        py: 3,
        px: { xs: 2, sm: 3 },
        minHeight: '100%'
      }}>
        <Typography 
          variant="h4" 
          gutterBottom 
          sx={{ 
            fontWeight: 'bold',
            color: '#1976d2',
            mb: 3
          }}>
          Dashboard
        </Typography>

        {/* Profile Section */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            mb: 4,
            borderRadius: 3,
            bgcolor: 'linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)',
            boxShadow: '0 4px 24px 0 rgba(31,38,135,0.12)',
            animation: 'fadeIn 0.8s',
          }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium' }}>
            Profile Information
          </Typography>
          <Box 
            display="grid" 
            gridTemplateColumns={{ xs: '1fr', md: '1fr 1fr' }}
            gap={2}
          >
            <Box>
              <Typography>
                <strong>Name:</strong> {profile?.name}
              </Typography>
              <Typography>
                <strong>Email:</strong> {profile?.email}
              </Typography>
              <Typography>
                <strong>Phone:</strong> {profile?.phone}
              </Typography>
            </Box>
            <Box>
              <Typography>
                <strong>Address:</strong>
              </Typography>
              <Typography>
                {profile?.address?.street}, {profile?.address?.city}
              </Typography>
              <Typography>
                {profile?.address?.state}, {profile?.address?.zipCode}
              </Typography>
              <Typography>{profile?.address?.country}</Typography>
            </Box>
          </Box>
        </Paper>

        {/* Summary Section */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 3, 
            mb: 4,
            borderRadius: 2,
            bgcolor: 'background.paper'
          }}>
          <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium' }}>
            Summary
          </Typography>
          <Box 
            display="grid" 
            gridTemplateColumns={{ 
              xs: '1fr',
              sm: 'repeat(3, 1fr)'
            }}
            gap={3}
          >
            <Card sx={{ height: '100%', background: 'linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)', boxShadow: '0 4px 24px 0 rgba(31,38,135,0.12)', borderRadius: 3, animation: 'fadeIn 0.8s' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  Total Listings
                </Typography>
                <Typography variant="h4">{summary?.total || 0}</Typography>
              </CardContent>
            </Card>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  By Type
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={`Sell: ${summary?.byType?.sell || 0}`}
                    color="primary"
                  />
                  <Chip
                    label={`Rent: ${summary?.byType?.rent || 0}`}
                    color="secondary"
                  />
                  <Chip
                    label={`Buy: ${summary?.byType?.buy || 0}`}
                    color="success"
                  />
                </Box>
              </CardContent>
            </Card>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Typography color="textSecondary" gutterBottom>
                  By Status
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  <Chip
                    label={`Available: ${summary?.byStatus?.available || 0}`}
                    color="success"
                  />
                  <Chip
                    label={`Sold: ${summary?.byStatus?.sold || 0}`}
                    color="error"
                  />
                  <Chip
                    label={`Rented: ${summary?.byStatus?.rented || 0}`}
                    color="warning"
                  />
                </Box>
              </CardContent>
            </Card>
          </Box>
        </Paper>

        {/* Products Section */}
        <Paper 
          elevation={0}
          sx={{ 
            p: 3,
            borderRadius: 2,
            bgcolor: 'background.paper'
          }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 'medium' }}>
              My Listings
            </Typography>
            <Button
              component={Link}
              to="/product/new"
              variant="contained"
              color="primary"
              sx={{ textTransform: 'none' }}
            >
              Add New Listing
            </Button>
          </Box>

          <Box 
            display="grid"
            gridTemplateColumns={{
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)'
            }}
            gap={3}
          >
            {products?.map((product) => (
              <Card 
                key={product._id}
                sx={{ 
                  height: '100%',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3
                  }
                }}
              >
                <CardContent>
                  <Typography variant="h6" noWrap>
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
                      label={product.status.toUpperCase()}
                      color={
                        product.status === 'available'
                          ? 'success'
                          : product.status === 'sold'
                          ? 'error'
                          : 'warning'
                      }
                      size="small"
                    />
                  </Box>
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Category: {product.category}
                  </Typography>
                  <Typography variant="h6" color="primary" sx={{ mt: 1 }}>
                    ${product.price}
                    {product.type === 'rent' &&
                      ` / $${product.rentPricePerDay} per day`}
                  </Typography>
                  <Button
                    component={Link}
                    to={`/product/${product._id}`}
                    variant="outlined"
                    fullWidth
                    sx={{ 
                      mt: 2,
                      textTransform: 'none'
                    }}
                  >
                    View Details
                  </Button>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Dashboard;
