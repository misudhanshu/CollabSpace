import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DragDropProvider, useDraggable, useDroppable } from "@dnd-kit/react";

const DraggableTask = ({ task }) => {
  const { ref } = useDraggable({
    id: task._id,
  });

  return (
    <div
      ref={ref}
      className="bg-white text-slate-900 mt-3 p-4 rounded-xl cursor-grab active:cursor-grabbing hover:border-blue-400 border border-blue-100 transition-all shadow-2xs hover:shadow-md space-y-1.5"
    >
      <h1 className="font-semibold text-sm text-slate-900">{task.title}</h1>
      {task.duedate && (
        <div className="pt-1">
          <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-100 px-2 py-0.5 rounded-md inline-block">
            Due: {new Date(task.duedate).toLocaleDateString("en-GB").replaceAll("/", "-")}
          </span>
        </div>
      )}
    </div>
  );
};

const DroppableColumn = ({ col, tasks }) => {
  const { ref } = useDroppable({
    id: col.id,
  });

  const colTasks = tasks.filter((task) => {
    if (col.id === "done") {
      return task.status === "done" || task.status === "completed";
    }
    return task.status === col.id;
  });

  return (
    <div
      ref={ref}
      className="bg-blue-50/50 border border-blue-100/80 w-full p-3.5 rounded-2xl flex flex-col lg:w-72 lg:flex-shrink-0 lg:h-full lg:max-h-full lg:min-h-0 lg:overflow-hidden shadow-2xs"
    >
      <div className="flex items-center justify-between mx-1 mt-1 mb-2 flex-shrink-0">
        <h1 className="font-bold text-sm text-slate-800 tracking-tight">{col.title}</h1>
        <span className="text-xs font-bold text-blue-700 bg-white border border-blue-200 px-2.5 py-0.5 rounded-full shadow-2xs">
          {colTasks.length}
        </span>
      </div>
      <div className="rounded-xl px-1 pt-1 pb-4 overflow-y-auto max-h-72 lg:max-h-none lg:flex-1 lg:min-h-0 lg:pb-6">
        {colTasks.map((task) => (
          <DraggableTask key={task._id} task={task} />
        ))}
      </div>
    </div>
  );
};

const Board = () => {
  const { organizationId, workspaceId } = useParams();
  const [tasks, setTasks] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");

  const fetchTask = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/organizations/${organizationId}/workspace/${workspaceId}/tasks`,
        {
          credentials: "include",
        },
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        setErrorMessage(result.message || "Failed to fetch tasks");
        return;
      }

      setTasks(result.findAllTasks || []);
    } catch (error) {
      console.log(error);
      setErrorMessage("Network error fetching tasks");
    }
  };

  useEffect(() => {
    fetchTask();
  }, [organizationId, workspaceId]);

  const handleDragEnd = async (event) => {
    const { source, target } = event.operation;
    if (!target) return;

    const taskId = source.id;
    const targetStatus = target.id;

    // Optimistically update local state for fast feedback
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task._id === taskId ? { ...task, status: targetStatus } : task,
      ),
    );

    // Persist status change to backend/database
    try {
      const response = await fetch(
        `http://localhost:8000/organizations/${organizationId}/workspace/${workspaceId}/tasks/${taskId}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ status: targetStatus }),
        },
      );

      const result = await response.json();
      if (!response.ok || !result.success) {
        setErrorMessage(result.message || "Failed to update task status");
        fetchTask();
      }
    } catch (error) {
      console.log(error);
      setErrorMessage("Network error updating task status");
      fetchTask();
    }
  };

  const columns = [
    { id: "todo", title: "To Do" },
    { id: "in-progress", title: "In Progress" },
    { id: "in-review", title: "In Review" },
    { id: "done", title: "Done" },
  ];

  return (
    <DragDropProvider onDragEnd={handleDragEnd}>
      {errorMessage && (
        <div className="fixed top-5 right-5 z-50 rounded-lg bg-red-600 px-6 py-3 text-white shadow-lg flex items-center gap-3">
          <span>{errorMessage}</span>
          <button onClick={() => setErrorMessage("")} className="font-bold">×</button>
        </div>
      )}
      <div className="h-full p-4 text-slate-900 flex flex-col gap-4 overflow-y-auto lg:flex-row lg:overflow-x-auto lg:overflow-y-hidden lg:items-stretch">
        {columns.map((col) => (
          <DroppableColumn key={col.id} col={col} tasks={tasks} />
        ))}
      </div>
    </DragDropProvider>
  );
};

export default Board;
