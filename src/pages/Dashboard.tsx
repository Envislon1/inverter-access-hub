import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { AddInverterSystem } from "@/components/inverter/AddInverterSystem";
import { InverterParameters } from "@/components/inverter/InverterParameters";
import { PowerSwitch } from "@/components/inverter/PowerSwitch";
import { PowerConsumptionChart } from "@/components/inverter/PowerConsumptionChart";
import { DeleteInverterSystem } from "@/components/inverter/DeleteInverterSystem";
import { Button } from "@/components/ui/button";
import { LoadControlPanel } from "@/components/inverter/LoadControlPanel";
import { useIsMobile } from "@/hooks/use-mobile";

interface InverterSystem {
  id: string;
  name: string;
  location: string;
  model: string;
  system_id?: string;
  capacity?: number;
  created_at: string;
  updated_at: string;
  user_id: string;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const [systems, setSystems] = useState<InverterSystem[]>([]);
  const [selectedSystem, setSelectedSystem] = useState<string | null>(null);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/");
      } else {
        setUserId(session.user.id);
      }
    };
    
    checkUser();
  }, [navigate]);

  useEffect(() => {
    if (userId) {
      fetchInverterSystems();
    }
  }, [userId]);

  const fetchInverterSystems = async () => {
    try {
      const { data, error } = await supabase
        .from('inverter_systems')
        .select('*')
        .eq('user_id', userId);
      
      if (error) throw error;
      setSystems(data || []);
      if (data?.length > 0 && !selectedSystem) {
        setSelectedSystem(data[0].id);
      }
    } catch (error: any) {
      console.error('Error fetching inverter systems:', error.message);
    }
  };

  const getSystemParameters = (systemId: string) => {
    const seed = systemId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const random = (min: number, max: number) => {
      const x = Math.sin(seed + systems.findIndex(s => s.id === systemId)) * 10000;
      return min + (Math.abs(x) % (max - min));
    };

    const selectedSystem = systems.find(s => s.id === systemId);
    const capacity = selectedSystem?.capacity || 3000;
    
    return {
      battery_percentage: Math.round(random(20, 100)),
      battery_voltage: parseFloat(random(22.1, 28.7).toFixed(1)),
      output_capacity: capacity,
      output_voltage: parseFloat(random(219, 241).toFixed(1)),
      output_power: Math.round(random(capacity * 0.3, capacity * 0.95)),
      frequency: parseFloat(random(49.5, 50.5).toFixed(1)),
      power_factor: parseFloat(random(0.8, 0.99).toFixed(2)),
      mains_present: random(0, 10) > 3,
      solar_present: random(0, 10) > 5,
      energy_kwh: parseFloat(random(5, 30).toFixed(1)),
      apparent_power: Math.round(random(1800, 2600)),
      reactive_power: Math.round(random(200, 700)),
      real_power: Math.round(random(1500, 2500)),
      acv_rms: parseFloat(random(220, 240).toFixed(1)),
      acv_peak_peak: Math.round(random(310, 340)),
      acc_rms: parseFloat(random(8, 15).toFixed(1)),
      acc_peak_peak: parseFloat(random(12, 20).toFixed(1))
    };
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const parameters = selectedSystem ? getSystemParameters(selectedSystem) : null;
  const selectedSystemData = systems.find(system => system.id === selectedSystem);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white p-2 sm:p-6">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-4">
          <h1 className="text-xl sm:text-3xl font-bold text-orange-500">Welcome to Technautic</h1>
          <div className="flex flex-wrap gap-2 sm:gap-4">
            <Button 
              variant="outline" 
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="text-orange-500 border-orange-500 hover:bg-orange-500 hover:text-white text-xs sm:text-sm"
              size={isMobile ? "sm" : "default"}
            >
              {showAdvanced ? "Basic View" : "Advanced View"}
            </Button>
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="text-red-500 border-red-500 hover:bg-red-500 hover:text-white text-xs sm:text-sm"
              size={isMobile ? "sm" : "default"}
            >
              Sign Out
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-8">
          <div className="md:col-span-2">
            {systems.length > 0 ? (
              <div className="space-y-4 sm:space-y-8">
                <div className="flex flex-wrap gap-2 sm:gap-4 items-center">
                  {systems.map((system) => (
                    <div key={system.id} className="flex items-center gap-1 sm:gap-2">
                      <Button
                        variant={selectedSystem === system.id ? "default" : "outline"}
                        onClick={() => setSelectedSystem(system.id)}
                        className={`${selectedSystem === system.id 
                          ? "bg-orange-500 hover:bg-orange-600 text-white" 
                          : "border-orange-500/30 text-orange-500 hover:bg-orange-500/20"
                        } text-xs sm:text-sm`}
                        size={isMobile ? "sm" : "default"}
                      >
                        {system.name}
                      </Button>
                      <DeleteInverterSystem 
                        inverterId={system.id} 
                        inverterName={system.name}
                        onDelete={fetchInverterSystems}
                      />
                    </div>
                  ))}
                </div>
                
                {selectedSystem && parameters && (
                  <>
                    <PowerSwitch 
                      inverterId={selectedSystem} 
                      initialState={true}
                    />
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold text-white mb-2">Load Control</h3>
                      <LoadControlPanel inverterId={selectedSystem} />
                    </div>
                    <InverterParameters data={parameters} showAdvanced={showAdvanced} />
                    
                    {showAdvanced && (
                      <div className="space-y-4 sm:space-y-8 mt-4 sm:mt-8">
                        <PowerConsumptionChart 
                          systemCapacity={parameters.output_capacity || 3000} 
                        />
                        
                        <div className="grid gap-4 md:grid-cols-2">
                          <div className="p-3 sm:p-4 bg-black/40 border border-orange-500/20 rounded-lg">
                            <h3 className="font-semibold mb-2 text-white text-sm sm:text-base">Advanced Power Quality</h3>
                            <p className="text-gray-300 text-xs sm:text-sm">Apparent Power: {parameters.apparent_power} VA</p>
                            <p className="text-gray-300 text-xs sm:text-sm">Reactive Power: {parameters.reactive_power} VAR</p>
                            <p className="text-gray-300 text-xs sm:text-sm">ACV RMS: {parameters.acv_rms} V</p>
                            <p className="text-gray-300 text-xs sm:text-sm">ACV Peak-Peak: {parameters.acv_peak_peak} V</p>
                          </div>
                          <div className="p-3 sm:p-4 bg-black/40 border border-orange-500/20 rounded-lg">
                            <h3 className="font-semibold mb-2 text-white text-sm sm:text-base">Current Parameters</h3>
                            <p className="text-gray-300 text-xs sm:text-sm">ACC RMS: {parameters.acc_rms} A</p>
                            <p className="text-gray-300 text-xs sm:text-sm">ACC Peak-Peak: {parameters.acc_peak_peak} A</p>
                            {selectedSystemData?.system_id && (
                              <p className="text-gray-300 mt-2 text-xs sm:text-sm">System ID: <span className="text-xs font-mono bg-black/60 p-1 rounded">{selectedSystemData.system_id}</span></p>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-4 sm:p-8 bg-black/40 border border-orange-500/20 rounded-lg">
                <p className="text-gray-300 mb-4 text-sm sm:text-base">No inverter systems found. Add one to get started!</p>
                <div className="w-full max-w-xs sm:w-64">
                  <AddInverterSystem onSuccess={fetchInverterSystems} />
                </div>
              </div>
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
