import React from 'react';
import { useApp } from '../../context/AppContext';
import Header from '../layout/Header';
import ProjectCard from '../projects/ProjectCard';
import TaskCard from '../tasks/TaskCard';
import Button from '../ui/Button';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { state, dispatch } = useApp();
  const { projects, tasks, user } = state;

  // Get recent projects (last 3)
  const recentProjects = projects.slice(0, 3);
  
  // Get user's tasks (assigned to current user)
  const userTasks = tasks.filter(task => task.assigneeId === user?.id);
  
  // Get recent tasks (last 5)
  const recentTasks = userTasks.slice(0, 5);
  
  // Get overdue tasks
  const overdueTasks = userTasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today && task.status !== 'done';
  });

  // Get tasks due today
  const todayTasks = userTasks.filter(task => {
    const dueDate = new Date(task.dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate.toDateString() === today.toDateString() && task.status !== 'done';
  });

  const stats = {
    totalProjects: projects.length,
    totalTasks: userTasks.length,
    completedTasks: userTasks.filter(task => task.status === 'done').length,
    overdueTasks: overdueTasks.length,
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

      <Header title={`Welcome back, ${user?.name?.split(' ')[0]}!`} />
      
      <div className="relative z-10 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-primary-600">{stats.totalProjects}</div>
              <div className="text-sm text-gray-600">Projects</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-blue-600">{stats.totalTasks}</div>
              <div className="text-sm text-gray-600">My Tasks</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-green-600">{stats.completedTasks}</div>
              <div className="text-sm text-gray-600">Completed</div>
            </div>
            <div className="bg-white p-4 rounded-lg border border-gray-200">
              <div className="text-2xl font-bold text-red-600">{stats.overdueTasks}</div>
              <div className="text-sm text-gray-600">Overdue</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Recent Projects */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Recent Projects</h2>
                <Link to="/projects">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
              
              {recentProjects.length > 0 ? (
                <div className="space-y-4">
                  {recentProjects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
                  <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-gray-100">
                    <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No projects yet</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating your first project</p>
                  <Link to="/projects">
                    <Button className="mt-3" size="sm">
                      Create Project
                    </Button>
                  </Link>
                </div>
              )}
            </div>

            {/* My Tasks */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">My Tasks</h2>
                <Link to="/tasks">
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </Link>
              </div>
              
              {recentTasks.length > 0 ? (
                <div className="space-y-3">
                  {recentTasks.map((task) => (
                    <TaskCard key={task.id} task={task} showProject={true} />
                  ))}
                </div>
              ) : (
                <div className="bg-white p-6 rounded-lg border border-gray-200 text-center">
                  <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-gray-100">
                    <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  </div>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No tasks assigned</h3>
                  <p className="mt-1 text-sm text-gray-500">You don't have any tasks assigned yet</p>
                </div>
              )}
            </div>
          </div>

          {/* Urgent Tasks Alert */}
          {(overdueTasks.length > 0 || todayTasks.length > 0) && (
            <div className="mt-8">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Urgent Tasks</h2>
              
              {overdueTasks.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium text-red-600 mb-2">Overdue Tasks</h3>
                  <div className="space-y-2">
                    {overdueTasks.slice(0, 3).map((task) => (
                      <div key={task.id} className="bg-red-50 border border-red-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-red-900">{task.title}</h4>
                            <p className="text-xs text-red-600">Due {new Date(task.dueDate).toLocaleDateString()}</p>
                          </div>
                          <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                            Overdue
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              {todayTasks.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium text-orange-600 mb-2">Due Today</h3>
                  <div className="space-y-2">
                    {todayTasks.slice(0, 3).map((task) => (
                      <div key={task.id} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium text-orange-900">{task.title}</h4>
                            <p className="text-xs text-orange-600">Due today</p>
                          </div>
                          <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full">
                            Today
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
