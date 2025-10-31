import { useState, useEffect } from 'react';
import { getTasks, createTask, updateTask, deleteTask } from './services/api';
import type { TaskItem } from './types/TaskItem';
import './App.css';

type FilterType = 'all' | 'pending' | 'completed';

function App() {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [filter, setFilter] = useState<FilterType>('all');

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const response = await getTasks();
      setTasks(response.data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const handleAdd = async () => {
    if (!newTaskDesc.trim()) return;
    try {
      await createTask(newTaskDesc);
      setNewTaskDesc('');
      loadTasks();
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const handleToggle = async (id: string, isCompleted: boolean) => {
    try {
      await updateTask(id, !isCompleted);
      loadTasks();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteTask(id);
      loadTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'pending') return !task.isCompleted;
    if (filter === 'completed') return task.isCompleted;
    return true;
  });

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => !t.isCompleted).length,
    completed: tasks.filter(t => t.isCompleted).length
  };

  return (
    <div className="container">
      <div className="header">
        <h1>Task Manager</h1>
        <p className="subtitle">Organize your tasks efficiently</p>
      </div>

      <div className="add-task">
        <input
          type="text"
          value={newTaskDesc}
          onChange={(e) => setNewTaskDesc(e.target.value)}
          placeholder="Enter a new task..."
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
        />
        <button className="btn-add" onClick={handleAdd}>
          <span>➕ Add</span>
        </button>
      </div>

      <div className="filter-tabs">
        <button
          className={filter === 'all' ? 'active' : ''}
          onClick={() => setFilter('all')}
        >
          All ({stats.total})
        </button>
        <button
          className={filter === 'pending' ? 'active' : ''}
          onClick={() => setFilter('pending')}
        >
          Pending ({stats.pending})
        </button>
        <button
          className={filter === 'completed' ? 'active' : ''}
          onClick={() => setFilter('completed')}
        >
          Completed ({stats.completed})
        </button>
      </div>

      <div className="tasks-section">
        <h3>Tasks ({filteredTasks.length})</h3>
        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <p>No tasks yet. Add one above!</p>
          </div>
        ) : (
          <ul className="task-list">
            {filteredTasks.map((task) => (
              <li key={task.id} className={task.isCompleted ? 'completed' : ''}>
                <div className="task-left">
                  <input
                    type="checkbox"
                    checked={task.isCompleted}
                    onChange={() => handleToggle(task.id, task.isCompleted)}
                  />
                  <div className="task-content">
                    <span className="task-description">{task.description}</span>
                    <span className="task-meta">
                      Created: {formatDate(task.createdAt)}
                      {task.updatedAt && ` • Updated: ${formatDate(task.updatedAt)}`}
                    </span>
                  </div>
                </div>
                <div className="task-right">
                  <span className={`status-badge ${task.isCompleted ? 'completed' : 'pending'}`}>
                    {task.isCompleted ? '✓ Completed' : '⏳ Pending'}
                  </span>
                  <button className="btn-delete" onClick={() => handleDelete(task.id)}>
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

export default App;
