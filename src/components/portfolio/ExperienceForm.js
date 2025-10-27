'use client';

import { useState, useEffect } from 'react';
import { portfolioService } from '../../services/portfolioService';
import { useAuth } from '../../context/AuthContext';

export default function ExperienceForm({ experience, onSuccess, onCancel }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    companyName: '',
    role: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: ''
  });

  useEffect(() => {
    if (experience) {
      setFormData({
        companyName: experience.companyName || '',
        role: experience.role || '',
        startDate: experience.startDate || '',
        endDate: experience.endDate || '',
        isCurrent: experience.isCurrent || false,
        description: experience.description || ''
      });
    }
  }, [experience]);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.companyName.trim()) {
      newErrors.companyName = 'Company name is required';
    }
    
    if (!formData.role.trim()) {
      newErrors.role = 'Role is required';
    }
    
    if (!formData.startDate) {
      newErrors.startDate = 'Start date is required';
    }
    
    if (!formData.isCurrent && !formData.endDate) {
      newErrors.endDate = 'End date is required for past positions';
    }
    
    if (formData.startDate && formData.endDate && formData.startDate > formData.endDate && !formData.isCurrent) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setLoading(true);
    
    try {
      const experienceData = {
        id: experience?.id,
        ...formData,
        endDate: formData.isCurrent ? 'Present' : formData.endDate
      };
      
      await portfolioService.saveExperience(user.uid, experienceData);
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset form if adding new experience
      if (!experience?.id) {
        setFormData({
          companyName: '',
          role: '',
          startDate: '',
          endDate: '',
          isCurrent: false,
          description: ''
        });
      }
      
      alert('Experience saved successfully!');
    } catch (error) {
      console.error('Error saving experience:', error);
      alert('Failed to save experience. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Company Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Company Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.companyName}
          onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
            errors.companyName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="e.g., Google, Microsoft"
        />
        {errors.companyName && <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>}
      </div>

      {/* Role */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Role/Position <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.role}
          onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
            errors.role ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="e.g., Software Engineer, Frontend Developer"
        />
        {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
      </div>

      {/* Duration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Start Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Start Date <span className="text-red-500">*</span>
          </label>
          <input
            type="month"
            value={formData.startDate}
            onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              errors.startDate ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.startDate && <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>}
        </div>

        {/* End Date or Current Position */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            {formData.isCurrent ? 'End Date' : 'End Date'} {!formData.isCurrent && <span className="text-red-500">*</span>}
          </label>
          <input
            type="month"
            value={formData.endDate}
            onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
            disabled={formData.isCurrent}
            className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
              errors.endDate ? 'border-red-500' : 'border-gray-300'
            } ${formData.isCurrent ? 'bg-gray-100 cursor-not-allowed' : ''}`}
          />
          {errors.endDate && <p className="text-red-500 text-sm mt-1">{errors.endDate}</p>}
          
          {/* Current Position Checkbox */}
          <label className="flex items-center mt-3">
            <input
              type="checkbox"
              checked={formData.isCurrent}
              onChange={(e) => setFormData(prev => ({ ...prev, isCurrent: e.target.checked, endDate: e.target.checked ? '' : prev.endDate }))}
              className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <span className="ml-2 text-sm text-gray-700">I currently work here</span>
          </label>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={5}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
            errors.description ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Describe your responsibilities, achievements, and key contributions..."
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>

      {/* Duration Display */}
      {formData.startDate && (
        <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
          <p className="text-sm text-indigo-700">
            <span className="font-medium">Duration:</span> {
              formData.isCurrent 
                ? `${new Date(formData.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })} - Present`
                : formData.endDate 
                  ? `${new Date(formData.startDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })} - ${new Date(formData.endDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}`
                  : 'Select dates to see duration'
            }
          </p>
        </div>
      )}

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : (experience?.id ? 'Update Experience' : 'Add Experience')}
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

