import echo from './echo';

class RealtimeService {
  constructor() {
    this.channels = {};
    this.listeners = {};
  }

  // Subscribe to a channel
  subscribe(channelName, callback) {
    if (!this.channels[channelName]) {
      this.channels[channelName] = echo.channel(channelName);
    }
    
    if (!this.listeners[channelName]) {
      this.listeners[channelName] = [];
    }
    
    this.listeners[channelName].push(callback);
    return () => this.unsubscribe(channelName, callback);
  }

  // Subscribe to private channel
  subscribePrivate(channelName, callback) {
    if (!this.channels[channelName]) {
      this.channels[channelName] = echo.private(channelName);
    }
    
    if (!this.listeners[channelName]) {
      this.listeners[channelName] = [];
    }
    
    this.listeners[channelName].push(callback);
    return () => this.unsubscribe(channelName, callback);
  }

  // Listen to events on a channel
  listen(channelName, eventName, callback) {
    const channel = this.channels[channelName];
    if (channel) {
      channel.listen(eventName, callback);
    }
  }

  // Unsubscribe from channel
  unsubscribe(channelName, callback) {
    if (this.listeners[channelName]) {
      this.listeners[channelName] = this.listeners[channelName].filter(
        cb => cb !== callback
      );
    }
    
    if (this.listeners[channelName]?.length === 0) {
      echo.leaveChannel(channelName);
      delete this.channels[channelName];
      delete this.listeners[channelName];
    }
  }

  // Broadcast event (for testing)
  broadcast(channelName, eventName, data) {
    if (this.listeners[channelName]) {
      this.listeners[channelName].forEach(callback => {
        callback({ event: eventName, data });
      });
    }
  }

  // Leave all channels
  leaveAll() {
    Object.keys(this.channels).forEach(channelName => {
      echo.leaveChannel(channelName);
    });
    this.channels = {};
    this.listeners = {};
  }
}

export default new RealtimeService();
