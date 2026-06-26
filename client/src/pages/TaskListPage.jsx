import { useState, useEffect } from 'react';
import { getTasks, createTask, deleteTask, updateTask } from '../api/taskApi';

function TaskListPage() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [status, setStatus] = useState('Pending');
    const [editingId, setEditingId] = useState(null);

    const fetchTasks = async () => {
        try {
            const response = await getTasks();
            setTasks(Array.isArray(response.data) ? response.data : []);
            setError('');
        } catch (err) {
            console.error(err);
            setError('Failed to load tasks');
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
            if(editingId) {
                await updateTask(editingId, {title, description, status});
                setEditingId(null);
            } else {
                await createTask({title, description, status});
            }

            setTitle('');
            setDescription('');
            setStatus('Pending');
            await fetchTasks();
        } catch (err) {
            console.error(err);
            setError(editingId ? 'Failed to update task' : 'Failed to create task');
        }
    };

    const handleDelete = async (id) => {
        if(!window.confirm('Delete this task?')) return;

        try {
            await deleteTask(id);
            await fetchTasks();
        } catch (err) {
            console.error(err);
            setError('Failed to delete task');
        }
    };

    const handleEdit = (task) => {
        setEditingId(task._id);
        setTitle(task.title);
        setDescription(task.description);
        setStatus(task.status);
    };

    if(loading) return <p>Loading...</p>;
    if(error) return <p>{error}</p>;

    return (
        <div>
            <h1>TaskNest - All Tasks</h1>

            <form onSubmit={handleSubmit}>
                <h2>{editingId ? 'Edit Task' : 'Add Task'}</h2>

                <input 
                    type="text"
                    placeholder="Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                />

                <textarea
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />

                <select 
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                >
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                </select>

                <button type="submit">{editingId ? 'Save Changes' : 'Add Task'}</button>

                {editingId && (
                    <button 
                        type="button"
                        onClick={() => {
                            setEditingId(null);
                            setTitle('');
                            setDescription('');
                            setStatus('Pending');
                        }}
                    >Cancel</button>
                )}
            </form>

            {tasks.length === 0 ? (
                <p>No tasks yet.</p>
            ) : (
                <ul>
                    {tasks.map((task) => (
                        <li key={task._id}>
                            {task.title} - {task.status}
                            <button type="button" onClick={() => handleDelete(task._id)}>Delete</button>
                            <button type="button" onClick={() => handleEdit(task)}>Edit</button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TaskListPage;