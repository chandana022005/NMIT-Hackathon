import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import TaskCard from './TaskCard';
import Button from '../ui/Button';

const TaskList = ({ tasks, showProject = true }) => {
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('dueDate');

  const filteredTasks = tasks.filter(task => {
    if (filter === 'all') return true;
    return task.status === filter;
  });

  const sortedTasks = [...filteredTasks].sort((a, b) => {
    switch (sortBy) {
      case 'dueDate':
        return new Date(a.dueDate) - new Date(b.dueDate);
      case 'status':
        const statusOrder = { 'todo': 0, 'in-progress': 1, 'done': 2 };
        return statusOrder[a.status] - statusOrder[b.status];
      case 'title':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const statusCounts = {
    all: tasks.length,
    todo: tasks.filter(task => task.status === 'todo').length,
    'in-progress': tasks.filter(task => task.status === 'in-progress').length,
    done: tasks.filter(task => task.status === 'done').length,
  };

  const filters = [
    { id: 'all', label: 'All Tasks', count: statusCounts.all },
    { id: 'todo', label: 'To Do', count: statusCounts.todo },
    { id: 'in-progress', label: 'In Progress', count: statusCounts['in-progress'] },
    { id: 'done', label: 'Done', count: statusCounts.done },
  ];

  return (
    <div>
      {/* Filters and Sort */}
      <div className="mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Status Filters */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filterItem) => (
              <button
                key={filterItem.id}
                onClick={() => setFilter(filterItem.id)}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                  filter === filterItem.id
                    ? 'bg-primary-100 text-primary-700 border border-primary-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200 border border-transparent'
                }`}
              >
                {filterItem.label}
                <span className="ml-1 text-xs opacity-75">({filterItem.count})</span>
              </button>
            ))}
          </div>

          {/* Sort Options */}
          <div className="flex items-center space-x-2">
            <label className="text-sm text-gray-600">Sort by:</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-sm border border-gray-300 rounded-lg px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="dueDate">Due Date</option>
              <option value="status">Status</option>
              <option value="title">Title</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tasks Grid */}
      {sortedTasks.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedTasks.map((task) => (
            <TaskCard key={task.id} task={task} showProject={showProject} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-gray-100">
            <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            {filter === 'all' ? 'No tasks yet' : `No ${filter.replace('-', ' ')} tasks`}
          </h3>
          <p className="mt-2 text-gray-500">
            {filter === 'all' 
              ? 'Get started by creating your first task'
              : `No tasks with status "${filter.replace('-', ' ')}"`
            }
          </p>
        </div>
      )}
    </div>
  );
};

export default TaskList;
