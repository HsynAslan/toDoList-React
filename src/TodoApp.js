import React, { useState, useEffect } from "react";
import ThreeCanvas from "./ThreeCanvas";
import '../src/toDoApp.css';

const TodoApp = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState("");

  // localStorage'dan görevleri yükleme
  useEffect(() => {
    const savedTasks = JSON.parse(localStorage.getItem("tasks"));
    if (savedTasks) {
      setTasks(savedTasks);
    }
  }, []);

  // localStorage'ı güncelleme
  useEffect(() => {
    if (tasks.length > 0) {
      localStorage.setItem("tasks", JSON.stringify(tasks));
    }
  }, [tasks]);

  // Yeni görev ekleme
  const addTask = () => {
    if (newTask.trim()) {
      const newTaskObject = { id: Date.now(), text: newTask, completed: false };
      const updatedTasks = [...tasks, newTaskObject];
      // Görevleri sıralama (id'ye göre zaman sırasına göre)
      updatedTasks.sort((a, b) => a.id - b.id);
      setTasks(updatedTasks);
      setNewTask("");
    }
  };

  // Görev silme
  const deleteTask = (id) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  };

  // Görev tamamlanma durumunu değiştirme
  const toggleTaskCompletion = (id) => {
    const updatedTasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  return (
    <div id="app-container">
    {/* Three.js Canvas */}
    <ThreeCanvas />
  
    <div id="todo-container">
      <h2>My To-Do List</h2>
      <div id="input-container">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a new task"
        />
        <button onClick={addTask}>Add Task</button>
      </div>
  
      <ul id="task-list">
        {tasks.map((task) => (
          <li key={task.id} className="task-item">
            <label className="task-checkbox">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTaskCompletion(task.id)}
              />
              <span className={task.completed ? "completed-text" : ""}>
                {task.text}
              </span>
            </label>
            <button
              onClick={() => deleteTask(task.id)}
              className="delete-btn"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  </div>
  );
};

export default TodoApp;
