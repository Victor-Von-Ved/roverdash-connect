import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin } from "lucide-react";
import { useEffect, useState } from "react";

const LocationDisplay = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Simulate position updates from accelerometer/motion data
    const interval = setInterval(() => {
      setPosition(prev => ({
        x: Math.max(-100, Math.min(100, prev.x + (Math.random() - 0.5) * 10)),
        y: Math.max(-100, Math.min(100, prev.y + (Math.random() - 0.5) * 10))
      }));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="w-5 h-5 text-primary" />
          Position
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-square bg-background/80 rounded-lg border border-border/50 overflow-hidden">
          {/* Grid pattern */}
          <div className="absolute inset-0" style={{
            backgroundImage: `
              linear-gradient(hsl(var(--border)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--border)) 1px, transparent 1px)
            `,
            backgroundSize: '20px 20px'
          }} />
          
          {/* Center cross */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-px bg-primary/20" />
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="h-full w-px bg-primary/20" />
          </div>

          {/* Rover position indicator */}
          <div 
            className="absolute w-4 h-4 bg-primary rounded-full shadow-[var(--shadow-glow)] transition-all duration-500"
            style={{
              left: `calc(50% + ${position.x}px - 8px)`,
              top: `calc(50% + ${position.y}px - 8px)`,
            }}
          >
            <div className="absolute inset-0 bg-primary rounded-full animate-ping opacity-75" />
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm font-mono">
          <div className="text-center">
            <div className="text-muted-foreground">X Position</div>
            <div className="text-lg font-bold text-foreground">{position.x.toFixed(1)}m</div>
          </div>
          <div className="text-center">
            <div className="text-muted-foreground">Y Position</div>
            <div className="text-lg font-bold text-foreground">{position.y.toFixed(1)}m</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationDisplay;
