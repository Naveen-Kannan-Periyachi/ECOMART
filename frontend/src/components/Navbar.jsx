import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Avatar,
  Tooltip,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Slide,
  Fade,
  Zoom,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  Chip
} from '@mui/material';
import {
  ShoppingCart,
  Notifications,
  AccountCircle,
  Menu as MenuIcon,
  Home,
  Dashboard,
  Chat,
  AdminPanelSettings,
  Add,
  Logout as LogoutIcon,
  Login,
  PersonAdd,
  Store,
  Search,
  Favorite,
  FavoriteBorder,
  Clear,
  MarkEmailRead,
  Gavel
} from '@mui/icons-material';
import { logout } from '../features/authSlice';
import { 
  fetchNotifications, 
  fetchUnreadCount, 
  markNotificationAsRead, 
  markAllNotificationsAsRead,
  clearRealTimeNotification,
  setBrowserPermission 
} from '../features/notificationSlice';
import NotificationService from '../services/notificationService.js';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { isAuthenticated, user, isAdmin } = useSelector((state) => state.auth);
  const { items: cartItems } = useSelector((state) => state.cart || { items: [] });
  const { 
    notifications, 
    unreadCount, 
    loading: notificationsLoading,
    realTimeNotification 
  } = useSelector((state) => state.notifications);
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileMenuAnchor, setProfileMenuAnchor] = useState(null);
  const [notificationsAnchor, setNotificationsAnchor] = useState(null);
  const [notificationDialog, setNotificationDialog] = useState(false);

  // Load notifications and unread count on mount
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUnreadCount());
      
      // Request browser notification permission
      NotificationService.requestNotificationPermission().then(granted => {
        dispatch(setBrowserPermission(granted ? 'granted' : 'denied'));
      });
    }
  }, [isAuthenticated, dispatch]);

  // Handle real-time notifications
  useEffect(() => {
    if (realTimeNotification) {
      // Show browser notification
      NotificationService.showBrowserNotification(
        realTimeNotification.title,
        {
          body: realTimeNotification.message,
          actionUrl: realTimeNotification.actionUrl
        }
      );
      
      // Clear the real-time notification after showing
      setTimeout(() => {
        dispatch(clearRealTimeNotification());
      }, 100);
    }
  }, [realTimeNotification, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
    setProfileMenuAnchor(null);
    setMobileMenuOpen(false);
  };

  const handleProfileMenuOpen = (event) => {
    setProfileMenuAnchor(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setProfileMenuAnchor(null);
  };

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchor(event.currentTarget);
    // Load notifications when opening the menu
    if (isAuthenticated) {
      dispatch(fetchNotifications({ page: 1, limit: 10 }));
    }
  };

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null);
  };

  const handleNotificationClick = async (notification) => {
    // Mark as read if not already read
    if (!notification.isRead) {
      dispatch(markNotificationAsRead(notification._id));
    }
    
    // Navigate to action URL if provided
    if (notification.actionUrl) {
      navigate(notification.actionUrl);
    }
    
    handleNotificationsClose();
  };

  const handleMarkAllRead = () => {
    dispatch(markAllNotificationsAsRead());
  };

  const handleViewAllNotifications = () => {
    setNotificationDialog(true);
    handleNotificationsClose();
  };

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const isActivePage = (path) => {
    return location.pathname === path;
  };

  const NavButton = ({ to, children, icon, onClick, active = false, ...props }) => (
    <Button
      component={to ? Link : 'button'}
      to={to}
      onClick={onClick}
      startIcon={icon}
      className="button-modern hover-lift"
      sx={{
        color: 'white',
        fontWeight: 600,
        borderRadius: 3,
        px: 3,
        py: 1,
        textTransform: 'none',
        background: active 
          ? 'rgba(255, 255, 255, 0.2)' 
          : 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          background: 'rgba(255, 255, 255, 0.25)',
          transform: 'translateY(-2px)',
          boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
          borderColor: 'rgba(255, 255, 255, 0.4)'
        },
        '&:active': {
          transform: 'translateY(0)'
        }
      }}
      {...props}
    >
      {children}
    </Button>
  );

  const mobileMenuItems = [
    { text: 'Home', icon: <Home />, path: '/' },
    ...(isAuthenticated ? [
      { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
      { text: 'Products', icon: <Store />, path: '/products' },
      { text: 'Cart', icon: <ShoppingCart />, path: '/cart', badge: cartItems?.length },
      { text: 'Wishlist', icon: <Favorite />, path: '/wishlist' },
      { text: 'Chats', icon: <Chat />, path: '/chats' },
      { text: 'Negotiations', icon: <Gavel />, path: '/negotiations' },
      { text: 'List Item', icon: <Add />, path: '/product/new' },
      ...(isAdmin ? [{ text: 'Admin Panel', icon: <AdminPanelSettings />, path: '/admin/dashboard' }] : []),
    ] : [
      { text: 'Products', icon: <Store />, path: '/products' },
      { text: 'Login', icon: <Login />, path: '/login' },
      { text: 'Register', icon: <PersonAdd />, path: '/register' }
    ])
  ];

  return (
    <>
      <Slide in direction="down" timeout={800}>
        <AppBar 
          position="sticky" 
          className="glass-effect"
          sx={{
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
              animation: 'shimmer 3s infinite'
            }
          }}
        >
          <Container maxWidth="xl">
            <Toolbar disableGutters sx={{ py: 1 }}>
              {/* Logo */}
              <Zoom in timeout={1000}>
                <Typography
                  variant="h5"
                  component={Link}
                  to="/"
                  className="gradient-text hover-scale"
                  sx={{
                    flexGrow: 1,
                    textDecoration: 'none',
                    fontWeight: 800,
                    letterSpacing: '3px',
                    background: 'linear-gradient(45deg, #ffffff, #f0f8ff, #ffffff)',
                    backgroundSize: '200% 100%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    textShadow: '0 0 30px rgba(255, 255, 255, 0.5)',
                    animation: 'shimmer 2s infinite, float 4s ease-in-out infinite',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      transform: 'scale(1.05)',
                      textShadow: '0 0 40px rgba(255, 255, 255, 0.8)'
                    }
                  }}
                >
                  ECOMART
                </Typography>
              </Zoom>

              {/* Desktop Navigation */}
              <Box sx={{ 
                display: { xs: 'none', md: 'flex' }, 
                gap: 2, 
                alignItems: 'center' 
              }}>
                <Fade in timeout={1200}>
                  <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                    <NavButton 
                      to="/" 
                      icon={<Home />}
                      active={isActivePage('/')}
                    >
                      Home
                    </NavButton>

                    <NavButton 
                      to="/products" 
                      icon={<Store />}
                      active={isActivePage('/products')}
                    >
                      Products
                    </NavButton>

                    {isAuthenticated ? (
                      <>
                        <NavButton 
                          to="/dashboard" 
                          icon={<Dashboard />}
                          active={isActivePage('/dashboard')}
                        >
                          Dashboard
                        </NavButton>

                        <Tooltip title="Shopping Cart">
                          <IconButton
                            component={Link}
                            to="/cart"
                            className="hover-scale"
                            sx={{
                              color: 'white',
                              background: 'rgba(255, 255, 255, 0.1)',
                              backdropFilter: 'blur(10px)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              '&:hover': {
                                background: 'rgba(255, 255, 255, 0.25)',
                                transform: 'scale(1.1)',
                                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                              }
                            }}
                          >
                            <Badge 
                              badgeContent={cartItems?.length || 0} 
                              color="error"
                              className="notification-badge"
                            >
                              <ShoppingCart />
                            </Badge>
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Wishlist">
                          <IconButton
                            component={Link}
                            to="/wishlist"
                            className="hover-scale"
                            sx={{
                              color: 'white',
                              background: 'rgba(255, 255, 255, 0.1)',
                              backdropFilter: 'blur(10px)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              '&:hover': {
                                background: 'rgba(255, 255, 255, 0.25)',
                                transform: 'scale(1.1)',
                                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                              }
                            }}
                          >
                            <FavoriteBorder />
                          </IconButton>
                        </Tooltip>

                        <Tooltip title="Notifications">
                          <IconButton
                            onClick={handleNotificationsOpen}
                            className="hover-scale"
                            sx={{
                              color: 'white',
                              background: 'rgba(255, 255, 255, 0.1)',
                              backdropFilter: 'blur(10px)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              '&:hover': {
                                background: 'rgba(255, 255, 255, 0.25)',
                                transform: 'scale(1.1)',
                                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                              }
                            }}
                          >
                            <Badge badgeContent={unreadCount} color="error" className="notification-badge">
                              <Notifications />
                            </Badge>
                          </IconButton>
                        </Tooltip>

                        <NavButton 
                          to="/chats" 
                          icon={<Chat />}
                          active={isActivePage('/chats')}
                        >
                          Chats
                        </NavButton>

                        <NavButton 
                          to="/negotiations" 
                          icon={<Gavel />}
                          active={isActivePage('/negotiations')}
                        >
                          Negotiations
                        </NavButton>

                        {isAdmin && (
                          <NavButton 
                            to="/admin/dashboard" 
                            icon={<AdminPanelSettings />}
                            active={isActivePage('/admin/dashboard')}
                          >
                            Admin
                          </NavButton>
                        )}

                        <NavButton 
                          to="/product/new" 
                          icon={<Add />}
                          active={isActivePage('/product/new')}
                        >
                          List Item
                        </NavButton>

                        <Tooltip title="Profile Menu">
                          <IconButton
                            onClick={handleProfileMenuOpen}
                            className="hover-scale"
                            sx={{
                              color: 'white',
                              background: 'rgba(255, 255, 255, 0.1)',
                              backdropFilter: 'blur(10px)',
                              border: '1px solid rgba(255, 255, 255, 0.2)',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              '&:hover': {
                                background: 'rgba(255, 255, 255, 0.25)',
                                transform: 'scale(1.1)',
                                boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                              }
                            }}
                          >
                            <Avatar 
                              sx={{ 
                                width: 32, 
                                height: 32,
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                fontSize: '14px',
                                fontWeight: 600
                              }}
                            >
                              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </Avatar>
                          </IconButton>
                        </Tooltip>
                      </>
                    ) : (
                      <>
                        <NavButton 
                          to="/login" 
                          icon={<Login />}
                          active={isActivePage('/login')}
                        >
                          Login
                        </NavButton>
                        <NavButton 
                          to="/register" 
                          icon={<PersonAdd />}
                          active={isActivePage('/register')}
                        >
                          Register
                        </NavButton>
                      </>
                    )}
                  </Box>
                </Fade>
              </Box>

              {/* Mobile Menu Button */}
              <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                <IconButton
                  onClick={toggleMobileMenu}
                  className="hover-scale ripple-effect"
                  sx={{
                    color: 'white',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.25)',
                      transform: 'scale(1.1)',
                      boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)'
                    }
                  }}
                >
                  <MenuIcon />
                </IconButton>
              </Box>
            </Toolbar>
          </Container>
        </AppBar>
      </Slide>

      {/* Profile Menu */}
      <Menu
        anchorEl={profileMenuAnchor}
        open={Boolean(profileMenuAnchor)}
        onClose={handleProfileMenuClose}
        className="glass-effect"
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 3,
            mt: 1,
            minWidth: 200,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <MenuItem 
          component={Link} 
          to="/profile" 
          onClick={handleProfileMenuClose}
          className="hover-lift"
          sx={{ 
            borderRadius: 2, 
            mx: 1, 
            my: 0.5,
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(102, 126, 234, 0.1)'
            }
          }}
        >
          <AccountCircle sx={{ mr: 2, color: '#667eea' }} />
          Profile Settings
        </MenuItem>
        <MenuItem 
          component={Link} 
          to="/wishlist" 
          onClick={handleProfileMenuClose}
          className="hover-lift"
          sx={{ 
            borderRadius: 2, 
            mx: 1, 
            my: 0.5,
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(102, 126, 234, 0.1)'
            }
          }}
        >
          <Favorite sx={{ mr: 2, color: '#f56565' }} />
          Wishlist
        </MenuItem>
        <Divider sx={{ my: 1 }} />
        <MenuItem 
          onClick={handleLogout}
          className="hover-lift"
          sx={{ 
            borderRadius: 2, 
            mx: 1, 
            my: 0.5,
            color: '#f56565',
            transition: 'all 0.3s ease',
            '&:hover': {
              background: 'rgba(245, 101, 101, 0.1)'
            }
          }}
        >
          <LogoutIcon sx={{ mr: 2 }} />
          Logout
        </MenuItem>
      </Menu>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchor}
        open={Boolean(notificationsAnchor)}
        onClose={handleNotificationsClose}
        className="glass-effect"
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: 3,
            mt: 1,
            minWidth: 350,
            maxHeight: 400,
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)'
          }
        }}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ p: 2, borderBottom: '1px solid rgba(0,0,0,0.1)' }}>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" className="gradient-text">
              Notifications
            </Typography>
            {unreadCount > 0 && (
              <Button 
                size="small" 
                onClick={handleMarkAllRead}
                startIcon={<MarkEmailRead />}
                sx={{ fontSize: '0.75em' }}
              >
                Mark all read
              </Button>
            )}
          </Box>
        </Box>
        
        {notificationsLoading ? (
          <Box display="flex" justifyContent="center" p={3}>
            <CircularProgress size={24} />
          </Box>
        ) : notifications.length === 0 ? (
          <Box p={3} textAlign="center">
            <Typography variant="body2" color="text.secondary">
              No notifications yet
            </Typography>
          </Box>
        ) : [
            ...notifications.slice(0, 5).map((notification) => {
              const formattedNotification = NotificationService.formatNotification(notification);
              return (
                <MenuItem 
                  key={notification._id}
                  className="hover-lift"
                  onClick={() => handleNotificationClick(notification)}
                  sx={{
                    backgroundColor: notification.isRead ? 'transparent' : 'rgba(25, 118, 210, 0.1)',
                    borderLeft: !notification.isRead ? '4px solid #1976d2' : 'none',
                    '&:hover': {
                      backgroundColor: 'rgba(25, 118, 210, 0.15)'
                    }
                  }}
                >
                  <Box display="flex" alignItems="flex-start" width="100%">
                    <Box sx={{ mr: 1, fontSize: '1.2em' }}>
                      {formattedNotification.icon}
                    </Box>
                    <Box flex={1}>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          fontWeight: notification.isRead ? 400 : 600,
                          mb: 0.5
                        }}
                      >
                        {notification.title}
                      </Typography>
                      <Typography 
                        variant="body2" 
                        color="text.secondary"
                        sx={{ mb: 0.5, fontSize: '0.85em' }}
                      >
                        {notification.message}
                      </Typography>
                      <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption" color="text.secondary">
                          {formattedNotification.timeAgo}
                        </Typography>
                        {notification.priority === 'HIGH' || notification.priority === 'URGENT' ? (
                          <Chip 
                            label={notification.priority.toLowerCase()} 
                            size="small"
                            color={notification.priority === 'URGENT' ? 'error' : 'warning'}
                            sx={{ height: 16, fontSize: '0.7em' }}
                          />
                        ) : null}
                      </Box>
                    </Box>
                  </Box>
                </MenuItem>
              );
            }),
            
            ...(notifications.length > 5 ? [
              <MenuItem key="view-all" onClick={handleViewAllNotifications}>
                <Box textAlign="center" width="100%">
                  <Typography variant="body2" color="primary">
                    View all notifications ({notifications.length})
                  </Typography>
                </Box>
              </MenuItem>
            ] : [])
          ]}
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={toggleMobileMenu}
        PaperProps={{
          sx: {
            width: 280,
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.95) 0%, rgba(118, 75, 162, 0.95) 100%)',
            backdropFilter: 'blur(20px)',
            color: 'white'
          }
        }}
      >
        <Box sx={{ pt: 2, pb: 1, px: 2 }}>
          <Typography variant="h6" className="text-shimmer" sx={{ fontWeight: 700, mb: 1 }}>
            ECOMART
          </Typography>
          <Typography variant="body2" sx={{ opacity: 0.8 }}>
            {isAuthenticated ? `Welcome back!` : 'Welcome to EcoMart'}
          </Typography>
        </Box>
        <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)' }} />
        <List>
          {mobileMenuItems.map((item) => (
            <ListItem
              key={item.text}
              component={Link}
              to={item.path}
              onClick={toggleMobileMenu}
              className="hover-lift"
              sx={{
                borderRadius: 2,
                mx: 1,
                my: 0.5,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.1)',
                  transform: 'translateX(8px)'
                }
              }}
            >
              <ListItemIcon sx={{ color: 'white', minWidth: 40 }}>
                {item.badge ? (
                  <Badge badgeContent={item.badge} color="error">
                    {item.icon}
                  </Badge>
                ) : (
                  item.icon
                )}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                sx={{ '& .MuiTypography-root': { fontWeight: 500 } }}
              />
            </ListItem>
          ))}
          {isAuthenticated && [
            <Divider key="divider" sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', my: 1 }} />,
            <ListItem
              key="logout"
              onClick={handleLogout}
              className="hover-lift"
              sx={{
                borderRadius: 2,
                mx: 1,
                my: 0.5,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: 'rgba(245, 101, 101, 0.2)',
                  transform: 'translateX(8px)'
                }
              }}
            >
              <ListItemIcon sx={{ color: '#ff6b6b', minWidth: 40 }}>
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText 
                primary="Logout" 
                sx={{ '& .MuiTypography-root': { fontWeight: 500, color: '#ff6b6b' } }}
              />
            </ListItem>
          ]}
        </List>
      </Drawer>

      {/* All Notifications Dialog */}
      <Dialog
        open={notificationDialog}
        onClose={() => setNotificationDialog(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
          }
        }}
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" className="gradient-text">
              All Notifications
            </Typography>
            <IconButton 
              onClick={() => setNotificationDialog(false)}
              size="small"
            >
              <Clear />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {notifications.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              You have no notifications yet.
            </Alert>
          ) : (
            <List>
              {notifications.map((notification) => {
                const formattedNotification = NotificationService.formatNotification(notification);
                return (
                  <ListItem
                    key={notification._id}
                    button
                    onClick={() => handleNotificationClick(notification)}
                    sx={{
                      backgroundColor: notification.isRead ? 'transparent' : 'rgba(25, 118, 210, 0.1)',
                      borderLeft: !notification.isRead ? '4px solid #1976d2' : 'none',
                      mb: 1,
                      borderRadius: 1,
                      '&:hover': {
                        backgroundColor: 'rgba(25, 118, 210, 0.15)'
                      }
                    }}
                  >
                    <ListItemIcon>
                      <Box sx={{ fontSize: '1.5em' }}>
                        {formattedNotification.icon}
                      </Box>
                    </ListItemIcon>
                    <ListItemText
                      primary={
                        <Typography
                          variant="subtitle1"
                          sx={{ fontWeight: notification.isRead ? 400 : 600 }}
                        >
                          {notification.title}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            {notification.message}
                          </Typography>
                          <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Typography variant="caption" color="text.secondary">
                              {formattedNotification.timeAgo}
                            </Typography>
                            {notification.priority === 'HIGH' || notification.priority === 'URGENT' ? (
                              <Chip 
                                label={notification.priority.toLowerCase()} 
                                size="small"
                                color={notification.priority === 'URGENT' ? 'error' : 'warning'}
                              />
                            ) : null}
                          </Box>
                        </Box>
                      }
                    />
                  </ListItem>
                );
              })}
            </List>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNotificationDialog(false)}>
            Close
          </Button>
          {unreadCount > 0 && (
            <Button
              variant="contained"
              onClick={() => {
                handleMarkAllRead();
                setNotificationDialog(false);
              }}
              startIcon={<MarkEmailRead />}
            >
              Mark All Read
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Navbar;
