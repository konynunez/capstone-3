import React from "react";
import { render } from "@testing-library/react";
import '@testing-library/jest-dom/extend-expect'; // for the "toBeInTheDocument" matcher
import { TaskProvider, useTasks } from "../src/context/TasksContext";

// A simple component to test useTasks
const TestComponent = () => {
  const { tasks, createTask, deleteTask, updateTask } = useTasks();
  return (
    <div>
      <div data-testid="tasks-length">{tasks.length}</div>
      <button onClick={() => createTask("Test Task", "Test Description")}>Create Task</button>
      <button onClick={() => deleteTask("test-id")}>Delete Task</button>
      <button onClick={() => updateTask("test-id", { title: "Updated Task" })}>Update Task</button>
    </div>
  );
};

describe("TaskProvider", () => {
  test("renders without crashing", () => {
    render(<TaskProvider><div /></TaskProvider>);
  });

  test("provides tasks context", () => {
    render(
      <TaskProvider>
        <TestComponent />
      </TaskProvider>
    );
    expect(screen.getByTestId("tasks-length")).toBeInTheDocument();
  });

  test("renders children", () => {
    const { getByTestId } = render(
      <TaskProvider>
        <div data-testid="child">Child Component</div>
      </TaskProvider>
    );
    expect(getByTestId("child")).toBeInTheDocument();
  });
});
