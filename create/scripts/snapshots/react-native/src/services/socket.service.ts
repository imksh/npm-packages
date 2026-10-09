import { io, Socket } from 'socket.io-client';
import { get } from '../utils/storage';
import Constants from 'expo-constants';

let socket: Socket | null = null;

// Set your backend socket URL
const SOCKET_URL = Constants.expoConfig?.extra?.apiUrl || 'http://localhost:3000';

export const initializeSocket = async () => {
  if (socket) return;
  const token = await get('token');
  if (!token) return;

  socket = io(SOCKET_URL, {
    auth: { token },
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    console.log('Connected to socket server');
  });

  socket.on('disconnect', () => {
    console.log('Disconnected from socket server');
  });
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
