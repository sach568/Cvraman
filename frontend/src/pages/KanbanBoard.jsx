import React, { useEffect, useState } from "react";
import { getTasks, updateTask } from "../api";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import toast from "react-hot-toast";

export default function KanbanBoard() {
  const [tasks, setTasks] = useState({
    pending: [],
    in_progress: [],
    completed: [],
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await getTasks("all");
    const grouped = { pending: [], in_progress: [], completed: [] };
    res.data.forEach((t) => {
      if (grouped[t.status]) grouped[t.status].push(t);
      else grouped.pending.push(t);
    });
    setTasks(grouped);
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const newTasks = { ...tasks };
    const [moved] = newTasks[source.droppableId].splice(source.index, 1);
    moved.status = destination.droppableId;
    newTasks[destination.droppableId].splice(destination.index, 0, moved);
    setTasks(newTasks);
    await updateTask(moved.id, { status: moved.status });
    toast.success(`Task moved to ${destination.droppableId.replace("_", " ")}`);
  };

  const columns = {
    pending: { title: "📋 To Do", color: "bg-gray-100" },
    in_progress: { title: "🚧 In Progress", color: "bg-blue-100" },
    completed: { title: "✅ Completed", color: "bg-green-100" },
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Object.entries(tasks).map(([status, items]) => (
          <Droppable key={status} droppableId={status}>
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                className={`${columns[status].color} rounded-xl p-4 min-h-[400px]`}
              >
                <h3 className="font-bold text-lg mb-3">
                  {columns[status].title} ({items.length})
                </h3>
                {items.map((item, idx) => (
                  <Draggable
                    key={item.id}
                    draggableId={String(item.id)}
                    index={idx}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="bg-white rounded-lg p-3 mb-2 shadow"
                      >
                        <h4 className="font-semibold">{item.title}</h4>
                        <p className="text-xs text-gray-500">
                          {item.project_title}
                        </p>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>
  );
}
