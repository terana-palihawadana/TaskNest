import { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { getTasks, updateTask } from "../api/taskApi";

function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const { search } = useOutletContext();

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const response = await getTasks();
        setTasks(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    loadTasks();
  }, []);
  const handleComplete = async (task) => {
    try {
      await updateTask(task._id, {
        title: task.title,
        description: task.description,
        status: "Completed",
        priority: task.priority,
        dueDate: task.dueDate,
      });

      const response = await getTasks();
      setTasks(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error(error);
    }
  };

  const total = tasks.length;
  const pending = tasks.filter((task) => task.status === "Pending").length;
  const focusTasks = tasks
    .filter((task) => task.status === "Pending")
    .filter((task) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        task.title.toLowerCase().includes(q) ||
        (task.description && task.description.toLowerCase().includes(q))
      );
    });
  const isToday = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const doneToday = tasks.filter(
    (task) => task.status === "Completed" && isToday(task.updatedAt),
  ).length;

  const highPending = tasks.filter(
    (task) => task.priority === "High" && task.status === "Pending",
  ).length;

  const highDoneToday = tasks.filter(
    (task) =>
      task.priority === "High" &&
      task.status === "Completed" &&
      isToday(task.updatedAt),
  ).length;

  const highTotal = highPending + highDoneToday;
  const focusPercent =
    highTotal === 0 ? 0 : Math.round((highDoneToday / highTotal) * 100);

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="h3 mb-2">{greeting}, Julian.</h1>
      <p className="text-muted mb-4">
        What will you focus on today to maintain your sanctuary?
      </p>
      <div className="row g-3">
        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <p className="text-muted mb-1">Total tasks</p>
              <h2 className="h3 mb-0">{total}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <p className="text-muted mb-1">Pending</p>
              <h2 className="h3 mb-0">{pending}</h2>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card">
            <div className="card-body">
              <p className="text-muted mb-1">Done Today</p>
              <h2 className="h3 mb-0">{doneToday}</h2>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-lg-8">
          <h2 className="h5 mb-3">Focus for Today</h2>

          {focusTasks.length === 0 ? (
            <p className="text-muted">
              No pending tasks. You're all caught up!
            </p>
          ) : (
            <ul className="list-group">
              {focusTasks.map((task) => (
                <li
                  key={task._id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <div className="d-flex align-items-center gap-3">
                    <input
                      type="checkbox"
                      className="form-check-input mt-0"
                      onChange={() => handleComplete(task)}
                    />
                    <strong>{task.title}</strong>
                    {task.dueDate && (
                      <span className="text-muted ms-2">
                        Due {new Date(task.dueDate).toLocaleDateString()}
                      </span>
                    )}
                  </div>
                  {task.priority && (
                    <span
                      className={`badge ${
                        task.priority === "High"
                          ? "bg-danger"
                          : task.priority === "Medium"
                            ? "bg-warning text-dark"
                            : "bg-secondary"
                      }`}
                    >
                      {task.priority}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="col-lg-4">
          <div
            className="card text-white h-100"
            style={{ backgroundColor: "#003333" }}
          >
            <div className="card-body">
              <p className="mb-1 opacity-75">Today's Focus</p>
              <h2 className="h3">{focusPercent}%</h2>
              <p className="small mb-3">
                {highDoneToday}/{highTotal} high-priority done
              </p>
              <div className="progress mb-3" style={{ height: "8px" }}>
                <div
                  className="progress-bar"
                  style={{
                    width: `${focusPercent}%`,
                    backgroundColor: "#99cc33",
                  }}
                />
              </div>
              <p className="small mb-0 opacity-75">
                You've completed {focusPercent}% of your high-priority goals.
                Keep the momentum.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
