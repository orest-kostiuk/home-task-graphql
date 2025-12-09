import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { Link } from 'react-router-dom';
import { GET_WORKPLANS } from '../graphql/queries';
import { DELETE_WORKPLAN } from '../graphql/mutations';
import WorkplanForm from '../components/WorkplanForm';
import StatusBadge from '../components/StatusBadge';
import './WorkplanList.css';

function WorkplanList() {
  const PAGE_SIZE = 8;
  const [showForm, setShowForm] = useState(false);
  const [editingWorkplan, setEditingWorkplan] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);

  const { loading, error, data, fetchMore, refetch } = useQuery(GET_WORKPLANS, {
    variables: {
      limit: PAGE_SIZE,
      offset: 0,
      status: statusFilter || null,
      category: categoryFilter || null
    }
  });
  const [deleteWorkplan] = useMutation(DELETE_WORKPLAN, {
    refetchQueries: () => [{
      query: GET_WORKPLANS,
      variables: {
        limit: PAGE_SIZE,
        offset: 0,
        status: statusFilter || null,
        category: categoryFilter || null
      }
    }]
  });

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this workplan?')) {
      await deleteWorkplan({ variables: { id } });
    }
  };

  const handleEdit = (workplan) => {
    setEditingWorkplan(workplan);
    setShowForm(true);
  };

  const handleLoadMore = async () => {
    const nextOffset = offset + PAGE_SIZE;
    const { data: moreData } = await fetchMore({
      variables: {
        limit: PAGE_SIZE,
        offset: nextOffset,
        status: statusFilter || null,
        category: categoryFilter || null
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult || !fetchMoreResult.workplansConnection) return prev;
        return {
          workplansConnection: {
            ...fetchMoreResult.workplansConnection,
            nodes: [...prev.workplansConnection.nodes, ...fetchMoreResult.workplansConnection.nodes]
          }
        };
      }
    });
    setOffset(nextOffset);
    setHasMore(!!moreData?.workplansConnection?.hasNextPage);
  };

  useEffect(() => {
    setOffset(0);
    setHasMore(true);
    refetch({
      limit: PAGE_SIZE,
      offset: 0,
      status: statusFilter || null,
      category: categoryFilter || null
    });
  }, [statusFilter, categoryFilter, refetch]);

  useEffect(() => {
    if (offset === 0 && data?.workplansConnection) {
      setHasMore(data.workplansConnection.hasNextPage);
    }
  }, [data, offset, PAGE_SIZE]);

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingWorkplan(null);
  };

  const formatCategory = (category) => {
    return category.charAt(0) + category.slice(1).toLowerCase();
  };

  if (loading) return <div className="container"><p>Loading...</p></div>;
  if (error) return <div className="container"><p>Error loading workplans</p></div>;

  const workplans = data?.workplansConnection?.nodes || [];

  return (
    <div className="container">
      <div className="header">
        <h1>Workplans</h1>
        <div className="header-actions">
          <div className="filters">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
              <option value="">All statuses</option>
              <option value="NOT_STARTED">Not Started</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETE">Complete</option>
            </select>
            <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
              <option value="">All categories</option>
              <option value="ENGINEERING">Engineering</option>
              <option value="SALES">Sales</option>
              <option value="PRODUCT">Product</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            New workplan
          </button>
        </div>
      </div>

      <div className="list">
        {workplans.map((workplan) => (
          <div key={workplan.id} className="list-item">
            <div className="list-item-main">
              <div className="list-item-header">
                <span className="list-item-name">{workplan.name}</span>
                <button className="icon-btn" onClick={() => handleEdit(workplan)} title="Edit">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button className="icon-btn" onClick={() => handleDelete(workplan.id)} title="Delete">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
              <div className="list-item-meta">
                <StatusBadge status={workplan.status} />
                <span className="category">{formatCategory(workplan.category)}</span>
              </div>
            </div>
            <div className="list-item-action">
              {workplan.tasksCount > 0 ? (
                <Link to={`/workplans/${workplan.id}/tasks`} className="link">
                  View {workplan.tasksCount} {workplan.tasksCount === 1 ? 'task' : 'tasks'}
                </Link>
              ) : (
                <Link to={`/workplans/${workplan.id}/tasks`} className="link">
                  Create tasks
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="load-more">
          <button className="btn btn-primary" onClick={handleLoadMore}>
            Load more
          </button>
        </div>
      )}

      {showForm && (
        <WorkplanForm
          workplan={editingWorkplan}
          onClose={handleCloseForm}
          refetchVariables={{
            limit: PAGE_SIZE,
            offset: 0,
            status: statusFilter || null,
            category: categoryFilter || null
          }}
        />
      )}
    </div>
  );
}

export default WorkplanList;
