

function StatsCard({ icon: Icon, label, value, color }) {
  return (
    <div className="flex items-center gap-4 bg-white rounded-xl shadow-sm px-5 py-4 hover:shadow-md transition">
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-xl font-semibold text-gray-900">{value}</p>
      </div>
    </div>
  );
}
export default StatsCard;