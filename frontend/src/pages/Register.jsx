import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
} from '@mui/material';
import { register } from '../features/authSlice';

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(register(formData));
    if (register.fulfilled.match(resultAction)) {
      navigate('/dashboard');
    }
  };

  return (
    <Container maxWidth="sm">
  <Paper elevation={3} sx={{ p: 4, mt: 4, background: 'linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)', boxShadow: '0 4px 24px 0 rgba(31,38,135,0.12)', borderRadius: 3, animation: 'fadeIn 0.8s' }}>
        <Typography variant="h4" gutterBottom>
          Register
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Street"
            name="address.street"
            value={formData.address.street}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="City"
            name="address.city"
            value={formData.address.city}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="State"
            name="address.state"
            value={formData.address.state}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="ZIP Code"
            name="address.zipCode"
            value={formData.address.zipCode}
            onChange={handleChange}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Country"
            name="address.country"
            value={formData.address.country}
            onChange={handleChange}
            margin="normal"
            required
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
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
            }}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
