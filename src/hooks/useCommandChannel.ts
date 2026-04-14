/**
 * useCommandChannel Hook
 * 
 * React hook for rover command and control operations.
 * Manages command lifecycle, status tracking, and error handling.
 * Uses commandClient adapter which can be replaced without modifying this hook.
 */

import { useState, useCallback, useEffect, useRef } from 'react';
import type { CommandType, CommandState, CommandStatus } from '@/types/rover';
import { commandClient } from '@/lib/commandClient';

export function useCommandChannel(): CommandState & {
  sendDriveCommand: (direction: 'forward' | 'backward' | 'left' | 'right') => Promise<void>;
  sendStop: () => Promise<void>;
  sendModeChange: (mode: 'manual' | 'autonomous' | 'safe') => Promise<void>;
  sendEmergencyStop: () => Promise<void>;
} {
  const [state, setState] = useState<CommandState>({
    lastCommand: null,
    status: 'success',
    error: null,
    pending: false,
  });

  const pendingCommands = useRef<Map<string, string>>(new Map());

  const handleCommandStatus = useCallback((commandId: string, status: CommandStatus) => {
    setState(prev => ({
      ...prev,
      status,
      pending: status === 'pending' || status === 'acknowledged',
    }));
  }, []);

  const sendCommand = useCallback(async (type: CommandType, payload?: Record<string, any>) => {
    setState(prev => ({
      ...prev,
      pending: true,
      status: 'pending',
      error: null,
    }));

    try {
      const status = await commandClient.send({ type, payload });
      
      setState(prev => ({
        ...prev,
        lastCommand: {
          id: '', // Will be updated when status callback arrives
          type,
          payload,
          timestamp: Date.now(),
        },
        status,
        pending: status === 'pending',
      }));
    } catch (error) {
      setState(prev => ({
        ...prev,
        status: 'failed',
        error: error instanceof Error ? error.message : 'Command failed',
        pending: false,
      }));
    }
  }, []);

  const sendDriveCommand = useCallback((direction: 'forward' | 'backward' | 'left' | 'right') => {
    const commandType = `drive_${direction}` as CommandType;
    return sendCommand(commandType);
  }, [sendCommand]);

  const sendStop = useCallback(() => {
    return sendCommand('stop');
  }, [sendCommand]);

  const sendModeChange = useCallback((mode: 'manual' | 'autonomous' | 'safe') => {
    return sendCommand('set_mode', { mode });
  }, [sendCommand]);

  const sendEmergencyStop = useCallback(() => {
    return sendCommand('estop_activate');
  }, [sendCommand]);

  useEffect(() => {
    commandClient.onCommandStatus = handleCommandStatus;
    commandClient.connect();

    return () => {
      commandClient.disconnect();
      commandClient.onCommandStatus = null;
    };
  }, [handleCommandStatus]);

  return {
    ...state,
    sendDriveCommand,
    sendStop,
    sendModeChange,
    sendEmergencyStop,
  };
}