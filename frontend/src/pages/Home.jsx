import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  return (
    <Box sx={{
      mt: 8,
      textAlign: 'center',
      background: 'linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)',
      borderRadius: 4,
      boxShadow: '0 8px 32px 0 rgba(31,38,135,0.10)',
      p: 6,
      animation: 'fadeIn 1s',
    }}>
      <Typography variant="h3" gutterBottom sx={{
        fontWeight: 700,
        color: '#764ba2',
        textShadow: '0 2px 8px #8ec5fc',
        letterSpacing: '2px',
      }}>
        Welcome to Ecomart
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom sx={{
        fontWeight: 500,
        color: '#222',
        mb: 4,
      }}>
        Buy, Sell, or Rent products — like Amazon, OLX, and a rental marketplace in one!
      </Typography>
      <Button variant="contained" sx={{
        mt: 4,
        background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
        color: '#fff',
        fontWeight: 600,
        borderRadius: 2,
        boxShadow: '0 2px 8px rgba(102,126,234,0.15)',
        transition: 'background 0.3s, transform 0.2s',
        '&:hover': {
          background: 'linear-gradient(90deg, #764ba2 0%, #667eea 100%)',
          transform: 'scale(1.05)',
        },
      }} onClick={() => navigate('/products')}>
        Browse Products
      </Button>
    </Box>
  );
};

export default Home;
