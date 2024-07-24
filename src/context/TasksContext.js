"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { collection, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from "firebase/firestore";
import { db, auth } from "../../firebase"; 
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "react-hot-toast";

export const TaskContext = createContext();

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks must be used within a provider");
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    });

    const unsubscribeTasks = onSnapshot(collection(db, "tasks"), (querySnapshot) => {
      const tasksData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTasks(tasksData);
    });

    return () => {
      unsubscribeAuth();
      unsubscribeTasks();
    };
  }, []);

  const createTask = async (title, description) => {
    if (!user) {
      toast.error("You must be logged in to create a task.");
      return;
    }

    try {
      const newTask = { title, description };
      const docRef = await addDoc(collection(db, "tasks"), newTask);
      setTasks([...tasks, { ...newTask, id: docRef.id }]);
      toast.success("Task created successfully");
    } catch (error) {
      console.error("Error adding task: ", error);
      toast.error("Error adding task.");
    }
  };

  const deleteTask = async (id) => {
    if (!user) {
      toast.error("You must be logged in to delete a task.");
      return;
    }

    try {
      await deleteDoc(doc(db, "tasks", id));
      setTasks(tasks.filter((task) => task.id !== id));
      toast.success("Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task: ", error);
      toast.error("Error deleting task.");
    }
  };

  const updateTask = async (id, newData) => {
    if (!user) {
      toast.error("You must be logged in to update a task.");
      return;
    }

    try {
      await updateDoc(doc(db, "tasks", id), newData);
      setTasks(tasks.map((task) => (task.id === id ? { ...task, ...newData } : task)));
      toast.success("Task updated successfully");
    } catch (error) {
      console.error("Error updating task: ", error);
      toast.error("Error updating task.");
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, createTask, deleteTask, updateTask }}>
      {children}
    </TaskContext.Provider>
  );
};
