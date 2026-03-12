import { useEffect, useCallback } from 'react';
import realtimeService from '../services/realtimeService';

export function useRealtime(channelName, eventName, callback, isPrivate = false) {
  useEffect(() => {
    if (!channelName || !eventName) return;

    const handleEvent = (data) => {
      callback(data);
    };

    // Subscribe to channel
    if (isPrivate) {
      realtimeService.subscribePrivate(channelName, handleEvent);
    } else {
      realtimeService.subscribe(channelName, handleEvent);
    }

    // Listen to specific event
    realtimeService.listen(channelName, eventName, handleEvent);

    // Cleanup
    return () => {
      realtimeService.unsubscribe(channelName, handleEvent);
    };
  }, [channelName, eventName, callback, isPrivate]);
}

export function useRealtimeMultiple(subscriptions) {
  useEffect(() => {
    const unsubscribers = subscriptions.map(({ channel, event, callback, isPrivate }) => {
      const handleEvent = (data) => callback(data);
      
      if (isPrivate) {
        realtimeService.subscribePrivate(channel, handleEvent);
      } else {
        realtimeService.subscribe(channel, handleEvent);
      }
      
      realtimeService.listen(channel, event, handleEvent);
      
      return () => realtimeService.unsubscribe(channel, handleEvent);
    });

    return () => unsubscribers.forEach(unsub => unsub());
  }, [subscriptions]);
}
