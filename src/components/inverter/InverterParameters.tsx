
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Battery, Gauge, Power, Zap } from "lucide-react";

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
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Battery Status</CardTitle>
          <Battery className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-2xl font-bold">{data.battery_percentage}%</p>
            <p className="text-xs text-muted-foreground">Voltage: {data.battery_voltage}V</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Output Parameters</CardTitle>
          <Power className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-2xl font-bold">{data.output_power}W</p>
            <p className="text-xs text-muted-foreground">
              Capacity: {data.output_capacity}VA | Voltage: {data.output_voltage}V
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Power Quality</CardTitle>
          <Zap className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-2xl font-bold">{data.power_factor}</p>
            <p className="text-xs text-muted-foreground">
              Frequency: {data.frequency}Hz
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Energy</CardTitle>
          <Gauge className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className="text-2xl font-bold">{data.energy_kwh} kWh</p>
            <p className="text-xs text-muted-foreground">
              Real Power: {data.real_power}W
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
