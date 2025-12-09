import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { CREATE_TASK, UPDATE_TASK } from '../graphql/mutations';
import { GET_WORKPLAN } from '../graphql/queries';
import './Modal.css';

function TaskForm({ task, workplanId, onClose, refetchVariables }) {
  const isEditing = !!task;
  const [name, setName] = useState(task?.name || '');
  const [status, setStatus] = useState(task?.status || '');
  const [dueDate, setDueDate] = useState(task?.dueDate || '');

  const [createTask, { loading: creating }] = useMutation(CREATE_TASK, {
    refetchQueries: [{
      query: GET_WORKPLAN,
      variables: refetchVariables || { id: workplanId }
    }]
  });

  const [updateTask, { loading: updating }] = useMutation(UPDATE_TASK, {
    refetchQueries: [{
      query: GET_WORKPLAN,
      variables: refetchVariables || { id: workplanId }
    }]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditing) {
      await updateTask({
        variables: {
          id: task.id,
          name,
          status,
          dueDate
        }
      });
    } else {
      await createTask({
        variables: {
          name,
          status: status || 'NOT_STARTED',
          dueDate,
          workplanId
        }
      });
    }
    onClose();
  };

  const loading = creating || updating;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{isEditing ? 'Edit task' : 'Create new task'}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter task name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="">Select status</option>
              <option value="NOT_STARTED">Not Started</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETE">Complete</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dueDate">Due date</label>
            <input
              id="dueDate"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {isEditing ? 'Save changes' : 'Create task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default TaskForm;
