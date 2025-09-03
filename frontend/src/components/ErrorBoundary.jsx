import React from 'react';
import { Box, Typography, Button, Paper, Container } from '@mui/material';
import { ErrorOutline, Refresh } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to console for debugging
    console.error('Error caught by boundary:', error, errorInfo);
    
    this.setState({
      error,
      errorInfo
    });

    // In production, you could send this to an error reporting service
    // Example: logErrorToService(error, errorInfo);
  }

  handleReload = () => {
    // Reset the error boundary state
    this.setState({ hasError: false, error: null, errorInfo: null });
    
    // Reload the page as a fallback
    window.location.reload();
  };

  handleGoHome = () => {
    // Reset the error boundary state
    this.setState({ hasError: false, error: null, errorInfo: null });
    
    // Navigate to home page
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Paper
            elevation={3}
            sx={{
              p: 6,
              textAlign: 'center',
              borderRadius: 3,
              background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)'
            }}
          >
            <Box sx={{ mb: 4 }}>
              <ErrorOutline
                sx={{
                  fontSize: 80,
                  color: 'error.main',
                  mb: 2
                }}
              />
              <Typography variant="h4" component="h1" gutterBottom color="error.main">
                Oops! Something went wrong
              </Typography>
              <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
                We're sorry, but something unexpected happened.
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
                The error has been logged and our team will look into it. 
                In the meantime, you can try refreshing the page or go back to the home page.
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                startIcon={<Refresh />}
                onClick={this.handleReload}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem'
                }}
              >
                Reload Page
              </Button>
              <Button
                variant="outlined"
                size="large"
                onClick={this.handleGoHome}
                sx={{
                  px: 4,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontSize: '1.1rem'
                }}
              >
                Go to Home
              </Button>
            </Box>

            {/* Show error details in development */}
            {import.meta.env.DEV && this.state.error && (
              <Box sx={{ mt: 4, textAlign: 'left' }}>
                <Typography variant="h6" color="error.main" gutterBottom>
                  Error Details (Development Only):
                </Typography>
                <Paper
                  sx={{
                    p: 2,
                    bgcolor: '#f5f5f5',
                    borderRadius: 1,
                    maxHeight: 200,
                    overflow: 'auto',
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  <Typography variant="body2" color="error.main">
                    {this.state.error.toString()}
                  </Typography>
                  {this.state.errorInfo && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {this.state.errorInfo.componentStack}
                    </Typography>
                  )}
                </Paper>
              </Box>
            )}
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;