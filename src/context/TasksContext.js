"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { collection, onSnapshot, deleteDoc, doc } from "firebase/firestore";
import { db } from "../../firebase";

const TasksContext = createContext();

export const useTasks = () => {
  const context = useContext(TasksContext);
  if (!context) throw new Error("useTasks must be used within a TaskProvider");
  return context;
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tasks"), (querySnapshot) => {
      const tasksData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setTasks(tasksData);
    });
    return () => unsubscribe();
  }, []);

  const createTask = (title, description) => {
    const newTask = {
      id: Date.now(),
      title,
      description,
    };
    setTasks([...tasks, newTask]);
  };

  const updateTask = (id, updatedFields) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, ...updatedFields } : task
    );
    setTasks(updatedTasks);
  };

  const deleteTask = async (id) => {
    await deleteDoc(doc(db, "tasks", id));
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  };

  return (
    <TasksContext.Provider value={{ tasks, createTask, updateTask, deleteTask }}>
      {children}
    </TasksContext.Provider>
  );
};
