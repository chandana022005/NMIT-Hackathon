import React from 'react';
import { useApp } from '../../context/AppContext';
import Avatar from '../ui/Avatar';
import StatusBadge from '../ui/StatusBadge';

const TaskCard = ({ task, showProject = true }) => {
  const { state, dispatch } = useApp();
  const { projects, users } = state;
  
  const project = projects.find(p => p.id === task.projectId);
  const assignee = users.find(u => u.id === task.assigneeId);

  const handleTaskClick = () => {
    dispatch({ type: 'SET_CURRENT_TASK', payload: task });
    dispatch({ type: 'TOGGLE_TASK_DETAIL' });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return { text: 'Overdue', color: 'text-red-600' };
    } else if (diffDays === 0) {
      return { text: 'Due today', color: 'text-orange-600' };
    } else if (diffDays === 1) {
      return { text: 'Due tomorrow', color: 'text-yellow-600' };
    } else if (diffDays <= 7) {
      return { text: `Due in ${diffDays} days`, color: 'text-gray-600' };
    } else {
      return { text: date.toLocaleDateString(), color: 'text-gray-500' };
    }
  };

  const dueDateInfo = formatDate(task.dueDate);

  return (
    <div 
      className="card cursor-pointer hover:shadow-md transition-all duration-200 relative group"
      onClick={handleTaskClick}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-base font-medium text-gray-900 line-clamp-2 flex-1">
          {task.title}
        </h3>
        <div className="flex items-center space-x-2">
          <StatusBadge status={task.status} className="flex-shrink-0" />
          {/* Three-dot menu */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
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
      
      {task.description && (
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          {assignee && (
            <div className="flex items-center">
              <Avatar src={assignee.avatar} name={assignee.name} size="sm" />
              <span className="ml-2 text-xs text-gray-600 hidden sm:block">
                {assignee.name}
              </span>
            </div>
          )}
          
          {showProject && project && (
            <div className="flex items-center">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              <span className="ml-2 text-xs text-gray-600 hidden sm:block">
                Project: {project.name}
              </span>
            </div>
          )}
        </div>
        
        <div className="text-xs">
          <span className={dueDateInfo.color}>
            {dueDateInfo.text}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
