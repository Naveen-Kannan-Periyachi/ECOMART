import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
} from '@mui/material';
import { logout } from '../features/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={{
      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
      boxShadow: '0 4px 24px 0 rgba(102,126,234,0.18)',
      animation: 'fadeIn 1s',
    }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              color: 'white',
              textDecoration: 'none',
              fontWeight: 700,
              letterSpacing: '2px',
              textShadow: '0 2px 8px #764ba2',
              transition: 'color 0.3s',
              '&:hover': {
                color: '#ffd700',
                textShadow: '0 2px 12px #667eea',
              },
            }}
          >
            ECOMART
          </Typography>

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button sx={{
              background: 'linear-gradient(90deg, #e0c3fc 0%, #8ec5fc 100%)',
              color: '#222',
              fontWeight: 600,
              borderRadius: 2,
              boxShadow: '0 2px 8px rgba(31,38,135,0.10)',
              transition: 'background 0.3s, transform 0.2s',
              '&:hover': {
                background: 'linear-gradient(90deg, #8ec5fc 0%, #e0c3fc 100%)',
                transform: 'scale(1.05)',
              },
            }} component={Link} to="/">
              Home
            </Button>

            {isAuthenticated ? (
              <>
                <Button sx={{
                  background: 'linear-gradient(90deg, #f7971e 0%, #ffd200 100%)',
                  color: '#222',
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(31,38,135,0.10)',
                  transition: 'background 0.3s, transform 0.2s',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #ffd200 0%, #f7971e 100%)',
                    transform: 'scale(1.05)',
                  },
                }} component={Link} to="/dashboard">
                  Dashboard
                </Button>
                <Button sx={{
                  background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
                  color: '#222',
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(31,38,135,0.10)',
                  transition: 'background 0.3s, transform 0.2s',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #38f9d7 0%, #43e97b 100%)',
                    transform: 'scale(1.05)',
                  },
                }} component={Link} to="/product/new">
                  List Item
                </Button>
                <Button sx={{
                  background: 'linear-gradient(90deg, #ff5858 0%, #f09819 100%)',
                  color: '#fff',
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(31,38,135,0.10)',
                  transition: 'background 0.3s, transform 0.2s',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #f09819 0%, #ff5858 100%)',
                    transform: 'scale(1.05)',
                  },
                }} onClick={handleLogout}>
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button sx={{
                  background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                  color: '#fff',
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(31,38,135,0.10)',
                  transition: 'background 0.3s, transform 0.2s',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #764ba2 0%, #667eea 100%)',
                    transform: 'scale(1.05)',
                  },
                }} component={Link} to="/login">
                  Login
                </Button>
                <Button sx={{
                  background: 'linear-gradient(90deg, #43e97b 0%, #38f9d7 100%)',
                  color: '#222',
                  fontWeight: 600,
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(31,38,135,0.10)',
                  transition: 'background 0.3s, transform 0.2s',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #38f9d7 0%, #43e97b 100%)',
                    transform: 'scale(1.05)',
                  },
                }} component={Link} to="/register">
                  Register
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar;
