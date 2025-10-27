'use client';

import { useState, useEffect } from 'react';
import { portfolioService } from '../../services/portfolioService';
import { useAuth } from '../../context/AuthContext';
import ProjectForm from './ProjectForm';
import SkillForm from './SkillForm';
import ExperienceForm from './ExperienceForm';

export default function PortfolioForm() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('projects');
  const [loading, setLoading] = useState(false);
  const [portfolioData, setPortfolioData] = useState({
    projects: [],
    skills: [],
    experience: []
  });

  useEffect(() => {
    if (user) {
      loadPortfolio();
    }
  }, [user]);

  const loadPortfolio = async () => {
    setLoading(true);
    try {
      const data = await portfolioService.getPortfolio(user.uid);
      
      // Convert object to array for projects
      if (data.projects && typeof data.projects === 'object' && !Array.isArray(data.projects)) {
        data.projects = Object.entries(data.projects).map(([id, project]) => ({
          id,
          ...project
        }));
      }
      
      // Convert object to array for skills
      if (data.skills && typeof data.skills === 'object' && !Array.isArray(data.skills)) {
        data.skills = Object.entries(data.skills).map(([id, skill]) => ({
          id,
          ...skill
        }));
      }
      
      // Convert object to array for experience
      if (data.experience && typeof data.experience === 'object' && !Array.isArray(data.experience)) {
        data.experience = Object.entries(data.experience).map(([id, exp]) => ({
          id,
          ...exp
        }));
      }
      
      setPortfolioData({
        projects: data.projects || [],
        skills: data.skills || [],
        experience: data.experience || []
      });
    } catch (error) {
      console.error('Error loading portfolio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = () => {
    loadPortfolio();
  };

  const handleDelete = async (type, id) => {
    if (!confirm(`Are you sure you want to delete this ${type === 'projects' ? 'project' : type === 'skills' ? 'skill' : 'experience'}?`)) {
      return;
    }

    try {
      await portfolioService[`delete${type === 'projects' ? 'Project' : type === 'skills' ? 'Skill' : 'Experience'}`](user.uid, id);
      loadPortfolio();
      alert('Deleted successfully!');
    } catch (error) {
      console.error('Error deleting:', error);
      alert('Failed to delete. Please try again.');
    }
  };

  const [editingItem, setEditingItem] = useState(null);

  const tabs = [
    { id: 'projects', label: 'Projects', icon: '📁' },
    { id: 'skills', label: 'Skills', icon: '🛠️' },
    { id: 'experience', label: 'Experience', icon: '💼' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Portfolio Manager
          </h1>
          <p className="text-gray-600 mt-2">Manage your projects, skills, and work experience</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-lg mb-6">
          <div className="border-b border-gray-200">
            <div className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id);
                    setEditingItem(null);
                  }}
                  className={`flex items-center px-6 py-4 font-medium text-sm transition-all duration-200 whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-b-2 border-indigo-600 text-indigo-600'
                      : 'text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2 text-xl">{tab.icon}</span>
                  {tab.label}
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    activeTab === tab.id
                      ? 'bg-indigo-100 text-indigo-600'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {portfolioData[tab.id]?.length || 0}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">
                {editingItem ? 'Edit' : 'Add New'}{' '}
                {activeTab === 'projects' && 'Project'}
                {activeTab === 'skills' && 'Skill'}
                {activeTab === 'experience' && 'Experience'}
              </h2>

              {activeTab === 'projects' && (
                <ProjectForm
                  project={editingItem}
                  onSuccess={() => {
                    handleSuccess();
                    setEditingItem(null);
                  }}
                  onCancel={() => setEditingItem(null)}
                />
              )}

              {activeTab === 'skills' && (
                <SkillForm
                  skill={editingItem}
                  onSuccess={() => {
                    handleSuccess();
                    setEditingItem(null);
                  }}
                  onCancel={() => setEditingItem(null)}
                />
              )}

              {activeTab === 'experience' && (
                <ExperienceForm
                  experience={editingItem}
                  onSuccess={() => {
                    handleSuccess();
                    setEditingItem(null);
                  }}
                  onCancel={() => setEditingItem(null)}
                />
              )}
            </div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">
                Your {activeTab === 'projects' ? 'Projects' : activeTab === 'skills' ? 'Skills' : 'Experience'}
              </h2>

              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
                  <p className="mt-2 text-gray-500">Loading...</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {portfolioData[activeTab]?.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <p className="text-sm">No {activeTab} added yet.</p>
                      <p className="text-xs mt-1">Add one to get started!</p>
                    </div>
                  ) : (
                    portfolioData[activeTab].map((item) => (
                      <div
                        key={item.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        {activeTab === 'projects' && (
                          <div>
                            <h3 className="font-semibold text-gray-900">{item.title}</h3>
                            <p className="text-sm text-gray-600 mt-1 line-clamp-2">{item.description}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {item.techStack?.slice(0, 3).map((tech) => (
                                <span key={tech} className="px-2 py-0.5 bg-indigo-100 text-indigo-700 text-xs rounded">
                                  {tech}
                                </span>
                              ))}
                              {item.techStack?.length > 3 && (
                                <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                                  +{item.techStack.length - 3}
                                </span>
                              )}
                            </div>
                          </div>
                        )}

                        {activeTab === 'skills' && (
                          <div>
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                                <p className="text-sm text-gray-600">{item.category}</p>
                              </div>
                              <span className="text-xs font-medium text-indigo-600">{item.proficiency}</span>
                            </div>
                            <div className="mt-2">
                              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-indigo-600 rounded-full"
                                  style={{ width: `${getProficiencyWidth(item.proficiency)}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {activeTab === 'experience' && (
                          <div>
                            <h3 className="font-semibold text-gray-900">{item.companyName}</h3>
                            <p className="text-sm text-gray-600">{item.role}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {item.startDate && (
                                <>
                                  {new Date(item.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                                  {' - '}
                                  {item.endDate === 'Present' ? 'Present' : item.endDate ? new Date(item.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'short' }) : ''}
                                </>
                              )}
                            </p>
                            <p className="text-sm text-gray-600 mt-2 line-clamp-2">{item.description}</p>
                          </div>
                        )}

                        <div className="flex gap-2 mt-3 pt-3 border-t border-gray-200">
                          <button
                            onClick={() => setEditingItem(item)}
                            className="flex-1 px-3 py-1 text-sm bg-indigo-600 text-white rounded hover:bg-indigo-700"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(activeTab, item.id)}
                            className="flex-1 px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  function getProficiencyWidth(proficiency) {
    const widths = {
      'Beginner': 25,
      'Intermediate': 50,
      'Advanced': 75,
      'Expert': 100
    };
    return widths[proficiency] || 0;
  }
}

