import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Paper,
  Typography,
  Rating,
  Avatar,
  Button,
  Chip,
  Divider,
  Grid,
  LinearProgress,
  IconButton,
  Menu,
  MenuItem,
  Alert,
  CircularProgress,
  Pagination
} from '@mui/material';
import {
  ThumbUp,
  ThumbDown,
  MoreVert,
  Report,
  Edit,
  Delete,
  Verified
} from '@mui/icons-material';
import { useSelector } from 'react-redux';
import { format } from 'date-fns';
import api from '../../services/api';
import ReviewForm from './ReviewForm';

const ReviewSummary = ({ ratingStats }) => {
  const { averageRating, totalReviews, ratingDistribution } = ratingStats;

  const getRatingPercentage = (rating) => {
    if (totalReviews === 0) return 0;
    return (ratingDistribution[rating] / totalReviews) * 100;
  };

  return (
    <Paper sx={{ p: 3, mb: 3 }}>
      <Typography variant="h6" gutterBottom>
        Customer Reviews
      </Typography>
      
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Box textAlign="center">
            <Typography variant="h2" component="div">
              {averageRating.toFixed(1)}
            </Typography>
            <Rating value={averageRating} readOnly precision={0.1} size="large" />
            <Typography variant="body2" color="textSecondary">
              Based on {totalReviews} reviews
            </Typography>
          </Box>
        </Grid>
        
        <Grid item xs={12} md={8}>
          {[5, 4, 3, 2, 1].map((rating) => (
            <Box key={rating} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ minWidth: 20 }}>
                {rating}
              </Typography>
              <Rating value={rating} readOnly size="small" sx={{ mx: 1 }} />
              <LinearProgress
                variant="determinate"
                value={getRatingPercentage(rating)}
                sx={{ flex: 1, mx: 1, height: 8, borderRadius: 4 }}
              />
              <Typography variant="body2" sx={{ minWidth: 40 }}>
                {ratingDistribution[rating] || 0}
              </Typography>
            </Box>
          ))}
        </Grid>
      </Grid>
    </Paper>
  );
};

const ReviewItem = ({ review, onReviewUpdate, onReviewDelete, currentUser }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [helpful, setHelpful] = useState(null);
  const [helpfulCount, setHelpfulCount] = useState(review.helpfulCount || 0);
  const [notHelpfulCount, setNotHelpfulCount] = useState(review.notHelpfulCount || 0);
  const [loading, setLoading] = useState(false);

  const isOwner = currentUser && review.user._id === currentUser._id;
  const isAdmin = currentUser && currentUser.role === 'admin';

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleHelpful = async (isHelpful) => {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const response = await api.post(`/reviews/${review._id}/helpful`, {
        helpful: isHelpful
      });

      if (response.data.success) {
        setHelpful(isHelpful);
        setHelpfulCount(response.data.data.helpfulCount);
        setNotHelpfulCount(response.data.data.notHelpfulCount);
      }
    } catch (error) {
      console.error('Error marking review as helpful:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleReport = async () => {
    if (!currentUser) return;

    try {
      const response = await api.post(`/reviews/${review._id}/report`, {
        reason: 'inappropriate'
      });

      if (response.data.success) {
        alert('Review reported successfully');
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to report review');
    }
    handleMenuClose();
  };

  const handleEdit = () => {
    onReviewUpdate(review);
    handleMenuClose();
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this review?')) {
      return;
    }

    try {
      const response = await api.delete(`/reviews/${review._id}`);
      if (response.data.success) {
        onReviewDelete(review._id);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete review');
    }
    handleMenuClose();
  };

  return (
    <Paper sx={{ p: 3, mb: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <Avatar sx={{ mr: 2 }}>
            {review.user.name.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="subtitle1" fontWeight="bold">
                {review.user.name}
              </Typography>
              {review.verified && (
                <Chip
                  icon={<Verified />}
                  label="Verified Purchase"
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              )}
            </Box>
            <Typography variant="body2" color="textSecondary">
              {format(new Date(review.createdAt), 'MMM dd, yyyy')}
            </Typography>
          </Box>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Rating value={review.rating} readOnly size="small" />
          {(isOwner || isAdmin || currentUser) && (
            <IconButton onClick={handleMenuClick} size="small">
              <MoreVert />
            </IconButton>
          )}
        </Box>
      </Box>

      <Typography variant="h6" gutterBottom>
        {review.title}
      </Typography>

      <Typography variant="body1" sx={{ mb: 2, lineHeight: 1.6 }}>
        {review.comment}
      </Typography>

      {/* Review Images */}
      {review.images && review.images.length > 0 && (
        <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
          {review.images.map((image, index) => (
            <Box
              key={index}
              sx={{
                width: 100,
                height: 100,
                borderRadius: 1,
                overflow: 'hidden',
                border: '1px solid #ddd'
              }}
            >
              <img
                src={image.url}
                alt={image.alt}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </Box>
          ))}
        </Box>
      )}

      {/* Helpful Actions */}
      {currentUser && !isOwner && (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
          <Typography variant="body2" color="textSecondary">
            Was this review helpful?
          </Typography>
          <Button
            size="small"
            startIcon={<ThumbUp />}
            onClick={() => handleHelpful(true)}
            disabled={loading}
            variant={helpful === true ? 'contained' : 'outlined'}
            color={helpful === true ? 'primary' : 'inherit'}
          >
            Yes ({helpfulCount})
          </Button>
          <Button
            size="small"
            startIcon={<ThumbDown />}
            onClick={() => handleHelpful(false)}
            disabled={loading}
            variant={helpful === false ? 'contained' : 'outlined'}
            color={helpful === false ? 'primary' : 'inherit'}
          >
            No ({notHelpfulCount})
          </Button>
        </Box>
      )}

      {/* Context Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        {isOwner && [
          <MenuItem key="edit" onClick={handleEdit}>
            <Edit sx={{ mr: 1 }} />
            Edit Review
          </MenuItem>,
          <MenuItem key="delete" onClick={handleDelete}>
            <Delete sx={{ mr: 1 }} />
            Delete Review
          </MenuItem>
        ]}
        {!isOwner && currentUser && (
          <MenuItem onClick={handleReport}>
            <Report sx={{ mr: 1 }} />
            Report Review
          </MenuItem>
        )}
        {isAdmin && !isOwner && (
          <MenuItem onClick={handleDelete}>
            <Delete sx={{ mr: 1 }} />
            Remove Review
          </MenuItem>
        )}
      </Menu>
    </Paper>
  );
};

const ReviewList = ({ productId, productTitle }) => {
  const { user } = useSelector((state) => state.auth);
  const [reviews, setReviews] = useState([]);
  const [ratingStats, setRatingStats] = useState({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalReviews: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [userReview, setUserReview] = useState(null);

  const fetchReviews = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const response = await api.get(`/reviews/product/${productId}`, {
        params: { page, limit: 10, sort: sortBy }
      });

      if (response.data.success) {
        setReviews(response.data.data.reviews);
        setPagination(response.data.data.pagination);
        setRatingStats(response.data.data.ratingStats);
        
        // Check if current user has reviewed this product
        if (user) {
          const existingReview = response.data.data.reviews.find(
            review => review.user._id === user._id
          );
          setUserReview(existingReview || null);
        }
      }
    } catch (error) {
      setError('Failed to load reviews');
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  }, [productId, sortBy, user]);

  useEffect(() => {
    fetchReviews();
  }, [productId, sortBy]);

  const handleSortChange = (newSort) => {
    setSortBy(newSort);
  };

  const handlePageChange = (event, page) => {
    fetchReviews(page);
  };

  const handleReviewSubmitted = (newReview) => {
    if (editingReview) {
      // Update existing review
      setReviews(reviews.map(review => 
        review._id === newReview._id ? newReview : review
      ));
      setUserReview(newReview);
    } else {
      // Add new review
      setReviews([newReview, ...reviews]);
      setUserReview(newReview);
    }
    setEditingReview(null);
    fetchReviews(); // Refresh to get updated stats
  };

  const handleReviewUpdate = (review) => {
    setEditingReview(review);
    setShowReviewForm(true);
  };

  const handleReviewDelete = (reviewId) => {
    setReviews(reviews.filter(review => review._id !== reviewId));
    if (userReview && userReview._id === reviewId) {
      setUserReview(null);
    }
    fetchReviews(); // Refresh to get updated stats
  };

  const handleWriteReview = () => {
    setEditingReview(null);
    setShowReviewForm(true);
  };

  if (loading && reviews.length === 0) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Rating Summary */}
      <ReviewSummary ratingStats={ratingStats} />

      {/* Write Review Button */}
      {user && !userReview && (
        <Box sx={{ mb: 3, textAlign: 'center' }}>
          <Button
            variant="contained"
            size="large"
            onClick={handleWriteReview}
          >
            Write a Review
          </Button>
        </Box>
      )}

      {/* Sort Options */}
      {reviews.length > 0 && (
        <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Typography variant="body2" sx={{ alignSelf: 'center', mr: 1 }}>
            Sort by:
          </Typography>
          {[
            { value: 'newest', label: 'Newest' },
            { value: 'oldest', label: 'Oldest' },
            { value: 'highest', label: 'Highest Rating' },
            { value: 'lowest', label: 'Lowest Rating' },
            { value: 'helpful', label: 'Most Helpful' }
          ].map((option) => (
            <Chip
              key={option.value}
              label={option.label}
              onClick={() => handleSortChange(option.value)}
              variant={sortBy === option.value ? 'filled' : 'outlined'}
              color={sortBy === option.value ? 'primary' : 'default'}
              clickable
            />
          ))}
        </Box>
      )}

      {/* Reviews List */}
      {reviews.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No reviews yet
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Be the first to review this product!
          </Typography>
        </Paper>
      ) : (
        <>
          {reviews.map((review) => (
            <ReviewItem
              key={review._id}
              review={review}
              onReviewUpdate={handleReviewUpdate}
              onReviewDelete={handleReviewDelete}
              currentUser={user}
            />
          ))}

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
              <Pagination
                count={pagination.totalPages}
                page={pagination.currentPage}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}

      {/* Review Form Dialog */}
      <ReviewForm
        open={showReviewForm}
        onClose={() => {
          setShowReviewForm(false);
          setEditingReview(null);
        }}
        productId={productId}
        productTitle={productTitle}
        onReviewSubmitted={handleReviewSubmitted}
        existingReview={editingReview}
      />
    </Box>
  );
};

export default ReviewList;