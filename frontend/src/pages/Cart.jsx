import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  IconButton,
  Divider,
  TextField,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { removeFromCart, updateQuantity } from '../features/cartSlice';

const Cart = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);

  const handleQuantityChange = (productId, newQuantity) => {
    dispatch(updateQuantity({ productId, quantity: newQuantity }));
  };

  const handleRemoveItem = (productId) => {
    dispatch(removeFromCart(productId));
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  if (items.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
  <Paper sx={{ p: 3, textAlign: 'center', background: 'linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)', boxShadow: '0 4px 24px 0 rgba(31,38,135,0.12)', borderRadius: 3, animation: 'fadeIn 0.8s' }}>
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/')}
            sx={{ mt: 2 }}
          >
            Continue Shopping
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3, background: 'linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)', boxShadow: '0 4px 24px 0 rgba(31,38,135,0.12)', borderRadius: 3, animation: 'fadeIn 0.8s' }}>
            <Typography variant="h5" gutterBottom>
              Shopping Cart ({items.length} items)
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {items.map((item) => (
              <Box
                key={item.productId}
                sx={{
                  display: 'flex',
                  mb: 2,
                  pb: 2,
                  borderBottom: '1px solid #eee',
                }}
              >
                {/* Product Image */}
                <Box
                  sx={{
                    width: 100,
                    height: 100,
                    mr: 2,
                    backgroundImage: `url(${item.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />

                {/* Product Details */}
                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6">{item.title}</Typography>
                  <Typography color="primary" sx={{ mb: 1 }}>
                    ${item.price}
                  </Typography>

                  {/* Quantity Controls */}
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleQuantityChange(item.productId, item.quantity - 1)
                      }
                      disabled={item.quantity <= 1}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <TextField
                      size="small"
                      value={item.quantity}
                      InputProps={{
                        readOnly: true,
                        sx: { width: '60px', textAlign: 'center' },
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() =>
                        handleQuantityChange(item.productId, item.quantity + 1)
                      }
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                </Box>

                {/* Price and Remove */}
                <Box sx={{ textAlign: 'right' }}>
                  <Typography variant="h6">
                    ${(item.price * item.quantity).toFixed(2)}
                  </Typography>
                  <IconButton
                    color="error"
                    onClick={() => handleRemoveItem(item.productId)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Paper>
        </Grid>

        {/* Order Summary */}
        <Grid item xs={12} md={4}>
    <Paper sx={{ p: 3, background: 'linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)', boxShadow: '0 4px 24px 0 rgba(31,38,135,0.12)', borderRadius: 3, animation: 'fadeIn 0.8s' }}>
            <Typography variant="h5" gutterBottom>
              Order Summary
            </Typography>
            <Divider sx={{ mb: 2 }} />

            <Box sx={{ mb: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 1,
                }}
              >
                <Typography>Subtotal:</Typography>
                <Typography>${calculateSubtotal().toFixed(2)}</Typography>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 1,
                }}
              >
                <Typography>Shipping:</Typography>
                <Typography>$0.00</Typography>
              </Box>
              <Divider sx={{ my: 1 }} />
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  mb: 2,
                }}
              >
                <Typography variant="h6">Total:</Typography>
                <Typography variant="h6">
                  ${calculateSubtotal().toFixed(2)}
                </Typography>
              </Box>
            </Box>

            <Button
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              onClick={() => navigate('/checkout')}
            >
              Proceed to Checkout
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;
