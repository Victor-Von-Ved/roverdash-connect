/**
 * useConnectionHealth Hook
 * 
 * Simplified safety lockout logic.
 * Controls are ONLY disabled when telemetry is stale or disconnected.
 * Command status never locks controls.
 */

import { useMemo } from 'react';
import type { TelemetryState } from '@/types/rover';
import { STALE_THRESHOLD_MS } from '@/lib/constants';

export type SystemHealth = 'healthy' | 'stale' | 'disconnected';

export interface ConnectionHealthState {
  health: SystemHealth;
  telemetryFresh: boolean;
  controlsAllowed: boolean;
  lastTelemetryAge: number | null;
  statusMessage: string;
}

export function useConnectionHealth(telemetryState: TelemetryState): ConnectionHealthState {
  
  return useMemo(() => {
    const now = Date.now();
    const lastTelemetryAge = telemetryState.lastUpdateTimestamp 
      ? now - telemetryState.lastUpdateTimestamp 
      : null;

    const telemetryFresh = telemetryState.connectionState === 'connected' && !telemetryState.isStale;
    const controlsAllowed = telemetryFresh;

    let health: SystemHealth;
    let statusMessage: string;

    if (telemetryState.connectionState === 'disconnected') {
      health = 'disconnected';
      statusMessage = 'No connection to rover';
    } else if (telemetryState.isStale || (lastTelemetryAge && lastTelemetryAge > STALE_THRESHOLD_MS)) {
      health = 'stale';
      statusMessage = 'Telemetry stale - last update > 3s';
    } else {
      health = 'healthy';
      statusMessage = 'Connection healthy';
    }

    return {
      health,
      telemetryFresh,
      controlsAllowed,
      lastTelemetryAge,
      statusMessage,
    };
  }, [telemetryState]);
}