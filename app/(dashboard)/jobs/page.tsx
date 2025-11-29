'use client';

import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface Job {
  id: string;
  title: string;
  company: string;
  location?: string;
  type: string;
  experience: string;
  salary?: string;
  description: string;
  requirements?: string;
  externalUrl: string;
  isActive: boolean;
  createdAt: string;
  postedByUser: {
    name: string;
  };
}

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [canManageJobs, setCanManageJobs] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'FULL_TIME',
    experience: '',
    salary: '',
    description: '',
    requirements: '',
    externalUrl: '',
  });

  useEffect(() => {
    checkAccessAndFetchJobs();
  }, []);

  const checkAccessAndFetchJobs = async () => {
    try {
      // Check if user can manage jobs
      const manageResponse = await fetch('/api/admin/jobs');
      setCanManageJobs(manageResponse.ok);

      // Fetch jobs
      const jobsResponse = await fetch('/api/jobs');
      if (jobsResponse.ok) {
        const data = await jobsResponse.json();
        setJobs(data);
      } else if (jobsResponse.status === 403) {
        setError('Active subscription required to access jobs');
      } else if (jobsResponse.status === 401) {
        setError('Please sign in to access jobs');
      } else {
        setError('Failed to load jobs');
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/admin/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setFormData({
          title: '',
          company: '',
          location: '',
          type: 'FULL_TIME',
          experience: '',
          salary: '',
          description: '',
          requirements: '',
          externalUrl: '',
        });
        setShowForm(false);
        checkAccessAndFetchJobs(); // Refresh jobs list
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to create job');
      }
    } catch (error) {
      console.error('Error creating job:', error);
      alert('Failed to create job');
    }
  };

  const handleApply = (externalUrl: string) => {
    window.open(externalUrl, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job board...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">💼</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Board</h1>
          <p className="text-gray-600 mb-6">{error}</p>
          {error.includes('subscription') && (
            <Button className="bg-indigo-600 hover:bg-indigo-700">
              Upgrade to Premium
            </Button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Job Board</h1>
            <p className="mt-2 text-gray-600">Discover and share career opportunities with the community</p>
          </div>
          {canManageJobs && (
            <Button
              onClick={() => setShowForm(!showForm)}
              className="bg-indigo-600 hover:bg-indigo-700"
            >
              {showForm ? 'Cancel' : 'Post New Job'}
            </Button>
          )}
        </div>

        {showForm && canManageJobs && (
          <Card className="p-6 mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Create New Job Posting</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Title *
                  </label>
                  <Input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company *
                  </label>
                  <Input
                    type="text"
                    value={formData.company}
                    onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Location
                  </label>
                  <Input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    placeholder="e.g., Bangalore, India or Remote"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Job Type *
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  >
                    <option value="FULL_TIME">Full Time</option>
                    <option value="PART_TIME">Part Time</option>
                    <option value="CONTRACT">Contract</option>
                    <option value="INTERNSHIP">Internship</option>
                    <option value="FREELANCE">Freelance</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience Required *
                  </label>
                  <Input
                    type="text"
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    placeholder="e.g., 2-5 years"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary Range
                  </label>
                  <Input
                    type="text"
                    value={formData.salary}
                    onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                    placeholder="e.g., ₹8-12 LPA or $60-80K"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Job Description *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Describe the role, responsibilities, and what the candidate will be doing..."
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Requirements
                </label>
                <textarea
                  value={formData.requirements}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, requirements: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="List the required skills, qualifications, and experience..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  External Job URL *
                </label>
                <Input
                  type="url"
                  value={formData.externalUrl}
                  onChange={(e) => setFormData({ ...formData, externalUrl: e.target.value })}
                  placeholder="https://company.com/careers/job-id"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Link to the actual job posting on the company's website or job board
                </p>
              </div>

              <div className="flex justify-end space-x-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                >
                  Cancel
                </Button>
                <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700">
                  Create Job Posting
                </Button>
              </div>
            </form>
          </Card>
        )}

        {jobs.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📋</div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">No Jobs Available</h2>
            <p className="text-gray-600 mb-6">Check back later for new job opportunities.</p>
            {canManageJobs && (
              <Button onClick={() => setShowForm(true)} className="bg-indigo-600 hover:bg-indigo-700">
                Post the First Job
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <Card key={job.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex flex-col h-full">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">{job.title}</h3>
                        <p className="text-indigo-600 font-medium text-lg">{job.company}</p>
                      </div>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        job.type === 'FULL_TIME' ? 'bg-blue-100 text-blue-800' :
                        job.type === 'PART_TIME' ? 'bg-green-100 text-green-800' :
                        job.type === 'CONTRACT' ? 'bg-yellow-100 text-yellow-800' :
                        job.type === 'INTERNSHIP' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {job.type.replace('_', ' ')}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium">Experience:</span>
                        <span className="ml-2">{job.experience}</span>
                      </div>
                      {job.location && (
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium">Location:</span>
                          <span className="ml-2">{job.location}</span>
                        </div>
                      )}
                      {job.salary && (
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="font-medium">Salary:</span>
                          <span className="ml-2">{job.salary}</span>
                        </div>
                      )}
                    </div>

                    <p className="text-gray-700 mb-4 line-clamp-3">{job.description}</p>

                    {job.requirements && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 mb-2">Requirements:</h4>
                        <p className="text-sm text-gray-600 line-clamp-2">{job.requirements}</p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <p className="text-xs text-gray-500">
                      Posted {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                    <Button
                      onClick={() => handleApply(job.externalUrl)}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      Apply Now
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">Community Job Board</h3>
            <p className="text-blue-700">
              This job board is powered by our premium community. All listings are posted by verified users and lead directly to legitimate job opportunities.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
