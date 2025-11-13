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
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="card p-8 text-center">
          <p className="text-gray-600">Job not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="card p-8 mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <p className="text-xl text-gray-600 font-medium">{job.company}</p>
            </div>
            {job.employmentType && (
              <span className="badge-success">{job.employmentType}</span>
            )}
          </div>

          {/* Meta Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-600 mb-1">Location</p>
              <p className="font-semibold text-gray-900">{job.location}</p>
            </div>
            {job.salary && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Salary</p>
                <p className="font-semibold text-green-600">
                  {typeof job.salary === 'object' ? `₹${job.salary.min}-${job.salary.max}` : `₹${job.salary}`}
                </p>
              </div>
            )}
            {job.experienceRequired && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Experience</p>
                <p className="font-semibold text-gray-900">{job.experienceRequired}</p>
              </div>
            )}
            {job.postedBy && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Posted by</p>
                <p className="font-semibold text-gray-900">{job.postedBy.name}</p>
              </div>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="card p-8 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Role</h2>
              <div className="prose prose-sm max-w-none">
                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{job.description}</p>
              </div>
            </div>

            {/* Required Skills */}
            {job.skills && job.skills.length > 0 && (
              <div className="card p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Required Skills</h2>
                <div className="flex flex-wrap gap-3">
                  {job.skills.map(skill => (
                    <span 
                      key={skill} 
                      className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 font-medium border border-blue-200"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Apply Section */}
          <div className="lg:col-span-1">
            <div className="card p-8 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-6">Apply Now</h3>

              {success && (
                <div className="mb-4 p-4 rounded-lg bg-emerald-50 border border-emerald-200">
                  <p className="text-sm text-emerald-800">✓ Application submitted successfully!</p>
                </div>
              )}

              <form onSubmit={handleApply} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Cover Letter (Optional)
                  </label>
                  <textarea 
                    value={coverLetter} 
                    onChange={e => setCoverLetter(e.target.value)} 
                    placeholder="Tell the employer why you're a great fit..." 
                    className="input-base min-h-32 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      className="flex items-center justify-center w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition-colors"
                    >
                      <div className="text-center">
                        <svg className="w-6 h-6 mx-auto text-gray-400 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <p className="text-sm text-gray-600">
                          {resumeFile ? resumeFile.name : 'Click to upload resume'}
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={submitting}
                  className="btn-success w-full"
                >
                  {submitting ? 'Applying...' : 'Apply Now'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
