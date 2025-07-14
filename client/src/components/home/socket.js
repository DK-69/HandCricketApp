import { io } from 'socket.io-client';

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  withCredentials: true,
  autoConnect: true,
  reconnection: true,
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

socket.on('connect', () => {
  console.log('✅ Connected to socket.io:', socket.id);
});

socket.on('disconnect', () => {
  console.log('❌ Disconnected from socket.io');
});

export default socket;