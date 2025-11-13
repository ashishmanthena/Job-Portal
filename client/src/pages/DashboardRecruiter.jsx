import React, { useEffect, useState } from 'react';
import api from '../services/api';

const statusColors = {
  applied: { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' },
  viewed: { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700' },
  shortlisted: { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700' },
  rejected: { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' }
};

export default function DashboardRecruiter() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  useEffect(() => {
    api.get('/applications').then(r => {
      setApps(r.data);
      setLoading(false);
    });
  }, []);

  async function updateStatus(id, status) {
    try {
      await api.put(`/applications/${id}/status`, { status });
      setApps(apps.map(a => a._id === id ? { ...a, status } : a));
    } catch (err) {
      alert('Failed to update status');
    }
  }

  const filteredApps = filter === 'all' ? apps : apps.filter(a => a.status === filter);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
          <p className="text-gray-600 mt-2">Manage applications to your job postings</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="card p-6 cursor-pointer hover:shadow-md" onClick={() => setFilter('all')}>
            <p className="text-gray-600 text-sm mb-2">Total Applications</p>
            <p className="text-3xl font-bold text-gray-900">{apps.length}</p>
          </div>
          <div className="card p-6 cursor-pointer hover:shadow-md" onClick={() => setFilter('applied')}>
            <p className="text-gray-600 text-sm mb-2">New</p>
            <p className="text-3xl font-bold text-blue-600">{apps.filter(a => a.status === 'applied').length}</p>
          </div>
          <div className="card p-6 cursor-pointer hover:shadow-md" onClick={() => setFilter('viewed')}>
            <p className="text-gray-600 text-sm mb-2">Viewed</p>
            <p className="text-3xl font-bold text-amber-600">{apps.filter(a => a.status === 'viewed').length}</p>
          </div>
          <div className="card p-6 cursor-pointer hover:shadow-md" onClick={() => setFilter('shortlisted')}>
            <p className="text-gray-600 text-sm mb-2">Shortlisted</p>
            <p className="text-3xl font-bold text-emerald-600">{apps.filter(a => a.status === 'shortlisted').length}</p>
          </div>
          <div className="card p-6 cursor-pointer hover:shadow-md" onClick={() => setFilter('rejected')}>
            <p className="text-gray-600 text-sm mb-2">Rejected</p>
            <p className="text-3xl font-bold text-red-600">{apps.filter(a => a.status === 'rejected').length}</p>
          </div>
        </div>

        {/* Applications */}
        <div className="card">
          <div className="border-b border-gray-200 p-6">
            <h2 className="text-2xl font-bold text-gray-900">Applications ({filteredApps.length})</h2>
          </div>

          {loading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : filteredApps.length > 0 ? (
            <div className="divide-y divide-gray-200">
              {filteredApps.map(a => {
                const colors = statusColors[a.status.toLowerCase()] || statusColors.applied;
                return (
                  <div key={a._id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">{a.applicant?.name}</h3>
                        <p className="text-gray-600">{a.job?.title}</p>
                      </div>
                      <div className={`px-4 py-2 rounded-full text-sm font-medium border ${colors.bg} ${colors.border} ${colors.text}`}>
                        {a.status.charAt(0).toUpperCase() + a.status.slice(1)}
                      </div>
                    </div>

                    <div className="mb-4">
                      {a.coverLetter && (
                        <div className="bg-gray-50 p-3 rounded border border-gray-200 mb-3">
                          <p className="text-xs text-gray-600 mb-1">Cover Letter</p>
                          <p className="text-sm text-gray-700 line-clamp-2">{a.coverLetter}</p>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500">
                        Applied {new Date(a.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                      <div className="flex gap-2">
                        {a.status !== 'viewed' && (
                          <button 
                            onClick={() => updateStatus(a._id, 'viewed')}
                            className="px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium"
                          >
                            Mark Viewed
                          </button>
                        )}
                        {a.status !== 'shortlisted' && (
                          <button 
                            onClick={() => updateStatus(a._id, 'shortlisted')}
                            className="px-3 py-2 text-sm border border-emerald-300 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors text-emerald-700 font-medium"
                          >
                            Shortlist
                          </button>
                        )}
                        {a.status !== 'rejected' && (
                          <button 
                            onClick={() => updateStatus(a._id, 'rejected')}
                            className="px-3 py-2 text-sm border border-red-300 bg-red-50 rounded-lg hover:bg-red-100 transition-colors text-red-700 font-medium"
                          >
                            Reject
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-900 mb-1">No applications in this category</h3>
              <p className="text-gray-600">Applications will appear here once job seekers apply</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
