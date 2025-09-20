import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Paper,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Chip,
  IconButton,
  Tooltip,
  Divider,
  Tab,
  Tabs,
  LinearProgress
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  People,
  Inventory,
  ShoppingCart,
  AttachMoney,
  Timeline,
  Refresh,
  Analytics as AnalyticsIcon,
  BarChart,
  PieChart,
  ShowChart
} from '@mui/icons-material';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Cell,
  Pie,
  LineChart,
  Line,
  Area,
  AreaChart
} from 'recharts';
import api from '../services/api';

const COLORS = ['#1976d2', '#2e7d2e', '#ed6c02', '#d32f2f', '#7b1fa2', '#c62828'];

const MetricCard = ({ title, value, change, icon: Icon, color = 'primary', loading = false }) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <Box>
          <Typography color="textSecondary" gutterBottom variant="body2">
            {title}
          </Typography>
          <Typography variant="h4" component="div">
            {loading ? <CircularProgress size={24} /> : value}
          </Typography>
          {change !== undefined && (
            <Box display="flex" alignItems="center" mt={1}>
              {change >= 0 ? (
                <TrendingUp color="success" sx={{ mr: 1 }} />
              ) : (
                <TrendingDown color="error" sx={{ mr: 1 }} />
              )}
              <Typography
                variant="body2"
                color={change >= 0 ? 'success.main' : 'error.main'}
              >
                {Math.abs(change)}%
              </Typography>
            </Box>
          )}
        </Box>
        <Box
          sx={{
            bgcolor: `${color}.main`,
            color: 'white',
            borderRadius: '50%',
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Icon />
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);
  const [realTimeData, setRealTimeData] = useState(null);
  const [activeTab, setActiveTab] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const fetchDashboardData = async () => {
    try {
      setError(null);
      const response = await api.get('/analytics/dashboard');
      setDashboardData(response.data.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  const fetchRealTimeData = async () => {
    try {
      const response = await api.get('/analytics/realtime');
      setRealTimeData(response.data.data);
    } catch (error) {
      console.error('Error fetching real-time data:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await Promise.all([fetchDashboardData(), fetchRealTimeData()]);
    setRefreshing(false);
  };

  useEffect(() => {
    fetchDashboardData();
    fetchRealTimeData();

    // Set up real-time data refresh
    const interval = setInterval(fetchRealTimeData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ m: 2 }}>
        {error}
      </Alert>
    );
  }

  const { overview, charts } = dashboardData || {};

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value || 0);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US').format(value || 0);
  };

  const monthlyRevenueData = charts?.monthlyRevenue?.map(item => ({
    name: `${item._id.month}/${item._id.year}`,
    revenue: item.revenue,
    orders: item.orders
  })) || [];

  const categoryData = charts?.productsByCategory?.map((item, index) => ({
    name: item._id || 'Unknown',
    value: item.count,
    color: COLORS[index % COLORS.length]
  })) || [];

  const orderStatusData = charts?.ordersByStatus?.map((item, index) => ({
    name: item._id || 'Unknown',
    value: item.count,
    color: COLORS[index % COLORS.length]
  })) || [];

  const userGrowthData = charts?.userGrowth?.map(item => ({
    name: `${item._id.month}/${item._id.year}`,
    users: item.count
  })) || [];

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Header */}
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Box>
          <Typography variant="h4" component="h1" gutterBottom>
            Analytics Dashboard
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Monitor your marketplace performance and insights
          </Typography>
        </Box>
        <Tooltip title="Refresh Data">
          <IconButton onClick={handleRefresh} disabled={refreshing}>
            <Refresh />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Real-time metrics */}
      {realTimeData && (
        <Paper sx={{ p: 2, mb: 3, bgcolor: 'primary.main', color: 'white' }}>
          <Typography variant="h6" gutterBottom>
            Real-time Metrics
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={3}>
              <Typography variant="body2">Today's Users</Typography>
              <Typography variant="h6">{realTimeData.todayUsers}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2">Today's Orders</Typography>
              <Typography variant="h6">{realTimeData.todayOrders}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2">Today's Revenue</Typography>
              <Typography variant="h6">{formatCurrency(realTimeData.todayRevenue)}</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2">Online Users</Typography>
              <Typography variant="h6">{realTimeData.onlineUsers}</Typography>
            </Grid>
          </Grid>
        </Paper>
      )}

      {/* Key Metrics */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Users"
            value={formatNumber(overview?.totalUsers)}
            change={overview?.userGrowth}
            icon={People}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Active Products"
            value={formatNumber(overview?.activeProducts)}
            icon={Inventory}
            color="success"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Orders"
            value={formatNumber(overview?.totalOrders)}
            change={overview?.orderGrowth}
            icon={ShoppingCart}
            color="warning"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard
            title="Total Revenue"
            value={formatCurrency(overview?.totalRevenue)}
            change={overview?.revenueGrowth}
            icon={AttachMoney}
            color="error"
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={activeTab} onChange={handleTabChange} aria-label="analytics tabs">
            <Tab label="Revenue & Growth" icon={<ShowChart />} />
            <Tab label="Products & Categories" icon={<PieChart />} />
            <Tab label="Orders & Status" icon={<BarChart />} />
          </Tabs>
        </Box>

        {/* Revenue & Growth Tab */}
        {activeTab === 0 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Monthly Revenue Trend
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyRevenueData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip formatter={(value) => formatCurrency(value)} />
                      <Area
                        type="monotone"
                        dataKey="revenue"
                        stroke="#1976d2"
                        fill="#1976d2"
                        fillOpacity={0.3}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    User Growth
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={userGrowthData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Line
                        type="monotone"
                        dataKey="users"
                        stroke="#2e7d2e"
                        strokeWidth={3}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Products & Categories Tab */}
        {activeTab === 1 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Products by Category
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsPieChart>
                      <Pie
                        data={categoryData}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <RechartsTooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Category Statistics
                  </Typography>
                  <Box>
                    {categoryData.map((category, index) => (
                      <Box key={index} sx={{ mb: 2 }}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                          <Typography variant="body2">{category.name}</Typography>
                          <Chip
                            label={category.value}
                            size="small"
                            sx={{ bgcolor: category.color, color: 'white' }}
                          />
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(category.value / Math.max(...categoryData.map(c => c.value))) * 100}
                          sx={{
                            mt: 1,
                            '& .MuiLinearProgress-bar': {
                              bgcolor: category.color
                            }
                          }}
                        />
                      </Box>
                    ))}
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Orders & Status Tab */}
        {activeTab === 2 && (
          <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={8}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Order Status Distribution
                  </Typography>
                  <ResponsiveContainer width="100%" height={300}>
                    <RechartsBarChart data={orderStatusData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <RechartsTooltip />
                      <Bar dataKey="value" fill="#1976d2" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="h6" gutterBottom>
                    Monthly Performance
                  </Typography>
                  <Box>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">
                        This Month
                      </Typography>
                      <Typography variant="h6">
                        {formatNumber(overview?.ordersThisMonth)} Orders
                      </Typography>
                      <Typography variant="body2">
                        {formatCurrency(overview?.revenueThisMonth)} Revenue
                      </Typography>
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body2" color="textSecondary">
                        Active Bookings
                      </Typography>
                      <Typography variant="h6">
                        {formatNumber(overview?.activeBookings)}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="textSecondary">
                        New Users This Month
                      </Typography>
                      <Typography variant="h6">
                        {formatNumber(overview?.newUsersThisMonth)}
                      </Typography>
                    </Box>
                  </Box>
                </Paper>
              </Grid>
            </Grid>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default Analytics;