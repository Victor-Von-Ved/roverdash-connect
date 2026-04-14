/**
 * Emergency Stop Control
 * 
 * Always visible safety control.
 * Currently mock implementation for UI testing.
 */

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { OctagonX } from 'lucide-react';
import { toast } from 'sonner';

interface EmergencyStopProps {
  onStateChange?: (engaged: boolean) => void;
}

const EmergencyStop = ({ onStateChange }: EmergencyStopProps) => {
  const [eStopEngaged, setEStopEngaged] = useState(false);

  const handleEmergencyStop = () => {
    if (!eStopEngaged) {
      setEStopEngaged(true);
      toast.error('⚠️ MOCK E-STOP ONLY - NO HARDWARE STOP', {
        duration: Infinity,
        position: 'top-center',
      });
      toast.warning('This is a UI demo only. Rover will continue moving.', {
        duration: 10000,
      });
      onStateChange?.(true);
    }
  };

  const handleReset = () => {
    setEStopEngaged(false);
    toast.success('Emergency stop cleared');
    onStateChange?.(false);
  };

  if (eStopEngaged) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-destructive text-destructive-foreground animate-pulse">
          <OctagonX className="w-5 h-5" />
          <span className="text-sm font-bold">E-STOP ENGAGED</span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleReset}
          className="border-destructive/50"
        >
          Reset
        </Button>
      </div>
    );
  }

  return (
    <Button
      variant="destructive"
      size="sm"
      onClick={handleEmergencyStop}
      className="gap-2 shadow-[0_0_12px_rgba(239,68,68,0.4)] hover:shadow-[0_0_20px_rgba(239,68,68,0.6)]"
    >
      <OctagonX className="w-4 h-4" />
      E-STOP
    </Button>
  );
};

export default EmergencyStop;