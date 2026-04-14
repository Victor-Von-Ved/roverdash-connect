/**
 * Telemetry Client Adapter
 * 
 * This interface defines the contract for telemetry sources.
 * Current implementation is a mock client for development.
 * Replace this with actual WebSocket implementation when backend gateway is available.
 * 
 * All implementation specific logic is isolated here so the useTelemetry hook
 * does not need to change when switching transport layers.
 */

import type { Telemetry, ConnectionState } from '@/types/rover';

export interface TelemetryClient {
  connect(): void;
  disconnect(): void;
  onTelemetry: ((data: Telemetry) => void) | null;
  onConnectionStateChange: ((state: ConnectionState) => void) | null;
  onError: ((error: string) => void) | null;
}

/**
 * Mock Telemetry Client - DEVELOPMENT ONLY
 * Simulates rover telemetry data for UI testing
 * Will be replaced with actual WebSocket client for field use
 */
export class MockTelemetryClient implements TelemetryClient {
  private intervalId: number | null = null;
  private connected = false;
  
  public onTelemetry: ((data: Telemetry) => void) | null = null;
  public onConnectionStateChange: ((state: ConnectionState) => void) | null = null;
  public onError: ((error: string) => void) | null = null;

  connect(): void {
    if (this.connected) return;
    
    this.onConnectionStateChange?.('connecting');
    
    // Simulate connection delay
    setTimeout(() => {
      this.connected = true;
      this.onConnectionStateChange?.('connected');
      this.startTelemetrySimulation();
    }, 1000);
  }

  disconnect(): void {
    this.stopTelemetrySimulation();
    this.connected = false;
    this.onConnectionStateChange?.('disconnected');
  }

  private startTelemetrySimulation(): void {
    if (this.intervalId) return;

    let baseBattery = 95;
    let baseTemperature = 28;

    this.intervalId = window.setInterval(() => {
      if (!this.connected) return;

      // Generate realistic simulated telemetry
      const telemetry: Telemetry = {
        power: {
          batteryPercentage: Math.max(0, baseBattery - Math.random() * 0.05),
          voltage: 12.4 + (Math.random() - 0.5) * 0.2,
          current: 2.2 + Math.random() * 0.8,
          warning: baseBattery < 20,
        },
        mobility: {
          speed: Math.random() * 0.8,
          driveState: 'idle',
          direction: 0,
          motorHealth: 98,
        },
        pose: {
          latitude: 51.5074 + (Math.random() - 0.5) * 0.0001,
          longitude: -0.1278 + (Math.random() - 0.5) * 0.0001,
          heading: Math.random() * 360,
          confidence: 95,
        },
        environment: {
          temperature: Math.min(50, baseTemperature + (Math.random() - 0.5) * 0.5),
          signalQuality: 85 + Math.random() * 15,
          cpuLoad: 15 + Math.random() * 20,
        },
        safety: {
          heartbeatAge: 0,
          eStopActive: false,
          mode: 'manual',
          subsystemAvailable: true,
        },
        video: {
          feedStatus: 'active',
          selectedCamera: 0,
          latency: 120 + Math.random() * 80,
        },
      };

      baseBattery = telemetry.power.batteryPercentage;
      baseTemperature = telemetry.environment.temperature;
      
      this.onTelemetry?.(telemetry);
    }, 1000);
  }

  private stopTelemetrySimulation(): void {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

// Export default client instance - replace with WebSocket implementation for production
export const telemetryClient: TelemetryClient = new MockTelemetryClient();