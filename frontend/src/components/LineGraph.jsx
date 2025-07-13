import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from "recharts";

const LineGraph = ({ data }) => (
  <div className="bg-white shadow rounded-lg p-6">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">📈 Book Activity (Uploads & Orders)</h3>
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
        <Line type="monotone" dataKey="uploads" stroke="#6366f1" strokeWidth={2} name="Uploads" />
        <Line type="monotone" dataKey="orders" stroke="#f59e0b" strokeWidth={2} name="Orders" />
        <CartesianGrid stroke="#ccc" strokeDasharray="5 5" />
        <XAxis dataKey="name" />
        <YAxis allowDecimals={false} />
        <Tooltip />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default LineGraph;
