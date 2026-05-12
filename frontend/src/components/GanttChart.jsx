import { useEffect, useState } from "react";
import api from "../api";

export default function GanttChart() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    api.get("/gantt.php").then((res) => setTasks(res.data));
  }, []);

  // Simple visual bar chart (expandable with a library like frappe-gantt)
  const minDate = new Date(Math.min(...tasks.map((t) => new Date(t.due_date))));
  const maxDate = new Date(Math.max(...tasks.map((t) => new Date(t.due_date))));
  const totalDays = (maxDate - minDate) / (1000 * 3600 * 24);

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[600px]">
        {tasks.map((task) => {
          const start = new Date(task.created_at);
          const end = new Date(task.due_date);
          const left =
            ((start - minDate) / (1000 * 3600 * 24) / totalDays) * 100;
          const width = ((end - start) / (1000 * 3600 * 24) / totalDays) * 100;
          return (
            <div key={task.id} className="relative h-10 my-2 border-b">
              <div className="absolute text-xs top-0 left-0 w-32">
                {task.title}
              </div>
              <div
                className="absolute h-6 rounded bg-blue-500 text-white text-xs pl-1"
                style={{ left: `${left}%`, width: `${width}%`, top: "4px" }}
              >
                {task.status}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
