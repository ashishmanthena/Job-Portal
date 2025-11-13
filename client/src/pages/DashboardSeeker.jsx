import React, { useEffect, useState } from 'react';
import api from '../services/api';

const statusBadges = {
  applied: 'badge',
  viewed: 'badge-warning',
  shortlisted: 'badge-success',
  rejected: 'badge-error'
};

export default function DashboardSeeker() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    api.get('/applications').then(r => {
      setApps(r.data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Welcome, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">Track and manage all your job applications</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="card p-6">
            <p className="text-gray-600 text-sm mb-2">Total Applications</p>
            <p className="text-3xl font-bold text-gray-900">{apps.length}</p>
          </div>
          <div className="card p-6">
            <p className="text-gray-600 text-sm mb-2">Shortlisted</p>
            <p className="text-3xl font-bold text-emerald-600">{apps.filter(a => a.status === 'shortlisted').length}</p>
          </div>
          <div className="card p-6">
            <p className="text-gray-600 text-sm mb-2">Viewed</p>
            <p className="text-3xl font-bold text-blue-600">{apps.filter(a => a.status === 'viewed').length}</p>
          </div>
          <div className="card p-6">
            <p className="text-gray-600 text-sm mb-2">Rejected</p>
            <p className="text-3xl font-bold text-red-600">{apps.filter(a => a.status === 'rejected').length}</p>
          </div>
        </div>

        {/* Applications */}
        <div className="card">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900">My Applications</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : apps.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {apps.map(a => (
                <div key={a._id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900">{a.job?.title}</h3>
                      <p className="text-gray-600">{a.job?.company}</p>
                    </div>
                    <span className={statusBadges[a.status.toLowerCase()] || 'badge'}>
                      {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-gray-100">
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Location</p>
                      <p className="text-sm font-medium text-gray-900">{a.job?.location}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Applied</p>
                      <p className="text-sm font-medium text-gray-900">{new Date(a.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-1">Last Update</p>
                      <p className="text-sm font-medium text-gray-900">{new Date(a.updatedAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No applications yet</h3>
              <p className="text-gray-600">Start applying to jobs to see them here</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
