import React, { useEffect, useState, useCallback } from 'react';
import api from '../services/api';
import JobCard from '../components/JobCard';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get(`/jobs${q ? `?title=${encodeURIComponent(q)}` : ''}`);
      setJobs(res.data);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
    setLoading(false);
  }, [q]);

  useEffect(()=> { fetchJobs(); }, [fetchJobs]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="text-center mb-12">
          <h1 className="section-title text-white">Find Your Dream Job</h1>
          <p className="section-subtitle text-gray-300">Explore thousands of job listings from top companies</p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <svg className="absolute left-4 top-3 w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input 
                value={q} 
                onChange={e => setQ(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && fetchJobs()}
                placeholder="Search by job title, company..." 
                className="input-base pl-12"
              />
            </div>
            <button 
              onClick={fetchJobs}
              className="btn-primary"
            >
              Search
            </button>
          </div>
        </div>

        {/* Results Section */}
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
            </div>
          ) : jobs.length > 0 ? (
            <>
              <div className="mb-6 flex items-center justify-between">
                <p className="text-gray-300">
                  Showing <span className="font-semibold text-white">{jobs.length}</span> jobs
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.map(job => <JobCard key={job._id} job={job} />)}
              </div>
            </>
          ) : (
            <div className="card p-12 text-center">
              <svg className="w-16 h-16 mx-auto text-gray-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <h3 className="text-lg font-semibold text-white mb-2">No jobs found</h3>
              <p className="text-gray-400">Try adjusting your search criteria</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
