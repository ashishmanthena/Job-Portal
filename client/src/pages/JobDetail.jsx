import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../services/api';

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    api.get(`/jobs/${id}`).then(r => {
      setJob(r.data);
      setLoading(false);
    });
  }, [id]);

  async function handleApply(e) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const form = new FormData();
      form.append('jobId', id);
      form.append('coverLetter', coverLetter);
      if (resumeFile) form.append('resume', resumeFile);

      await api.post('/applications', form, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess(true);
      setCoverLetter('');
      setResumeFile(null);
      setTimeout(() => setSuccess(false), 5000);
    } catch (err) {
      alert('Failed to apply: ' + (err.response?.data?.message || 'Try again'));
    }
    setSubmitting(false);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 flex items-center justify-center">
        <div className="bg-slate-800 border border-blue-500/30 rounded-xl p-8 text-center">
          <p className="text-gray-300">Job not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-blue-900 py-12">
      <div className="max-w-5xl mx-auto px-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-800 to-slate-700 border border-blue-500/20 rounded-xl p-8 mb-8 backdrop-blur">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">{job.title}</h1>
              <p className="text-xl text-blue-300 font-medium">{job.company}</p>
            </div>
            {job.employmentType && (
              <span className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white text-sm font-semibold">
                {job.employmentType}
              </span>
            )}
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-blue-500/20">
            <div>
              <p className="text-sm text-gray-400 mb-1">Location</p>
              <p className="font-semibold text-white">{job.location}</p>
            </div>
            {job.salary && (
              <div>
                <p className="text-sm text-gray-400 mb-1">Salary</p>
                <p className="font-semibold text-blue-400">
                  {typeof job.salary === 'object' ? `${job.salary.min}-${job.salary.max}` : `${job.salary}`}
                </p>
              </div>
            )}
            {job.experienceRequired && (
              <div>
                <p className="text-sm text-gray-400 mb-1">Experience</p>
                <p className="font-semibold text-white">{job.experienceRequired}</p>
              </div>
            )}
            {job.postedBy && (
              <div>
                <p className="text-sm text-gray-400 mb-1">Posted by</p>
                <p className="font-semibold text-white">{job.postedBy.name}</p>
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-8">
          {/* Description */}
          <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-8 backdrop-blur hover:border-blue-500/40 transition-all duration-300">
            <h2 className="text-2xl font-bold text-white mb-4">About This Role</h2>
            <div className="prose prose-invert prose-sm max-w-none">
              <p className="text-gray-300 leading-relaxed whitespace-pre-wrap">{job.description}</p>
            </div>
          </div>

          {/* Required Skills */}
          {job.skills && job.skills.length > 0 && (
            <div className="bg-slate-800/50 border border-blue-500/20 rounded-xl p-8 backdrop-blur hover:border-blue-500/40 transition-all duration-300">
              <h2 className="text-2xl font-bold text-white mb-4">Required Skills</h2>
              <div className="flex flex-wrap gap-3">
                {job.skills.map(skill => (
                  <span 
                    key={skill} 
                    className="px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 font-medium border border-blue-500/30 hover:border-blue-500/60 transition-all duration-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Apply Section */}
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 border border-blue-500/20 rounded-xl p-8 backdrop-blur hover:border-blue-500/40 transition-all duration-300">
            <h3 className="text-2xl font-bold text-white mb-6">Apply for this position</h3>

            {success && (
              <div className="mb-6 p-4 rounded-lg bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 border border-emerald-500/50">
                <p className="text-sm text-emerald-300">✓ Application submitted successfully!</p>
              </div>
            )}

            <form onSubmit={handleApply} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Cover Letter
                </label>
                <textarea 
                  value={coverLetter} 
                  onChange={e => setCoverLetter(e.target.value)} 
                  placeholder="Tell the employer why you're a great fit for this role..." 
                  className="w-full px-4 py-3 rounded-lg bg-slate-900/50 border border-blue-500/30 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none min-h-48"
                />
                <p className="text-xs text-gray-400 mt-2">{coverLetter.length} characters</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-white mb-3">
                  Upload Resume
                </label>
                <div className="relative">
                  <input 
                    type="file" 
                    onChange={e => setResumeFile(e.target.files[0])} 
                    className="hidden"
                    id="resume-upload"
                    accept=".pdf,.doc,.docx"
                  />
                  <label 
                    htmlFor="resume-upload"
                    className="flex items-center justify-center w-full px-4 py-4 border-2 border-dashed border-blue-500/40 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-500/10 transition-all duration-200"
                  >
                    <div className="text-center">
                      <svg className="w-6 h-6 mx-auto text-blue-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <p className="text-sm text-gray-300">
                        {resumeFile ? (
                          <span className="text-blue-400 font-medium">{resumeFile.name}</span>
                        ) : (
                          <>Click to upload resume</>
                        )}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">PDF, DOC, or DOCX up to 5MB</p>
                    </div>
                  </label>
                </div>
              </div>

              <button 
                type="submit"
                disabled={submitting}
                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold transition-all duration-200 hover:shadow-lg hover:from-blue-700 hover:to-blue-800 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? 'Applying...' : 'Apply Now'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
