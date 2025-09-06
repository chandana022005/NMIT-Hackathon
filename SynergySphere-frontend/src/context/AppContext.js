import React, { createContext, useContext, useReducer } from 'react';
import { dummyProjects, dummyTasks, dummyUsers, currentUser } from '../data/dummyData';

const AppContext = createContext();

const initialState = {
  user: null,
  projects: dummyProjects,
  tasks: dummyTasks,
  users: dummyUsers,
  isAuthenticated: false, // Start as not authenticated to show login screen
  currentProject: null,
  currentTask: null,
  showProjectModal: false,
  showTaskModal: false,
  showTaskDetail: false,
};

const appReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
      };
    
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        currentProject: null,
        currentTask: null,
      };
    
    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [...state.projects, { ...action.payload, id: Date.now() }],
        showProjectModal: false,
      };
    
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.id ? action.payload : project
        ),
      };
    
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(project => project.id !== action.payload),
        tasks: state.tasks.filter(task => task.projectId !== action.payload),
        currentProject: state.currentProject?.id === action.payload ? null : state.currentProject,
      };
    
    case 'ADD_TASK':
      return {
        ...state,
        tasks: [...state.tasks, { ...action.payload, id: Date.now() }],
        showTaskModal: false,
      };
    
    case 'UPDATE_TASK':
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        ),
      };
    
    case 'DELETE_TASK':
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload),
        currentTask: state.currentTask?.id === action.payload ? null : state.currentTask,
      };
    
    case 'SET_CURRENT_PROJECT':
      return {
        ...state,
        currentProject: action.payload,
      };
    
    case 'SET_CURRENT_TASK':
      return {
        ...state,
        currentTask: action.payload,
      };
    
    case 'TOGGLE_PROJECT_MODAL':
      return {
        ...state,
        showProjectModal: !state.showProjectModal,
      };
    
    case 'TOGGLE_TASK_MODAL':
      return {
        ...state,
        showTaskModal: !state.showTaskModal,
      };
    
    case 'TOGGLE_TASK_DETAIL':
      return {
        ...state,
        showTaskDetail: !state.showTaskDetail,
      };
    
    case 'UPDATE_USER_PROFILE':
      return {
        ...state,
        user: { ...state.user, ...action.payload },
      };
    
    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
