/**
 * Command Client Adapter
 * 
 * Interface for rover command transport.
 * Current implementation is mock client for UI development.
 * Replace this with actual WebSocket/HTTP implementation when backend is available.
 */

import type { Command, CommandStatus, CommandClient } from '@/types/rover';

export class MockCommandClient implements CommandClient {
  private connected = false;
  private commandLog: Command[] = [];
  
  public onCommandStatus: ((commandId: string, status: CommandStatus) => void) | null = null;

  connect(): void {
    this.connected = true;
  }

  disconnect(): void {
    this.connected = false;
  }

  async send(command: Omit<Command, 'id' | 'timestamp'>): Promise<CommandStatus> {
    if (!this.connected) {
      return 'failed';
    }

    const commandId = crypto.randomUUID();
    const fullCommand: Command = {
      ...command,
      id: commandId,
      timestamp: Date.now(),
    };

    this.commandLog.push(fullCommand);
    console.log(`📤 Command sent: ${command.type}`, fullCommand);

    // Simulate network latency and command lifecycle
    setTimeout(() => this.onCommandStatus?.(commandId, 'acknowledged'), 100);
    setTimeout(() => this.onCommandStatus?.(commandId, 'success'), 300);

    return 'pending';
  }

  getCommandHistory(): Command[] {
    return [...this.commandLog];
  }
}

export const commandClient: CommandClient = new MockCommandClient();