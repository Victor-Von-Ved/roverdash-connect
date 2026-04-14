/**
 * useTelemetry Hook
 * 
 * React hook for managing rover telemetry state, connection lifecycle,
 * freshness detection and stale state marking.
 * 
 * Uses the telemetryClient adapter which can be replaced without modifying this hook.
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import type { Telemetry, TelemetryState, ConnectionState } from '@/types/rover';
import { STALE_THRESHOLD_MS, RECONNECT_DELAY_MS } from '@/lib/constants';
import { telemetryClient } from '@/lib/telemetryClient';

export function useTelemetry(): TelemetryState {
  const [state, setState] = useState<TelemetryState>({
    data: null,
    connectionState: 'disconnected',
    lastUpdateTimestamp: null,
    isStale: false,
    lastError: null,
  });

  const staleCheckInterval = useRef<number | null>(null);
  const reconnectTimeout = useRef<number | null>(null);

  const handleTelemetry = useCallback((data: Telemetry) => {
    setState(prev => ({
      ...prev,
      data,
      lastUpdateTimestamp: Date.now(),
      isStale: false,
      lastError: null,
    }));
  }, []);

  const handleConnectionStateChange = useCallback((connectionState: ConnectionState) => {
    setState(prev => ({
      ...prev,
      connectionState,
    }));

    if (connectionState === 'disconnected') {
      scheduleReconnect();
    }
  }, []);

  const handleError = useCallback((error: string) => {
    setState(prev => ({
      ...prev,
      lastError: error,
      connectionState: 'error',
    }));
    scheduleReconnect();
  }, []);

  const scheduleReconnect = useCallback(() => {
    if (reconnectTimeout.current) {
      window.clearTimeout(reconnectTimeout.current);
    }
    
    reconnectTimeout.current = window.setTimeout(() => {
      telemetryClient.connect();
    }, RECONNECT_DELAY_MS);
  }, []);

  // Stale state detection
  useEffect(() => {
    staleCheckInterval.current = window.setInterval(() => {
      setState(prev => {
        if (!prev.lastUpdateTimestamp) {
          return { ...prev, isStale: true };
        }

        const age = Date.now() - prev.lastUpdateTimestamp;
        const isStale = age > STALE_THRESHOLD_MS;

        // Update connection state to stale if threshold exceeded
        const connectionState = isStale && prev.connectionState === 'connected' 
          ? 'stale' 
          : prev.connectionState;

        return {
          ...prev,
          isStale,
          connectionState,
        };
      });
    }, 500);

    return () => {
      if (staleCheckInterval.current) {
        window.clearInterval(staleCheckInterval.current);
      }
    };
  }, []);

  // Client lifecycle management
  useEffect(() => {
    telemetryClient.onTelemetry = handleTelemetry;
    telemetryClient.onConnectionStateChange = handleConnectionStateChange;
    telemetryClient.onError = handleError;

    telemetryClient.connect();

    return () => {
      telemetryClient.disconnect();
      
      telemetryClient.onTelemetry = null;
      telemetryClient.onConnectionStateChange = null;
      telemetryClient.onError = null;

      if (reconnectTimeout.current) {
        window.clearTimeout(reconnectTimeout.current);
      }
      
      if (staleCheckInterval.current) {
        window.clearInterval(staleCheckInterval.current);
      }
    };
  }, [handleTelemetry, handleConnectionStateChange, handleError]);

  return state;
}