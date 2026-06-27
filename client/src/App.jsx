import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import TaskListPage from "./pages/TaskListPage.jsx";
import AppLayout from "./components/AppLayout.jsx";
import DashboardPage from "./pages/DashboardPage.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="tasks" element={<TaskListPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
