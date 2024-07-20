import { createContext, useContext, useState, useEffect } from "react";
import { collection, onSnapshot, deleteDoc, doc, addDoc } from "firebase/firestore"; 
import { db } from "../../firebase"; 

// Create context
const TasksContext = createContext();

// Custom hook to use the TasksContext
export const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) throw new Error("useTasks must be used within a TaskProvider");
  return context;
};

// TaskProvider component
export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  // Fetch tasks from Firestore on mount
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, "tasks"),
      (querySnapshot) => {
        const tasksData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTasks(tasksData);
      },
      (error) => {
        console.error("Error fetching tasks: ", error);
      }
    );
    return () => unsubscribe();
  }, []);

  // Create a new task in Firestore
  const createTask = async (title, description) => {
    try {
      const newTask = {
        title,
        description,
        createdAt: new Date() // Adding createdAt field for timestamp
      };
      await addDoc(collection(db, "tasks"), newTask); // Use addDoc to add to Firestore
    } catch (error) {
      console.error("Error creating task: ", error);
    }
  };

  // Update a task locally (assuming Firestore syncs automatically)
  const updateTask = (id, updatedFields) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === id ? { ...task, ...updatedFields } : task
      )
    );
    // For full sync, you may need to update Firestore directly as well
  };

  // Delete a task from Firestore
  const deleteTask = async (id) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };

  return (
    <TasksContext.Provider value={{ tasks, createTask, updateTask, deleteTask }}>
      {children}
    </TasksContext.Provider>
  );
};
