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

const Dashboard = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [roverData, setRoverData] = useState({
    speed: 0,
    battery: 100,
    temperature: 22,
    sensorReadings: {
      distance: 0,
      altitude: 0,
    }
  });

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

  useEffect(() => {
    // Simulate real-time data updates
    const interval = setInterval(() => {
      setRoverData(prev => ({
        speed: Math.max(0, prev.speed + (Math.random() - 0.5) * 5),
        battery: Math.max(0, Math.min(100, prev.battery - Math.random() * 0.1)),
        temperature: Math.max(15, Math.min(35, prev.temperature + (Math.random() - 0.5) * 2)),
        sensorReadings: {
          distance: Math.max(0, prev.sensorReadings.distance + (Math.random() - 0.5) * 10),
          altitude: Math.max(0, prev.sensorReadings.altitude + (Math.random() - 0.5) * 5),
        }
      }));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out successfully");
    navigate("/auth");
  };

  const handleMovement = (direction: string) => {
    toast.info(`Moving ${direction}`);
    // Here you would send the command to your Flask backend
    console.log(`Command sent: ${direction}`);
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
            <ConnectionStatus />
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
            <VirtualJoystick onMove={handleMovement} />
            <LocationDisplay />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
