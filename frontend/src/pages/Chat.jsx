// ...existing code...
import { useEffect, useState, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Typography, Paper, TextField, Button, List, ListItem, ListItemText, Avatar } from '@mui/material';

// Dummy chat logic for negotiation (replace with real socket/chat API)
const mockMessages = [
  { sender: 'seller', text: 'Hi! How can I help you?' },
];

const Chat = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const [messages, setMessages] = useState(mockMessages);
  const [input, setInput] = useState('');
  const chatRef = useRef(null);

  // Parse seller and product from query params
  const params = new URLSearchParams(location.search);
  const sellerId = params.get('seller');
  const productId = params.get('product');

  useEffect(() => {
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: user?.name || 'You', text: input }]);
    setInput('');
  };

  return (
    <Box maxWidth="sm" mx="auto" mt={4}>
  <Paper elevation={3} sx={{ p: 2, background: 'linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)', boxShadow: '0 4px 24px 0 rgba(31,38,135,0.12)', borderRadius: 3, animation: 'fadeIn 0.8s' }}>
        <Typography variant="h6" gutterBottom>
          Negotiation Chat
        </Typography>
        <Typography variant="body2" color="text.secondary" gutterBottom>
          Product ID: {productId} | Seller ID: {sellerId}
        </Typography>
  <Box ref={chatRef} sx={{ maxHeight: 300, overflowY: 'auto', mb: 2, border: '1px solid #eee', borderRadius: 2, p: 1, background: 'rgba(255,255,255,0.85)', animation: 'fadeIn 0.8s' }}>
          <List>
            {messages.map((msg, idx) => (
              <ListItem key={idx} alignItems={msg.sender === (user?.name || 'You') ? 'right' : 'left'}>
                <Avatar sx={{ mr: 1 }}>{msg.sender[0]}</Avatar>
                <ListItemText
                  primary={msg.text}
                  secondary={msg.sender}
                  sx={{ textAlign: msg.sender === (user?.name || 'You') ? 'right' : 'left' }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            size="small"
            placeholder="Type your message..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
          />
          <Button variant="contained" onClick={handleSend} disabled={!input.trim()} sx={{
            background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
            color: '#fff',
            fontWeight: 600,
            borderRadius: 2,
            boxShadow: '0 2px 8px rgba(102,126,234,0.15)',
            transition: 'background 0.3s, transform 0.2s',
            '&:hover': {
              background: 'linear-gradient(90deg, #764ba2 0%, #667eea 100%)',
              transform: 'scale(1.05)',
            },
          }}>
            Send
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default Chat;
