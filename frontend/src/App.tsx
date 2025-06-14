import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { authService } from './service/authService';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            authService.isAuthenticated()
              ? <Navigate to="/dashboard" />
              : <Navigate to="/login" />
          }
        />
        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
