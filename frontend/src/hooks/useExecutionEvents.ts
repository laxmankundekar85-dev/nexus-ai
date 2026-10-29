import { notificationService } from '../services/notificationService';
import { useEffect, useRef, useState, useCallback } from 'react';
import { createEventSource } from '../services/api';
import type { ExecutionEvent } from '../types';

interface UseExecutionEventsOptions {
  onEvent?: (event: ExecutionEvent) => void;
  onError?: (error: Event) => void;
}

export function useExecutionEvents(
  executionId: string | undefined | null,
  options: UseExecutionEventsOptions = {}
) {
  const [events, setEvents] = useState<ExecutionEvent[]>([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const esRef = useRef<EventSource | null>(null);
  const { onEvent, onError } = options;

  const clearEvents = useCallback(() => setEvents([]), []);

  useEffect(() => {
    if (!executionId) return;

    // Clean up previous connection
    if (esRef.current) {
      esRef.current.close();
    }

    setEvents([]);
    setError(null);

    try {
      const es = createEventSource(executionId);
      esRef.current = es;

      es.onopen = () => {
        setConnected(true);
        setError(null);
      };

      es.onmessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data) as ExecutionEvent;
          setEvents((prev) => [...prev, data]);
          onEvent?.(data);
        } catch {
          // Ignore parse errors for heartbeat messages
        }
      };

      es.onerror = (err: Event) => {
        setConnected(false);
        setError('Connection lost. Reconnecting...');
        onError?.(err);
      };

      // Listen for specific event types
      [
        'status_changed',
        'task_started',
        'task_completed',
        'task_failed',
        'plan_created',
        'approval_resolved',
      ].forEach((type) => {
        es.addEventListener(type, (event: MessageEvent) => {
          try {
            const data = JSON.parse(event.data) as ExecutionEvent;
            setEvents((prev) => [...prev, data]);
            onEvent?.(data);

            if (type === 'task_completed') {
              notificationService.notifyTaskCompleted(
                (data.payload as any)?.title || 'Task Step Finished',
                (data.payload as any)?.agent_role || 'Agent'
              );
            } else if (type === 'status_changed' && (data.payload as any)?.status === 'completed') {
              notificationService.notifyMissionCompleted(
                (data.payload as any)?.objective || 'Autonomous Intelligence Mission'
              );
            }
          } catch {
            // ignore
          }
        });
      });
    } catch {
      setError('Failed to connect to event stream');
    }

    return () => {
      if (esRef.current) {
        esRef.current.close();
        esRef.current = null;
        setConnected(false);
      }
    };
  }, [executionId, onEvent, onError]);

  return { events, connected, error, clearEvents };
}
