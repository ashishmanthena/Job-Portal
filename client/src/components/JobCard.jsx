import React from 'react';
import { Link } from 'react-router-dom';

export default function JobCard({ job }) {
  return (
    <Link to={`/jobs/${job._id}`}>
      <div className="card p-6 hover:shadow-xl hover:shadow-blue-500/20 hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full flex flex-col">
        {/* Header */}
        <div className="mb-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-bold text-white line-clamp-2 flex-1">{job.title}</h3>
            {job.employmentType && (
              <span className="badge ml-2 flex-shrink-0">{job.employmentType}</span>
            )}
          </div>
          <p className="text-sm font-medium text-gray-400">{job.company}</p>
        </div>

        {/* Location */}
        <div className="flex items-center text-sm text-gray-400 mb-4">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
          </svg>
          {job.location}
        </div>

        {/* Description */}
        <p className="text-sm text-gray-300 line-clamp-2 mb-4 flex-grow">{job.description}</p>

        {/* Skills */}
        {job.skills && job.skills.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {job.skills.slice(0, 3).map(skill => (
                <span 
                  key={skill} 
                  className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-300 border border-blue-500/40"
                >
                  {skill}
                </span>
              ))}
              {job.skills.length > 3 && (
                <span className="inline-block px-3 py-1 rounded-full text-xs font-medium text-gray-400">
                  +{job.skills.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-4 border-t border-blue-500/20">
          {job.salary && (
            <div className="font-semibold text-blue-400 text-sm">
              {typeof job.salary === 'object' ? `${job.salary.min}-${job.salary.max}` : `${job.salary}`}
            </div>
          )}
          <div className="text-blue-400 font-medium text-sm hover:text-blue-300 flex items-center">
            View Details
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </Link>
  );
}
