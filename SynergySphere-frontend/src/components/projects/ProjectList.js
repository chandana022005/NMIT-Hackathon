import React from 'react';
import { useApp } from '../../context/AppContext';
import Header from '../layout/Header';
import ProjectCard from './ProjectCard';
import ProjectCreationModal from './ProjectCreationModal';
import Button from '../ui/Button';

const ProjectList = () => {
  const { state, dispatch } = useApp();
  const { projects } = state;

  const handleCreateProject = () => {
    dispatch({ type: 'TOGGLE_PROJECT_MODAL' });
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

      {/* Header */}
      <Header 
        title="Projects" 
        showNewProject={true} 
        onNewProject={handleCreateProject}
      />

      <div className="relative z-10 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">

          {/* Projects Grid */}
          {projects.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-gray-100">
                <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="mt-4 text-lg font-medium text-gray-900">No projects yet</h3>
              <p className="mt-2 text-gray-500">
                Get started by creating your first project
              </p>
              <Button
                onClick={handleCreateProject}
                className="mt-4"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Project
              </Button>
            </div>
          )}

          {/* Floating Action Button for Mobile */}
          <button
            onClick={handleCreateProject}
            className="btn-floating md:hidden"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Project Creation Modal */}
      <ProjectCreationModal
        isOpen={state.showProjectModal}
        onClose={() => dispatch({ type: 'TOGGLE_PROJECT_MODAL' })}
      />
    </div>
  );
};

export default ProjectList;
