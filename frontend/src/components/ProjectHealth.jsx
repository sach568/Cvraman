export default function ProjectHealth({ projects }) {
  const healthCount = { green: 0, yellow: 0, red: 0 };
  projects.forEach((p) => {
    healthCount[p.health] = (healthCount[p.health] || 0) + 1;
  });

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span>🟢 On Track</span>
        <span className="font-bold">{healthCount.green || 0}</span>
      </div>
      <div className="flex items-center justify-between">
        <span>🟡 Risk</span>
        <span className="font-bold">{healthCount.yellow || 0}</span>
      </div>
      <div className="flex items-center justify-between">
        <span>🔴 Delayed</span>
        <span className="font-bold">{healthCount.red || 0}</span>
      </div>
      <div className="mt-4 pt-3 border-t">
        <p className="text-sm text-gray-500">
          Based on overdue tasks, workload, and progress %
        </p>
      </div>
    </div>
  );
}
