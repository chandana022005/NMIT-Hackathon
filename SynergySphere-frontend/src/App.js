import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';

// Auth Components
import Login from './components/auth/Login';
import SignUp from './components/auth/SignUp';
import ForgotPassword from './components/auth/ForgotPassword';

// Layout Components
import Layout from './components/layout/Layout';

// Dashboard
import Dashboard from './components/dashboard/Dashboard';

// Project Components
import ProjectList from './components/projects/ProjectList';
import ProjectDetail from './components/projects/ProjectDetail';

// Task Components
import AllTasks from './components/tasks/AllTasks';

// Profile
import Profile from './components/profile/Profile';

// Task Detail Modal
import TaskDetail from './components/tasks/TaskDetail';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { state } = useApp();
  return state.isAuthenticated ? children : <Navigate to="/login" />;
};

// Public Route Component (redirect to projects if authenticated)
const PublicRoute = ({ children }) => {
  const { state } = useApp();
  return !state.isAuthenticated ? children : <Navigate to="/projects" />;
};

// Main App Routes
const AppRoutes = () => {
  const { state, dispatch } = useApp();

  const handleLogin = (user) => {
    dispatch({ type: 'LOGIN', payload: user });
  };

  const handleSignUp = (user) => {
    dispatch({ type: 'LOGIN', payload: user });
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login onLogin={handleLogin} />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignUp onSignUp={handleSignUp} />
            </PublicRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <PublicRoute>
              <ForgotPassword />
            </PublicRoute>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/projects" />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<ProjectList />} />
          <Route path="projects/:id" element={<ProjectDetail />} />
          <Route path="tasks" element={<AllTasks />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/projects" />} />
      </Routes>

      {/* Global Modals */}
      <TaskDetail
        isOpen={state.showTaskDetail}
        onClose={() => dispatch({ type: 'TOGGLE_TASK_DETAIL' })}
      />
    </Router>
  );
};

// Main App Component
const App = () => {
  return (
    <AppProvider>
      <AppRoutes />
    </AppProvider>
  );
};

export default App;
