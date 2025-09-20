import React, { useEffect, useState, useRef, useCallback, memo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  List,
  ListItem,
  Avatar,
  Container,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  IconButton,
  Divider,
  Chip,
  Stack,
  Snackbar
} from '@mui/material';
import {
  Send,
  ArrowBack,
  AttachFile,
  MoreVert,
  Circle,
  VolumeUp,
  VolumeOff
} from '@mui/icons-material';
import { io } from 'socket.io-client';
import { api } from '../utils/api';
import { markNotificationAsRead, fetchUnreadCount } from '../features/notificationSlice';

const Chat = () => {
  const { chatId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { notifications } = useSelector((state) => state.notifications);
  
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);
  const [chatInfo, setChatInfo] = useState(null);
  const [otherUser, setOtherUser] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [socket, setSocket] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [notification, setNotification] = useState({ open: false, message: '' });
  const [isPageVisible, setIsPageVisible] = useState(true);
  
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);
  const typingTimeoutRef = useRef(null);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Handle page visibility for notifications
  useEffect(() => {
    const handleVisibilityChange = () => {
      setIsPageVisible(!document.hidden);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Notification functions
  const playNotificationSound = useCallback(() => {
    if (soundEnabled) {
      // Create a simple notification sound
      try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      } catch {
        console.log('Audio notification not supported');
      }
    }
  }, [soundEnabled]);

  const showBrowserNotification = useCallback((message, sender) => {
    if ('Notification' in window && Notification.permission === 'granted' && !isPageVisible) {
      const notification = new Notification(`New message from ${sender}`, {
        body: message,
        icon: '/vite.svg',
        tag: chatId,
      });

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      setTimeout(() => notification.close(), 5000);
    }
  }, [chatId, isPageVisible]);

  const showInAppNotification = useCallback((message, sender) => {
    setNotification({
      open: true,
      message: `New message from ${sender}: ${message.substring(0, 50)}${message.length > 50 ? '...' : ''}`
    });
  }, []);

  // Initialize Socket.IO connection
  useEffect(() => {
    if (!user || !chatId) return;

    const newSocket = io('http://localhost:5001', {
      auth: {
        token: localStorage.getItem('token')
      },
      transports: ['websocket', 'polling']
    });

    newSocket.on('connect', () => {
      console.log('Connected to chat server with socket ID:', newSocket.id);
      newSocket.emit('join', { chatId });
    });

    newSocket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });

    newSocket.on('message', (newMessage) => {
      const isFromOtherUser = newMessage.senderId !== user._id;
      
      setMessages(prev => {
        const isDuplicate = prev.some(msg => 
          msg._id === newMessage._id || 
          (msg.content === newMessage.content && msg.senderId === newMessage.senderId)
        );
        
        if (isDuplicate) {
          return prev;
        }
        
        return [...prev, newMessage];
      });
      
      if (isFromOtherUser) {
        playNotificationSound();
        showBrowserNotification(newMessage.content, newMessage.senderName || 'Someone');
        showInAppNotification(newMessage.content, newMessage.senderName || 'Someone');
      }
      
      scrollToBottom();
    });

    newSocket.on('typing', ({ userId, isTyping: typing }) => {
      if (userId !== user._id) {
        setIsTyping(typing);
      }
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from chat server');
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user, chatId, playNotificationSound, showBrowserNotification, showInAppNotification]);

  // Fetch chat messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!chatId) return;
      
      try {
        setLoading(true);
        const response = await api.get(`/chat/${chatId}`);
        setMessages(response.data);
        
        const chatResponse = await api.get(`/chat/${chatId}/info`);
        setChatInfo(chatResponse.data);
        
        const otherUserId = chatResponse.data.buyerId === user._id 
          ? chatResponse.data.sellerId 
          : chatResponse.data.buyerId;
        
        setOtherUser({
          _id: otherUserId,
          name: chatResponse.data.buyerId === user._id 
            ? chatResponse.data.seller?.name 
            : chatResponse.data.buyer?.name
        });
        
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load chat');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [chatId, user]);

  // Mark chat-related notifications as read when entering chat
  useEffect(() => {
    if (!chatId || !notifications || !user) return;

    // Find unread notifications related to this chat
    const chatRelatedNotifications = notifications.filter(notification => {
      return !notification.isRead && 
             notification.type === 'NEW_MESSAGE' &&
             notification.actionUrl && 
             notification.actionUrl.includes(chatId);
    });

    // Mark each chat-related notification as read
    chatRelatedNotifications.forEach(notification => {
      dispatch(markNotificationAsRead(notification._id));
    });

    // Update unread count
    if (chatRelatedNotifications.length > 0) {
      dispatch(fetchUnreadCount());
    }
  }, [chatId, notifications, dispatch, user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleTyping = () => {
    if (!socket) return;

    socket.emit('typing', { chatId, userId: user._id, isTyping: true });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('typing', { chatId, userId: user._id, isTyping: false });
    }, 1000);
  };

  const handleSend = async () => {
    if (!input.trim() || sending || !user) return;
    
    const messageContent = input.trim();
    setInput('');
    setSending(true);

    try {
      await api.post(`/chat/${chatId}/message`, {
        content: messageContent
      });
      
      if (socket) {
        socket.emit('typing', { chatId, userId: user._id, isTyping: false });
      }
      
    } catch (err) {
      console.error('Error sending message:', err);
      const errorMessage = err.response?.data?.message || 'Failed to send message';
      alert(errorMessage);
      setInput(messageContent);
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    } else {
      handleTyping();
    }
  };

  const formatMessageTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!user) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Alert severity="warning">Please log in to access chat</Alert>
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
        <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>
        <Button onClick={() => navigate('/products')} variant="contained">
          Back to Products
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 2, height: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Chat Header */}
      <Paper elevation={3} sx={{ p: 2, mb: 2, borderRadius: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
              <ArrowBack />
            </IconButton>
            
            <Avatar sx={{ mr: 2, bgcolor: '#667eea' }}>
              {otherUser?.name?.charAt(0)?.toUpperCase() || 'U'}
            </Avatar>
            
            <Box>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {otherUser?.name || 'Unknown User'}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Circle sx={{ fontSize: 8, color: 'success.main', mr: 0.5 }} />
                <Typography variant="caption" color="text.secondary">
                  {isTyping ? 'Typing...' : 'Online'}
                </Typography>
              </Box>
            </Box>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {chatInfo?.product && (
              <Chip 
                label={`About: ${chatInfo.product.title}`} 
                size="small" 
                color="primary"
                onClick={() => navigate(`/product/${chatInfo.product._id}`)}
                sx={{ cursor: 'pointer' }}
              />
            )}
            <IconButton 
              onClick={() => setSoundEnabled(!soundEnabled)}
              color={soundEnabled ? "primary" : "default"}
              title={soundEnabled ? "Disable notifications" : "Enable notifications"}
            >
              {soundEnabled ? <VolumeUp /> : <VolumeOff />}
            </IconButton>
            <IconButton>
              <MoreVert />
            </IconButton>
          </Box>
        </Box>
      </Paper>

      {/* Messages Container */}
      <Paper 
        elevation={3} 
        sx={{ 
          flexGrow: 1, 
          p: 1, 
          borderRadius: 3,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0
        }}
      >
        <Box sx={{ 
          flexGrow: 1, 
          overflowY: 'auto', 
          maxHeight: '60vh',
          px: 1
        }}>
          {messages.length === 0 ? (
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '100%',
              flexDirection: 'column',
              color: 'text.secondary'
            }}>
              <Typography variant="h6" sx={{ mb: 1 }}>No messages yet</Typography>
              <Typography variant="body2">Start the conversation!</Typography>
            </Box>
          ) : (
            <List sx={{ py: 0 }}>
              {messages.map((message, index) => {
                const isMyMessage = message.senderId === user._id;
                const showAvatar = index === 0 || messages[index - 1].senderId !== message.senderId;
                
                return (
                  <ListItem
                    key={message._id || index}
                    sx={{
                      display: 'flex',
                      justifyContent: isMyMessage ? 'flex-end' : 'flex-start',
                      alignItems: 'flex-end',
                      px: 1,
                      py: 0.5
                    }}
                  >
                    {!isMyMessage && showAvatar && (
                      <Avatar sx={{ mr: 1, width: 32, height: 32, bgcolor: '#667eea' }}>
                        {otherUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                      </Avatar>
                    )}
                    
                    {!isMyMessage && !showAvatar && (
                      <Box sx={{ width: 40 }} />
                    )}
                    
                    <Box sx={{ 
                      maxWidth: '70%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: isMyMessage ? 'flex-end' : 'flex-start'
                    }}>
                      <Paper
                        elevation={1}
                        sx={{
                          p: 1.5,
                          borderRadius: 2,
                          background: isMyMessage 
                            ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                            : '#f8fafc',
                          color: isMyMessage ? 'white' : 'text.primary',
                          maxWidth: '100%',
                          wordBreak: 'break-word'
                        }}
                      >
                        <Typography variant="body2">
                          {message.content}
                        </Typography>
                      </Paper>
                      
                      <Typography 
                        variant="caption" 
                        color="text.secondary"
                        sx={{ mt: 0.5, px: 1 }}
                      >
                        {formatMessageTime(message.createdAt)}
                      </Typography>
                    </Box>
                  </ListItem>
                );
              })}
              
              {isTyping && (
                <ListItem sx={{ justifyContent: 'flex-start', px: 1 }}>
                  <Avatar sx={{ mr: 1, width: 32, height: 32, bgcolor: '#667eea' }}>
                    {otherUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                  </Avatar>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 1.5,
                      borderRadius: 2,
                      background: '#f8fafc',
                      color: 'text.secondary'
                    }}
                  >
                    <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                      Typing...
                    </Typography>
                  </Paper>
                </ListItem>
              )}
              
              <div ref={messagesEndRef} />
            </List>
          )}
        </Box>

        <Divider sx={{ my: 1 }} />

        {/* Message Input */}
        <Box sx={{ p: 1 }}>
          <Stack direction="row" spacing={1} alignItems="flex-end">
            <IconButton color="primary" size="small">
              <AttachFile />
            </IconButton>
            
            <TextField
              ref={inputRef}
              fullWidth
              multiline
              maxRows={3}
              size="small"
              placeholder="Type your message..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={sending}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: 3,
                }
              }}
            />
            
            <IconButton
              color="primary"
              onClick={handleSend}
              disabled={!input.trim() || sending}
              sx={{
                background: input.trim() ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : undefined,
                color: input.trim() ? 'white' : undefined,
                '&:hover': {
                  background: input.trim() ? 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)' : undefined,
                }
              }}
            >
              {sending ? <CircularProgress size={20} /> : <Send />}
            </IconButton>
          </Stack>
        </Box>
      </Paper>

      {/* In-app notification */}
      <Snackbar
        open={notification.open}
        autoHideDuration={4000}
        onClose={() => setNotification({ open: false, message: '' })}
        message={notification.message}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          '& .MuiSnackbarContent-root': {
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white'
          }
        }}
      />
    </Container>
  );
};

export default memo(Chat);
