import { useState, useEffect } from "react";
import { getTasks, createTask, deleteTask, updateTask } from "../api/taskApi";
import { Modal } from "react-bootstrap";
import { useLocation, useOutletContext } from "react-router-dom";
import "./TaskListPage.css";

function priorityBadgeClass(priority) {
  if (priority === "High") return "priority-badge priority-badge-high";
  if (priority === "Medium") return "priority-badge priority-badge-medium";
  return "priority-badge priority-badge-low";
}

function formatDueDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const FilterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M4 7h16M7 12h10M10 17h4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

const SortIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M4 7h10M4 12h7M4 17h4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M18 6v12M18 18l3-3M18 18l-3-3"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const CalendarIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <rect x="4" y="5" width="16" height="15" rx="2" stroke="currentColor" strokeWidth="1.75" />
    <path d="M8 3v4M16 3v4M4 10h16" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
);

const EditIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L8 18l-4 1 1-4 11.5-11.5z"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const TrashIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M9 3h6l1 2h4v2H4V5h4l1-2z" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M6 9h12v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9z"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <path d="M10 11v6M14 11v6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

function TaskListPage() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("Pending");
  const [editingId, setEditingId] = useState(null);
  const [priority, setPriority] = useState("Medium");
  const [dueDate, setDueDate] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const location = useLocation();
  const { search } = useOutletContext();

  const fetchTasks = async () => {
    try {
      const response = await getTasks();
      setTasks(Array.isArray(response.data) ? response.data : []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Failed to load tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.state?.openModal) {
      setShowModal(true);
    }
  }, [location.state]);

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingId) {
        await updateTask(editingId, {
          title,
          description,
          status,
          priority,
          dueDate: dueDate || null,
        });
        setEditingId(null);
      } else {
        await createTask({
          title,
          description,
          status,
          priority,
          dueDate: dueDate || null,
        });
      }

      setTitle("");
      setDescription("");
      setStatus("Pending");
      setPriority("Medium");
      setDueDate("");
      setEditingId(null);
      setShowModal(false);
      await fetchTasks();
    } catch (err) {
      console.error(err);
      setError(editingId ? "Failed to update task" : "Failed to create task");
    }
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await deleteTask(deleteId);
      closeDeleteModal();
      await fetchTasks();
    } catch (err) {
      console.error(err);
      setError("Failed to delete task");
    }
  };

  const handleEdit = (task) => {
    setEditingId(task._id);
    setTitle(task.title);
    setDescription(task.description);
    setStatus(task.status);
    setPriority(task.priority || "Medium");
    setDueDate(task.dueDate ? task.dueDate.split("T")[0] : "");
    setShowModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setDeleteId(null);
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setStatus("Pending");
    setPriority("Medium");
    setDueDate("");
    setEditingId(null);
  };

  const closeTaskModal = () => {
    setShowModal(false);
    resetForm();
  };

  const filteredTasks = tasks.filter((task) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      task.title.toLowerCase().includes(q) ||
      (task.description && task.description.toLowerCase().includes(q))
    );
  });

  if (loading) return <p className="tasks-loading">Loading tasks...</p>;

  return (
    <div className="tasks-page">
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="tasks-page-top">
        <div className="tasks-page-header">
          <h1 className="tasks-page-title">All Tasks</h1>
          <p className="tasks-page-subtitle">
            Manage your sanctuary of focused work and deep productivity.
          </p>
        </div>

        <div className="tasks-toolbar">
          <button type="button" className="tasks-toolbar-btn" disabled>
            <FilterIcon />
            Filter
          </button>
          <button type="button" className="tasks-toolbar-btn" disabled>
            <SortIcon />
            Sort
          </button>
        </div>
      </div>

      <Modal
        show={showModal}
        centered
        fullscreen="sm-down"
        dialogClassName="task-modal-dialog"
        onHide={closeTaskModal}
      >
        {editingId ? (
          <>
            <Modal.Header closeButton className="task-modal-header">
              <Modal.Title>Edit Task</Modal.Title>
            </Modal.Header>
            <Modal.Body className="task-modal-body">
              <form id="edit-task-form" onSubmit={handleSubmit}>
                <div className="task-modal-field">
                  <label htmlFor="edit-title">Task Description</label>
                  <input
                    id="edit-title"
                    type="text"
                    className="task-modal-input"
                    placeholder="What needs to be done?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="task-modal-field">
                  <label htmlFor="edit-description">
                    Context &amp; Details
                  </label>
                  <textarea
                    id="edit-description"
                    className="task-modal-textarea"
                    placeholder="Add any background information, links, or specific sub-tasks..."
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="task-modal-field">
                  <label>Priority Level</label>
                  <div
                    className="priority-segments"
                    role="group"
                    aria-label="Priority level"
                  >
                    {["Low", "Medium", "High"].map((level) => (
                      <button
                        key={level}
                        type="button"
                        className={`priority-segment${priority === level ? " active" : ""}`}
                        onClick={() => setPriority(level)}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="task-modal-field">
                  <label htmlFor="edit-due-date">Due Date</label>
                  <input
                    id="edit-due-date"
                    type="date"
                    className="task-modal-textarea task-modal-date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>

                <div className="task-modal-field">
                  <label htmlFor="edit-status">Status</label>
                  <select
                    id="edit-status"
                    className="task-modal-textarea task-modal-select"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer className="task-modal-footer">
              <button
                type="button"
                className="task-modal-discard"
                onClick={closeTaskModal}
              >
                Discard
              </button>
              <button
                type="submit"
                form="edit-task-form"
                className="task-modal-submit"
              >
                Save Changes
              </button>
            </Modal.Footer>
          </>
        ) : (
          <>
            <Modal.Header closeButton className="task-modal-header">
              <Modal.Title>New Task</Modal.Title>
            </Modal.Header>
            <Modal.Body className="task-modal-body">
              <form id="create-task-form" onSubmit={handleSubmit}>
                <div className="task-modal-field">
                  <label htmlFor="create-title">Task Description</label>
                  <input
                    id="create-title"
                    type="text"
                    className="task-modal-input"
                    placeholder="What needs to be done?"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="task-modal-field">
                  <label htmlFor="create-description">
                    Context &amp; Details
                  </label>
                  <textarea
                    id="create-description"
                    className="task-modal-textarea"
                    placeholder="Add any background information, links, or specific sub-tasks..."
                    rows="4"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>

                <div className="task-modal-field">
                  <label>Priority Level</label>
                  <div
                    className="priority-segments"
                    role="group"
                    aria-label="Priority level"
                  >
                    {["Low", "Medium", "High"].map((level) => (
                      <button
                        key={level}
                        type="button"
                        className={`priority-segment${priority === level ? " active" : ""}`}
                        onClick={() => setPriority(level)}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="task-modal-field">
                  <label htmlFor="create-due-date">Due Date</label>
                  <input
                    id="create-due-date"
                    type="date"
                    className="task-modal-textarea task-modal-date"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                  />
                </div>
              </form>
            </Modal.Body>
            <Modal.Footer className="task-modal-footer">
              <button
                type="button"
                className="task-modal-discard"
                onClick={closeTaskModal}
              >
                Discard
              </button>
              <button
                type="submit"
                form="create-task-form"
                className="task-modal-submit"
              >
                Create Task
              </button>
            </Modal.Footer>
          </>
        )}
      </Modal>

      <Modal
        show={showDeleteModal}
        centered
        dialogClassName="delete-modal-dialog"
        onHide={closeDeleteModal}
      >
        <Modal.Body className="delete-modal-body">
          <div className="delete-modal-icon" aria-hidden="true">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M9 3h6l1 2h4v2H4V5h4l1-2z" fill="currentColor" />
              <path
                d="M6 9h12v10a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V9z"
                fill="currentColor"
                opacity="0.85"
              />
              <path
                d="M10 11v6M14 11v6"
                stroke="#fce8e8"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M12 8v2M11 7l1 1 1-1"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className="delete-modal-title">Delete Task?</h2>
          <p className="delete-modal-text">
            Are you sure you want to delete this task? This action cannot be
            undone and will remove all associated logs from your sanctuary.
          </p>
          <div className="delete-modal-actions">
            <button
              type="button"
              className="delete-modal-cancel"
              onClick={closeDeleteModal}
            >
              Cancel
            </button>
            <button
              type="button"
              className="delete-modal-confirm"
              onClick={confirmDelete}
            >
              Delete
            </button>
          </div>
        </Modal.Body>
      </Modal>

      <div className="tasks-table-card">
        {filteredTasks.length === 0 ? (
          <p className="tasks-empty">
            {tasks.length === 0 ? "No tasks yet." : "No tasks match your search."}
          </p>
        ) : (
          <>
            <div className="task-cards d-md-none">
              {filteredTasks.map((task) => {
                const isCompleted = task.status === "Completed";

                return (
                  <article
                    key={task._id}
                    className={`task-card${isCompleted ? " is-completed" : ""}`}
                  >
                    <div className="task-card-header">
                      <span className="task-card-title">{task.title}</span>
                      <span
                        className={`task-status task-status-${task.status.toLowerCase()}`}
                      >
                        <span className="task-status-dot" aria-hidden="true" />
                        {task.status}
                      </span>
                    </div>
                    {task.description && (
                      <p className="task-card-desc">{task.description}</p>
                    )}
                    <div className="task-card-meta">
                      <span className="task-due-date">
                        <CalendarIcon />
                        {formatDueDate(task.dueDate)}
                      </span>
                      {task.priority && (
                        <span className={priorityBadgeClass(task.priority)}>
                          {task.priority}
                        </span>
                      )}
                    </div>
                    <div className="task-card-actions">
                      <button
                        type="button"
                        className="task-action-btn"
                        aria-label="Edit task"
                        onClick={() => handleEdit(task)}
                      >
                        <EditIcon />
                      </button>
                      <button
                        type="button"
                        className="task-action-btn task-action-btn-danger"
                        aria-label="Delete task"
                        onClick={() => openDeleteModal(task._id)}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="tasks-table-wrap d-none d-md-block">
              <table className="tasks-table">
                <thead>
                  <tr>
                    <th>Task name</th>
                    <th>Due date</th>
                    <th>Priority</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTasks.map((task) => {
                    const isCompleted = task.status === "Completed";

                    return (
                      <tr
                        key={task._id}
                        className={isCompleted ? "is-completed" : undefined}
                      >
                        <td>
                          <div className="task-name-cell">
                            <span className="task-name-title">{task.title}</span>
                            {task.description && (
                              <span className="task-name-desc">
                                {task.description}
                              </span>
                            )}
                          </div>
                        </td>
                        <td>
                          <span className="task-due-date">
                            <CalendarIcon />
                            {formatDueDate(task.dueDate)}
                          </span>
                        </td>
                        <td>
                          {task.priority ? (
                            <span className={priorityBadgeClass(task.priority)}>
                              {task.priority}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td>
                          <span
                            className={`task-status task-status-${task.status.toLowerCase()}`}
                          >
                            <span className="task-status-dot" aria-hidden="true" />
                            {task.status}
                          </span>
                        </td>
                        <td>
                          <div className="task-actions">
                            <button
                              type="button"
                              className="task-action-btn"
                              aria-label="Edit task"
                              onClick={() => handleEdit(task)}
                            >
                              <EditIcon />
                            </button>
                            <button
                              type="button"
                              className="task-action-btn task-action-btn-danger"
                              aria-label="Delete task"
                              onClick={() => openDeleteModal(task._id)}
                            >
                              <TrashIcon />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="tasks-table-footer">
              <span>
                Showing {filteredTasks.length} of {tasks.length} task
                {tasks.length === 1 ? "" : "s"}
              </span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default TaskListPage;
