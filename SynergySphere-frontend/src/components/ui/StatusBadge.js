import React from 'react';

const StatusBadge = ({ status, className = '' }) => {
  const statusConfig = {
    todo: {
      label: 'To Do',
      classes: 'status-badge status-todo',
    },
    'in-progress': {
      label: 'In Progress',
      classes: 'status-badge status-progress',
    },
    done: {
      label: 'Done',
      classes: 'status-badge status-done',
    },
  };

  const config = statusConfig[status] || statusConfig.todo;

  return (
    <span className={`${config.classes} ${className}`}>
      {config.label}
    </span>
  );
};

export default StatusBadge;
