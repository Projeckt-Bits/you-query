'use client';

import { useState, useEffect } from 'react';
import { portfolioService } from '../../services/portfolioService';
import { useAuth } from '../../context/AuthContext';

export default function ProjectForm({ project, onSuccess, onCancel }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploading, setUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    techStack: [],
    githubLink: '',
    liveDemoLink: '',
    thumbnailUrl: ''
  });

  const [currentTech, setCurrentTech] = useState('');
  const popularTech = ['React', 'Next.js', 'Vue', 'Angular', 'Node.js', 'Express', 'Python', 'Django', 'Flask', 'Java', 'Spring', 'C++', 'C#', 'PHP', 'Laravel', 'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'TypeScript', 'JavaScript', 'HTML', 'CSS', 'Tailwind CSS', 'Bootstrap', 'Sass'];

  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title || '',
        description: project.description || '',
        techStack: project.techStack || [],
        githubLink: project.githubLink || '',
        liveDemoLink: project.liveDemoLink || '',
        thumbnailUrl: project.thumbnailUrl || ''
      });
    }
  }, [project]);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (formData.techStack.length === 0) {
      newErrors.techStack = 'At least one technology is required';
    }
    
    if (formData.githubLink && !isValidUrl(formData.githubLink)) {
      newErrors.githubLink = 'Please enter a valid GitHub URL';
    }
    
    if (formData.liveDemoLink && !isValidUrl(formData.liveDemoLink)) {
      newErrors.liveDemoLink = 'Please enter a valid URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const handleCloudinaryUpload = async (file) => {
    setUploading(true);
    try {
      // Check if Cloudinary is configured
      if (!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME) {
        // Fallback: Convert image to base64
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result;
            resolve(base64data);
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
      }

      // You'll need to set up Cloudinary environment variables
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`;
      
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'ml_default');
      
      const response = await fetch(cloudinaryUrl, {
        method: 'POST',
        body: formData
      });
      
      const data = await response.json();
      
      if (data.secure_url) {
        return data.secure_url;
      }
      throw new Error('Failed to upload image');
    } catch (error) {
      console.error('Error uploading to Cloudinary:', error);
      alert('Failed to upload image. Please try again.');
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      try {
        const url = await handleCloudinaryUpload(file);
        setFormData(prev => ({ ...prev, thumbnailUrl: url }));
      } catch (error) {
        // Error already handled in handleCloudinaryUpload
      }
    }
  };

  const addTech = (tech) => {
    if (tech && !formData.techStack.includes(tech)) {
      setFormData(prev => ({
        ...prev,
        techStack: [...prev.techStack, tech]
      }));
    }
  };

  const removeTech = (tech) => {
    setFormData(prev => ({
      ...prev,
      techStack: prev.techStack.filter(t => t !== tech)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    if (!user || !user.uid) {
      alert('You must be logged in to save projects.');
      return;
    }
    
    setLoading(true);
    
    try {
      const projectData = {
        id: project?.id,
        ...formData
      };
      
      console.log('Saving project for user:', user.uid, projectData);
      await portfolioService.saveProject(user.uid, projectData);
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset form if adding new project
      if (!project?.id) {
        setFormData({
          title: '',
          description: '',
          techStack: [],
          githubLink: '',
          liveDemoLink: '',
          thumbnailUrl: ''
        });
      }
      
      alert('Project saved successfully!');
    } catch (error) {
      console.error('Error saving project:', error);
      console.error('Error details:', error.message, error.stack);
      alert(`Failed to save project: ${error.message || 'Please check your Firebase configuration.'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Project Title <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
            errors.title ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="e.g., E-commerce Platform"
        />
        {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={4}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Describe your project..."
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      {/* Tech Stack */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Tech Stack <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-2 mb-2">
          {formData.techStack.map((tech) => (
            <span
              key={tech}
              className="inline-flex items-center px-3 py-1 bg-indigo-100 text-indigo-800 rounded-full text-sm"
            >
              {tech}
              <button
                type="button"
                onClick={() => removeTech(tech)}
                className="ml-2 text-indigo-600 hover:text-indigo-800"
              >
                ×
              </button>
            </span>
          ))}
        </div>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={currentTech}
            onChange={(e) => setCurrentTech(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                addTech(currentTech);
                setCurrentTech('');
              }
            }}
            placeholder="Add technology..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <button
            type="button"
            onClick={() => {
              addTech(currentTech);
              setCurrentTech('');
            }}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            Add
          </button>
        </div>
        
        {/* Popular technologies */}
        <div className="mt-2">
          <p className="text-xs text-gray-500 mb-2">Popular technologies:</p>
          <div className="flex flex-wrap gap-2">
            {popularTech.slice(0, 12).map((tech) => (
              <button
                key={tech}
                type="button"
                onClick={() => addTech(tech)}
                disabled={formData.techStack.includes(tech)}
                className={`px-3 py-1 text-xs rounded-full ${
                  formData.techStack.includes(tech)
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                + {tech}
              </button>
            ))}
          </div>
        </div>
        
        {errors.techStack && <p className="text-red-500 text-sm mt-1">{errors.techStack}</p>}
      </div>

      {/* GitHub Link */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          GitHub Link
        </label>
        <input
          type="url"
          value={formData.githubLink}
          onChange={(e) => setFormData(prev => ({ ...prev, githubLink: e.target.value }))}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
            errors.githubLink ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="https://github.com/user/repo"
        />
        {errors.githubLink && <p className="text-red-500 text-sm mt-1">{errors.githubLink}</p>}
      </div>

      {/* Live Demo Link */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Live Demo Link
        </label>
        <input
          type="url"
          value={formData.liveDemoLink}
          onChange={(e) => setFormData(prev => ({ ...prev, liveDemoLink: e.target.value }))}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
            errors.liveDemoLink ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="https://yourproject.com"
        />
        {errors.liveDemoLink && <p className="text-red-500 text-sm mt-1">{errors.liveDemoLink}</p>}
      </div>

      {/* Thumbnail Upload */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Project Thumbnail
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
        {uploading && <p className="text-sm text-gray-500 mt-1">Uploading...</p>}
        {formData.thumbnailUrl && (
          <div className="mt-2">
            <img
              src={formData.thumbnailUrl}
              alt="Thumbnail preview"
              className="w-32 h-32 object-cover rounded-lg"
            />
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, thumbnailUrl: '' }))}
              className="mt-2 text-sm text-red-600 hover:text-red-800"
            >
              Remove image
            </button>
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading || uploading}
          className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : (project?.id ? 'Update Project' : 'Add Project')}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

