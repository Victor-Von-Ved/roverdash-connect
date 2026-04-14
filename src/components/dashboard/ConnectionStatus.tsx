import { Wifi, WifiOff, AlertTriangle } from "lucide-react";

interface ConnectionStatusProps {
  health: 'healthy' | 'stale' | 'disconnected';
  statusMessage: string;
}

const ConnectionStatus = ({ health, statusMessage }: ConnectionStatusProps) => {

  if (health === 'healthy') {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/50 bg-card/50">
        <Wifi className="w-4 h-4 text-success" />
        <span className="text-xs font-medium text-success">{statusMessage}</span>
      </div>
    );
  }

  if (health === 'stale') {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-amber-500/50 bg-amber-500/10">
        <AlertTriangle className="w-4 h-4 text-amber-500" />
        <span className="text-xs font-medium text-amber-500">{statusMessage}</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-destructive/50 bg-destructive/10">
      <WifiOff className="w-4 h-4 text-destructive" />
      <span className="text-xs font-medium text-destructive">{statusMessage}</span>
    </div>
  );
};

export default ConnectionStatus;
