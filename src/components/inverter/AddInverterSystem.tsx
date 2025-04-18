
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export const AddInverterSystem = ({ onSuccess }: { onSuccess: () => void }) => {
  const [systemId, setSystemId] = useState("");
  const [capacity, setCapacity] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const getUserId = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserId(session.user.id);
      }
    };
    
    getUserId();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!userId) {
      toast({
        title: "Error",
        description: "You must be logged in to add an inverter system",
        variant: "destructive",
      });
      return;
    }
    
    if (!systemId.trim()) {
      toast({
        title: "Error",
        description: "System ID is required",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);

    try {
      // Generate a name based on the first 8 characters of the ID
      const truncatedId = systemId.length > 8 ? systemId.substring(0, 8) : systemId;
      const name = `System ${truncatedId}`;
      
      const { error } = await supabase
        .from('inverter_systems')
        .insert({
          name,
          location: "Default Location",
          model: "Standard Model",
          user_id: userId,
          system_id: systemId,
          capacity: capacity ? parseInt(capacity) : 3000 // Default to 3000W if not specified
        });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Inverter system added successfully",
      });
      setSystemId("");
      setCapacity("");
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
    <Card className="bg-black/40 border-orange-500/20">
      <CardHeader>
        <CardTitle className="text-white">Add New Inverter System</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="systemId" className="text-sm text-gray-300">System ID</label>
            <Input
              id="systemId"
              placeholder="Enter the system ID provided by the company"
              value={systemId}
              onChange={(e) => setSystemId(e.target.value)}
              required
              className="bg-black/60 border-orange-500/30 text-white"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="capacity" className="text-sm text-gray-300">System Capacity (Watts)</label>
            <Input
              id="capacity"
              type="number"
              placeholder="e.g., 3000"
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
              className="bg-black/60 border-orange-500/30 text-white"
            />
          </div>
          <Button 
            type="submit" 
            disabled={isSubmitting || !userId} 
            className="w-full bg-orange-500 hover:bg-orange-600 text-white"
          >
            Add System
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
