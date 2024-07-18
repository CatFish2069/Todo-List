import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [list, setList] = useState([]);
  const [updateId, setUpdateId] = useState(null); // Track which todo to update

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/get`);
      setList(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  const addTodo = async () => {
    try {
      await axios.post(`http://localhost:5000/create`, {
        title: title,
        description: description,
      });
      fetchTodos(); // Refresh todo list
      setTitle("");
      setDescription("");
      alert(`Todo created successfully`);
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/delete/${id}`);
      fetchTodos(); // Refresh todo list after deletion
      alert("Todo deleted successfully");
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const updateTodo = async () => {
    try {
      await axios.put(`http://localhost:5000/update/${updateId}`, {
        newTitle: title,
        newDescription: description,
      });
      fetchTodos(); // Refresh todo list after update
      setTitle("");
      setDescription("");
      setUpdateId(null); // Reset updateId after update
      alert("Todo updated successfully");
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const handleUpdateClick = (id, currentTitle, currentDescription) => {
    setUpdateId(id); // Set the id of the todo to be updated
    setTitle(currentTitle); // Populate input fields with current todo data
    setDescription(currentDescription);
  };

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-black text-white font-serif">
      <h1 className="font-bold text-3xl text-blue-400 mb-5 drop-shadow-lg">
        Todo List using MERN
      </h1>

      {/* Container for Inputs */}
      <div className="border-2 border-gray-700 w-[300px] flex justify-center items-center flex-col rounded-lg bg-gray-900 p-4 shadow-md">
        <div className="w-full p-2">
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="title-input">
            Title
          </label>
          <input
            className="custom-input w-full px-3 py-2 bg-white border border-gray-600 rounded focus:outline-none focus:border-yellow-400 text-black"
            placeholder="Enter title"
            type="text"
            id="title-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="w-full p-2">
          <label className="block text-gray-300 text-sm font-bold mb-2" htmlFor="description-input">
            Description
          </label>
          <input
            className="custom-input w-full px-3 py-2 bg-white border border-gray-600 rounded focus:outline-none focus:border-yellow-400 text-black"
            placeholder="Enter description"
            type="text"
            id="description-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Conditional rendering of buttons based on whether an update is in progress */}
        {!updateId ? (
          <button
            className="w-full bg-blue-500 text-black rounded-lg mt-3 py-2 px-4 hover:shadow-md"
            onClick={addTodo}
          >
            Add
          </button>
        ) : (
          <button
            className="w-full bg-blue-500 text-black rounded-lg mt-3 py-2 px-4 hover:shadow-md"
            onClick={updateTodo}
          >
            Update
          </button>
        )}
      </div>

      {/* Todo Container */}
      <div className="mt-4 grid grid-cols-3 gap-4">
        {list.map((todo) => (
          <div
            className="w-[300px] bg-gray-900 text-gray-300 border border-gray-700 p-4 rounded-lg shadow-md hover:shadow-lg"
            key={todo._id}
          >
            <div className="text-lg font-semibold capitalize rounded-md mb-2 text-yellow-500">
              {todo.title}
            </div>
            <div className="rounded-md mb-2">{todo.description}</div>

            <div className="flex justify-center space-x-10">
              <button
                className="rounded-md border-2 border-black bg-gray-800 hover:bg-gray-700 text-yellow-400 hover:text-yellow-300 py-2 px-3"
                onClick={() => deleteTodo(todo._id)}
              >
                Delete
              </button>
              <button
                className="rounded-md border-2 border-black bg-gray-800 hover:bg-gray-700 text-yellow-400 hover:text-yellow-300 py-2 px-3"
                onClick={() => handleUpdateClick(todo._id, todo.title, todo.description)}
              >
                Update
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
