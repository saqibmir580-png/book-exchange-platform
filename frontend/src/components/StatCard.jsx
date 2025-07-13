const StatCard = ({ label, value, icon, bg }) => (
  <div className={`rounded-xl shadow bg-white p-5 flex items-center justify-between hover:scale-[1.02] transition`}>
    <div>
      <div className="text-sm text-gray-500">{label}</div>
      <div className="text-xl font-semibold text-gray-900">{value}</div>
    </div>
    <div className={`p-3 rounded-full ${bg}`}>{icon}</div>
  </div>
);

export default StatCard;
