import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const AdminDashboard = ({ workspace, onRefreshWorkspace }) => {
  const { organizationId, workspaceId } = useParams();

  // State management
  const [tasks, setTasks] = useState([]);
  const [members, setMembers] = useState(workspace?.members || []);
  const [registeredUsers, setRegisteredUsers] = useState([]);
  const [activeTab, setActiveTab] = useState("tasks"); // 'tasks' | 'members'

  // Task creation form state
  const [taskTitle, setTaskTitle] = useState("");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskStatus, setTaskStatus] = useState("todo");

  // Member addition state
  const [selectedUsername, setSelectedUsername] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Notification state
  const [message, setMessage] = useState({ text: "", type: "" });

  const showNotification = (text, type = "success") => {
    setMessage({ text, type });
    setTimeout(() => setMessage({ text: "", type: "" }), 4000);
  };

  // Fetch tasks
  const fetchTasks = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/organizations/${organizationId}/workspace/${workspaceId}/tasks`,
        { credentials: "include" },
      );
      const data = await response.json();
      if (response.ok && data.success) {
        setTasks(data.findAllTasks || []);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };

  // Fetch registered users
  const fetchRegisteredUsers = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/organizations/${organizationId}/workspace/${workspaceId}/all-users`,
        { credentials: "include" },
      );
      const data = await response.json();
      if (response.ok && data.success) {
        setRegisteredUsers(data.users || []);
      }
    } catch (error) {
      console.error("Error fetching registered users:", error);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchRegisteredUsers();
  }, [organizationId, workspaceId]);

  useEffect(() => {
    if (workspace?.members) {
      setMembers(workspace.members);
    }
  }, [workspace]);

  // Task Handlers
  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!taskTitle.trim()) {
      showNotification("Task title is required", "error");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/organizations/${organizationId}/workspace/${workspaceId}/tasks/create`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({
            title: taskTitle,
            duedate: taskDueDate || null,
            status: taskStatus,
          }),
        },
      );

      const data = await response.json();
      if (response.ok && data.success) {
        showNotification("Task created successfully!");
        setTaskTitle("");
        setTaskDueDate("");
        setTaskStatus("todo");
        fetchTasks();
      } else {
        showNotification(data.message || "Failed to create task", "error");
      }
    } catch (error) {
      console.error("Error creating task:", error);
      showNotification("Network error creating task", "error");
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const response = await fetch(
        `http://localhost:8000/organizations/${organizationId}/workspace/${workspaceId}/tasks/${taskId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await response.json();
      if (response.ok && data.success) {
        showNotification("Task deleted successfully!");
        fetchTasks();
      } else {
        showNotification(data.message || "Failed to delete task", "error");
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      showNotification("Network error deleting task", "error");
    }
  };

  // Member Handlers
  const handleAddMember = async (e) => {
    e.preventDefault();
    if (!selectedUsername.trim()) {
      showNotification("Please enter or select a username", "error");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8000/organizations/${organizationId}/workspace/${workspaceId}/members`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ username: selectedUsername }),
        },
      );

      const data = await response.json();
      if (response.ok && data.success) {
        showNotification("Member added to workspace!");
        setSelectedUsername("");
        if (data.workspace?.members) {
          setMembers(data.workspace.members);
        }
        if (onRefreshWorkspace) onRefreshWorkspace();
      } else {
        showNotification(data.message || "Failed to add member", "error");
      }
    } catch (error) {
      console.error("Error adding member:", error);
      showNotification("Network error adding member", "error");
    }
  };

  const handleRemoveMember = async (targetMember) => {
    if (!targetMember) return;
    const targetId = typeof targetMember === "object" ? targetMember._id : targetMember;
    if (!targetId) return;

    try {
      setMembers((prev) =>
        prev.filter((m) => {
          const mId = typeof m === "object" ? m._id : m;
          return mId && mId.toString() !== targetId.toString();
        }),
      );

      const response = await fetch(
        `http://localhost:8000/organizations/${organizationId}/workspace/${workspaceId}/members/${targetId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      const data = await response.json();
      if (response.ok && data.success) {
        showNotification("Member removed!");
        const updatedMembers =
          data.workspace?.members || data.findTheWorkspace?.members;
        if (updatedMembers && Array.isArray(updatedMembers)) {
          setMembers(updatedMembers.filter(Boolean));
        }
        if (onRefreshWorkspace) onRefreshWorkspace();
      } else {
        showNotification(data.message || "Failed to remove member", "error");
        if (onRefreshWorkspace) onRefreshWorkspace();
      }
    } catch (error) {
      console.error("Error removing member:", error);
      showNotification("Network error removing member", "error");
    }
  };

  const completedTasks = tasks.filter(
    (t) => t.status === "done" || t.status === "completed",
  ).length;
  const pendingTasks = tasks.length - completedTasks;
  const owner = workspace?.organization?.owner;

  return (
    <div className="p-4 sm:p-6 text-slate-900 h-full overflow-y-auto max-w-5xl mx-auto space-y-6">
      {/* Toast Notification */}
      {message.text && (
        <div
          className={`px-4 py-3 rounded-xl border text-sm flex items-center justify-between font-medium ${
            message.type === "error"
              ? "bg-red-50 border-red-200 text-red-700"
              : "bg-blue-50 border-blue-200 text-blue-800"
          }`}
        >
          <span>{message.text}</span>
          <button
            onClick={() => setMessage({ text: "", type: "" })}
            className="font-bold text-base hover:opacity-75"
          >
            ×
          </button>
        </div>
      )}

      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-slate-900">Admin Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Workspace settings and member management</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white border border-blue-100 p-4.5 rounded-2xl text-center shadow-2xs">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Total Tasks</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{tasks.length}</p>
        </div>
        <div className="bg-white border border-blue-100 p-4.5 rounded-2xl text-center shadow-2xs">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Completed</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{completedTasks}</p>
        </div>
        <div className="bg-white border border-blue-100 p-4.5 rounded-2xl text-center shadow-2xs">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Pending</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{pendingTasks}</p>
        </div>
        <div className="bg-white border border-blue-100 p-4.5 rounded-2xl text-center shadow-2xs">
          <p className="text-xs font-bold text-blue-600 uppercase tracking-wider">Members</p>
          <p className="text-2xl font-extrabold text-slate-900 mt-1">{members.length}</p>
        </div>
      </div>

      {/* Sub Navigation Tabs */}
      <div className="flex border-b border-slate-200 gap-6">
        <button
          onClick={() => setActiveTab("tasks")}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === "tasks"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Task Management
        </button>
        <button
          onClick={() => setActiveTab("members")}
          className={`pb-3 text-sm font-bold border-b-2 transition-all ${
            activeTab === "members"
              ? "border-blue-600 text-blue-600"
              : "border-transparent text-slate-500 hover:text-slate-900"
          }`}
        >
          Member Management
        </button>
      </div>

      {/* TASKS TAB */}
      {activeTab === "tasks" && (
        <div className="space-y-6">
          <div className="bg-white border border-blue-100 p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Add New Task</h3>
            <form onSubmit={handleCreateTask} className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Title *</label>
                <input
                  type="text"
                  placeholder="Task title..."
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Due Date</label>
                <input
                  type="date"
                  value={taskDueDate}
                  onChange={(e) => setTaskDueDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Status</label>
                <select
                  value={taskStatus}
                  onChange={(e) => setTaskStatus(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                >
                  <option value="todo">To Do</option>
                  <option value="in-progress">In Progress</option>
                  <option value="in-review">In Review</option>
                  <option value="done">Done</option>
                </select>
              </div>

              <div className="sm:col-span-3 flex justify-end">
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-xs cursor-pointer"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-blue-100 bg-blue-50/40">
              <h3 className="font-bold text-sm text-slate-900">Workspace Tasks ({tasks.length})</h3>
            </div>
            {tasks.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-sm">No tasks created yet.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-blue-50/80 text-blue-900 uppercase text-[11px] font-bold border-b border-blue-100">
                    <tr>
                      <th className="py-3 px-4">Title</th>
                      <th className="py-3 px-4">Due Date</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {tasks.map((task) => (
                      <tr key={task._id} className="hover:bg-blue-50/40 transition-all">
                        <td className="py-3.5 px-4 font-semibold text-slate-900">{task.title}</td>
                        <td className="py-3.5 px-4 text-slate-500">
                          {task.duedate
                            ? new Date(task.duedate).toLocaleDateString("en-GB").replaceAll("/", "-")
                            : "-"}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 capitalize">
                            {task.status || "todo"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => handleDeleteTask(task._id)}
                            className="bg-red-50 hover:bg-red-600 text-red-600 hover:text-white px-3 py-1 rounded-lg border border-red-200 text-xs transition-all font-semibold cursor-pointer"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* MEMBERS TAB */}
      {activeTab === "members" && (
        <div className="space-y-6">
          <div className="bg-white border border-blue-100 p-5 sm:p-6 rounded-2xl shadow-2xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900">Add Member to Workspace</h3>
            <form onSubmit={handleAddMember} className="flex flex-col sm:flex-row gap-4 items-end">
              <div className="flex-1 w-full relative">
                <label className="block text-xs font-semibold text-slate-700 mb-1">Search User</label>
                <input
                  type="text"
                  placeholder="Type username..."
                  value={selectedUsername}
                  onChange={(e) => {
                    setSelectedUsername(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                {showSuggestions && selectedUsername.trim() !== "" && (
                  <ul className="absolute z-20 w-full mt-1 bg-white border border-blue-200 rounded-xl shadow-xl max-h-48 overflow-y-auto divide-y divide-slate-100">
                    {registeredUsers.filter((u) =>
                      u.username.toLowerCase().includes(selectedUsername.toLowerCase()),
                    ).length > 0 ? (
                      registeredUsers
                        .filter((u) =>
                          u.username.toLowerCase().includes(selectedUsername.toLowerCase()),
                        )
                        .map((u) => (
                          <li
                            key={u._id}
                            onClick={() => {
                              setSelectedUsername(u.username);
                              setShowSuggestions(false);
                            }}
                            className="px-3.5 py-2.5 text-xs text-slate-800 hover:bg-blue-600 hover:text-white cursor-pointer transition-all flex items-center justify-between font-medium"
                          >
                            <span>{u.username}</span>
                            <span className="text-[10px] bg-blue-50 text-blue-700 px-2 py-0.5 rounded font-semibold">User</span>
                          </li>
                        ))
                    ) : (
                      <li className="px-3.5 py-2.5 text-xs text-slate-400 text-center">No user found</li>
                    )}
                  </ul>
                )}
              </div>

              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-all w-full sm:w-auto shadow-xs cursor-pointer"
              >
                Add Member
              </button>
            </form>
          </div>

          <div className="bg-white border border-blue-100 rounded-2xl overflow-hidden shadow-2xs">
            <div className="p-4 border-b border-blue-100 bg-blue-50/40">
              <h3 className="font-bold text-sm text-slate-900">Workspace Members ({members.length})</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-blue-50/80 text-blue-900 uppercase text-[11px] font-bold border-b border-blue-100">
                  <tr>
                    <th className="py-3 px-4">Member Name</th>
                    <th className="py-3 px-4">Role</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {members.map((member, index) => {
                    const name = member.username || member.name || "User";
                    const isOwner =
                      owner?.username === name ||
                      owner?._id === member._id ||
                      index === 0;

                    return (
                      <tr key={member._id || index} className="hover:bg-blue-50/40 transition-all">
                        <td className="py-3.5 px-4 font-semibold text-slate-900 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white shadow-2xs">
                            {name.slice(0, 2).toUpperCase()}
                          </div>
                          <span>{name}</span>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            {isOwner ? "Owner" : "Member"}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {!isOwner && (
                            <button
                              onClick={() => handleRemoveMember(member)}
                              className="bg-red-50 hover:bg-red-600 text-red-600 hover:text-white px-3 py-1 rounded-lg border border-red-200 text-xs transition-all font-semibold cursor-pointer"
                            >
                              Remove
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
