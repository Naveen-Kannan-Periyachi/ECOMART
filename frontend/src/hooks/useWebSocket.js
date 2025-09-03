import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import webSocketService from '../utils/websocket.js';
import logger from '../utils/logger.js';

export const useWebSocket = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && user?._id) {
      // Connect to WebSocket when user is authenticated
      logger.log('Connecting to WebSocket for user:', user._id);
      webSocketService.connect(user._id);
    } else {
      // Disconnect when user logs out
      logger.log('Disconnecting from WebSocket');
      webSocketService.disconnect();
    }

    // Cleanup on unmount
    return () => {
      webSocketService.disconnect();
    };
  }, [isAuthenticated, user?._id]);

  return {
    socket: webSocketService.getSocket(),
    isConnected: webSocketService.getConnectionStatus(),
    joinChat: webSocketService.joinChat.bind(webSocketService),
    leaveChat: webSocketService.leaveChat.bind(webSocketService),
    sendMessage: webSocketService.sendMessage.bind(webSocketService),
    sendTyping: webSocketService.sendTyping.bind(webSocketService),
    onMessage: webSocketService.onMessage.bind(webSocketService),
    onTyping: webSocketService.onTyping.bind(webSocketService),
    offMessage: webSocketService.offMessage.bind(webSocketService),
    offTyping: webSocketService.offTyping.bind(webSocketService)
  };
};

export default useWebSocket;
