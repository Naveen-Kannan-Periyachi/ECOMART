import React from 'react';
import { 
  Box, 
  Paper, 
  Typography, 
  Button, 
  Stack, 
  Chip,
  Divider,
  Alert
} from '@mui/material';
import { AccountCircle, AdminPanelSettings } from '@mui/icons-material';

const DemoAccounts = ({ onFillForm }) => {
  const demoUsers = [
    {
      name: 'Alice Johnson',
      email: 'alice@example.com',
      password: 'password123',
      phone: '1234567890',
      address: {
        street: '123 Main St',
        city: 'New York',
        state: 'NY',
        zipCode: '10001',
        country: 'USA'
      }
    },
    {
      name: 'Bob Williams',
      email: 'bob@example.com',
      password: 'password123',
      phone: '0987654321',
      address: {
        street: '456 Oak Ave',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90210',
        country: 'USA'
      }
    }
  ];

  return (
    <Paper 
      elevation={2} 
      sx={{ 
        p: 3, 
        mt: 3, 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        borderRadius: 2
      }}
    >
      <Stack spacing={2}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccountCircle color="primary" />
          Demo Accounts Available
        </Typography>
        
        <Alert severity="info" variant="outlined">
          These accounts already exist in the system. You can either use them for testing or create a new account with different details.
        </Alert>

        <Divider />

        {/* Admin Account */}
        <Box sx={{ p: 2, bgcolor: 'rgba(255, 193, 7, 0.1)', borderRadius: 1 }}>
          <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <AdminPanelSettings color="warning" />
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  Admin Account
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  admin@ecomart.com / admin123
                </Typography>
              </Box>
            </Box>
            <Chip label="Admin" color="warning" size="small" />
          </Stack>
        </Box>

        {/* Demo User Accounts */}
        {demoUsers.map((user, index) => (
          <Box key={index} sx={{ p: 2, bgcolor: 'rgba(25, 118, 210, 0.05)', borderRadius: 1 }}>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Box>
                <Typography variant="subtitle1" fontWeight="bold">
                  {user.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.email} / {user.password}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user.address.city}, {user.address.state}
                </Typography>
              </Box>
              <Stack direction="row" spacing={1}>
                <Chip label="User" color="primary" size="small" />
                <Button 
                  size="small" 
                  variant="outlined"
                  onClick={() => onFillForm && onFillForm(user)}
                >
                  Use This
                </Button>
              </Stack>
            </Box>
          ))}
        ))}

        <Alert severity="success" variant="outlined">
          <Typography variant="body2">
            <strong>Tip:</strong> Click "Use This" to auto-fill the registration form with demo data, 
            then modify the email to create a new account.
          </Typography>
        </Alert>
      </Stack>
    </Paper>
  );
};

export default DemoAccounts;
