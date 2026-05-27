import { useEffect, useRef } from 'react';

type UseSSEProps<T> = {
  roomId: string;
  onMessage: (data: T) => void;
};

export default function useSSE<T>({
  roomId,
  onMessage,
}: UseSSEProps<T>) {
  const onMessageRef = useRef(onMessage);
  const eventSourceRef = useRef<EventSource | null>(null);

  useEffect(() => {
    onMessageRef.current = onMessage;
  }, [onMessage]);

  useEffect(() => {
    if (!roomId) return;

    const eventSource = new EventSource(
      `http://localhost:3000/simulation/userstream/${roomId}`
    );

    eventSourceRef.current = eventSource;

    eventSource.onopen = () => {
      console.log('SSE connected');
    };

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        onMessageRef.current(data);
      } catch (error) {
        console.error('Failed to parse SSE message:', error);
      }
    };

    eventSource.onerror = (error) => {
      console.error('SSE error:', error);
    };

    return () => {
      eventSourceRef.current?.close();
      eventSourceRef.current = null;
    };
  }, [roomId]);
}