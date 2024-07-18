"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { db } from "../../firebase";
import { collection, getDocs, addDoc, deleteDoc, doc, updateDoc, onSnapshot } from "firebase/firestore";

export const TaskContext = createContext();

export const useTasks = () => {
  const context = useContext(TaskContext);
  if (!context) throw new Error("useTasks must be used within a provider");
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

  const createTask = async (title, description) => {
    try {
      const newTask = { title, description };
      const docRef = await addDoc(collection(db, "tasks"), newTask);
      setTasks([...tasks, { ...newTask, id: docRef.id }]);
    } catch (error) {
      console.error("Error adding task: ", error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await deleteDoc(doc(db, "tasks", id));
      setTasks(tasks.filter((task) => task.id !== id));
    } catch (error) {
      console.error("Error deleting task: ", error);
    }
  };

  const updateTask = async (id, newData) => {
    try {
      await updateDoc(doc(db, "tasks", id), newData);
      setTasks(tasks.map((task) => (task.id === id ? { ...task, ...newData } : task)));
    } catch (error) {
      console.error("Error updating task: ", error);
    }
  };

  return (
    <TaskContext.Provider value={{ tasks, createTask, deleteTask, updateTask }}>
      {children}
    </TaskContext.Provider>
  );
};
