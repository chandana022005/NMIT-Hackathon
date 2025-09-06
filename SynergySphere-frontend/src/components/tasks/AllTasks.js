import React from 'react';
import { useApp } from '../../context/AppContext';
import Header from '../layout/Header';
import TaskList from './TaskList';
import TaskCreationModal from './TaskCreationModal';
import Button from '../ui/Button';

const AllTasks = () => {
  const { state, dispatch } = useApp();
  const { tasks } = state;

  const handleCreateTask = () => {
    dispatch({ type: 'TOGGLE_TASK_MODAL' });
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
          <div className="absolute top-40 right-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse animation-delay-4000"></div>
        </div>
      </div>

      <Header title="My Tasks" />
      
      <div className="relative z-10 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Tasks</h1>
              <p className="text-gray-600 mt-1">
                Manage all your assigned tasks
              </p>
            </div>
            <Button
              onClick={handleCreateTask}
              className="hidden md:inline-flex"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              New Task
            </Button>
          </div>

          {/* Tasks List */}
          <TaskList tasks={tasks} showProject={true} />

          {/* Floating Action Button for Mobile */}
          <button
            onClick={handleCreateTask}
            className="btn-floating md:hidden"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Task Creation Modal */}
      <TaskCreationModal
        isOpen={state.showTaskModal}
        onClose={() => dispatch({ type: 'TOGGLE_TASK_MODAL' })}
      />
    </div>
  );
};

export default AllTasks;
