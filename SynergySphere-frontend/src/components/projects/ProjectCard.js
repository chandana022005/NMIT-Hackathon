import React from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import StatusBadge from '../ui/StatusBadge';

const ProjectCard = ({ project }) => {
  const { state, dispatch } = useApp();
  const { tasks } = state;
  
  const projectTasks = tasks.filter(task => task.projectId === project.id);
  const completedTasks = projectTasks.filter(task => task.status === 'done').length;
  const progressPercentage = projectTasks.length > 0 ? (completedTasks / projectTasks.length) * 100 : 0;

  const handleMenuClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Handle menu actions
  };

  return (
    <div className="card hover:shadow-lg transition-all duration-200 cursor-pointer relative group">
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-1 flex-1">
          {project.name}
        </h3>
        <div className="flex items-center space-x-2">
          <span className="text-xs text-gray-500">
            {completedTasks}/{projectTasks.length}
          </span>
          {/* Three-dot menu */}
          <div className="relative">
            <button
              onClick={handleMenuClick}
              className="p-1 text-gray-400 hover:text-gray-600 transition-colors opacity-0 group-hover:opacity-100"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-1 w-32 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50 opacity-0 group-hover:opacity-100 transition-opacity">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                Edit
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                Delete
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                Select
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
        {project.description}
      </p>
      
      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
          <span>Progress</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-primary-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>
      
      {/* Project Stats */}
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>Created {new Date(project.createdAt).toLocaleDateString()}</span>
        <span>{project.members.length} member{project.members.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Click overlay for navigation */}
      <Link to={`/projects/${project.id}`} className="absolute inset-0 z-10"></Link>
    </div>
  );
};

export default ProjectCard;
