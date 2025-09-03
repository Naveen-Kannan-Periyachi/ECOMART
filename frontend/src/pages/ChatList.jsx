import React, { useEffect, useState, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import {
  Box,
  Typography,
  Container,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  CircularProgress,
  Alert,
  Divider,
  Paper,
  Badge
} from '@mui/material';
import {
  Chat as ChatIcon,
  ArrowForward,
  ShoppingBag,
  Schedule
} from '@mui/icons-material';
import { api } from '../utils/api';

const ChatList = () => {
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchChats = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const response = await api.get('/chat');
        setChats(response.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load chats');
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [user]);

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffInMinutes = Math.floor((now - date) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return date.toLocaleDateString();
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning">Please log in to view your chats</Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="center" alignItems="center" height="60vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        {/* Header */}
        <Box sx={{ 
          p: 3, 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <ChatIcon sx={{ mr: 2, fontSize: 32 }} />
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Your Chats
            </Typography>
          </Box>
          <Typography variant="body1" sx={{ opacity: 0.9 }}>
            Continue your negotiations and conversations
          </Typography>
        </Box>

        {/* Chat List */}
        {chats.length === 0 ? (
          <Box sx={{ 
            p: 6, 
            textAlign: 'center', 
            color: 'text.secondary' 
          }}>
            <ChatIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
            <Typography variant="h6" sx={{ mb: 1 }}>
              No chats yet
            </Typography>
            <Typography variant="body2">
              Start shopping and negotiate with sellers to begin conversations
            </Typography>
          </Box>
        ) : (
          <List sx={{ p: 0 }}>
            {chats.map((chat, index) => (
              <React.Fragment key={chat._id}>
                <ListItem
                  sx={{
                    py: 2,
                    px: 3,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      backgroundColor: '#f8fafc'
                    }
                  }}
                  onClick={() => navigate(`/chat/${chat._id}`)}
                >
                  <ListItemAvatar>
                    <Badge
                      color="success"
                      variant="dot"
                      invisible={!chat.lastMessage || 
                        new Date() - new Date(chat.lastMessage.createdAt) > 300000} // 5 min
                    >
                      <Avatar sx={{ 
                        bgcolor: '#667eea',
                        width: 56,
                        height: 56,
                        fontSize: '1.2rem'
                      }}>
                        {chat.otherUser.name.charAt(0).toUpperCase()}
                      </Avatar>
                    </Badge>
                  </ListItemAvatar>

                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mr: 1 }}>
                          {chat.otherUser.name}
                        </Typography>
                        {chat.product && (
                          <Chip
                            icon={<ShoppingBag />}
                            label={chat.product.title}
                            size="small"
                            variant="outlined"
                            color="primary"
                            sx={{ maxWidth: 200 }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Box>
                        {chat.lastMessage ? (
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{ 
                              mb: 0.5,
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden'
                            }}
                          >
                            {chat.lastMessage.content}
                          </Typography>
                        ) : (
                          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                            No messages yet
                          </Typography>
                        )}
                        
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Schedule sx={{ fontSize: 14, mr: 0.5, color: 'text.disabled' }} />
                          <Typography variant="caption" color="text.disabled">
                            {formatMessageTime(chat.lastMessage?.createdAt || chat.updatedAt)}
                          </Typography>
                          {chat.product && (
                            <>
                              <Typography variant="caption" sx={{ mx: 1, color: 'text.disabled' }}>
                                •
                              </Typography>
                              <Typography variant="caption" color="primary" sx={{ fontWeight: 600 }}>
                                ${chat.product.price}
                              </Typography>
                            </>
                          )}
                        </Box>
                      </Box>
                    }
                  />

                  <ListItemSecondaryAction>
                    <IconButton 
                      edge="end" 
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/chat/${chat._id}`);
                      }}
                      sx={{
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        color: 'white',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
                        }
                      }}
                    >
                      <ArrowForward />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                
                {index < chats.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
      </Paper>
    </Container>
  );
};

export default memo(ChatList);
