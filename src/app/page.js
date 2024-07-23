"use client";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase";
import { useTasks } from "../context/TasksContext";
import { TaskCard } from "../components/TaskCard";
import Auth from "../components/Auth";

function Page() {
  const { tasks } = useTasks(); // Assuming useTasks provides access to tasks
  const [user, setUser] = useState(null); // State to track authenticated user

  useEffect(() => {
    // Effect to listen to authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user); // Set user state if authenticated
      } else {
        setUser(null); // Reset user state if not authenticated
      }
    });

    return () => unsubscribe(); // Clean up function to unsubscribe from listener
  }, []); // Empty dependency array means this effect runs only once

  // Render Auth component if no user is authenticated
  if (!user) {
    return <Auth />;
  }

  // Render authenticated user view
  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => auth.signOut()} // Sign out button
        className="bg-red-500 hover:bg-red-400 px-5 py-2 text-gray-50 font-bold rounded-sm mt-5"
      >
        Sign Out
      </button>
      <div className="w-7/12">
        {/* Display tasks using TaskCard component */}
        {tasks.map((task) => (
          <TaskCard task={task} key={task.id} />
        ))}
      </div>
    </div>
  );
}

export default Page;
