import { useEffect, useState } from "react";
import { getTasks, addTask, deleteTask, updateTask } from "./api/TaskApi";

export default function Home() {
  const [tasks, setTasks] = useState<
    { id: string; title: string; completed: boolean }[]
  >([]);
  const [title, setTitle] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");

  const fetchTasks = async () => {
    const res = await getTasks();
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleAdd = async () => {
    if (!title.trim()) return;
    await addTask({ title, completed: false });
    setTitle("");
    fetchTasks();
  };

  const handleDelete = async (id: string) => {
    await deleteTask(id);
    fetchTasks();
  };

  const handleEditStart = (task: {
    id: string;
    title: string;
    completed: boolean;
  }) => {
    setEditingId(task.id);
    setEditTitle(task.title);
  };

  const handleSaveUpdate = async (id: string, completed: boolean) => {
    if (!editTitle.trim()) return;
    await updateTask(id, { title: editTitle, completed });
    setEditingId(null);
    setEditTitle("");
    fetchTasks();
  };

  const handleToggleComplete = async (task: {
    id: string;
    title: string;
    completed: boolean;
  }) => {
    await updateTask(task.id, {
      title: task.title,
      completed: !task.completed,
    });
    fetchTasks();
  };

  function HandleLogout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    window.location.href = "/login";
  }

  return (
    <div className="min-h-screen  from-blue-50 to-indigo-100 flex flex-col items-center justify-center  p-4">
      <div className="w-full h-10 top-0 p-10 flex items-center justify-end absolute bg-black">
        <button
          onClick={HandleLogout}
          className="border-2 border-white shadow-2xl text-white p-2 rounded-3xl hover:cursor-pointer"
        >
          Logout
        </button>
      </div>
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">My Tasks</h1>

        <div className="flex gap-2 mb-6">
          <input
            className="border border-gray-300 p-3 flex-1 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleAdd()}
            placeholder="Add a new task..."
          />
          <button
            onClick={handleAdd}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold transition duration-200"
          >
            Add
          </button>
        </div>

        {tasks.length === 0 ? (
          <p className="text-center text-gray-400 py-8">
            No tasks yet. Add one to get started!
          </p>
        ) : (
          <div className="space-y-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center gap-3 p-4 rounded-lg border transition duration-200 ${
                  task.completed
                    ? "bg-gray-50 border-gray-200"
                    : "bg-white border-gray-300 hover:border-blue-400"
                }`}
              >
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => handleToggleComplete(task)}
                  className="w-5 h-5 accent-blue-500 cursor-pointer"
                />

                {editingId === task.id ? (
                  <input
                    className="flex-1 border border-blue-400 p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    autoFocus
                  />
                ) : (
                  <span
                    className={`flex-1 p-2 ${
                      task.completed
                        ? "line-through text-gray-500"
                        : "text-gray-800 font-medium"
                    }`}
                  >
                    {task.title}
                  </span>
                )}

                <div className="flex gap-2">
                  {editingId === task.id ? (
                    <>
                      <button
                        onClick={() =>
                          handleSaveUpdate(task.id, task.completed)
                        }
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg font-semibold transition duration-200"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded-lg font-semibold transition duration-200"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => handleEditStart(task)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg font-semibold transition duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(task.id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-semibold transition duration-200"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
