import { useEffect } from 'react';

type UseSSEProps<T> = {
  roomId: string;
  onMessage: (data: T) => void;
};

export default function useSSE<T>({ roomId, onMessage }: UseSSEProps<T>) {
  useEffect(() => {
    const eventSource = new EventSource(
      `http://localhost:3000/simulation/userstream/${roomId}`
    );

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);

      onMessage(data);
    };

    eventSource.onerror = (err) => {
      console.error('SSE error', err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, [onMessage, roomId]);
}