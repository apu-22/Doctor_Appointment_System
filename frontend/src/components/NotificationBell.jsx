import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../hooks/useNotifications';

const TYPE_STYLE = {
  appointment: { icon: '🗓️', color: '#3b82f6' },
  alert:       { icon: '⚠️', color: '#ef4444' },
  reminder:    { icon: '⏰', color: '#f59e0b' },
  system:      { icon: '🔔', color: '#8b5cf6' },
};

const timeAgo = (dateStr) => {
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 1000);
  if (diff < 60)    return 'just now';
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
};

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { notifications, unreadCount, loading, markAsRead, markAllRead, clearAll } = useNotifications();
  const navigate    = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleClick = async (notification) => {
    if (!notification.is_read) await markAsRead(notification.id);
    if (notification.link)     navigate(notification.link);
    setOpen(false);
  };

  // Read/unread এর default ও hover background
  const getDefaultBg  = (is_read) => is_read ? '#f9f9f9' : 'rgba(59,130,246,0.10)';
  const getHoverBg    = (is_read) => is_read ? '#f0f0f0' : 'rgba(59,130,246,0.18)';

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>

      {/* Bell button */}
      <button
        onClick={() => setOpen(prev => !prev)}
        style={{
          position: 'relative',
          background: open ? '#f0f0f0' : 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '8px',
          borderRadius: '8px',
          fontSize: '22px',
          lineHeight: 1,
          color: 'var(--color-text-primary)',
          transition: 'background 0.15s'
        }}
        aria-label="Notifications"
      >
        🔔
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '2px',
            right: '2px',
            background: '#ef4444',
            color: '#fff',
            fontSize: '11px',
            fontWeight: 500,
            borderRadius: '10px',
            minWidth: '18px',
            height: '18px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '0 4px',
            lineHeight: 1
          }}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div style={{
          position: 'absolute',
          top: '110%',
          right: 0,
          width: '360px',
          background: '#ffffff',
          border: '1px solid #e5e7eb',
          borderRadius: '12px',
          boxShadow: '0 8px 32px rgba(0,0,0,0.14)',
          zIndex: 1000,
          overflow: 'hidden'
        }}>

          {/* Header */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '14px 16px',
            borderBottom: '1px solid #e5e7eb',
            background: '#f8f9fa'
          }}>
            <span style={{ fontWeight: 500, fontSize: '15px', color: '#111827' }}>
              Notifications {unreadCount > 0 && <span style={{ color: '#3b82f6' }}>({unreadCount})</span>}
            </span>
            <div style={{ display: 'flex', gap: '12px' }}>
              {unreadCount > 0 && (
                <button onClick={markAllRead} style={btnStyle}>
                  Mark all read
                </button>
              )}
              {notifications.length > 0 && (
                <button onClick={clearAll} style={{ ...btnStyle, color: '#ef4444' }}>
                  Clear all
                </button>
              )}
            </div>
          </div>

          {/* List */}
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {loading && (
              <p style={{ textAlign: 'center', padding: '24px', color: '#6b7280', fontSize: '14px' }}>
                Loading...
              </p>
            )}
            {!loading && notifications.length === 0 && (
              <p style={{ textAlign: 'center', padding: '32px', color: '#6b7280', fontSize: '14px' }}>
                No notifications yet
              </p>
            )}
            {notifications.map(n => {
              const typeStyle = TYPE_STYLE[n.type] || TYPE_STYLE.system;
              return (
                <div
                  key={n.id}
                  onClick={() => handleClick(n)}
                  style={{
                    display: 'flex',
                    gap: '12px',
                    padding: '12px 16px',
                    cursor: n.link ? 'pointer' : 'default',
                    background: getDefaultBg(n.is_read),
                    borderBottom: '1px solid #e5e7eb',
                    transition: 'background 0.15s'
                  }}
                  onMouseEnter={e => e.currentTarget.style.background = getHoverBg(n.is_read)}
                  onMouseLeave={e => e.currentTarget.style.background = getDefaultBg(n.is_read)}
                >
                  {/* Icon */}
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: typeStyle.color + '22',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                    flexShrink: 0
                  }}>
                    {typeStyle.icon}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '8px' }}>
                      <p style={{
                        margin: 0,
                        fontSize: '13px',
                        fontWeight: n.is_read ? 400 : 600,
                        color: '#111827',
                        lineHeight: 1.4
                      }}>
                        {n.title}
                      </p>
                      {!n.is_read && (
                        <span style={{
                          width: '8px',
                          height: '8px',
                          borderRadius: '50%',
                          background: '#3b82f6',
                          flexShrink: 0,
                          marginTop: '4px'
                        }}/>
                      )}
                    </div>
                    <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#6b7280', lineHeight: 1.4 }}>
                      {n.message}
                    </p>
                    <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#9ca3af' }}>
                      {timeAgo(n.created_at)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

const btnStyle = {
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  fontSize: '12px',
  color: '#6b7280',
  padding: '2px 4px',
  borderRadius: '4px'
};