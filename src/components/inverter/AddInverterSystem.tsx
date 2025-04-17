
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const AddInverterSystem = ({ onSuccess }: { onSuccess: () => void }) => {
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [model, setModel] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('inverter_systems')
        .insert([{ name, location, model }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Inverter system added successfully",
      });
      setName("");
      setLocation("");
      setModel("");
      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add New Inverter System</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            placeholder="System Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <Input
            placeholder="Location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
          />
          <Input
            placeholder="Model"
            value={model}
            onChange={(e) => setModel(e.target.value)}
          />
          <Button type="submit" disabled={isSubmitting} className="w-full">
            Add System
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
