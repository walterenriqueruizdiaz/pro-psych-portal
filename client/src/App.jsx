import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import CompleteProfile from './pages/CompleteProfile';
import Dashboard from './pages/Dashboard';
import PatientList from './pages/PatientList';
import PatientForm from './pages/PatientForm';
import Schedule from './pages/Schedule';
import AppointmentForm from './pages/AppointmentForm';
import SessionForm from './pages/SessionForm';
import SessionList from './pages/SessionList';
import AdminDashboard from './pages/AdminDashboard';
import PatientContacts from './pages/PatientContacts';
import { AuthProvider, useAuth } from './context/AuthContext';

// Real protected route wrapper
const PrivateRoute = ({ children }) => {
  const { authenticated, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading application...</div>;

  return authenticated ? <Layout>{children}</Layout> : <Navigate to="/" />;
};

// Admin protected route
const AdminRoute = ({ children }) => {
  const { authenticated, user, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading application...</div>;

  if (!authenticated) return <Navigate to="/" />;
  if (user?.role !== 'ADMIN') return <Navigate to="/dashboard" />;

  return <Layout>{children}</Layout>;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/complete-profile" element={<PrivateRoute><CompleteProfile /></PrivateRoute>} />
          <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />

          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />

          <Route path="/patients" element={<PrivateRoute><PatientList /></PrivateRoute>} />
          <Route path="/patients/new" element={<PrivateRoute><PatientForm /></PrivateRoute>} />
          <Route path="/patients/:id" element={<PrivateRoute><PatientForm /></PrivateRoute>} />
          <Route path="/patients/:id/contacts" element={<PrivateRoute><PatientContacts /></PrivateRoute>} />

          <Route path="/appointments" element={<PrivateRoute><Schedule /></PrivateRoute>} />
          <Route path="/appointments/new" element={<PrivateRoute><AppointmentForm /></PrivateRoute>} />
          <Route path="/appointments/:id/edit" element={<PrivateRoute><AppointmentForm /></PrivateRoute>} />
          <Route path="/appointments/:id/session" element={<PrivateRoute><SessionForm /></PrivateRoute>} />
          <Route path="/sessions" element={<PrivateRoute><SessionList /></PrivateRoute>} />
          <Route path="/sessions/:sessionId/edit" element={<PrivateRoute><SessionForm /></PrivateRoute>} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
