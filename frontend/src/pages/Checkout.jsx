import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  TextField,
  Stepper,
  Step,
  StepLabel,
  Divider,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { createOrder } from '../features/orderSlice';
import { clearCart } from '../features/cartSlice';

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

const steps = ['Shipping Address', 'Payment Method', 'Review Order'];

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const { items } = useSelector((state) => state.cart);
  const { loading, error } = useSelector((state) => state.orders);

  const [activeStep, setActiveStep] = useState(0);
  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
  });
  const [paymentError, setPaymentError] = useState(null);

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
  };

  const handleNext = () => {
    if (activeStep === 0 && !validateShippingForm()) {
      return;
    }
    setActiveStep((prevStep) => prevStep + 1);
  };

  const validateShippingForm = () => {
    return Object.values(shippingAddress).every((field) => field.trim() !== '');
  };

  const handleShippingChange = (e) => {
    setShippingAddress({
      ...shippingAddress,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setPaymentError(null);

    // Create order first to get total
    const orderResponse = await dispatch(
      createOrder({
        items: items.map((item) => ({
          productId: item.productId,
          quantity: item.quantity,
        })),
        shippingAddress,
      })
    );

    if (orderResponse.error) {
      setPaymentError(orderResponse.error.message);
      return;
    }

    const { clientSecret } = orderResponse.payload;

    // Confirm payment with Stripe
    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      }
    );

    if (stripeError) {
      setPaymentError(stripeError.message);
      return;
    }

    if (paymentIntent.status === 'succeeded') {
      // Clear cart and navigate to success page
      dispatch(clearCart());
      navigate('/order-success');
    }
  };

  const renderShippingForm = () => (
    <Box component="form" noValidate sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        name="street"
        label="Street Address"
        value={shippingAddress.street}
        onChange={handleShippingChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="city"
        label="City"
        value={shippingAddress.city}
        onChange={handleShippingChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="state"
        label="State/Province"
        value={shippingAddress.state}
        onChange={handleShippingChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="zipCode"
        label="ZIP/Postal Code"
        value={shippingAddress.zipCode}
        onChange={handleShippingChange}
      />
      <TextField
        margin="normal"
        required
        fullWidth
        name="country"
        label="Country"
        value={shippingAddress.country}
        onChange={handleShippingChange}
      />
    </Box>
  );

  const renderPaymentForm = () => (
    <Box sx={{ mt: 3 }}>
      <CardElement options={CARD_ELEMENT_OPTIONS} />
    </Box>
  );

  const renderReview = () => (
    <Box>
      <Typography variant="h6" gutterBottom>
        Order Summary
      </Typography>
      {items.map((item) => (
        <Box
          key={item.productId}
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mb: 1,
          }}
        >
          <Typography>
            {item.title} x {item.quantity}
          </Typography>
          <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>
        </Box>
      ))}
      <Divider sx={{ my: 2 }} />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mb: 2,
        }}
      >
        <Typography variant="h6">Total:</Typography>
        <Typography variant="h6">${calculateTotal().toFixed(2)}</Typography>
      </Box>

      <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
        Shipping Address
      </Typography>
      <Typography>
        {shippingAddress.street}
        <br />
        {shippingAddress.city}, {shippingAddress.state} {shippingAddress.zipCode}
        <br />
        {shippingAddress.country}
      </Typography>
    </Box>
  );

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return renderShippingForm();
      case 1:
        return renderPaymentForm();
      case 2:
        return renderReview();
      default:
        return 'Unknown step';
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
  <Paper sx={{ p: 3, background: 'linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)', boxShadow: '0 4px 24px 0 rgba(31,38,135,0.12)', borderRadius: 3, animation: 'fadeIn 0.8s' }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Checkout
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {paymentError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {paymentError}
          </Alert>
        )}

        {getStepContent(activeStep)}

        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          {activeStep !== 0 && (
            <Button onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
          )}
          {activeStep === steps.length - 1 ? (
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} sx={{ mr: 1 }} />
              ) : (
                'Place Order'
              )}
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={handleNext}
              disabled={activeStep === 0 && !validateShippingForm()}
            >
              Next
            </Button>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default Checkout;
