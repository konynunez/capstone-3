"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { useTasks } from "../context/TasksContext";
import { TaskCard } from "../components/TaskCard";
import Auth from "../components/Auth";

function Page() {
  const { tasks } = useTasks();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => auth.signOut()}
        className="bg-red-500 hover:bg-red-400 px-5 py-2 text-gray-50 font-bold rounded-sm mt-5"
      >
        Sign Out
      </button>
      <div className="w-7/12">
        {tasks.map((task) => (
          <TaskCard task={task} key={task.id} />
        ))}
      </div>
    </div>
  );
}

export default Page;
