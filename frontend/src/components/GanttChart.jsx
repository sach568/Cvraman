import { useEffect, useState } from "react";
import { getGanttData } from "../api";

export default function GanttChart() {
  const [tasks, setTasks] = useState([]);
  useEffect(() => {
    getGanttData().then((res) => setTasks(res.data));
  }, []);
  if (!tasks.length)
    return <p className="text-gray-400 text-center">No tasks yet</p>;
  return (
    <div className="space-y-2">
      {tasks.slice(0, 5).map((task) => (
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
