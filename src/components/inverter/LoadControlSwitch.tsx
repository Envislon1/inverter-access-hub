
import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useIsMobile } from "@/hooks/use-mobile";

interface LoadControlSwitchProps {
  name: string;
  inverterId: string;
  onChange?: (state: boolean) => void;
}

export const LoadControlSwitch = ({ name, inverterId, onChange }: LoadControlSwitchProps) => {
  const [isOn, setIsOn] = useState(false);
  const isMobile = useIsMobile();

  const handleToggle = (checked: boolean) => {
    setIsOn(checked);
    onChange?.(checked);
    // In a real application, this would send a command to the actual inverter
    toast({
      title: checked ? `${name} turned ON` : `${name} turned OFF`,
      description: `Load control switch state changed to ${checked ? '1' : '0'}`,
    });
  };

  return (
    <div className="flex items-center justify-between p-2 sm:p-3 bg-black/20 rounded-lg">
      <Label 
        htmlFor={`load-switch-${inverterId}-${name}`} 
        className="text-white text-xs sm:text-sm mr-2"
      >
        {name}
      </Label>
      <Switch
        id={`load-switch-${inverterId}-${name}`}
        checked={isOn}
        onCheckedChange={handleToggle}
        className="data-[state=checked]:bg-orange-500"
      />
    </div>
  );
};
