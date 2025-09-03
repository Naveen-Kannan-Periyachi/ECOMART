import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { clearProductError, createProduct, updateProduct, getProductById } from '../features/productsSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from '@mui/material';
import { CloudUpload, Clear } from '@mui/icons-material';
import { api } from '../utils/api';

const categories = [
  'Electronics',
  'Furniture',
  'Fashion',
  'Books',
  'Sports',
  'Others',
];

const conditions = ['New', 'Like New', 'Good', 'Fair', 'Poor'];

const ProductForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { loading, error, currentProduct } = useSelector((state) => state.products);
  const [formError, setFormError] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    rentPricePerDay: 0,
    category: '',
    condition: '',
    type: 'sell',
    location: '',
    images: [],
  });

  // Load product data if editing
  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      dispatch(getProductById(id));
    }
  }, [id, dispatch]);

  // Populate form when product data is loaded
  useEffect(() => {
    if (isEditMode && currentProduct) {
      setFormData({
        title: currentProduct.title || '',
        description: currentProduct.description || '',
        price: currentProduct.price || 0,
        rentPricePerDay: currentProduct.rentPricePerDay || 0,
        category: currentProduct.category || '',
        condition: currentProduct.condition || '',
        type: currentProduct.type || 'sell',
        location: currentProduct.location || '',
        images: currentProduct.images || [],
      });
    }
  }, [isEditMode, currentProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Special handling for price fields
    if (name === 'price' || name === 'rentPricePerDay') {
      const numValue = Number(value);
      // Limit maximum price to prevent overflow
      if (numValue > 999999) {
        alert('Price cannot exceed $999,999');
        return;
      }
      setFormData((prev) => ({
        ...prev,
        [name]: numValue || 0,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    const formData = new FormData();
    
    files.forEach((file) => {
      formData.append('images', file);
    });

    try {
      const response = await api.post('/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...response.data],
      }));
    } catch (error) {
      console.error('Error uploading images:', error);
    }
  };

  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log('Form submission started');
    
    // Clear any previous errors
    setFormError('');
    dispatch(clearProductError());
    
    // Enhanced validation to match backend requirements exactly
    if (!formData.title || formData.title.trim().length < 3) {
      setFormError('Title must be at least 3 characters long');
      return;
    }
    
    if (formData.title.trim().length > 100) {
      setFormError('Title cannot exceed 100 characters');
      return;
    }
    
    if (!formData.description || formData.description.trim().length < 10) {
      setFormError('Description must be at least 10 characters long');
      return;
    }
    
    if (formData.description.trim().length > 1000) {
      setFormError('Description cannot exceed 1000 characters');
      return;
    }
    
    if (!formData.price || formData.price <= 0) {
      setFormError('Price must be greater than 0');
      return;
    }

    if (formData.price > 999999) {
      setFormError('Price cannot exceed $999,999');
      return;
    }
    
    if (!formData.category) {
      setFormError('Please select a category');
      return;
    }
    
    if (!formData.condition) {
      setFormError('Please select a condition');
      return;
    }
    
    if (!formData.location || formData.location.trim().length === 0) {
      setFormError('Location is required');
      return;
    }

    if (formData.type === 'rent' && formData.rentPricePerDay <= 0) {
      setFormError('Rent price per day must be greater than 0');
      return;
    }

    try {
      // Prepare clean form data, only include rentPricePerDay for rent type
      const cleanFormData = {
        title: formData.title,
        description: formData.description,
        price: formData.price,
        category: formData.category,
        condition: formData.condition,
        type: formData.type,
        location: formData.location,
        images: formData.images
      };

      // Only include rentPricePerDay for rent type products
      if (formData.type === 'rent') {
        cleanFormData.rentPricePerDay = formData.rentPricePerDay;
      }

      console.log('All validations passed, submitting product data:', {
        ...cleanFormData,
        titleLength: cleanFormData.title.length,
        descriptionLength: cleanFormData.description.length,
        priceType: typeof cleanFormData.price,
        priceValue: cleanFormData.price
      });
      console.log('Current Redux error state:', error);
      
      let resultAction;
      if (isEditMode) {
        resultAction = await dispatch(updateProduct({ id, productData: cleanFormData }));
      } else {
        resultAction = await dispatch(createProduct(cleanFormData));
      }
      
      const isSuccess = isEditMode 
        ? updateProduct.fulfilled.match(resultAction)
        : createProduct.fulfilled.match(resultAction);
      
      if (isSuccess) {
        toast.success(`Product ${isEditMode ? 'updated' : 'created'} successfully!`);
        navigate('/dashboard');
      } else {
        // Handle validation errors from backend
        const errorData = resultAction.payload;
        console.log('Error data received:', errorData);
        
        if (errorData && errorData.errors && Array.isArray(errorData.errors)) {
          const errorMessages = errorData.errors.map(err => 
            typeof err === 'string' ? err : (err.msg || err.message || 'Validation error')
          ).join(', ');
          setFormError(`Validation failed: ${errorMessages}`);
        } else if (errorData && typeof errorData.message === 'string') {
          setFormError(errorData.message);
        } else if (typeof errorData === 'string') {
          setFormError(errorData);
        } else {
          setFormError('Failed to create product. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error creating product:', error);
      setFormError('Failed to create product. Please try again.');
    }
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          {isEditMode ? 'Edit Your Item' : 'List Your Item'}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {typeof error === 'string' ? error : 
             error?.message || 
             (error?.errors && Array.isArray(error.errors) ? 
               error.errors.map(err => typeof err === 'string' ? err : err.msg || err.message || 'Validation error').join(', ') : 
               'An error occurred')}
          </Alert>
        )}

        {formError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {formError}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            margin="normal"
            required
            helperText={`${formData.title.length}/100 characters (minimum 3 required)`}
            error={formData.title.length > 0 && formData.title.length < 3}
          />

          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={4}
            required
            helperText={`${formData.description.length}/1000 characters (minimum 10 required)`}
            error={formData.description.length > 0 && formData.description.length < 10}
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Type</InputLabel>
            <Select
              name="type"
              value={formData.type}
              onChange={handleChange}
              required
            >
              <MenuItem value="sell">Sell</MenuItem>
              <MenuItem value="rent">Rent</MenuItem>
              <MenuItem value="buy">Buy</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Price"
            name="price"
            type="number"
            value={formData.price || ''}
            onChange={handleChange}
            margin="normal"
            inputProps={{ min: 0.01, step: 0.01 }}
            required
          />

          {formData.type === 'rent' && (
            <TextField
              fullWidth
              label="Rent Price Per Day"
              name="rentPricePerDay"
              type="number"
              value={formData.rentPricePerDay || ''}
              onChange={handleChange}
              margin="normal"
              inputProps={{ min: 0.01, step: 0.01 }}
              required
            />
          )}

          <FormControl fullWidth margin="normal">
            <InputLabel>Category</InputLabel>
            <Select
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
            >
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Condition</InputLabel>
            <Select
              name="condition"
              value={formData.condition}
              onChange={handleChange}
              required
            >
              {conditions.map((condition) => (
                <MenuItem key={condition} value={condition}>
                  {condition}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            margin="normal"
            required
          />

          <Box sx={{ mt: 2 }}>
            <input
              accept="image/*"
              style={{ display: 'none' }}
              id="image-upload"
              type="file"
              multiple
              onChange={handleImageUpload}
            />
            <label htmlFor="image-upload">
              <Button
                variant="outlined"
                component="span"
                startIcon={<CloudUpload />}
                fullWidth
              >
                Upload Images (Max 5)
              </Button>
            </label>
          </Box>

          {formData.images.length > 0 && (
            <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {formData.images.map((image, index) => (
                <Box
                  key={index}
                  sx={{
                    position: 'relative',
                    width: 100,
                    height: 100,
                  }}
                >
                  <img
                    src={image}
                    alt={`Product ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                  <IconButton
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      backgroundColor: 'rgba(255, 255, 255, 0.8)',
                    }}
                    onClick={() => handleRemoveImage(index)}
                  >
                    <Clear />
                  </IconButton>
                </Box>
              ))}
            </Box>
          )}

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 3 }}
            disabled={loading}
          >
            {loading 
              ? (isEditMode ? 'Updating...' : 'Creating...') 
              : (isEditMode ? 'Update Listing' : 'Create Listing')
            }
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default ProductForm;
