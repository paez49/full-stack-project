import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './views/Login';
import Dashboard from './views/Dashboard';
import PatientsPage from './views/Patient';
import HospitalsPage from './views/Hospitals';
import ProtectedRoute from './components/ProtectedRoute';
import { authService } from './service/authService';
import ProtectedLayout from './layout/ProtectedLayout';


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
              <ProtectedLayout>
                <Dashboard />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/patients"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <PatientsPage />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />

        <Route
          path="/hospitals"
          element={
            <ProtectedRoute>
              <ProtectedLayout>
                <HospitalsPage />
              </ProtectedLayout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
};

export default App;
