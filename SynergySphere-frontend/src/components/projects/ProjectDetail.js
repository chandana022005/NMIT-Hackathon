import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import Header from '../layout/Header';
import TaskList from '../tasks/TaskList';
import TaskCreationModal from '../tasks/TaskCreationModal';
import Button from '../ui/Button';
import Avatar from '../ui/Avatar';

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { state, dispatch } = useApp();
  const { projects, tasks, users } = state;
  
  const [activeTab, setActiveTab] = useState('tasks');
  
  const project = projects.find(p => p.id === parseInt(id));
  const projectTasks = tasks.filter(task => task.projectId === parseInt(id));
  const projectMembers = users.filter(user => project?.members.includes(user.id));

  useEffect(() => {
    if (project) {
      dispatch({ type: 'SET_CURRENT_PROJECT', payload: project });
    } else {
      navigate('/projects');
    }
  }, [project, dispatch, navigate]);

  if (!project) {
    return (
      <div className="p-4 md:p-6">
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900">Project not found</h2>
          <p className="text-gray-600 mt-2">The project you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/projects')} className="mt-4">
            Back to Projects
          </Button>
        </div>
      </div>
    );
  }

  const handleCreateTask = () => {
    dispatch({ type: 'TOGGLE_TASK_MODAL' });
  };

  const tabs = [
    { id: 'tasks', label: 'Tasks', count: projectTasks.length },
    { id: 'members', label: 'Members', count: projectMembers.length },
    { id: 'overview', label: 'Overview', count: null },
  ];

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

      <Header title={project.name} />
      
      <div className="relative z-10 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumbs */}
          <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <Link to="/projects" className="text-gray-700 hover:text-primary-600 transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg className="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="ml-1 text-gray-500 md:ml-2">{project.name}</span>
                </div>
              </li>
            </ol>
          </nav>
          {/* Project Header */}
          <div className="mb-6">
            <p className="text-gray-600 mb-4">{project.description}</p>
            
            {/* Project Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-gray-900">{projectTasks.length}</div>
                <div className="text-sm text-gray-600">Total Tasks</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-green-600">
                  {projectTasks.filter(task => task.status === 'done').length}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-blue-600">
                  {projectTasks.filter(task => task.status === 'in-progress').length}
                </div>
                <div className="text-sm text-gray-600">In Progress</div>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="text-2xl font-bold text-gray-600">
                  {projectMembers.length}
                </div>
                <div className="text-sm text-gray-600">Members</div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.label}
                  {tab.count !== null && (
                    <span className={`ml-2 py-0.5 px-2 rounded-full text-xs ${
                      activeTab === tab.id
                        ? 'bg-primary-100 text-primary-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="min-h-96">
            {activeTab === 'tasks' && (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>
                  <Button
                    onClick={handleCreateTask}
                    className="hidden md:inline-flex"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add Task
                  </Button>
                </div>
                <TaskList tasks={projectTasks} showProject={false} />
              </div>
            )}

            {activeTab === 'members' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Team Members</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {projectMembers.map((member) => (
                    <div key={member.id} className="card">
                      <div className="flex items-center">
                        <Avatar src={member.avatar} name={member.name} size="md" />
                        <div className="ml-3">
                          <h3 className="text-sm font-medium text-gray-900">{member.name}</h3>
                          <p className="text-sm text-gray-500">{member.email}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'overview' && (
              <div>
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Project Overview</h2>
                <div className="bg-white p-6 rounded-lg border border-gray-200">
                  <p className="text-gray-600">
                    This feature is coming soon. Here you'll see project analytics, 
                    timeline, and detailed insights.
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Floating Action Button for Mobile */}
          {activeTab === 'tasks' && (
            <button
              onClick={handleCreateTask}
              className="btn-floating md:hidden"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Task Creation Modal */}
      <TaskCreationModal
        isOpen={state.showTaskModal}
        onClose={() => dispatch({ type: 'TOGGLE_TASK_MODAL' })}
        projectId={parseInt(id)}
      />
    </div>
  );
};

export default ProjectDetail;
