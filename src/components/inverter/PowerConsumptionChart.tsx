
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  ReferenceLine
} from "recharts";

// Generate demo data for the chart
const generateHourlyData = (capacity: number) => {
  const hours = Array.from({ length: 24 }, (_, i) => i);
  return hours.map(hour => {
    // Create a power surge around 7-8PM for demonstration
    const baseline = Math.random() * 0.5 * capacity; // 0-50% of capacity as baseline
    const isPeak = hour >= 18 && hour <= 21; 
    const power = isPeak 
      ? baseline + (Math.random() * 0.5 * capacity) // Potentially 50-100% of capacity during peak
      : baseline;
    
    return {
      hour: `${hour}:00`,
      power: Math.round(power),
      surgeThreshold: Math.round(capacity * 0.85)
    };
  });
};

interface PowerConsumptionChartProps {
  systemCapacity: number;
}

export const PowerConsumptionChart = ({ systemCapacity }: PowerConsumptionChartProps) => {
  const data = generateHourlyData(systemCapacity);
  const maxValue = systemCapacity * 1.1; // 110% of capacity for chart upper bound

  const chartConfig = {
    power: {
      label: "Power",
      theme: {
        light: "#F97316", // Orange
        dark: "#F97316",
      },
    },
    surgeThreshold: {
      label: "Surge Threshold (85%)",
      theme: {
        light: "#EF4444", // Red
        dark: "#EF4444",
      },
    },
  };

  return (
    <div className="w-full h-80 p-4 bg-black/40 rounded-lg border border-orange-500/20">
      <h3 className="text-lg font-semibold text-white mb-4">Power Consumption (24h)</h3>
      <ChartContainer 
        config={chartConfig} 
        className="h-64"
      >
        <AreaChart
          data={data}
          margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis 
            dataKey="hour" 
            stroke="#999" 
            tickFormatter={(value) => value.split(':')[0]} 
          />
          <YAxis 
            stroke="#999" 
            domain={[0, maxValue]} 
            tickFormatter={(value) => `${value}W`} 
          />
          <ChartTooltip 
            content={
              <ChartTooltipContent 
                formatter={(value, name) => [`${value}W`, name === "surgeThreshold" ? "Surge Threshold" : "Power"]}
              />
            } 
          />
          <defs>
            <linearGradient id="powerGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F97316" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#F97316" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          <ReferenceLine 
            y={systemCapacity * 0.85} 
            stroke="#EF4444" 
            strokeDasharray="3 3" 
            label={{ value: "Surge Threshold", position: "insideBottomRight", fill: "#EF4444" }} 
          />
          <Area 
            type="monotone" 
            dataKey="power" 
            stroke="#F97316" 
            fillOpacity={1}
            fill="url(#powerGradient)" 
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
};
