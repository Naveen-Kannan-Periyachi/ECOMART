import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Box,
  Chip,
  Alert,
  Divider,
  Grid,
  IconButton,
  Slider,
  InputAdornment
} from '@mui/material';
import {
  Close,
  AttachMoney,
  TrendingDown,
  Info
} from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { startNegotiation } from '../features/negotiationSlice';
import NegotiationService from '../services/negotiationService';

const NegotiationDialog = ({ 
  open, 
  onClose, 
  product, 
  onNegotiationStarted 
}) => {
  const dispatch = useDispatch();
  const [proposedPrice, setProposedPrice] = useState(0);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Initialize price when product changes or dialog opens
  React.useEffect(() => {
    if (product?.price && open) {
      const initialPrice = Math.round(product.price * 0.85);
      setProposedPrice(initialPrice);
    }
  }, [product?.price, open]);

  const handleSliderChange = (event, newValue) => {
    const price = Number(newValue);
    setProposedPrice(price);
    setError(''); // Clear any validation errors
  };

  const handleInputChange = (event) => {
    const value = Number(event.target.value);
    if (!isNaN(value) && value >= 0) {
      const maxPrice = product?.price || 0;
      const clampedValue = Math.min(Math.max(value, 0), maxPrice - 1);
      setProposedPrice(clampedValue);
      setError(''); // Clear any validation errors
    }
  };

  const isValidOffer = () => {
    if (!product?.price || proposedPrice <= 0) return false;
    if (proposedPrice >= product.price) return false;
    // Allow offers that are reasonable (at least 10% less than original)
    return proposedPrice <= product.price * 0.95;
  };

  const handleSubmit = async () => {
    if (!product || !isValidOffer()) {
      setError('Please enter a valid offer amount');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await dispatch(startNegotiation({
        productId: product._id,
        proposedPrice: Number(proposedPrice),
        message: message.trim()
      })).unwrap();

      if (onNegotiationStarted) {
        onNegotiationStarted();
      }
      
      handleClose();
    } catch (err) {
      console.error('Negotiation error:', err);
      setError(typeof err === 'string' ? err : 'Failed to start negotiation. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setProposedPrice(product?.price ? Math.round(product.price * 0.85) : 0);
    setMessage('');
    setError('');
    onClose();
  };

  const suggestedPrices = product ? NegotiationService.getSuggestedPrices(product.price) : [];
  const savings = product ? NegotiationService.calculateSavings(product.price, proposedPrice) : { savings: 0, percentage: 0 };

  if (!product) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          borderRadius: 3
        }
      }}
    >
      <DialogTitle sx={{ 
        background: 'rgba(255, 255, 255, 0.1)', 
        color: 'white',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box display="flex" alignItems="center" gap={1}>
          <TrendingDown />
          <Typography variant="h6">Negotiate Price</Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ background: 'rgba(255, 255, 255, 0.95)', color: '#333' }}>
        <Box sx={{ py: 2 }}>
          {/* Product Info */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {product.title}
            </Typography>
            <Typography variant="h5" color="primary" gutterBottom>
              Original Price: ${product.price}
            </Typography>
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Price Negotiation */}
          <Typography variant="h6" gutterBottom>
            Your Offer
          </Typography>
          
          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12}>
              <TextField
                label="Proposed Price"
                type="number"
                value={proposedPrice}
                onChange={handleInputChange}
                fullWidth
                InputProps={{
                  startAdornment: <InputAdornment position="start">$</InputAdornment>,
                }}
                sx={{ mb: 2 }}
              />
              
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Use slider to adjust:
              </Typography>
              
              <Slider
                value={proposedPrice || 0}
                onChange={handleSliderChange}
                min={product ? Math.round(product.price * 0.1) : 1}
                max={product ? Math.round(product.price * 0.95) : 100}
                step={1}
                marks={product ? [
                  { value: Math.round(product.price * 0.1), label: '10%' },
                  { value: Math.round(product.price * 0.5), label: '50%' },
                  { value: Math.round(product.price * 0.85), label: '85%' },
                ] : []}
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `$${value}`}
                sx={{
                  '& .MuiSlider-thumb': {
                    backgroundColor: '#FE6B8B',
                  },
                  '& .MuiSlider-track': {
                    backgroundColor: '#FE6B8B',
                  },
                  '& .MuiSlider-rail': {
                    backgroundColor: '#ddd',
                  }
                }}
              />
            </Grid>
          </Grid>

          {/* Suggested Prices */}
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Quick suggestions:
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              {suggestedPrices.map((suggestion, index) => (
                <Chip
                  key={index}
                  label={`${suggestion.label} - $${suggestion.price}`}
                  variant="outlined"
                  clickable
                  onClick={() => setProposedPrice(suggestion.price)}
                  size="small"
                />
              ))}
            </Box>
          </Box>

          {/* Savings Display */}
          {savings.savings > 0 && (
            <Alert severity="success" sx={{ mb: 2 }}>
              <Box display="flex" alignItems="center" gap={1}>
                <AttachMoney />
                <Typography>
                  You'll save ${savings.savings} ({savings.percentage}% off)
                </Typography>
              </Box>
            </Alert>
          )}

          {/* Message */}
          <TextField
            label="Message to Seller (Optional)"
            multiline
            rows={3}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            fullWidth
            placeholder="Explain why you think this price is fair..."
            sx={{ mb: 2 }}
          />

          {/* Negotiation Tips */}
          <Alert severity="info" icon={<Info />}>
            <Typography variant="body2">
              <strong>Tips:</strong> Be respectful and provide a reason for your offer. 
              Negotiations typically work best when your offer is 10-25% below the asking price.
            </Typography>
          </Alert>

          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ 
        background: 'rgba(255, 255, 255, 0.1)',
        gap: 1,
        p: 2
      }}>
        <Button 
          onClick={onClose} 
          sx={{ color: 'white' }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={!isValidOffer() || loading}
          sx={{
            background: isValidOffer() && !loading
              ? 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)'
              : 'rgba(0,0,0,0.12)',
            color: isValidOffer() && !loading ? 'white' : 'rgba(0,0,0,0.26)',
            '&:hover': {
              background: isValidOffer() && !loading
                ? 'linear-gradient(45deg, #FE6B8B 60%, #FF8E53 100%)'
                : 'rgba(0,0,0,0.12)',
            },
            '&:disabled': {
              background: 'rgba(0,0,0,0.12)',
              color: 'rgba(0,0,0,0.26)'
            }
          }}
        >
          {loading ? 'Starting Negotiation...' : `Offer $${proposedPrice || 0}`}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default NegotiationDialog;
