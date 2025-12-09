# Workplan & Task Manager

Single-page React app backed by a Rails GraphQL API to manage workplans, tasks, and comments. Built to mirror the provided Figma layouts with scrollable lists, pill status badges, and light, card-like panels.

## Stack
- Frontend: React 19, Apollo Client, React Router, vanilla CSS.
- Backend: Rails 8 (graphql-ruby), SQLite, ActiveRecord enums/counter caches.
- GraphQL endpoint: `http://localhost:3001/graphql` (CORS opened for localhost ports).

## Running the app
Backend:
```bash
cd backend
bundle install
rails db:create db:migrate db:seed
rails server -p 3001
```

Frontend (in a separate terminal):
```bash
cd frontend
npm install
npm start
# App runs at http://localhost:3000 and talks to the Rails GraphQL server on 3001
```

GraphiQL (for manual queries/mutations): `http://localhost:3001/graphiql`

## Features delivered
- Workplans: create/update/delete with status + category enums; list shows task counts and deep-links into a workplan’s tasks.
- Tasks: per-workplan list with status/due date, edit/delete, and a “New task” modal; rows styled/hoverable per the design and kept scrollable. Added task status filter + paginated `tasksConnection` with `hasNextPage/totalCount`.
- Workplans pagination/filters: filter by status/category and paginated `workplansConnection` with `hasNextPage/totalCount`.
- Comments (extra credit): add/edit/delete comments inline on each task with timestamps; refreshed via GraphQL mutations.
- Seed data: `rails db:seed` preloads example workplans, tasks, and comments.

## Implementation notes
- GraphQL schema uses integer enums for status/category and a `tasks_count` counter cache for efficient list rendering. Added `resolve_type` to prevent interface/union resolution errors.
- Apollo client uses query refetching after mutations to keep lists consistent; minimal local state for modal visibility and comment drafts.
