import { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client/react';
import { useParams, Link } from 'react-router-dom';
import { GET_WORKPLAN } from '../graphql/queries';
import { CREATE_COMMENT, DELETE_COMMENT, DELETE_TASK, UPDATE_COMMENT } from '../graphql/mutations';
import TaskForm from '../components/TaskForm';
import StatusBadge from '../components/StatusBadge';
import './TaskList.css';

function TaskList() {
  const PAGE_SIZE = 8;
  const { id } = useParams();
  const [showForm, setShowForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [commentDrafts, setCommentDrafts] = useState({});
  const [editingComments, setEditingComments] = useState({});
  const [taskStatusFilter, setTaskStatusFilter] = useState('');
  const [taskOffset, setTaskOffset] = useState(0);

  const { loading, error, data, fetchMore, refetch } = useQuery(GET_WORKPLAN, {
    variables: {
      id,
      taskLimit: PAGE_SIZE,
      taskOffset: 0,
      taskStatus: taskStatusFilter || null
    }
  });

  const [deleteTask] = useMutation(DELETE_TASK, {
    refetchQueries: () => [{
      query: GET_WORKPLAN,
      variables: { id, taskLimit: PAGE_SIZE, taskOffset: 0, taskStatus: taskStatusFilter || null }
    }]
  });

  const [createComment, { loading: creatingComment }] = useMutation(CREATE_COMMENT, {
    refetchQueries: () => [{
      query: GET_WORKPLAN,
      variables: { id, taskLimit: PAGE_SIZE, taskOffset: 0, taskStatus: taskStatusFilter || null }
    }]
  });

  const [deleteComment, { loading: deletingComment }] = useMutation(DELETE_COMMENT, {
    refetchQueries: () => [{
      query: GET_WORKPLAN,
      variables: { id, taskLimit: PAGE_SIZE, taskOffset: 0, taskStatus: taskStatusFilter || null }
    }]
  });

  const [updateComment, { loading: updatingComment }] = useMutation(UPDATE_COMMENT, {
    refetchQueries: () => [{
      query: GET_WORKPLAN,
      variables: { id, taskLimit: PAGE_SIZE, taskOffset: 0, taskStatus: taskStatusFilter || null }
    }]
  });

  const handleDelete = async (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteTask({ variables: { id: taskId } });
    }
  };

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: '2-digit'
    });
  };

  const handleCommentChange = (taskId, value) => {
    setCommentDrafts((prev) => ({ ...prev, [taskId]: value }));
  };

  const handleAddComment = async (taskId) => {
    const body = (commentDrafts[taskId] || '').trim();
    if (!body) return;

    await createComment({ variables: { body, taskId } });
    setCommentDrafts((prev) => ({ ...prev, [taskId]: '' }));
  };

  const formatDateTime = (isoString) => {
    const date = new Date(isoString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const handleDeleteComment = async (commentId) => {
    await deleteComment({ variables: { id: commentId } });
  };

  const handleStartEditComment = (comment) => {
    setEditingComments((prev) => ({ ...prev, [comment.id]: comment.body }));
  };

  const handleChangeEditComment = (commentId, value) => {
    setEditingComments((prev) => ({ ...prev, [commentId]: value }));
  };

  const handleSaveEditComment = async (commentId) => {
    const body = (editingComments[commentId] || '').trim();
    if (!body) return;
    await updateComment({ variables: { id: commentId, body } });
    setEditingComments((prev) => {
      const next = { ...prev };
      delete next[commentId];
      return next;
    });
  };

  const handleCancelEditComment = (commentId) => {
    setEditingComments((prev) => {
      const next = { ...prev };
      delete next[commentId];
      return next;
    });
  };

  const handleLoadMoreTasks = async () => {
    const nextOffset = taskOffset + PAGE_SIZE;
    const { data: moreData } = await fetchMore({
      variables: {
        id,
        taskLimit: PAGE_SIZE,
        taskOffset: nextOffset,
        taskStatus: taskStatusFilter || null
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (!fetchMoreResult || !fetchMoreResult.workplan) return prev;
        return {
          workplan: {
            ...prev.workplan,
            ...fetchMoreResult.workplan,
            tasksConnection: {
              ...fetchMoreResult.workplan.tasksConnection,
              nodes: [
                ...(prev.workplan?.tasksConnection?.nodes || []),
                ...(fetchMoreResult.workplan.tasksConnection?.nodes || [])
              ]
            }
          }
        };
      }
    });
    setTaskOffset(nextOffset);
  };

  useEffect(() => {
    setTaskOffset(0);
    refetch({
      id,
      taskLimit: PAGE_SIZE,
      taskOffset: 0,
      taskStatus: taskStatusFilter || null
    });
  }, [taskStatusFilter, refetch, id]);

  useEffect(() => {
  }, [data, taskOffset, PAGE_SIZE]);

  const isCommentMutating = creatingComment || deletingComment || updatingComment;

  if (loading) return <div className="container"><p>Loading...</p></div>;
  if (error) return <div className="container"><p>Error loading tasks</p></div>;

  const workplan = data.workplan;
  if (!workplan) return <div className="container"><p>Workplan not found.</p></div>;
  const tasksConnection = workplan.tasksConnection || { nodes: [], hasNextPage: false };

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1>{workplan.name}</h1>
          <Link to="/" className="back-link">Back to workplans</Link>
        </div>
        <div className="header-actions">
          <div className="filters">
            <select value={taskStatusFilter} onChange={(e) => setTaskStatusFilter(e.target.value)}>
              <option value="">All statuses</option>
              <option value="NOT_STARTED">Not Started</option>
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETE">Complete</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={() => setShowForm(true)}>
            New task
          </button>
        </div>
      </div>

      <div className="list">
        {tasksConnection.nodes.map((task) => (
          <div key={task.id} className="list-item">
            <div className="list-item-main">
              <div className="list-item-header">
                <span className="list-item-name">{task.name}</span>
                <button className="icon-btn" onClick={() => handleEdit(task)} title="Edit">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                </button>
                <button className="icon-btn" onClick={() => handleDelete(task.id)} title="Delete">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </button>
              </div>
              <div className="list-item-meta">
                <StatusBadge status={task.status} />
                <span className="due-date">{formatDate(task.dueDate)}</span>
              </div>
            </div>
            <div className="comments">
              <div className="comments-header">Comments</div>
              <div className="comments-list">
                {task.comments.length === 0 && (
                  <p className="comment-empty">No comments yet. Start the conversation.</p>
                )}
                {task.comments.map((comment) => {
                  const isEditing = editingComments[comment.id] !== undefined;
                  return (
                    <div key={comment.id} className="comment-row">
                      <div className="comment-main">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editingComments[comment.id]}
                            onChange={(e) => handleChangeEditComment(comment.id, e.target.value)}
                          />
                        ) : (
                          <span className="comment-body">{comment.body}</span>
                        )}
                        <span className="comment-timestamp">
                          {formatDateTime(comment.updatedAt || comment.createdAt)}
                        </span>
                      </div>
                      <div className="comment-actions">
                        {isEditing ? (
                          <>
                            <button
                              className="btn btn-secondary small"
                              onClick={() => handleCancelEditComment(comment.id)}
                              disabled={isCommentMutating}
                            >
                              Cancel
                            </button>
                            <button
                              className="btn btn-primary small"
                              onClick={() => handleSaveEditComment(comment.id)}
                              disabled={isCommentMutating}
                            >
                              Save
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="icon-btn small"
                              onClick={() => handleStartEditComment(comment)}
                              title="Edit comment"
                              disabled={isCommentMutating}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                              </svg>
                            </button>
                            <button
                              className="icon-btn small"
                              onClick={() => handleDeleteComment(comment.id)}
                              title="Delete comment"
                              disabled={isCommentMutating}
                            >
                              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <polyline points="3 6 5 6 21 6" />
                                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                              </svg>
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="comment-form">
                <input
                  type="text"
                  value={commentDrafts[task.id] || ''}
                  onChange={(e) => handleCommentChange(task.id, e.target.value)}
                  placeholder="Add a comment"
                />
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={() => handleAddComment(task.id)}
                  disabled={isCommentMutating}
                >
                  Add
                </button>
              </div>
            </div>
          </div>
        ))}

        {tasksConnection.nodes.length === 0 && (
          <p className="empty-state">No tasks yet. Create one to get started.</p>
        )}
      </div>

      {tasksConnection.hasNextPage && (
        <div className="load-more">
          <button className="btn btn-primary" onClick={handleLoadMoreTasks}>
            Load more tasks
          </button>
        </div>
      )}

      {showForm && (
        <TaskForm
          task={editingTask}
          workplanId={id}
          onClose={handleCloseForm}
          refetchVariables={{
            id,
            taskLimit: PAGE_SIZE,
            taskOffset: 0,
            taskStatus: taskStatusFilter || null
          }}
        />
      )}
    </div>
  );
}

export default TaskList;
