import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  Button,
  TextField,
  IconButton,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Stack,
  Card,
  CardContent,
  Divider
} from '@mui/material';
import {
  Person,
  Shield,
  Edit,
  Delete,
  Visibility,
  Search,
  SupervisorAccount
} from '@mui/icons-material';
import { getAllUsers, updateUserRole, deleteUser } from '../../features/adminSlice';
import { toast } from 'react-toastify';

const AdminUsers = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { users, loading } = useSelector((state) => state.admin);
  const { user: currentUser } = useSelector((state) => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  useEffect(() => {
    dispatch(getAllUsers());
  }, [dispatch]);

  const handleUserClick = (userId) => {
    navigate(`/admin/users/${userId}`);
  };

  const handleRoleUpdate = async (userId, newRole) => {
    try {
      await dispatch(updateUserRole({ userId, role: newRole })).unwrap();
      toast.success(`User role updated to ${newRole}`);
    } catch (error) {
      toast.error(error || 'Failed to update user role');
    }
  };

  const handleDeleteClick = (user) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (userToDelete) {
      try {
        await dispatch(deleteUser(userToDelete._id)).unwrap();
        toast.success('User deleted successfully');
        setDeleteDialogOpen(false);
        setUserToDelete(null);
      } catch (error) {
        toast.error(error || 'Failed to delete user');
      }
    }
  };

  const filteredUsers = users?.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
          <CircularProgress size={60} />
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" sx={{ fontWeight: 700, color: '#2d3748', mb: 1 }}>
          Users Management
        </Typography>
        <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
          Manage user accounts and permissions
        </Typography>
        
        <Card sx={{ p: 2, mb: 3, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
          <CardContent sx={{ py: 1 }}>
            <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
              Total Users: {users?.length || 0}
            </Typography>
          </CardContent>
        </Card>
      </Box>

      {/* Search */}
      <Paper sx={{ p: 3, mb: 4, borderRadius: 3 }}>
        <TextField
          fullWidth
          variant="outlined"
          label="Search Users"
          placeholder="Search users by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'action.active' }} />,
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: 2,
              '&:hover': {
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)'
              }
            }
          }}
        />
      </Paper>

      {/* Users Table */}
      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <TableContainer>
          <Table>
            <TableHead sx={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
              <TableRow>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#4a5568' }}>
                    User
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#4a5568' }}>
                    Contact
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#4a5568' }}>
                    Role
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#4a5568' }}>
                    Joined
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="subtitle2" sx={{ fontWeight: 700, color: '#4a5568' }}>
                    Actions
                  </Typography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow 
                  key={user._id}
                  hover
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'rgba(102, 126, 234, 0.04)'
                    }
                  }}
                  onClick={() => handleUserClick(user._id)}
                >
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Avatar sx={{ 
                        mr: 2, 
                        bgcolor: '#667eea',
                        width: 48,
                        height: 48
                      }}>
                        <Person />
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                          {user.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          ID: {user._id.slice(-6)}
                        </Typography>
                      </Box>
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Box>
                      <Typography variant="body2">
                        {user.email}
                      </Typography>
                      {user.phone && (
                        <Typography variant="caption" color="text.secondary">
                          {user.phone}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>
                  
                  <TableCell>
                    <Chip
                      icon={user.role === 'admin' ? <Shield /> : <Person />}
                      label={user.role}
                      color={user.role === 'admin' ? 'secondary' : 'default'}
                      size="small"
                      sx={{
                        fontWeight: 600,
                        textTransform: 'capitalize'
                      }}
                    />
                  </TableCell>
                  
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </Typography>
                  </TableCell>
                  
                  <TableCell>
                    <Stack direction="row" spacing={1} onClick={(e) => e.stopPropagation()}>
                      {/* View Details */}
                      <IconButton
                        size="small"
                        onClick={() => handleUserClick(user._id)}
                        sx={{
                          color: '#3b82f6',
                          '&:hover': {
                            backgroundColor: 'rgba(59, 130, 246, 0.1)'
                          }
                        }}
                      >
                        <Visibility fontSize="small" />
                      </IconButton>
                      
                      {/* Role Toggle */}
                      {currentUser._id !== user._id && (
                        <IconButton
                          size="small"
                          onClick={() => handleRoleUpdate(
                            user._id, 
                            user.role === 'admin' ? 'user' : 'admin'
                          )}
                          sx={{
                            color: user.role === 'admin' ? '#f59e0b' : '#10b981',
                            '&:hover': {
                              backgroundColor: user.role === 'admin' 
                                ? 'rgba(245, 158, 11, 0.1)' 
                                : 'rgba(16, 185, 129, 0.1)'
                            }
                          }}
                        >
                          {user.role === 'admin' ? <Person fontSize="small" /> : <SupervisorAccount fontSize="small" />}
                        </IconButton>
                      )}
                      
                      {/* Delete Button */}
                      {currentUser._id !== user._id && user.role !== 'admin' && (
                        <IconButton
                          size="small"
                          onClick={() => handleDeleteClick(user)}
                          sx={{
                            color: '#ef4444',
                            '&:hover': {
                              backgroundColor: 'rgba(239, 68, 68, 0.1)'
                            }
                          }}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      )}
                    </Stack>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        
        {filteredUsers.length === 0 && (
          <Box sx={{ py: 8, textAlign: 'center' }}>
            <Alert severity="info" sx={{ maxWidth: 400, mx: 'auto' }}>
              No users found matching your search criteria.
            </Alert>
          </Box>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Confirm Delete User
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete user "{userToDelete?.name}"? 
            This action cannot be undone and will permanently remove their account and all associated data.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            onClick={() => setDeleteDialogOpen(false)} 
            variant="outlined"
            sx={{ mr: 1 }}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleDeleteConfirm} 
            variant="contained"
            color="error"
            sx={{
              background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
              '&:hover': {
                background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)'
              }
            }}
          >
            Delete User
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminUsers;
