import { useEffect, useState } from "react";
import { getTasks } from "../api";

export default function GanttChart() {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    getTasks().then((res) => setTasks(res.data.slice(0, 5)));
  }, []);
  if (!tasks.length)
    return <p className="text-gray-400 text-center">No tasks yet</p>;
  return (
    <div className="space-y-2">
      {tasks.map((task) => (
        <div key={task.id}>
          <div className="text-sm font-medium">{task.title}</div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full"
              style={{
                width:
                  task.status === "completed"
                    ? "100%"
                    : task.status === "in_progress"
                      ? "50%"
                      : "10%",
              }}
            ></div>
          </div>
          <div className="text-xs text-gray-500">
            Due: {task.due_date || "No date"}
          </div>
        </div>
      ))}
    </div>
  );
}
