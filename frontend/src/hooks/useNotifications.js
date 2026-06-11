import { useState, useEffect, useCallback } from 'react';
import axiosInstance from '../api/axios';

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount]     = useState(0);
  const [loading, setLoading]             = useState(true);

  // Initial fetch
  const fetchNotifications = useCallback(async () => {
    try {
      const res = await axiosInstance.get('/notifications');
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    } catch (err) {
      console.error('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  }, []);

  // SSE — real-time push listen করো
  useEffect(() => {
    fetchNotifications();

    const token = localStorage.getItem('token');
    if (!token) return;

    // SSE connection খোলো
    const eventSource = new EventSource(
      `${import.meta.env.VITE_API_URL}/api/notifications/stream?token=${token}`
    );

    eventSource.onmessage = (e) => {
      const payload = JSON.parse(e.data);
      if (payload.type === 'new_notification') {
        // নতুন notification list এর উপরে যোগ করো
        setNotifications(prev => [payload.data, ...prev]);
        setUnreadCount(prev => prev + 1);
      }
    };

    eventSource.onerror = () => {
      // Connection হারালে চুপ থাকো — browser auto-reconnect করে
      eventSource.close();
    };

    return () => eventSource.close(); // Component unmount হলে বন্ধ করো
  }, [fetchNotifications]);

  // Mark one as read
  const markAsRead = async (id) => {
    await axiosInstance.patch(`/notifications/${id}/read`);
    setNotifications(prev =>
      prev.map(n => n.id === id ? { ...n, is_read: 1 } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  // Mark all as read
  const markAllRead = async () => {
    await axiosInstance.patch('/notifications/read-all');
    setNotifications(prev => prev.map(n => ({ ...n, is_read: 1 })));
    setUnreadCount(0);
  };

  // Clear all
  const clearAll = async () => {
    await axiosInstance.delete('/notifications/clear');
    setNotifications([]);
    setUnreadCount(0);
  };

  return { notifications, unreadCount, loading, markAsRead, markAllRead, clearAll };
};