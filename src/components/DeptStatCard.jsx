export default function DeptStatCard({ label, value }) {
  return (
    <div className="bg-slate-800 p-6 rounded-xl shadow">
      <p className="text-slate-400">{label}</p>
      <h3 className="text-3xl font-bold mt-2">{value}</h3>
    </div>
  );
}
