import { ApolloProvider } from '@apollo/client/react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import client from './graphql/client';
import WorkplanList from './pages/WorkplanList';
import TaskList from './pages/TaskList';
import './App.css';

function App() {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <div className="app">
          <Routes>
            <Route path="/" element={<WorkplanList />} />
            <Route path="/workplans/:id/tasks" element={<TaskList />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ApolloProvider>
  );
}

export default App;
