import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';
import Avatar from '../ui/Avatar';
import StatusBadge from '../ui/StatusBadge';

const TaskDetail = ({ isOpen, onClose }) => {
  const { state, dispatch } = useApp();
  const { currentTask, projects, users } = state;
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: currentTask?.title || '',
    description: currentTask?.description || '',
    assigneeId: currentTask?.assigneeId || '',
    dueDate: currentTask?.dueDate || '',
    status: currentTask?.status || 'todo',
  });

  const project = projects.find(p => p.id === currentTask?.projectId);
  const assignee = users.find(u => u.id === currentTask?.assigneeId);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const updatedTask = {
        ...currentTask,
        ...formData,
        assigneeId: parseInt(formData.assigneeId),
      };
      
      dispatch({ type: 'UPDATE_TASK', payload: updatedTask });
      setIsEditing(false);
      setIsLoading(false);
    }, 1000);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        dispatch({ type: 'DELETE_TASK', payload: currentTask.id });
        setIsLoading(false);
        onClose();
      }, 1000);
    }
  };

  const handleClose = () => {
    setIsEditing(false);
    setFormData({
      title: currentTask?.title || '',
      description: currentTask?.description || '',
      assigneeId: currentTask?.assigneeId || '',
      dueDate: currentTask?.dueDate || '',
      status: currentTask?.status || 'todo',
    });
    onClose();
  };

  if (!currentTask) return null;

  const userOptions = users.map(user => ({
    value: user.id,
    label: user.name,
  }));

  const statusOptions = [
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
  ];

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Task Details" size="lg">
      <div className="space-y-6">
        {/* Task Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            {isEditing ? (
              <Input
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="text-xl font-semibold"
              />
            ) : (
              <h2 className="text-xl font-semibold text-gray-900">{currentTask.title}</h2>
            )}
          </div>
          <div className="flex items-center space-x-2 ml-4">
            {!isEditing && (
              <StatusBadge status={currentTask.status} />
            )}
          </div>
        </div>

        {/* Project Info */}
        {project && (
          <div className="flex items-center text-sm text-gray-600">
            <div className="w-2 h-2 bg-primary-500 rounded-full mr-2"></div>
            <span>{project.name}</span>
          </div>
        )}

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          {isEditing ? (
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
            />
          ) : (
            <p className="text-gray-600 whitespace-pre-wrap">{currentTask.description}</p>
          )}
        </div>

        {/* Task Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Assignee */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Assignee
            </label>
            {isEditing ? (
              <Select
                name="assigneeId"
                value={formData.assigneeId}
                onChange={handleChange}
                options={userOptions}
                placeholder="Select assignee"
              />
            ) : (
              <div className="flex items-center">
                {assignee && (
                  <>
                    <Avatar src={assignee.avatar} name={assignee.name} size="sm" />
                    <span className="ml-2 text-gray-900">{assignee.name}</span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Due Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Due Date
            </label>
            {isEditing ? (
              <Input
                name="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={handleChange}
              />
            ) : (
              <p className="text-gray-900">{formatDate(currentTask.dueDate)}</p>
            )}
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            {isEditing ? (
              <Select
                name="status"
                value={formData.status}
                onChange={handleChange}
                options={statusOptions}
                placeholder="Select status"
              />
            ) : (
              <StatusBadge status={currentTask.status} />
            )}
          </div>

          {/* Created Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Created
            </label>
            <p className="text-gray-900">{formatDate(currentTask.createdAt)}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-6 border-t border-gray-200">
          <div className="flex space-x-3">
            {isEditing ? (
              <>
                <Button
                  variant="secondary"
                  onClick={() => setIsEditing(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="secondary"
                  onClick={() => setIsEditing(true)}
                >
                  Edit Task
                </Button>
                <Button
                  variant="danger"
                  onClick={handleDelete}
                  disabled={isLoading}
                >
                  Delete Task
                </Button>
              </>
            )}
          </div>
          
          <Button
            variant="outline"
            onClick={handleClose}
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default TaskDetail;
