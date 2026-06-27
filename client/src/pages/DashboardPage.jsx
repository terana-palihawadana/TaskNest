import { useState, useEffect } from "react";
import { Link, useOutletContext } from "react-router-dom";
import { getTasks, updateTask } from "../api/taskApi";
import "./DashboardPage.css";

function StatCard({ iconBg, icon, label, value, topRight }) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div className="stat-card-icon" style={{ backgroundColor: iconBg }}>
          {icon}
        </div>
        {topRight && <div className="stat-card-extra">{topRight}</div>}
      </div>
      <p className="stat-card-label">{label}</p>
      <p className="stat-card-value">{value}</p>
    </div>
  );
}

const ListIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M9 6h11M9 12h11M9 18h11"
      stroke="#3d5c1a"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="5" cy="6" r="1.25" fill="#3d5c1a" />
    <circle cx="5" cy="12" r="1.25" fill="#3d5c1a" />
    <circle cx="5" cy="18" r="1.25" fill="#3d5c1a" />
  </svg>
);

const PendingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2"
      stroke="#6d28d9"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <rect x="9" y="3" width="6" height="4" rx="1" stroke="#6d28d9" strokeWidth="2" />
    <circle cx="12" cy="14" r="3" stroke="#6d28d9" strokeWidth="2" />
    <path d="M12 12.5V14l1 1" stroke="#6d28d9" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

const DoneIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="9" stroke="#fff" strokeWidth="2" />
    <path
      d="M8 12.5l2.5 2.5L16 9.5"
      stroke="#fff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const LightningIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M13 2L4 14h7l-1 8 9-12h-7l1-8z"
      fill="#99cc33"
      stroke="#99cc33"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

function priorityClass(priority) {
  if (priority === "High") return "focus-priority-high";
  if (priority === "Medium") return "focus-priority-medium";
  return "focus-priority-low";
}

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

  const isYesterday = (dateString) => {
    const date = new Date(dateString);
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return date.toDateString() === yesterday.toDateString();
  };

  const createdYesterday = tasks.filter((task) =>
    isYesterday(task.createdAt),
  ).length;

  const doneToday = tasks.filter(
    (task) => task.status === "Completed" && isToday(task.updatedAt),
  ).length;

  const doneTodayPercent =
    doneToday + pending === 0
      ? 0
      : Math.round((doneToday / (doneToday + pending)) * 100);

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

  const weekDays = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
  const weekCounts = [0, 0, 0, 0, 0, 0, 0];

  const startOfWeek = new Date();
  startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
  startOfWeek.setHours(0, 0, 0, 0);

  tasks.forEach((task) => {
    if (task.status === "Completed" && task.updatedAt) {
      const completedDate = new Date(task.updatedAt);
      if (completedDate >= startOfWeek) {
        weekCounts[completedDate.getDay()] += 1;
      }
    }
  });

  const weekTotal = weekCounts.reduce((sum, count) => sum + count, 0);

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
          <StatCard
            iconBg="#eef6dc"
            icon={<ListIcon />}
            label="Total tasks"
            value={total}
            topRight={
              <p className="stat-card-yesterday">
                +{createdYesterday} from yesterday
              </p>
            }
          />
        </div>

        <div className="col-md-4">
          <StatCard
            iconBg="#ede9fe"
            icon={<PendingIcon />}
            label="Pending"
            value={pending}
          />
        </div>

        <div className="col-md-4">
          <StatCard
            iconBg="#99cc33"
            icon={<DoneIcon />}
            label="Done today"
            value={doneToday}
            topRight={
              <div className="stat-card-progress">
                <div
                  className="stat-card-progress-fill"
                  style={{ width: `${doneTodayPercent}%` }}
                />
              </div>
            }
          />
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-lg-8">
          <div className="focus-panel">
            <div className="focus-panel-header">
              <div className="focus-panel-title">
                <LightningIcon />
                <h2>Focus for Today</h2>
              </div>
              <Link to="/tasks" className="focus-panel-view-all">
                View All
              </Link>
            </div>

            {focusTasks.length === 0 ? (
              <p className="focus-panel-empty">
                No pending tasks. You're all caught up!
              </p>
            ) : (
              <ul className="focus-panel-list">
                {focusTasks.map((task) => (
                  <li key={task._id} className="focus-panel-item">
                    <input
                      type="checkbox"
                      className="focus-panel-checkbox"
                      aria-label={`Mark ${task.title} complete`}
                      onChange={() => handleComplete(task)}
                    />
                    <span className="focus-panel-task-title">{task.title}</span>
                    {task.priority && (
                      <span
                        className={`focus-priority-badge ${priorityClass(task.priority)}`}
                      >
                        {task.priority}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <div className="col-lg-4 d-flex flex-column gap-3">
          <div
            className="card text-white"
            style={{ backgroundColor: "#224D4D", border: "none" }}
          >
            <div className="card-body p-4">
              <p className="fw-semibold mb-0">Today's Focus</p>
              <p className="small mt-2 mb-4 opacity-75">
                You've completed {focusPercent}% of your high-priority goals.
                Keep the momentum.
              </p>
              <h2
                className="display-6 fw-bold mb-4"
                style={{ color: "#99cc33" }}
              >
                {focusPercent}%
              </h2>
              <div className="d-flex justify-content-end mb-1">
                <span className="small opacity-75">
                  {highDoneToday}/{highTotal} Done
                </span>
              </div>
              <div
                className="progress"
                style={{
                  height: "10px",
                  backgroundColor: "rgba(255,255,255,0.15)",
                }}
              >
                <div
                  className="progress-bar"
                  style={{
                    width: `${focusPercent}%`,
                    backgroundColor: "#99cc33",
                  }}
                />
              </div>
            </div>
          </div>

          <div
            className="card text-white"
            style={{ backgroundColor: "#224D4D", border: "none" }}
          >
            <div className="card-body p-4">
              <div className="d-flex justify-content-between align-items-start mb-4">
                <p className="mb-0 opacity-75">Weekly Deep Work</p>
                <span
                  className="fw-bold"
                  style={{ color: "#99cc33", fontSize: "1.5rem" }}
                >
                  {weekTotal} tasks
                </span>
              </div>

              <div
                className="d-flex align-items-end justify-content-between gap-1"
                style={{ height: "120px" }}
              >
                {weekCounts.map((count, index) => {
                  const max = Math.max(...weekCounts, 1);
                  const height = `${(count / max) * 100}%`;

                  return (
                    <div
                      key={weekDays[index]}
                      className="d-flex flex-column align-items-center flex-fill"
                    >
                      <div
                        style={{
                          width: "100%",
                          height,
                          backgroundColor:
                            index === new Date().getDay()
                              ? "#99cc33"
                              : "rgba(255,255,255,0.25)",
                          borderRadius: "4px",
                          minHeight: count > 0 ? "8px" : "0",
                        }}
                      />
                      <span className="small mt-2 opacity-75">
                        {weekDays[index]}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
