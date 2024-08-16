"use client";  
import { useEffect, useState } from "react";
import { useTasks } from "../../context/TasksContext";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../../firebase";  

function Page({ params }) {
  const { tasks, createTask, updateTask } = useTasks();  
  const router = useRouter(); 
  const { register, handleSubmit, setValue, formState: { errors } } = useForm();  
  const [user, setUser] = useState(null);  

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {  
      if (user) {
        setUser(user);  
      } else {
        setUser(null);  
        toast.error("You must be logged in to create or edit a task.");  
        router.push("/");  
      }
    });

    return () => unsubscribe();  
  }, [router]);

  const onSubmit = handleSubmit((data) => {
    if (!user) {  
      toast.error("You must be logged in to create or edit a task.");
      return;
    }

    if (params && params.id) {  
      updateTask(params.id, data);  
      toast.success("Task updated successfully");
    } else {
      createTask(data.title, data.description);  
      toast.success("Task created successfully");
    }
    router.push("/");  
  });

  useEffect(() => {
    if (params && params.id) {  
      const taskFound = tasks.find((task) => task.id === params.id);
      if (taskFound) {
        setValue("title", taskFound.title);
        setValue("description", taskFound.description);
      }
    }
  }, [params, tasks, setValue]);

  return (
    <div className="flex justify-center items-center h-full">
      <form onSubmit={onSubmit} className="bg-gray-700 p-10">
        <h2 className="text-white mb-5">{params && params.id ? "Edit Task" : "New Task"}</h2>
        <input
          className="bg-gray-800 py-3 px-4 mb-2 block focus:outline-none w-full"
          placeholder="Write a title"
          {...register("title", { required: true })}  
        />
        {errors.title && (
          <span className="block text-red-400 mb-2">This field is required</span>
        )}
        <textarea
          className="bg-gray-800 py-3 px-4 mb-2 block focus:outline-none w-full"
          placeholder="Write a description"
          {...register("description", { required: true })}  
        />
        {errors.description && (
          <span className="block text-red-400 mb-2">This field is required</span>
        )}
        <button className="bg-green-500 hover:bg-green-400 px-4 py-2 rounded-sm disabled:opacity-30">
          {params && params.id ? "Update Task" : "Save"}  {/* Button text changes based on action */}
        </button>
      </form>
    </div>
  );
}

export default Page;
