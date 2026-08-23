"use client";

import { useEffect, useState } from "react";

export interface RealtimeKafkaEvent {
  event_id: string;
  event_type: string;
  consumer_group: string;
  patient_id?: string;
  facility_id?: number;
  timestamp: string;
  data: Record<string, any>;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 
  (typeof window !== "undefined" && window.location.hostname === "localhost" 
    ? "http://localhost:8000/api" 
    : "https://ai-chikitsalya-backend-6yl5.onrender.com/api");

export function useRealtimeEvents(onEvent?: (event: RealtimeKafkaEvent) => void) {
  const [latestEvent, setLatestEvent] = useState<RealtimeKafkaEvent | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    let eventSource: EventSource | null = null;

    try {
      const streamUrl = `${API_BASE}/realtime/stream`;
      eventSource = new EventSource(streamUrl);

      eventSource.onopen = () => {
        setIsConnected(true);
      };

      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.event_id && parsed.event_type) {
            const kafkaEvent = parsed as RealtimeKafkaEvent;
            setLatestEvent(kafkaEvent);
            if (onEvent) {
              onEvent(kafkaEvent);
            }
          }
        } catch (e) {
          // ignore heartbeat / ping messages
        }
      };

      eventSource.onerror = () => {
        setIsConnected(false);
      };
    } catch (err) {
      setIsConnected(false);
    }

    return () => {
      if (eventSource) {
        eventSource.close();
      }
    };
  }, [onEvent]);

  return { latestEvent, isConnected };
}
