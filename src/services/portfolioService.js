'use client';

import { ref, set, get, push, remove, update } from 'firebase/database';
import { database } from '../../firebase';

// Portfolio Service for Realtime Database operations

// Verify database is initialized
if (!database) {
  console.error('Firebase Realtime Database is not initialized!');
  console.error('Check your firebase.js configuration and environment variables.');
}

export const portfolioService = {
  // Get user's portfolio data
  async getPortfolio(userId) {
    try {
      const snapshot = await get(ref(database, `portfolios/${userId}`));
      if (snapshot.exists()) {
        return snapshot.val();
      }
      return {
        projects: [],
        skills: [],
        experience: []
      };
    } catch (error) {
      console.error('Error getting portfolio:', error);
      throw error;
    }
  },

  // Add/Update a project
  async saveProject(userId, projectData) {
    try {
      console.log('saveProject called with:', { userId, projectData });
      
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      if (!projectData) {
        throw new Error('Project data is required');
      }
      
      const { id, ...project } = projectData;
      let projectId = id;
      
      console.log('Project ID:', projectId);
      
      if (projectId) {
        // Update existing project
        console.log('Updating existing project:', projectId);
        const projectRef = ref(database, `portfolios/${userId}/projects/${projectId}`);
        await set(projectRef, {
          ...project,
          updatedAt: new Date().toISOString()
        });
        console.log('Project updated successfully');
        return projectId;
      } else {
        // Create new project
        console.log('Creating new project');
        const projectRef = ref(database, `portfolios/${userId}/projects`);
        const newProjectRef = push(projectRef);
        console.log('New project ref created:', newProjectRef.key);
        await set(newProjectRef, {
          ...project,
          updatedAt: new Date().toISOString()
        });
        console.log('Project saved successfully with key:', newProjectRef.key);
        return newProjectRef.key;
      }
    } catch (error) {
      console.error('Error saving project:', error);
      console.error('Error details:', error.message, error.code, error.stack);
      throw new Error(`Failed to save project: ${error.message}`);
    }
  },

  // Delete a project
  async deleteProject(userId, projectId) {
    try {
      await remove(ref(database, `portfolios/${userId}/projects/${projectId}`));
    } catch (error) {
      console.error('Error deleting project:', error);
      throw error;
    }
  },

  // Add/Update a skill
  async saveSkill(userId, skillData) {
    try {
      const { id, ...skill } = skillData;
      let skillId = id;
      
      if (skillId) {
        // Update existing skill
        const skillRef = ref(database, `portfolios/${userId}/skills/${skillId}`);
        await set(skillRef, {
          ...skill,
          updatedAt: new Date().toISOString()
        });
        return skillId;
      } else {
        // Create new skill
        const skillRef = ref(database, `portfolios/${userId}/skills`);
        const newSkillRef = push(skillRef);
        await set(newSkillRef, {
          ...skill,
          updatedAt: new Date().toISOString()
        });
        return newSkillRef.key;
      }
    } catch (error) {
      console.error('Error saving skill:', error);
      throw error;
    }
  },

  // Delete a skill
  async deleteSkill(userId, skillId) {
    try {
      await remove(ref(database, `portfolios/${userId}/skills/${skillId}`));
    } catch (error) {
      console.error('Error deleting skill:', error);
      throw error;
    }
  },

  // Add/Update an experience
  async saveExperience(userId, experienceData) {
    try {
      const { id, ...experience } = experienceData;
      let expId = id;
      
      if (expId) {
        // Update existing experience
        const expRef = ref(database, `portfolios/${userId}/experience/${expId}`);
        await set(expRef, {
          ...experience,
          updatedAt: new Date().toISOString()
        });
        return expId;
      } else {
        // Create new experience
        const expRef = ref(database, `portfolios/${userId}/experience`);
        const newExpRef = push(expRef);
        await set(newExpRef, {
          ...experience,
          updatedAt: new Date().toISOString()
        });
        return newExpRef.key;
      }
    } catch (error) {
      console.error('Error saving experience:', error);
      throw error;
    }
  },

  // Delete an experience
  async deleteExperience(userId, experienceId) {
    try {
      await remove(ref(database, `portfolios/${userId}/experience/${experienceId}`));
    } catch (error) {
      console.error('Error deleting experience:', error);
      throw error;
    }
  }
};

