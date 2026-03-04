import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Battery, Gauge, Thermometer, Radar } from "lucide-react";

interface StatsGridProps {
  data: {
    speed: number;
    battery: number;
    temperature: number;
    sensorReadings: {
      distance: number;
      altitude: number;
    };
  };
}

const StatsGrid = ({ data }: StatsGridProps) => {
  const stats = [
    {
      title: "Speed",
      value: `${data.speed.toFixed(1)} m/s`,
      icon: Gauge,
      color: "text-primary"
    },
    {
      title: "Battery",
      value: `${data.battery.toFixed(1)}%`,
      icon: Battery,
      color: data.battery > 50 ? "text-success" : data.battery > 20 ? "text-warning" : "text-destructive"
    },
    {
      title: "Temperature",
      value: `${data.temperature.toFixed(1)}°C`,
      icon: Thermometer,
      color: data.temperature < 30 ? "text-success" : "text-warning"
    },
    {
      title: "Distance",
      value: `${data.sensorReadings.distance.toFixed(1)} m`,
      icon: Radar,
      color: "text-primary"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon;
        return (
          <Card key={stat.title} className="border-border/50 bg-card/50 backdrop-blur shadow-lg hover:shadow-xl transition-all">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Icon className={`w-4 h-4 ${stat.color}`} />
                {stat.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground font-mono">{stat.value}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default StatsGrid;
