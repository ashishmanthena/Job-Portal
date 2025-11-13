import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Jobs from './pages/Jobs';
import JobDetail from './pages/JobDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardSeeker from './pages/DashboardSeeker';
import DashboardRecruiter from './pages/DashboardRecruiter';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-4">
        <Routes>
          <Route path="/" element={<Jobs />} />
          <Route path="/jobs/:id" element={<JobDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard/seeker" element={<ProtectedRoute><DashboardSeeker /></ProtectedRoute>} />
          <Route path="/dashboard/recruiter" element={<ProtectedRoute><DashboardRecruiter /></ProtectedRoute>} />
        </Routes>
      </div>
    </>
  );
}
