import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Alert, Card, CardContent, Divider } from '@mui/material';

const DirectApiTest = () => {
  const [testResults, setTestResults] = useState([]);
  const [isRunning, setIsRunning] = useState(false);

  const addResult = (test, status, message, data = null) => {
    setTestResults(prev => [...prev, { test, status, message, data, timestamp: new Date().toLocaleTimeString() }]);
  };

  const runTests = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    // Test 1: Basic fetch to test endpoint
    try {
      addResult('API Test Endpoint', 'running', 'Testing /api/test endpoint...');
      
      const response = await fetch('http://localhost:5001/api/test', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        addResult('API Test Endpoint', 'success', 'API is responding correctly', data);
      } else {
        addResult('API Test Endpoint', 'error', `HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      addResult('API Test Endpoint', 'error', `Network error: ${error.message}`);
    }

    // Test 2: Get products (public endpoint)
    try {
      addResult('Get Products', 'running', 'Fetching products...');
      
      const response = await fetch('http://localhost:5001/api/products', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const products = await response.json();
        addResult('Get Products', 'success', `Found ${products.length} products`, { count: products.length, sample: products.slice(0, 2) });
      } else {
        addResult('Get Products', 'error', `HTTP ${response.status}: ${response.statusText}`);
      }
    } catch (error) {
      addResult('Get Products', 'error', `Network error: ${error.message}`);
    }

    // Test 3: Test CORS preflight
    try {
      addResult('CORS Test', 'running', 'Testing CORS configuration...');
      
      const response = await fetch('http://localhost:5001/api/products', {
        method: 'OPTIONS',
      });
      
      addResult('CORS Test', 'success', `CORS preflight successful: ${response.status}`);
    } catch (error) {
      addResult('CORS Test', 'error', `CORS error: ${error.message}`);
    }

    // Test 4: User registration
    try {
      addResult('User Registration', 'running', 'Testing user registration...');
      
      const testUser = {
        name: 'Frontend Test User',
        email: `frontendtest${Date.now()}@example.com`,
        password: 'testpass123',
        phone: '+1234567890'
      };
      
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testUser),
      });
      
      if (response.ok) {
        const data = await response.json();
        addResult('User Registration', 'success', 'User registered successfully', { hasToken: !!data.token });
        
        // Test 5: Create product with auth token
        if (data.token) {
          try {
            addResult('Create Product', 'running', 'Testing product creation...');
            
            const testProduct = {
              title: 'Frontend Test Product',
              description: 'This is a test product created from the frontend API test.',
              price: 299.99,
              category: 'Electronics',
              condition: 'New',
              type: 'sell',
              location: 'Test Location'
            };
            
            const productResponse = await fetch('http://localhost:5001/api/products', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${data.token}`,
              },
              body: JSON.stringify(testProduct),
            });
            
            if (productResponse.ok) {
              const productData = await productResponse.json();
              addResult('Create Product', 'success', 'Product created successfully', { productId: productData._id, title: productData.title });
            } else {
              const errorData = await productResponse.text();
              addResult('Create Product', 'error', `HTTP ${productResponse.status}: ${errorData}`);
            }
          } catch (error) {
            addResult('Create Product', 'error', `Error: ${error.message}`);
          }
        }
      } else {
        const errorData = await response.text();
        addResult('User Registration', 'error', `HTTP ${response.status}: ${errorData}`);
      }
    } catch (error) {
      addResult('User Registration', 'error', `Network error: ${error.message}`);
    }

    setIsRunning(false);
  };

  return (
    <Box sx={{ p: 4, maxWidth: 1000, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Direct API Test
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
        This test directly calls the backend API without Redux to identify connection issues.
      </Typography>
      
      <Button 
        variant="contained" 
        onClick={runTests} 
        disabled={isRunning}
        sx={{ mb: 3 }}
      >
        {isRunning ? 'Running Tests...' : 'Run API Tests'}
      </Button>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {testResults.map((result, index) => (
          <Card key={index} sx={{ 
            borderLeft: `4px solid ${
              result.status === 'success' ? '#4caf50' : 
              result.status === 'error' ? '#f44336' : 
              '#ff9800'
            }` 
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="h6">
                  {result.test}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {result.timestamp}
                </Typography>
              </Box>
              
              <Alert severity={
                result.status === 'success' ? 'success' : 
                result.status === 'error' ? 'error' : 
                'info'
              }>
                {result.message}
              </Alert>
              
              {result.data && (
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    Response Data:
                  </Typography>
                  <Box sx={{ 
                    background: '#f5f5f5', 
                    p: 2, 
                    borderRadius: 1, 
                    fontFamily: 'monospace',
                    fontSize: '0.875rem',
                    overflow: 'auto'
                  }}>
                    <pre>{JSON.stringify(result.data, null, 2)}</pre>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>
    </Box>
  );
};

export default DirectApiTest;
