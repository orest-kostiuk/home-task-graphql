import { useState } from 'react';
import { useMutation } from '@apollo/client/react';
import { CREATE_WORKPLAN, UPDATE_WORKPLAN } from '../graphql/mutations';
import { GET_WORKPLANS } from '../graphql/queries';
import './Modal.css';

function WorkplanForm({ workplan, onClose, refetchVariables }) {
  const isEditing = !!workplan;
  const [name, setName] = useState(workplan?.name || '');
  const [category, setCategory] = useState(workplan?.category || '');
  const [status, setStatus] = useState(workplan?.status || '');

  const [createWorkplan, { loading: creating }] = useMutation(CREATE_WORKPLAN, {
    refetchQueries: [{
      query: GET_WORKPLANS,
      variables: refetchVariables
    }]
  });

  const [updateWorkplan, { loading: updating }] = useMutation(UPDATE_WORKPLAN, {
    refetchQueries: [{
      query: GET_WORKPLANS,
      variables: refetchVariables
    }]
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isEditing) {
      await updateWorkplan({
        variables: {
          id: workplan.id,
          name,
          category,
          status
        }
      });
    } else {
      await createWorkplan({
        variables: {
          name,
          category,
          status: status || 'NOT_STARTED'
        }
      });
    }
    onClose();
  };

  const loading = creating || updating;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h2>{isEditing ? 'Edit workplan' : 'Create new workplan'}</h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter workplan name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select category</option>
              <option value="ENGINEERING">Engineering</option>
              <option value="SALES">Sales</option>
              <option value="PRODUCT">Product</option>
            </select>
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

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {isEditing ? 'Save changes' : 'Create workplan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default WorkplanForm;
