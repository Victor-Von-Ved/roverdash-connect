import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Square } from "lucide-react";

interface VirtualJoystickProps {
  onMove: (direction: string) => void;
}

const VirtualJoystick = ({ onMove }: VirtualJoystickProps) => {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg">Movement Controls</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
          <div></div>
          <Button
            size="lg"
            onClick={() => onMove("forward")}
            className="bg-primary hover:bg-primary-glow text-primary-foreground shadow-lg hover:shadow-[var(--shadow-glow)] transition-all"
          >
            <ArrowUp className="w-6 h-6" />
          </Button>
          <div></div>

          <Button
            size="lg"
            onClick={() => onMove("left")}
            className="bg-primary hover:bg-primary-glow text-primary-foreground shadow-lg hover:shadow-[var(--shadow-glow)] transition-all"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>
          <Button
            size="lg"
            onClick={() => onMove("stop")}
            variant="outline"
            className="border-destructive/50 text-destructive hover:bg-destructive hover:text-destructive-foreground"
          >
            <Square className="w-6 h-6" />
          </Button>
          <Button
            size="lg"
            onClick={() => onMove("right")}
            className="bg-primary hover:bg-primary-glow text-primary-foreground shadow-lg hover:shadow-[var(--shadow-glow)] transition-all"
          >
            <ArrowRight className="w-6 h-6" />
          </Button>

          <div></div>
          <Button
            size="lg"
            onClick={() => onMove("backward")}
            className="bg-primary hover:bg-primary-glow text-primary-foreground shadow-lg hover:shadow-[var(--shadow-glow)] transition-all"
          >
            <ArrowDown className="w-6 h-6" />
          </Button>
          <div></div>
        </div>
      </CardContent>
    </Card>
  );
};

export default VirtualJoystick;
