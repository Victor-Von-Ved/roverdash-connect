import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { LogOut, Rocket } from "lucide-react";
import { Session } from "@supabase/supabase-js";
import StatsGrid from "@/components/dashboard/StatsGrid";
import CameraFeed from "@/components/dashboard/CameraFeed";
import VirtualJoystick from "@/components/dashboard/VirtualJoystick";
import LocationDisplay from "@/components/dashboard/LocationDisplay";
import ConnectionStatus from "@/components/dashboard/ConnectionStatus";
import EmergencyStop from "@/components/dashboard/EmergencyStop";
import { useTelemetry } from "@/hooks/useTelemetry";
import { useCommandChannel } from "@/hooks/useCommandChannel";
import { useConnectionHealth } from "@/hooks/useConnectionHealth";

const Dashboard = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const telemetry = useTelemetry();

  // Map new typed telemetry to existing component props
  const roverData = telemetry.data ? {
    speed: telemetry.data.mobility.speed,
    battery: telemetry.data.power.batteryPercentage,
    temperature: telemetry.data.environment.temperature,
    sensorReadings: {
      distance: telemetry.data.environment.signalQuality,
      altitude: telemetry.data.pose.heading,
    }
  } : {
    speed: 0,
    battery: 0,
    temperature: 0,
    sensorReadings: {
      distance: 0,
      altitude: 0,
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        navigate("/auth");
      } else {
        setSession(session);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      } else {
        setSession(session);
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  const commandChannel = useCommandChannel();
  const connectionHealth = useConnectionHealth(telemetry);

  const handleMovement = (direction: string) => {
    const validDirections = ['forward', 'backward', 'left', 'right'] as const;
    if (validDirections.includes(direction as any)) {
      commandChannel.sendDriveCommand(direction as any);
      toast.info(`Moving ${direction}`);
    }
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/10 p-4">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <header className="flex items-center justify-between pb-4 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg border border-primary/20">
              <Rocket className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">Rover Control</h1>
              <p className="text-sm text-muted-foreground">Mission Command Center</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ConnectionStatus 
              health={connectionHealth.health} 
              statusMessage={connectionHealth.statusMessage}
            />
            <EmergencyStop />
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleLogout}
              className="gap-2 border-border/50"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </header>

        {/* Stats Grid */}
        <StatsGrid data={roverData} />

        {/* Main Control Area */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Camera Feed */}
          <CameraFeed />
          
          {/* Controls */}
          <div className="space-y-6">
            <VirtualJoystick 
              onMove={handleMovement} 
              disabled={!connectionHealth.controlsAllowed}
            />
            <LocationDisplay />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
