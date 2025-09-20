import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Rating,
  Box,
  Typography,
  IconButton,
  Alert,
  Chip,
  CircularProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  PhotoCamera,
  Delete as DeleteIcon
} from '@mui/icons-material';
import api from '../../services/api';

const ReviewForm = ({ 
  open, 
  onClose, 
  productId, 
  productTitle, 
  onReviewSubmitted,
  existingReview = null 
}) => {
  const [formData, setFormData] = useState({
    rating: existingReview?.rating || 0,
    title: existingReview?.title || '',
    comment: existingReview?.comment || '',
    images: existingReview?.images || []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    setError('');
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    
    files.forEach(file => {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('Image size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const newImage = {
          url: e.target.result,
          alt: `Review image for ${productTitle}`
        };
        
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, newImage].slice(0, 5) // Max 5 images
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const validateForm = () => {
    if (formData.rating === 0) {
      setError('Please provide a rating');
      return false;
    }
    if (!formData.title.trim()) {
      setError('Please provide a review title');
      return false;
    }
    if (!formData.comment.trim()) {
      setError('Please provide a review comment');
      return false;
    }
    if (formData.title.length > 100) {
      setError('Review title must be less than 100 characters');
      return false;
    }
    if (formData.comment.length > 1000) {
      setError('Review comment must be less than 1000 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    setError('');

    try {
      const reviewData = {
        productId,
        rating: formData.rating,
        title: formData.title.trim(),
        comment: formData.comment.trim(),
        images: formData.images
      };

      let response;
      if (existingReview) {
        // Update existing review
        response = await api.put(`/reviews/${existingReview._id}`, reviewData);
      } else {
        // Create new review
        response = await api.post('/reviews', reviewData);
      }

      if (response.data.success) {
        onReviewSubmitted(response.data.data);
        onClose();
        
        // Reset form
        setFormData({
          rating: 0,
          title: '',
          comment: '',
          images: []
        });
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
      setError('');
    }
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h6">
            {existingReview ? 'Edit Review' : 'Write a Review'}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {productTitle}
          </Typography>
        </Box>
        <IconButton onClick={handleClose} disabled={loading}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Rating */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Rating *
          </Typography>
          <Rating
            value={formData.rating}
            onChange={(event, newValue) => handleInputChange('rating', newValue)}
            size="large"
            precision={1}
          />
        </Box>

        {/* Title */}
        <TextField
          fullWidth
          label="Review Title *"
          value={formData.title}
          onChange={(e) => handleInputChange('title', e.target.value)}
          margin="normal"
          helperText={`${formData.title.length}/100 characters`}
          error={formData.title.length > 100}
          placeholder="Summarize your experience..."
        />

        {/* Comment */}
        <TextField
          fullWidth
          label="Your Review *"
          value={formData.comment}
          onChange={(e) => handleInputChange('comment', e.target.value)}
          margin="normal"
          multiline
          rows={4}
          helperText={`${formData.comment.length}/1000 characters`}
          error={formData.comment.length > 1000}
          placeholder="Share your detailed experience with this product..."
        />

        {/* Images */}
        <Box sx={{ mt: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Add Photos (Optional)
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Share photos to help others see your experience. Max 5 photos, 5MB each.
          </Typography>

          {/* Image Upload Button */}
          <Box sx={{ mb: 2 }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="review-image-upload"
              type="file"
              multiple
              onChange={handleImageUpload}
              disabled={formData.images.length >= 5}
            />
            <label htmlFor="review-image-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<PhotoCamera />}
                disabled={formData.images.length >= 5}
              >
                Add Photos ({formData.images.length}/5)
              </Button>
            </label>
          </Box>

          {/* Image Preview */}
          {formData.images.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {formData.images.map((image, index) => (
                <Box
                  key={index}
                  sx={{
                    position: 'relative',
                    width: 80,
                    height: 80,
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
                  <IconButton
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      bgcolor: 'rgba(0,0,0,0.7)',
                      color: 'white',
                      '&:hover': { bgcolor: 'rgba(0,0,0,0.8)' },
                      width: 24,
                      height: 24
                    }}
                    onClick={() => removeImage(index)}
                  >
                    <DeleteIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}
        </Box>

        {/* Guidelines */}
        <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
          <Typography variant="subtitle2" gutterBottom>
            Review Guidelines:
          </Typography>
          <Typography variant="body2" color="textSecondary">
            • Be honest and helpful to other users
            <br />
            • Focus on the product, not the seller
            <br />
            • Avoid inappropriate language or personal information
            <br />
            • Only review products you've actually used
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button onClick={handleClose} disabled={loading}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || formData.rating === 0 || !formData.title.trim() || !formData.comment.trim()}
          startIcon={loading && <CircularProgress size={16} />}
        >
          {existingReview ? 'Update Review' : 'Submit Review'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ReviewForm;