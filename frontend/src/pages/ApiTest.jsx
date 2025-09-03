import React, { useEffect, useState } from 'react';
import { api } from '../utils/api';

const ApiTest = () => {
  const [testResults, setTestResults] = useState([]);

  useEffect(() => {
    const runTests = async () => {
      const results = [];
      
      // Test 1: Check API configuration
      results.push({
        test: 'API Configuration',
        result: `baseURL: ${api.defaults.baseURL}`,
        status: 'info'
      });

      // Test 2: Test URL construction
      try {
        const testUrl = api.getUri({ url: '/products' });
        results.push({
          test: 'URL Construction',
          result: `Constructed URL: ${testUrl}`,
          status: testUrl.includes('localhost:5001') ? 'success' : 'error'
        });
      } catch (error) {
        results.push({
          test: 'URL Construction',
          result: `Error: ${error.message}`,
          status: 'error'
        });
      }

      // Test 3: Test actual API call
      try {
        await api.get('/test');
        results.push({
          test: 'API Connection',
          result: 'Successfully connected to API',
          status: 'success'
        });
      } catch (error) {
        results.push({
          test: 'API Connection',
          result: `Error: ${error.message}`,
          status: 'error'
        });
      }

      setTestResults(results);
    };

    runTests();
  }, []);

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>API Configuration Test</h1>
      <div style={{ marginBottom: '20px' }}>
        <strong>Environment Info:</strong>
        <pre>{JSON.stringify({
          VITE_API_URL: import.meta.env.VITE_API_URL,
          NODE_ENV: import.meta.env.NODE_ENV,
          MODE: import.meta.env.MODE
        }, null, 2)}</pre>
      </div>
      
      <h2>Test Results:</h2>
      {testResults.map((result, index) => (
        <div 
          key={index}
          style={{
            padding: '10px',
            margin: '10px 0',
            border: '1px solid #ccc',
            borderRadius: '5px',
            backgroundColor: 
              result.status === 'success' ? '#d4edda' :
              result.status === 'error' ? '#f8d7da' : '#d1ecf1'
          }}
        >
          <strong>{result.test}:</strong> {result.result}
        </div>
      ))}
    </div>
  );
};

export default ApiTest;
