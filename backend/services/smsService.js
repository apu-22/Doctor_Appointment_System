//  active connections
const clients = new Map();

const sseManager = {

  addClient(user_id, res) {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no'); 
    res.flushHeaders();

    res.write('data: {"type":"connected"}\n\n');

    clients.set(user_id, res);

    res.on('close', () => {
      clients.delete(user_id);
    });
  },

  sendToUser(user_id, notification) {
    const res = clients.get(user_id);
    if (res) {
      res.write(`data: ${JSON.stringify(notification)}\n\n`);
    }
  },

  isConnected(user_id) {
    return clients.has(user_id);
  }
};

module.exports = sseManager;