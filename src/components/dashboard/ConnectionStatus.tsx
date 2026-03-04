import { useState, useEffect } from "react";
import { Wifi, WifiOff } from "lucide-react";

const ConnectionStatus = () => {
  const [isConnected, setIsConnected] = useState(true);

  useEffect(() => {
    // Simulate connection status (replace with actual backend connection check)
    const interval = setInterval(() => {
      setIsConnected(Math.random() > 0.1); // 90% uptime simulation
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border/50 bg-card/50">
      {isConnected ? (
        <>
          <Wifi className="w-4 h-4 text-success" />
          <span className="text-xs font-medium text-success">Connected</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4 text-destructive" />
          <span className="text-xs font-medium text-destructive">Disconnected</span>
        </>
      )}
    </div>
  );
};

export default ConnectionStatus;
