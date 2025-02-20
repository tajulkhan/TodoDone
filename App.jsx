/* eslint-disable no-undef */
/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { motion } from "framer-motion";
import { v4 as uuidv4 } from "uuid";
import { HTML5Backend } from "react-dnd-html5-backend";
import useLocalStorage from "./components/useLocalStorage";
import "./App.css";
import Navbar from "./components/navbar";
import Footer from "./components/footer";

const TodoApp = () => {
  // const [todos, setTodos] = useState(() => {
  //   const savedTodos = localStorage.getItem("todos");
  //   return savedTodos ? JSON.parse(savedTodos) : [];
  // });
  const [todos, setTodos] = useLocalStorage("todos", []);
  const allCount = todos.length
  const completedCount = todos.filter((todo)=>todo.completed).length;
  const pendingCount = allCount - completedCount;
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState("all");
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (input.trim() === "") return;
    setTodos((prev) => [
      ...prev,
      { id: uuidv4(), text: input, completed: false },
    ]);
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
      prev.map((todo, i) => (i === index ? { ...todo, text: editText } : todo))
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
    <>
      <Navbar />
      <div className="max-w-6xl sm:mx-auto mx-4">
        <div className="grid grid-cols-2 gap-4 mt-11 md:grid-cols-10">
          <div className="col-span-7 md:col-span-2 lg:col-span-7">
            <div className="bg-white rounded-lg p-4 min-h-[450px]">
              <DndProvider backend={HTML5Backend}>
                <h1 className="text-[#142648] lexend-medium text-[32px] text-start mb-2.5">
                  Today’s Task{" "}
                </h1>
                <div className="flex justify-between">
                  <input
                    className="flex-1 border-2 border-[#142648] p-2.5 rounded-sm placeholder-[#142648] text-sm mr-4"
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter a todo..."
                  />
                  <button
                    className="w-20 flex items-center justify-between bg-[#142648] rounded-lg text-white px-3.5 py-2"
                    onClick={addTodo}
                  >
                    <img
                      src="/images/add-ic.svg"
                      width={16}
                      height={16}
                      alt="Add"
                    />
                    Add
                  </button>
                </div>

                <div className="mt-4 mb-8 text-left w-[280px] h-[32px] border-2 border-[#142648] rounded-sm flex">
                  <button
                    className="cursor-pointer text-sm px-2 py-2 flex items-center gap-2 border-r-2 border-[#142648]"
                    onClick={() => setFilter("all")}
                  >
                    All
                    <span className="w-4 h-4 bg-[#142648] text-[9px] p-1 rounded-full text-white flex items-center justify-center">
                      {allCount}
                    </span>
                  </button>

                  <button
                    className="cursor-pointer text-sm px-2 py-2 flex items-center gap-2 border-r-2 border-[#142648]"
                    onClick={() => setFilter("completed")}
                  >
                    Completed
                    <span className="w-4 h-4 bg-[#142648] text-[9px] p-1 rounded-full text-white flex items-center justify-center">
                      {completedCount}
                    </span>
                  </button>
                  <button
                    className="cursor-pointer text-sm px-2 py-2 flex items-center gap-2"
                    onClick={() => setFilter("pending")}
                  >
                    Pending
                    <span className="w-4 h-4 bg-[#142648] text-[9px] p-1 rounded-full text-white flex items-center justify-center">
                      {pendingCount}
                    </span>
                  </button>
                </div>
                <ul style={{ listStyleType: "none", paddingLeft: 0 }}>
                  {filteredTodos.length === 0 ?( <li className="text-center my-28">No todos available</li>):(
                    filteredTodos.map((todo, index) => (
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
                    ))
                  )}
                 
                </ul>
              </DndProvider>
            </div>
          </div>
          <div className="col-span-7 md:col-span-2 lg:col-span-3">
            <div className="bg-white w-full rounded-lg h-[200px] flex flex-col items-center justify-center">
              <img
                      src="/images/motive-img-1.svg"
                      width={214}
                      height={143}
                      alt="ListDone Stay productive"
                    />
              <h2 className="text-[#142648] text-[20px] lexend-medium">ListDone Stay productive</h2>
            </div>
            <div className="mt-5 bg-white w-full rounded-lg h-[200px] flex flex-col items-center justify-center">
              <img
                      src="/images/motive-img-2.svg"
                      width={214}
                      height={143}
                      alt="ListDone Stay productive"
                    />
              <h2 className="text-[#142648] text-[20px] lexend-medium">Keep Pushing, Achieve More</h2>
            </div>
          </div>
        </div>
      </div>
      <Footer/>
    </>
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
      className="bg-[#142648] flex px-2 py-3 rounded-sm mb-3"
    >
      {editIndex === index ? (
        <>
        <div className=" w-64 flex flex-auto items-center text-white text-sm cursor-grabbing">
          <input className="flex-1 border-b-1 mr-2 border-amber-50 pb-1 roundec-sm text-sm"
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
          />
          <button onClick={() => saveEdit(index)} className="cursor-pointer">💾 Save</button>
          {/* <button onClick={() => setEditIndex(null)}>❌ Cancel</button> */}
          </div>
        </>
      ) : (
        <>
          <div
            className={`${
              todo.completed ? "line-through" : "none"
            } w-64 flex flex-auto items-center text-white text-sm cursor-grabbing`}
          >
            <img
              src="/images/move-ic.svg"
              width={18}
              height={18}
              alt="Move icon"
            />

            {todo.text}
          </div>

          <button onClick={() => toggleComplete(index)} className="bg-white p-1 rounded-sm mr-2 cursor-pointer">
            <img
              src="/images/done-ic.svg"
              width={16}
              height={16}
              alt="Done icon"
            />
          </button>
          <button onClick={() => startEditing(index, todo.text)}  className="bg-white p-1 rounded-sm mr-2 cursor-pointer">
            <img
              src="/images/edit-ic.svg"
              width={16}
              height={16}
              alt="Edit icon"
            />
          </button>
          <button onClick={() => removeTodo(index)} className="cursor-pointer">
            <img
              src="/images/delete-ic.svg"
              width={22}
              height={22}
              alt="Edit icon"
            />
          </button>
        </>
      )}
    </motion.li>
  );
};

export default TodoApp;
