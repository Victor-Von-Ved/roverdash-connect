import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Video } from "lucide-react";
import { useState } from "react";

const CameraFeed = () => {
  const [streamUrl, setStreamUrl] = useState("");

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Video className="w-5 h-5 text-primary" />
          Camera Feed
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="stream-url" className="text-sm text-muted-foreground">
            MJPEG Stream URL
          </Label>
          <Input
            id="stream-url"
            type="url"
            placeholder="http://your-rover-ip:port/stream"
            value={streamUrl}
            onChange={(e) => setStreamUrl(e.target.value)}
            className="bg-background/50 font-mono text-xs"
          />
        </div>
        
        <div className="aspect-video bg-background/80 rounded-lg border border-border/50 flex items-center justify-center overflow-hidden">
          {streamUrl ? (
            <img 
              src={streamUrl} 
              alt="Rover camera feed" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className="text-center space-y-2 p-8">
              <Video className="w-12 h-12 text-muted-foreground mx-auto opacity-50" />
              <p className="text-sm text-muted-foreground">
                Enter stream URL above to view live feed
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CameraFeed;
