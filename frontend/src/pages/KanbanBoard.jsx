import { useEffect, useState } from "react";
import api from "../api";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default function KanbanBoard() {
  const [tasks, setTasks] = useState({
    pending: [],
    in_progress: [],
    completed: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks.php");
      const grouped = { pending: [], in_progress: [], completed: [] };
      res.data.forEach((t) => {
        if (grouped[t.status]) grouped[t.status].push(t);
        else grouped.pending.push(t); // fallback
      });
      setTasks(grouped);
    } catch (err) {
      console.error("Failed to load tasks", err);
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = async (result) => {
    if (!result.destination) return;
    const { source, destination } = result;
    const newTasks = { ...tasks };
    const [moved] = newTasks[source.droppableId].splice(source.index, 1);
    moved.status = destination.droppableId;
    newTasks[destination.droppableId].splice(destination.index, 0, moved);
    setTasks(newTasks);
    try {
      await api.put(`/tasks.php?id=${moved.id}`, { status: moved.status });
    } catch (err) {
      console.error("Failed to update task status", err);
      fetchTasks(); // revert on error
    }
  };

  const getColumnConfig = (status) => {
    const configs = {
      pending: {
        title: "📋 To Do",
        color: "bg-gray-50",
        borderColor: "border-gray-300",
        headerBg: "bg-gray-100",
        textColor: "text-gray-700",
      },
      in_progress: {
        title: "🚧 In Progress",
        color: "bg-blue-50",
        borderColor: "border-blue-300",
        headerBg: "bg-blue-100",
        textColor: "text-blue-700",
      },
      completed: {
        title: "✅ Completed",
        color: "bg-green-50",
        borderColor: "border-green-300",
        headerBg: "bg-green-100",
        textColor: "text-green-700",
      },
    };
    return configs[status] || configs.pending;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold mb-6 bg-gradient-to-r from-blue-700 to-indigo-600 bg-clip-text text-transparent">
        🎯 Kanban Board
      </h2>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(tasks).map(([status, items]) => {
            const config = getColumnConfig(status);
            return (
              <Droppable key={status} droppableId={status}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`rounded-xl shadow-md overflow-hidden transition-all ${config.color} ${snapshot.isDraggingOver ? "ring-2 ring-blue-400 scale-[1.02]" : ""}`}
                  >
                    {/* Column Header */}
                    <div
                      className={`${config.headerBg} px-4 py-3 border-b ${config.borderColor}`}
                    >
                      <h3
                        className={`font-bold text-lg ${config.textColor} flex items-center justify-between`}
                      >
                        {config.title}
                        <span className="bg-white rounded-full px-2 py-0.5 text-xs text-gray-600 shadow-sm">
                          {items.length}
                        </span>
                      </h3>
                    </div>

                    {/* Task List */}
                    <div className="p-3 space-y-3 min-h-[300px]">
                      {items.length === 0 ? (
                        <div className="text-center text-gray-400 py-8 text-sm">
                          No tasks
                        </div>
                      ) : (
                        items.map((item, idx) => (
                          <Draggable
                            key={item.id}
                            draggableId={String(item.id)}
                            index={idx}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`bg-white rounded-lg p-3 shadow-sm border border-gray-200 hover:shadow-md transition cursor-grab active:cursor-grabbing ${
                                  snapshot.isDragging
                                    ? "shadow-lg rotate-1"
                                    : ""
                                }`}
                              >
                                <h4 className="font-semibold text-gray-800 text-sm">
                                  {item.title}
                                </h4>
                                {item.description && (
                                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                    {item.description}
                                  </p>
                                )}
                                <div className="flex justify-between items-center mt-2">
                                  {item.due_date && (
                                    <span className="text-xs text-gray-400">
                                      📅{" "}
                                      {new Date(
                                        item.due_date,
                                      ).toLocaleDateString()}
                                    </span>
                                  )}
                                  <span className="text-xs text-gray-400">
                                    #{item.id}
                                  </span>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        ))
                      )}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}
