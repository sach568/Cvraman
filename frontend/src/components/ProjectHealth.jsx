export default function ProjectHealth({ projects }) {
  const health = { green: 0, yellow: 0, red: 0 };
  projects.forEach((p) => {
    if (p.health) health[p.health]++;
    else health.green++;
  });
  return (
    <div className="space-y-2">
      <div className="flex justify-between">
        <span>🟢 On Track</span>
        <span className="font-bold">{health.green}</span>
      </div>
      <div className="flex justify-between">
        <span>🟡 Risk</span>
        <span className="font-bold">{health.yellow}</span>
      </div>
      <div className="flex justify-between">
        <span>🔴 Delayed</span>
        <span className="font-bold">{health.red}</span>
      </div>
    </div>
  );
}
