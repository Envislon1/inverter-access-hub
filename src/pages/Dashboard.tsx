
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AddInverterSystem } from "@/components/inverter/AddInverterSystem";
import { InverterParameters } from "@/components/inverter/InverterParameters";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const navigate = useNavigate();
  const [systems, setSystems] = useState<any[]>([]);
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/");
      }
    };
    
    checkUser();
    fetchInverterSystems();
  }, [navigate]);

  const fetchInverterSystems = async () => {
    try {
      const { data, error } = await supabase
        .from('inverter_systems')
        .select('*');
      
      if (error) throw error;
      setSystems(data || []);
      if (data?.length > 0 && !selectedSystem) {
        setSelectedSystem(data[0].id);
      }
    } catch (error: any) {
      console.error('Error fetching inverter systems:', error.message);
    }
  };

  const mockParameters = {
    battery_percentage: 85,
    battery_voltage: 24.5,
    output_capacity: 3000,
    output_voltage: 230,
    output_power: 2400,
    frequency: 50,
    power_factor: 0.95,
    mains_present: true,
    solar_present: true,
    energy_kwh: 12.5,
    apparent_power: 2500,
    reactive_power: 500,
    real_power: 2400,
    acv_rms: 230,
    acv_peak_peak: 325,
    acc_rms: 10.5,
    acc_peak_peak: 15
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-orange-500">Welcome to Technautic</h1>
          <Button 
            variant="outline" 
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-orange-500 border-orange-500 hover:bg-orange-500 hover:text-white"
          >
            {showAdvanced ? "Basic View" : "Advanced View"}
          </Button>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2">
            {systems.length > 0 ? (
              <div className="space-y-8">
                <div className="flex gap-4">
                  {systems.map((system) => (
                    <Button
                      key={system.id}
                      variant={selectedSystem === system.id ? "default" : "outline"}
                      onClick={() => setSelectedSystem(system.id)}
                      className="text-orange-500"
                    >
                      {system.name}
                    </Button>
                  ))}
                </div>
                <InverterParameters data={mockParameters} />
                {showAdvanced && (
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="p-4 bg-gray-800 rounded-lg">
                      <h3 className="font-semibold mb-2">Advanced Power Quality</h3>
                      <p>Apparent Power: {mockParameters.apparent_power} VA</p>
                      <p>Reactive Power: {mockParameters.reactive_power} VAR</p>
                      <p>ACV RMS: {mockParameters.acv_rms} V</p>
                      <p>ACV Peak-Peak: {mockParameters.acv_peak_peak} V</p>
                    </div>
                    <div className="p-4 bg-gray-800 rounded-lg">
                      <h3 className="font-semibold mb-2">Current Parameters</h3>
                      <p>ACC RMS: {mockParameters.acc_rms} A</p>
                      <p>ACC Peak-Peak: {mockParameters.acc_peak_peak} A</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-gray-400">No inverter systems found. Add one to get started!</p>
            )}
          </div>
          <div>
            <AddInverterSystem onSuccess={fetchInverterSystems} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
