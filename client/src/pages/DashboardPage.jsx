import { useState, useEffect } from "react";
import { getTasks } from "../api/taskApi";

function DashboardPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const total = tasks.length;
  const pending = tasks.filter((task) => task.status === "Pending").length;
  const completed = tasks.filter((task) => task.status === "Completed").length;

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="h3 mb-4">Dashboard</h1>
      <p className="text-muted mb-4">Overview of your work</p>

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
              <p className="text-muted mb-1">Completed</p>
              <h2 className="h3 mb-0">{completed}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardPage;
