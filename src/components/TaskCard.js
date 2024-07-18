"use client";
import { useRouter } from "next/navigation";
import { useTasks } from "../context/TasksContext";
import { toast } from "react-hot-toast";

export const TaskCard = ({ task }) => {
  const router = useRouter();
  const { deleteTask } = useTasks();

  return (
    <div
      className="bg-gray-700 hover:bg-gray-600 cursor-pointer px-20 py-5 m-2"
      onClick={() => router.push(`/edit/${task.id}`)}
    >
      <div className="flex justify-between">
        <div>
          <h1 className="text-2xl font-bold">{task.title}</h1>
          <p className="text-gray-300">{task.description}</p>
          <span className="text-gray-400">{task.id}</span>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (window.confirm("Are you sure?")) {
              deleteTask(task.id);
              toast.success("Task deleted successfully");
            }
          }}
          className="bg-red-700 hover:bg-red-600 text-sm px-3 py-1 rounded-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
};
