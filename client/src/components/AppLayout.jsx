import { NavLink, Outlet, useNavigate } from "react-router-dom";
import "./AppLayout.css";
import TopBar from "./TopBar.jsx";

function AppLayout() {
  const navigate = useNavigate();

  const handleNewTask = () => {
    navigate("/tasks", { state: { openModal: true } });
  };
  return (
    <div className="d-flex min-vh-100">
      <aside
        className="text-white p-3 d-flex flex-column"
        style={{ width: "240px", backgroundColor: "#003333" }}
      >
        <div className="mb-4">
          <h1 className="h5 mb-1">TaskNest</h1>
          <p className="small mb-0 opacity-75">Deep Work Sanctuary</p>
        </div>

        <nav className="nav flex-column gap-1 mb-auto">
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? "sidebar-link-active" : ""}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/tasks"
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? "sidebar-link-active" : ""}`
            }
          >
            Tasks
          </NavLink>
        </nav>

        <button
          type="button"
          className="btn btn-new-task w-100"
          onClick={handleNewTask}
        >
          + New Task
        </button>
      </aside>

      <main className="flex-grow-1 p-4 bg-light">
        <TopBar />
        <Outlet />
      </main>
    </div>
  );
}

export default AppLayout;
