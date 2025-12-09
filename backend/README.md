# Workplan Task Manager - Backend API

GraphQL API for managing workplans and tasks built with Rails 8 and SQLite.

## Tech Stack

- Rails 8.0.2
- GraphQL (graphql-ruby 2.5)
- SQLite3
- GraphiQL (development)

## Setup

### Prerequisites

- Ruby 3.3.4
- Bundler

### Installation

```bash
cd backend
bundle install
rails db:create db:migrate db:seed
rails server -p 3001
```

### GraphiQL

Access the GraphQL IDE at: http://localhost:3001/graphiql

## Data Model

### Workplan

- name (string)
- status (enum: not_started, in_progress, complete)
- category (enum: engineering, sales, product)
- has_many tasks

### Task

- name (string)
- status (enum)
- due_date (date)
- belongs_to workplan
- has_many comments

### Comment (Extra Credit)

- body (text)
- belongs_to task

## API Examples

### Query: List Workplans

```graphql
query {
  workplans {
    id
    name
    status
    category
    tasksCount
    tasks {
      id
      name
      dueDate
    }
  }
}
```

### Query: Single Workplan

```graphql
query {
  workplan(id: "1") {
    id
    name
    tasks {
      id
      name
      status
      dueDate
      comments {
        id
        body
      }
    }
  }
}
```

### Mutation: Create Workplan

```graphql
mutation {
  createWorkplan(input: {
    name: "Q1 Launch"
    status: NOT_STARTED
    category: PRODUCT
  }) {
    workplan {
      id
      name
    }
    errors
  }
}
```

### Mutation: Create Task

```graphql
mutation {
  createTask(input: {
    name: "Design review"
    status: IN_PROGRESS
    dueDate: "2025-01-15"
    workplanId: "1"
  }) {
    task {
      id
      name
      workplan {
        tasksCount
      }
    }
    errors
  }
}
```

### Mutation: Update Workplan

```graphql
mutation {
  updateWorkplan(input: {
    id: "1"
    status: COMPLETE
  }) {
    workplan {
      id
      status
    }
    errors
  }
}
```

### Mutation: Delete Task

```graphql
mutation {
  deleteTask(input: { id: "1" }) {
    task {
      id
    }
    errors
  }
}
```