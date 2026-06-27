import { useState, useEffect } from "react";
import { getTasks, createTask, deleteTask, updateTask } from "../api/taskApi";
import { Modal, Button } from "react-bootstrap";

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
      setShowDeleteModal(false);
      setDeleteId(null);
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

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <h1 className="h3 mb-4">TaskNest - All Tasks</h1>
      <p className="text-muted">Manage your sanctuary of focused work</p>

      <button
        type="button"
        className="btn btn-new-task mb-4"
        onClick={() => setShowModal(true)}
      >
        + Add Task
      </button>

      <Modal
        show={showModal}
        onHide={() => {
          setShowModal(false);
          setEditingId(null);
          setTitle("");
          setDescription("");
          setStatus("Pending");
          setPriority("Medium");
          setDueDate("");
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>{editingId ? "Edit Task" : "Add Task"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                placeholder="Description"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Priority</label>
              <select
                className="form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="mb-3">
              <label className="form-label">Due Date</label>
              <input
                type="date"
                className="form-control"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <button type="submit" className="btn btn-new-task">
              {editingId ? "Save Changes" : "Add Task"}
            </button>
          </form>
        </Modal.Body>
      </Modal>

      <Modal
        show={showDeleteModal}
        onHide={() => {
          setShowDeleteModal(false);
          setDeleteId(null);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title>Delete task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this task? This cannot be undone.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => {
              setShowDeleteModal(false);
              setDeleteId(null);
            }}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      {tasks.length === 0 ? (
        <p className="text-muted">No tasks yet.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover align-middle bg-white">
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
              {tasks.map((task) => (
                <tr key={task._id}>
                  <td>
                    <strong>{task.title}</strong>
                    {task.description && (
                      <div className="small text-muted">{task.description}</div>
                    )}
                  </td>
                  <td>
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "—"}
                  </td>
                  <td>
                    {task.priority ? (
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
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    <span
                      className={`badge ${
                        task.status === "Completed"
                          ? "bg-success"
                          : "bg-warning text-dark"
                      }`}
                    >
                      {task.status}
                    </span>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => handleEdit(task)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => openDeleteModal(task._id)}
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
  );
}

export default TaskListPage;
