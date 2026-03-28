import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { User } from '../types';

const SOCKET_URL = 'http://localhost:4000';

export function useWebSockets(user: User | null) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [lastNotification, setLastNotification] = useState<{ type: string; data: any } | null>(null);

  useEffect(() => {
    if (!user?.id) return;

    // Connect with user ID room context
    const socketInstance = io(SOCKET_URL, {
      query: { userId: user.id },
      transports: ['websocket'],
    });

    socketInstance.on('connect', () => {
      console.log('WS: Connected to notification engine', socketInstance.id);
    });

    socketInstance.on('roadmap-completed', (data) => {
      console.log('WS: Roadmap Ready Notification Received', data);
      setLastNotification({ type: 'ROADMAP_READY', data });
      // You could trigger a toast or update local state here
    });

    socketInstance.on('roadmap-failed', (data) => {
      console.warn('WS: Roadmap Generation Failed', data);
      setLastNotification({ type: 'ROADMAP_FAILED', data });
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [user?.id]);

  return { socket, lastNotification };
}
