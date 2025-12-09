import { gql } from '@apollo/client';

export const CREATE_WORKPLAN = gql`
  mutation CreateWorkplan($name: String!, $status: StatusEnum, $category: CategoryEnum!) {
    createWorkplan(input: { name: $name, status: $status, category: $category }) {
      workplan {
        id
        name
        status
        category
        tasksCount
      }
      errors
    }
  }
`;

export const UPDATE_WORKPLAN = gql`
  mutation UpdateWorkplan($id: ID!, $name: String, $status: StatusEnum, $category: CategoryEnum) {
    updateWorkplan(input: { id: $id, name: $name, status: $status, category: $category }) {
      workplan {
        id
        name
        status
        category
      }
      errors
    }
  }
`;

export const DELETE_WORKPLAN = gql`
  mutation DeleteWorkplan($id: ID!) {
    deleteWorkplan(input: { id: $id }) {
      workplan {
        id
      }
      errors
    }
  }
`;

export const CREATE_TASK = gql`
  mutation CreateTask($name: String!, $status: StatusEnum!, $dueDate: ISO8601Date!, $workplanId: ID!) {
    createTask(input: { name: $name, status: $status, dueDate: $dueDate, workplanId: $workplanId }) {
      task {
        id
        name
        status
        dueDate
      }
      errors
    }
  }
`;

export const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $name: String, $status: StatusEnum, $dueDate: ISO8601Date) {
    updateTask(input: { id: $id, name: $name, status: $status, dueDate: $dueDate }) {
      task {
        id
        name
        status
        dueDate
      }
      errors
    }
  }
`;

export const DELETE_TASK = gql`
  mutation DeleteTask($id: ID!) {
    deleteTask(input: { id: $id }) {
      task {
        id
      }
      errors
    }
  }
`;

export const CREATE_COMMENT = gql`
  mutation CreateComment($body: String!, $taskId: ID!) {
    createComment(input: { body: $body, taskId: $taskId }) {
      comment {
        id
        body
        createdAt
        taskId
      }
      errors
    }
  }
`;

export const DELETE_COMMENT = gql`
  mutation DeleteComment($id: ID!) {
    deleteComment(input: { id: $id }) {
      comment {
        id
      }
      errors
    }
  }
`;

export const UPDATE_COMMENT = gql`
  mutation UpdateComment($id: ID!, $body: String!) {
    updateComment(input: { id: $id, body: $body }) {
      comment {
        id
        body
        updatedAt
        createdAt
      }
      errors
    }
  }
`;
