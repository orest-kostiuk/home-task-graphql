# Maestro Full-Stack Take-Home Test

Your assignment is to build a Workplan/Task list web application that follows the design shown below (full details in (`full-stack-take-home.fig`, which is a [Figma](https://www.figma.com/) file). The application will have 3 main components: Front-End React UI, Server and Database.

![](workplans.png)
![](workplans-create.png)
![](tasks.png)
![](tasks-create.png)

### Requirements

- The frontend should be a standalone, single-page React application, that communicates with API endpoints served from a backend server you will write.
- The frontend can use third party packages if desired to expedite developement (icons, widgets, libraries, etcs)
- The server can be built using any framework of your choosing (i.e Rails, Django, Node, Flask, etc.)
- The server should store the application's data in a relational database of your choosing (i.e. MySql, Postgres, etc).
- The server should expose application data (no markup or styling) to the frontend via REST or GraphQL APIs
- The server does not need to authenticate requests

### Getting started

- To create your initial front-end app, use `create-react-app` (https://reactjs.org/docs/create-a-new-react-app.html#create-react-app)
- Follow documentation/tutorials from your web framework of choice to setup initial server and database

### What we're looking for

Backend:
- intuitive data modeling and use of ORM if supported by your framework
- performant and well thought-out REST/Graphql API endpoints
- best practices with database schema (indexes, fk constraints, enums, etc)

Frontend:
- logical encapsulation of UI components
- efficient fetching of data from server
- use of hooks and state management
- attention to detail matching your code to the design

### What we're not looking for

- **Tests.** If they assist you in building the project than by all means write them but we're looking for implementing the design and functionality so don't prioritize them.

### Submitting

Along with your code, create a short `README.md` file that talks about any interesting things you ran into and/or decisions you made etc. Also use this as a place to tell us any context around a certain decision you've made or if you couldn't get something completed, explain what you would do if you had more time.

Once done, create a public or private repo on Github. If it's private then you can invite the interviewer (`bill-filler`).

### Things to note

