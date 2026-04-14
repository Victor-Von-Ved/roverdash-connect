/**
 * WebSocket Client Adapter
 * 
 * Real backend transport implementation.
 * Implements same interfaces as mock clients for zero impact on hooks/UI.
 */

import type { Telemetry, Command, CommandStatus, TelemetryClient, CommandClient } from '@/types/rover';

export class RoverGatewayWebsocketClient implements TelemetryClient, CommandClient {
  private ws: WebSocket | null = null;
  private reconnectAttempts = 0;
  private connected = false;

  public onTelemetry: ((data: Telemetry) => void) | null = null;
  public onConnectionStateChange: ((state: any) => void) | null = null;
  public onCommandStatus: ((commandId: string, status: CommandStatus) => void) | null = null;
  public onError: ((error: string) => void) | null = null;

  constructor(private readonly gatewayUrl: string) {}

  connect(): void {
    if (this.connected || this.ws) return;

    this.onConnectionStateChange?.('connecting');

    try {
      this.ws = new WebSocket(this.gatewayUrl);

      this.ws.onopen = () => {
        this.connected = true;
        this.reconnectAttempts = 0;
        this.onConnectionStateChange?.('connected');
      };

      this.ws.onmessage = (event) => {
        try {
          const message = JSON.parse(event.data);
          
          if (message.type === 'telemetry') {
            this.onTelemetry?.(message.payload);
          } else if (message.type === 'command_status') {
            this.onCommandStatus?.(message.commandId, message.status);
          }
        } catch (error) {
          console.error('Invalid gateway message:', error);
        }
      };

      this.ws.onclose = () => {
        this.connected = false;
        this.ws = null;
        this.onConnectionStateChange?.('disconnected');
        this.scheduleReconnect();
      };

      this.ws.onerror = () => {
        this.onError?.('Connection error');
      };

    } catch (error) {
      this.onConnectionStateChange?.('error');
      this.scheduleReconnect();
    }
  }

  disconnect(): void {
    this.reconnectAttempts = 0;
    this.connected = false;
    
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  async send(command: Omit<Command, 'id' | 'timestamp'>): Promise<CommandStatus> {
    if (!this.connected || !this.ws) {
      return 'failed';
    }

    const commandId = crypto.randomUUID();
    const fullCommand: Command = {
      ...command,
      id: commandId,
      timestamp: Date.now(),
    };

    this.ws.send(JSON.stringify({
      type: 'command',
      payload: fullCommand,
    }));

    return 'pending';
  }

  private scheduleReconnect(): void {
    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 15000);
    this.reconnectAttempts++;
    
    setTimeout(() => {
      if (!this.connected) {
        this.connect();
      }
    }, delay);
  }
}

// Initialize gateway client - use environment variable for production
const GATEWAY_URL = import.meta.env.VITE_GATEWAY_WS_URL || 'ws://localhost:8080/gateway';

export const roverGatewayClient = new RoverGatewayWebsocketClient(GATEWAY_URL);