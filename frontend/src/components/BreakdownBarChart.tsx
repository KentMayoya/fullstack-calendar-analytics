import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ChartData {
  name: string;
  minutes: number;
}

interface BreakdownBarChartProps {
  data: ChartData[];
}

const BreakdownBarChart = ({ data }: BreakdownBarChartProps) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="minutes" fill="#8884d8" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default BreakdownBarChart;
