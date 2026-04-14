/**
 * Rover telemetry data structures
 * Follows PRD specification v1 requirements
 */

export interface Telemetry {
  power: {
    batteryPercentage: number;
    voltage: number;
    current: number;
    warning: boolean;
  };
  mobility: {
    speed: number;
    driveState: 'idle' | 'forward' | 'reverse' | 'turning' | 'stopped';
    direction: number;
    motorHealth: number;
  };
  pose: {
    latitude: number;
    longitude: number;
    heading: number;
    confidence: number;
  };
  environment: {
    temperature: number;
    signalQuality: number;
    cpuLoad: number;
  };
  safety: {
    heartbeatAge: number;
    eStopActive: boolean;
    mode: 'manual' | 'autonomous' | 'safe';
    subsystemAvailable: boolean;
  };
  video: {
    feedStatus: 'active' | 'disconnected' | 'degraded' | 'loading';
    selectedCamera: number;
    latency: number;
  };
}

export type ConnectionState = 
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'stale'
  | 'error';

export interface TelemetryState {
  data: Telemetry | null;
  connectionState: ConnectionState;
  lastUpdateTimestamp: number | null;
  isStale: boolean;
  lastError: string | null;
}

export interface FreshnessThresholds {
  staleThresholdMs: number;
  criticalThresholdMs: number;
}

/**
 * Command and Control Types
 */

export type CommandType = 
  | 'drive_forward'
  | 'drive_backward'
  | 'turn_left'
  | 'turn_right'
  | 'stop'
  | 'set_mode'
  | 'estop_activate'
  | 'estop_reset'
  | 'select_camera';

export type CommandStatus = 
  | 'pending'
  | 'acknowledged'
  | 'success'
  | 'failed'
  | 'timeout';

export interface Command {
  id: string;
  type: CommandType;
  payload?: Record<string, any>;
  timestamp: number;
}

export interface CommandState {
  lastCommand: Command | null;
  status: CommandStatus;
  error: string | null;
  pending: boolean;
}

export interface CommandClient {
  send(command: Omit<Command, 'id' | 'timestamp'>): Promise<CommandStatus>;
  onCommandStatus: ((commandId: string, status: CommandStatus) => void) | null;
  connect(): void;
  disconnect(): void;
}
