import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./AppLayout.css";
import TopBar from "./TopBar.jsx";

function AppLayout() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNewTask = () => {
    navigate("/tasks", { state: { openModal: true } });
    setSidebarOpen(false);
  };

  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="app-layout">
      {sidebarOpen && (
        <button
          type="button"
          className="sidebar-overlay"
          aria-label="Close menu"
          onClick={closeSidebar}
        />
      )}

      <aside
        className={`app-sidebar text-white p-3 d-flex flex-column${
          sidebarOpen ? " sidebar-open" : ""
        }`}
      >
        <div className="mb-4">
          <h1 className="h5 mb-1">TaskNest</h1>
          <p className="small mb-0 opacity-75">Deep Work Sanctuary</p>
        </div>

        <nav className="nav flex-column gap-1 mb-auto">
          <NavLink
            to="/dashboard"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? "sidebar-link-active" : ""}`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/tasks"
            onClick={closeSidebar}
            className={({ isActive }) =>
              `nav-link text-white ${isActive ? "sidebar-link-active" : ""}`
            }
          >
            Tasks
          </NavLink>
        </nav>

        <button
          type="button"
          className="btn btn-new-task w-100 mb-3"
          onClick={handleNewTask}
        >
          + New Task
        </button>

        <footer className="sidebar-footer">
          <p>© {new Date().getFullYear()} TaskNest. All rights reserved.</p>
        </footer>
      </aside>

      <div className="app-main">
        <header className="app-topbar">
          <TopBar
            search={search}
            onSearchChange={setSearch}
            onMenuToggle={() => setSidebarOpen((open) => !open)}
          />
        </header>
        <div className="app-content">
          <Outlet context={{ search }} />
        </div>
      </div>
    </div>
  );
}

export default AppLayout;
