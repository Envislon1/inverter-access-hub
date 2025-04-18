
import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Power } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface PowerSwitchProps {
  inverterId: string;
  initialState?: boolean;
}

export const PowerSwitch = ({ inverterId, initialState = false }: PowerSwitchProps) => {
  const [isOn, setIsOn] = useState(initialState);

  const handleToggle = (checked: boolean) => {
    setIsOn(checked);
    // In a real application, this would send a command to the actual inverter
    toast({
      title: checked ? "Inverter turned ON" : "Inverter turned OFF",
      description: `System ${inverterId} power state changed`,
    });
  };

  return (
    <div className="flex items-center justify-between p-4 bg-black/40 rounded-lg">
      <div className="flex items-center space-x-2">
        <Power className={`h-5 w-5 ${isOn ? "text-orange-500" : "text-gray-500"}`} />
        <Label htmlFor={`power-switch-${inverterId}`} className="text-white">
          {isOn ? "System Online" : "System Offline"}
        </Label>
      </div>
      <Switch
        id={`power-switch-${inverterId}`}
        checked={isOn}
        onCheckedChange={handleToggle}
        className="data-[state=checked]:bg-orange-500"
      />
    </div>
  );
};
