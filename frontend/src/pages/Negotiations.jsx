import React, { useEffect, useState, memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Avatar,
  Divider,
  Alert,
  CircularProgress,
  Tab,
  Tabs,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Stack
} from '@mui/material';
import {
  TrendingDown,
  CheckCircle,
  Cancel,
  Loop,
  AttachMoney,
  Schedule,
  Person
} from '@mui/icons-material';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNegotiations,
  acceptNegotiation,
  rejectNegotiation,
  makeCounterOffer,
  setFilters
} from '../features/negotiationSlice';
import NegotiationService from '../services/negotiationService';
import { getProductImageUrl } from '../utils/imageUtils';

const Negotiations = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { negotiationId } = useParams();
  const { negotiations, loading, error, filters } = useSelector(state => state.negotiations);
  const { user } = useSelector(state => state.auth);
  
  const [tabValue, setTabValue] = useState(0);
  const [responseDialog, setResponseDialog] = useState({ open: false, negotiation: null, action: null });
  const [counterOffer, setCounterOffer] = useState('');
  const [responseMessage, setResponseMessage] = useState('');

  useEffect(() => {
    if (user && user._id) {
      dispatch(fetchNegotiations(filters));
    }
  }, [dispatch, user, filters]);

  // Handle specific negotiation ID from URL
  useEffect(() => {
    if (negotiationId && negotiations.length > 0 && user?._id) {
      const specificNegotiation = negotiations.find(n => n._id === negotiationId);
      if (specificNegotiation) {
        // Set the appropriate tab based on user role
        const isBuyer = specificNegotiation.buyerId && specificNegotiation.buyerId._id === user._id;
        setTabValue(isBuyer ? 0 : 1);
        
        // Scroll to the specific negotiation after a short delay
        setTimeout(() => {
          const element = document.getElementById(`negotiation-${negotiationId}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Add a highlight effect
            element.style.boxShadow = '0 0 20px rgba(25, 118, 210, 0.5)';
            setTimeout(() => {
              element.style.boxShadow = '';
            }, 3000);
          }
        }, 100);
      }
    }
  }, [negotiationId, negotiations, user]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    const roleMap = ['all', 'buyer', 'seller'];
    dispatch(setFilters({ role: roleMap[newValue] }));
  };

  const handleRespond = (negotiation, action) => {
    setResponseDialog({ open: true, negotiation, action });
    setCounterOffer('');
    setResponseMessage('');
  };

  const handleSubmitResponse = async () => {
    const { negotiation, action } = responseDialog;
    
    try {
      console.log('Submitting response:', { action, negotiationId: negotiation._id, message: responseMessage });
      
      if (action === 'accept') {
        const result = await dispatch(acceptNegotiation({ 
          negotiationId: negotiation._id, 
          message: responseMessage 
        })).unwrap();
        console.log('Accept result:', result);
      } else if (action === 'reject') {
        const result = await dispatch(rejectNegotiation({ 
          negotiationId: negotiation._id, 
          message: responseMessage 
        })).unwrap();
        console.log('Reject result:', result);
      } else if (action === 'counter') {
        const result = await dispatch(makeCounterOffer({ 
          negotiationId: negotiation._id, 
          counterOffer: parseFloat(counterOffer), 
          message: responseMessage 
        })).unwrap();
        console.log('Counter result:', result);
      }
      
      // Refresh negotiations after successful action
      dispatch(fetchNegotiations(filters));
      setResponseDialog({ open: false, negotiation: null, action: null });
    } catch (error) {
      console.error('Error responding to negotiation:', error);
      // You might want to show an error message to the user here
    }
  };

  const renderNegotiationCard = (negotiation) => {
    // Check if negotiation has required properties
    if (!negotiation || !negotiation._id) {
      return null;
    }

    // Get latest offer from counterOffers array or use initial proposed price
    const latestOffer = negotiation.counterOffers && negotiation.counterOffers.length > 0 
      ? negotiation.counterOffers[negotiation.counterOffers.length - 1]
      : {
          amount: negotiation.proposedPrice || 0,
          offeredBy: negotiation.buyerId || null,
          createdAt: negotiation.createdAt || new Date()
        };
    
    const isUserBuyer = user?._id === negotiation.buyerId?._id;
    const statusInfo = NegotiationService.formatNegotiationStatus(negotiation.status || 'PENDING');
    const timeRemaining = NegotiationService.getTimeRemaining(negotiation.expiresAt || new Date());
    const savings = NegotiationService.calculateSavings(negotiation.originalPrice || 0, latestOffer.amount || 0);

    return (
      <Card 
        key={negotiation._id} 
        id={`negotiation-${negotiation._id}`}
        sx={{ mb: 2, overflow: 'visible' }}
      >
        <CardContent>
          <Grid container spacing={3}>
            {/* Product Info */}
            <Grid item xs={12} md={4}>
              <Box display="flex" alignItems="center" gap={2}>
                {negotiation.productId?.images?.[0] && (
                  <Avatar
                    src={getProductImageUrl(negotiation.productId.images, 0)}
                    variant="rounded"
                    sx={{ width: 60, height: 60 }}
                  />
                )}
                <Box>
                  <Typography variant="h6" sx={{ fontSize: '1rem' }}>
                    {negotiation.productId?.title || 'Product Title'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Original: ${negotiation.originalPrice || 0}
                  </Typography>
                  <Chip 
                    label={`${statusInfo.label} ${statusInfo.icon}`}
                    color={statusInfo.color}
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              </Box>
            </Grid>

            {/* Negotiation Details */}
            <Grid item xs={12} md={4}>
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Current Offer: ${latestOffer.amount}
                </Typography>
                {savings.savings > 0 && (
                  <Typography variant="body2" color="success.main">
                    💰 Save ${savings.savings} ({savings.percentage}% off)
                  </Typography>
                )}
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  Round {negotiation.negotiationRound}/{negotiation.maxRounds}
                </Typography>
                {!timeRemaining.expired && (
                  <Typography variant="body2" color="warning.main">
                    ⏰ {timeRemaining.text}
                  </Typography>
                )}
              </Box>
            </Grid>

            {/* Actions */}
            <Grid item xs={12} md={4}>
              <Box display="flex" flexDirection="column" gap={1}>
                {negotiation.status === 'PENDING' || negotiation.status === 'COUNTER_OFFERED' ? (
                  <>
                    {/* Seller can accept/reject/counter */}
                    {!isUserBuyer && latestOffer.offeredBy && latestOffer.offeredBy?._id !== user._id && (
                      <Stack direction="row" spacing={1}>
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          startIcon={<CheckCircle />}
                          onClick={() => handleRespond(negotiation, 'accept')}
                        >
                          Accept
                        </Button>
                        <Button
                          size="small"
                          variant="outlined"
                          color="error"
                          startIcon={<Cancel />}
                          onClick={() => handleRespond(negotiation, 'reject')}
                        >
                          Reject
                        </Button>
                        {negotiation.negotiationRound < negotiation.maxRounds && (
                          <Button
                            size="small"
                            variant="outlined"
                            startIcon={<Loop />}
                            onClick={() => handleRespond(negotiation, 'counter')}
                          >
                            Counter
                          </Button>
                        )}
                      </Stack>
                    )}
                    
                    {/* Buyer can counter if seller made last offer */}
                    {isUserBuyer && latestOffer.offeredBy && latestOffer.offeredBy?._id !== user._id && negotiation.negotiationRound < negotiation.maxRounds && (
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Loop />}
                        onClick={() => handleRespond(negotiation, 'counter')}
                      >
                        Counter Offer
                      </Button>
                    )}
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Negotiation {negotiation.status.toLowerCase()}
                  </Typography>
                )}
                
                <Typography variant="caption" color="text.secondary">
                  With: {isUserBuyer ? negotiation.sellerId?.name : negotiation.buyerId?.name}
                </Typography>
              </Box>
            </Grid>
          </Grid>

          {/* Counter Offers History */}
          {negotiation.counterOffers?.length > 0 && (
            <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid #eee' }}>
              <Typography variant="subtitle2" gutterBottom>
                Negotiation History:
              </Typography>
              <Box display="flex" gap={1} flexWrap="wrap">
                <Chip 
                  label={`Initial: $${negotiation.proposedPrice}`}
                  size="small"
                  variant="outlined"
                />
                {negotiation.counterOffers?.map((offer, index) => (
                  <Chip
                    key={index}
                    label={`${offer.offeredBy?.name || 'Unknown'}: $${offer.amount}`}
                    size="small"
                    color={offer.offeredBy?._id === user._id ? 'primary' : 'default'}
                  />
                ))}
              </Box>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  if (!user || !user._id) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <Alert severity="warning">
          Please log in to view your negotiations.
        </Alert>
      </Container>
    );
  }

  if (loading && negotiations.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          <TrendingDown sx={{ mr: 1, verticalAlign: 'bottom' }} />
          My Negotiations
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Manage your price negotiations for products
        </Typography>
      </Box>

      {/* Filter Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="All Negotiations" />
          <Tab label="As Buyer" />
          <Tab label="As Seller" />
        </Tabs>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {negotiations.length === 0 ? (
        <Alert severity="info">
          No negotiations found. Visit product pages to start negotiating prices!
        </Alert>
      ) : (
        <Box>
          {negotiations.map(renderNegotiationCard)}
        </Box>
      )}

      {/* Response Dialog */}
      <Dialog 
        open={responseDialog.open} 
        onClose={() => setResponseDialog({ open: false, negotiation: null, action: null })}
        maxWidth="sm" 
        fullWidth
      >
        <DialogTitle>
          {responseDialog.action === 'accept' && 'Accept Negotiation'}
          {responseDialog.action === 'reject' && 'Reject Negotiation'}
          {responseDialog.action === 'counter' && 'Make Counter Offer'}
        </DialogTitle>
        <DialogContent>
          {responseDialog.action === 'counter' && (
            <TextField
              label="Counter Offer Amount"
              type="number"
              value={counterOffer}
              onChange={(e) => setCounterOffer(e.target.value)}
              fullWidth
              sx={{ mb: 2 }}
              InputProps={{
                startAdornment: '$'
              }}
            />
          )}
          <TextField
            label="Message (Optional)"
            multiline
            rows={3}
            value={responseMessage}
            onChange={(e) => setResponseMessage(e.target.value)}
            fullWidth
            placeholder="Add a message to explain your decision..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setResponseDialog({ open: false, negotiation: null, action: null })}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmitResponse}
            variant="contained"
            disabled={responseDialog.action === 'counter' && !counterOffer}
          >
            {responseDialog.action === 'accept' && 'Accept Offer'}
            {responseDialog.action === 'reject' && 'Reject Offer'}
            {responseDialog.action === 'counter' && 'Send Counter Offer'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default memo(Negotiations);
