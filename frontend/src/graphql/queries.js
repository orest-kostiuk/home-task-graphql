import { gql } from '@apollo/client';

export const GET_WORKPLANS = gql`
  query GetWorkplans($limit: Int, $offset: Int, $status: StatusEnum, $category: CategoryEnum) {
    workplansConnection(limit: $limit, offset: $offset, status: $status, category: $category) {
      nodes {
        id
        name
        status
        category
        tasksCount
      }
      totalCount
      hasNextPage
    }
  }
`;

export const GET_WORKPLAN = gql`
  query GetWorkplan($id: ID!, $taskLimit: Int, $taskOffset: Int, $taskStatus: StatusEnum) {
    workplan(id: $id) {
      id
      name
      status
      category
      tasksConnection(limit: $taskLimit, offset: $taskOffset, status: $taskStatus) {
        nodes {
          id
          name
          status
          dueDate
          comments {
            id
            body
            createdAt
            updatedAt
          }
        }
        totalCount
        hasNextPage
      }
    }
  }
`;
