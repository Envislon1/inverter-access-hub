
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Battery, Gauge, Power, Zap, AlertTriangle } from "lucide-react";

interface ParameterProps {
  data: {
    battery_percentage?: number;
    battery_voltage?: number;
    output_capacity?: number;
    output_voltage?: number;
    output_power?: number;
    frequency?: number;
    power_factor?: number;
    mains_present?: boolean;
    solar_present?: boolean;
    energy_kwh?: number;
    apparent_power?: number;
    reactive_power?: number;
    real_power?: number;
    acv_rms?: number;
    acv_peak_peak?: number;
    acc_rms?: number;
    acc_peak_peak?: number;
  };
}

export const InverterParameters = ({ data }: ParameterProps) => {
  // Check for power surge (above 85% of capacity)
  const isPowerSurge = data.output_power && data.output_capacity 
    ? (data.output_power / data.output_capacity) > 0.85 
    : false;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="bg-black/40 border-orange-500/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">Battery Status</CardTitle>
          <Battery className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-white">{data.battery_percentage}%</p>
            <p className="text-xs text-gray-300">Voltage: {data.battery_voltage}V</p>
          </div>
        </CardContent>
      </Card>

      <Card className={`bg-black/40 border-${isPowerSurge ? 'red-500/50' : 'orange-500/20'}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">Output Parameters</CardTitle>
          {isPowerSurge ? 
            <AlertTriangle className="h-4 w-4 text-red-500 animate-pulse" /> : 
            <Power className="h-4 w-4 text-orange-500" />
          }
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-2xl font-bold text-white">{data.output_power}W</p>
              {isPowerSurge && 
                <span className="text-xs bg-red-500 text-white px-2 py-1 rounded-full">
                  Power Surge
                </span>
              }
            </div>
            <p className="text-xs text-gray-300">
              Capacity: {data.output_capacity}VA | Voltage: {data.output_voltage}V
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/40 border-orange-500/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">Power Quality</CardTitle>
          <Zap className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-white">{data.power_factor}</p>
            <p className="text-xs text-gray-300">
              Frequency: {data.frequency}Hz
            </p>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-black/40 border-orange-500/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-white">Energy</CardTitle>
          <Gauge className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-white">{data.energy_kwh} kWh</p>
            <p className="text-xs text-gray-300">
              Real Power: {data.real_power}W
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
