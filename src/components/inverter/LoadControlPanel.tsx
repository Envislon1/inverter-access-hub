
import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { LoadControlSwitch } from "./LoadControlSwitch";

interface LoadControlPanelProps {
  inverterId: string;
}

export const LoadControlPanel = ({ inverterId }: LoadControlPanelProps) => {
  const [switches, setSwitches] = useState<string[]>([]);
  const [newSwitchName, setNewSwitchName] = useState("");

  const handleAddSwitch = () => {
    if (!newSwitchName.trim()) return;
    setSwitches([...switches, newSwitchName.trim()]);
    setNewSwitchName("");
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Input
          value={newSwitchName}
          onChange={(e) => setNewSwitchName(e.target.value)}
          placeholder="Enter switch name"
          className="bg-black/20 border-orange-500/20 text-white placeholder:text-gray-400"
        />
        <Button
          onClick={handleAddSwitch}
          variant="outline"
          className="border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid gap-2">
        {switches.map((name) => (
          <LoadControlSwitch
            key={name}
            name={name}
            inverterId={inverterId}
          />
        ))}
      </div>
    </div>
  );
};
