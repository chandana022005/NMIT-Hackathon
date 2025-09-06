import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Textarea from '../ui/Textarea';
import Select from '../ui/Select';

const TaskCreationModal = ({ isOpen, onClose, projectId = null }) => {
  const { state, dispatch } = useApp();
  const { projects, users } = state;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigneeId: '',
    dueDate: '',
    status: 'todo',
    projectId: projectId || '',
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Task title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Task description is required';
    }
    
    if (!formData.assigneeId) {
      newErrors.assigneeId = 'Please assign this task to someone';
    }
    
    if (!formData.dueDate) {
      newErrors.dueDate = 'Due date is required';
    }
    
    if (!projectId && !formData.projectId) {
      newErrors.projectId = 'Please select a project';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      const newTask = {
        ...formData,
        projectId: projectId || parseInt(formData.projectId),
        assigneeId: parseInt(formData.assigneeId),
        createdAt: new Date().toISOString().split('T')[0],
      };
      
      dispatch({ type: 'ADD_TASK', payload: newTask });
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        assigneeId: '',
        dueDate: '',
        status: 'todo',
        projectId: projectId || '',
      });
      setErrors({});
      setIsLoading(false);
      onClose();
    }, 1000);
  };

  const handleClose = () => {
    setFormData({
      title: '',
      description: '',
      assigneeId: '',
      dueDate: '',
      status: 'todo',
      projectId: projectId || '',
    });
    setErrors({});
    onClose();
  };

  const userOptions = users.map(user => ({
    value: user.id,
    label: user.name,
  }));

  const projectOptions = projects.map(project => ({
    value: project.id,
    label: project.name,
  }));

  const statusOptions = [
    { value: 'todo', label: 'To Do' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Create New Task">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Task Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
          required
          placeholder="Enter task title"
        />
        
        <Textarea
          label="Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          error={errors.description}
          required
          placeholder="Describe the task"
          rows={3}
        />
        
        {!projectId && (
          <Select
            label="Project"
            name="projectId"
            value={formData.projectId}
            onChange={handleChange}
            options={projectOptions}
            error={errors.projectId}
            required
            placeholder="Select a project"
          />
        )}
        
        <Select
          label="Assignee"
          name="assigneeId"
          value={formData.assigneeId}
          onChange={handleChange}
          options={userOptions}
          error={errors.assigneeId}
          required
          placeholder="Select an assignee"
        />
        
        <Input
          label="Due Date"
          name="dueDate"
          type="date"
          value={formData.dueDate}
          onChange={handleChange}
          error={errors.dueDate}
          required
        />
        
        <Select
          label="Status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          options={statusOptions}
          placeholder="Select status"
        />
        
        <div className="flex space-x-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={handleClose}
            className="flex-1"
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            className="flex-1"
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Task'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default TaskCreationModal;
