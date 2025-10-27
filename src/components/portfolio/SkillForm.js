'use client';

import { useState, useEffect } from 'react';
import { portfolioService } from '../../services/portfolioService';
import { useAuth } from '../../context/AuthContext';

export default function SkillForm({ skill, onSuccess, onCancel }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  
  const [formData, setFormData] = useState({
    name: '',
    category: 'Frontend',
    proficiency: 'Beginner'
  });

  const categories = ['Frontend', 'Backend', 'Database', 'DevOps', 'Design', 'Mobile', 'Cloud', 'Other'];
  const proficiencyLevels = [
    { value: 'Beginner', label: 'Beginner (0-25%)' },
    { value: 'Intermediate', label: 'Intermediate (26-50%)' },
    { value: 'Advanced', label: 'Advanced (51-75%)' },
    { value: 'Expert', label: 'Expert (76-100%)' }
  ];

  useEffect(() => {
    if (skill) {
      setFormData({
        name: skill.name || '',
        category: skill.category || 'Frontend',
        proficiency: skill.proficiency || 'Beginner'
      });
    }
  }, [skill]);

  const validate = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Skill name is required';
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
      const skillData = {
        id: skill?.id,
        ...formData
      };
      
      await portfolioService.saveSkill(user.uid, skillData);
      
      if (onSuccess) {
        onSuccess();
      }
      
      // Reset form if adding new skill
      if (!skill?.id) {
        setFormData({
          name: '',
          category: 'Frontend',
          proficiency: 'Beginner'
        });
      }
      
      alert('Skill saved successfully!');
    } catch (error) {
      console.error('Error saving skill:', error);
      alert('Failed to save skill. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Skill Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Skill Name <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent ${
            errors.name ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="e.g., React, Node.js, Python"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category <span className="text-red-500">*</span>
        </label>
        <select
          value={formData.category}
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>

      {/* Proficiency Level */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Proficiency Level <span className="text-red-500">*</span>
        </label>
        
        {/* Dropdown */}
        <select
          value={formData.proficiency}
          onChange={(e) => setFormData(prev => ({ ...prev, proficiency: e.target.value }))}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        >
          {proficiencyLevels.map((level) => (
            <option key={level.value} value={level.value}>
              {level.label}
            </option>
          ))}
        </select>

        {/* Visual Slider */}
        <div className="mt-4">
          <input
            type="range"
            min="0"
            max="100"
            value={getProficiencyValue(formData.proficiency)}
            onChange={(e) => {
              const value = e.target.value;
              setFormData(prev => ({
                ...prev,
                proficiency: getProficiencyFromValue(value)
              }));
            }}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            style={{
              background: `linear-gradient(to right, #4F46E5 0%, #4F46E5 ${getProficiencyValue(formData.proficiency)}%, #E5E7EB ${getProficiencyValue(formData.proficiency)}%, #E5E7EB 100%)`
            }}
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span className="font-medium text-indigo-600">{getProficiencyValue(formData.proficiency)}%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Proficiency bars */}
        <div className="mt-4 space-y-2">
          {proficiencyLevels.map((level) => (
            <div key={level.value} className="flex items-center">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, proficiency: level.value }))}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                  formData.proficiency === level.value
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {level.label}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {loading ? 'Saving...' : (skill?.id ? 'Update Skill' : 'Add Skill')}
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

  function getProficiencyValue(level) {
    const values = {
      'Beginner': 12.5,
      'Intermediate': 37.5,
      'Advanced': 62.5,
      'Expert': 87.5
    };
    return values[level] || 0;
  }

  function getProficiencyFromValue(value) {
    const num = parseInt(value);
    if (num <= 25) return 'Beginner';
    if (num <= 50) return 'Intermediate';
    if (num <= 75) return 'Advanced';
    return 'Expert';
  }
}

