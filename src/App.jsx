import './App.css'

/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from 'uuid';
import { HTML5Backend } from "react-dnd-html5-backend";
import useLocalStorage from "./components/useLocalStorage";
const TodoApp = () => {
  // const [todos, setTodos] = useState(() => {
  //   const savedTodos = localStorage.getItem("todos");
  //   return savedTodos ? JSON.parse(savedTodos) : [];
  // });
  const [todos, setTodos] = useLocalStorage("todos", []);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("theme") === "dark";
  });

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem("theme", darkMode ? "dark" : "light");
    document.body.style.backgroundColor = darkMode ? "#121212" : "#ffffff";
    document.body.style.color = darkMode ? "#ffffff" : "#000000";
  }, [darkMode]);

  const addTodo = () => {
    if (input.trim() === "") return;
    setTodos((prev) => [...prev, { id: uuidv4(), text: input, completed: false }]);
    setInput("");
  };

  const removeTodo = (index) => {
    setTodos((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleComplete = (index) => {
    setTodos((prev) =>
      prev.map((todo, i) =>
        i === index ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const startEditing = (index, text) => {
    setEditIndex(index);
    setEditText(text);
  };

  const saveEdit = (index) => {
    setTodos((prev) =>
      prev.map((todo, i) =>
        i === index ? { ...todo, text: editText } : todo
      )
    );
    setEditIndex(null);
    setEditText("");
  };

  const moveTodo = (fromIndex, toIndex) => {
    const reorderedTodos = [...todos];
    const [movedTodo] = reorderedTodos.splice(fromIndex, 1);
    reorderedTodos.splice(toIndex, 0, movedTodo);
    setTodos(reorderedTodos);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "completed") return todo.completed;
    if (filter === "pending") return !todo.completed;
    return true;
  });

  return (
    <DndProvider backend={HTML5Backend}>
      <div style={{ padding: "20px" }}>
       <h2>ListDone Stay productive 🚀</h2>

        {/* Dark Mode Toggle */}
        <button onClick={() => setDarkMode((prev) => !prev)}>
          {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>

        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter a todo..."
        />
        <button onClick={addTodo}>Add</button>

        {/* Filter Buttons */}
        <div>
          <button onClick={() => setFilter("all")}>All</button>
          <button onClick={() => setFilter("completed")}>Completed</button>
          <button onClick={() => setFilter("pending")}>Pending</button>
        </div>

        <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
          {filteredTodos.map((todo, index) => (
            <Todo
              key={todo.id}
              index={index}
              todo={todo}
              moveTodo={moveTodo}
              toggleComplete={toggleComplete}
              removeTodo={removeTodo}
              startEditing={startEditing}
              saveEdit={saveEdit}
              editIndex={editIndex}
              editText={editText}
              setEditText={setEditText}
            />
          ))}
        </ul>
      </div>
    </DndProvider>
  );
};

const Todo = ({
  todo,
  index,
  moveTodo,
  toggleComplete,
  removeTodo,
  startEditing,
  saveEdit,
  editIndex,
  editText,
  setEditText,
}) => {
  const [, drag] = useDrag(() => ({
    type: "TODO",
    item: { index },
  }));

  const [, drop] = useDrop(() => ({
    accept: "TODO",
    hover: (item) => {
      if (item.index !== index) {
        moveTodo(item.index, index);
        item.index = index; // Update the dragged item's index
      }
    },
  }));

  return (
    <motion.li
      ref={(node) => drag(drop(node))}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        padding: "10px",
        border: "1px solid gray",
        marginBottom: "5px",
        backgroundColor: "#f9f9f9",
        cursor: "grab",
      }}
    >
      {editIndex === index ? (
        <>
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <button onClick={() => saveEdit(index)}>💾 Save</button>
          <button onClick={() => setEditIndex(null)}>❌ Cancel</button>
        </>
      ) : (
        <>
        <span style={{ width:"200px",
        textDecoration: todo.completed ? "line-through" : "none"
      }}>{todo.text}</span>
          
          <button onClick={() => toggleComplete(index)}>✔</button>
          <button onClick={() => startEditing(index, todo.text)}>✏️ Edit</button>
          <button onClick={() => removeTodo(index)}>❌</button>
        </>
      )}
    </motion.li>
  );
};

export default TodoApp;