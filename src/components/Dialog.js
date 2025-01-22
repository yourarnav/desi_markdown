import React from 'react';

export const Dialog = ({ open, onOpenChange, children }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export const DialogContent = ({ children, className = "" }) => (
  <div className={`space-y-4 ${className}`}>{children}</div>
);

export const DialogHeader = ({ children }) => (
  <div className="mb-4">{children}</div>
);

export const DialogTitle = ({ children }) => (
  <h2 className="text-lg font-semibold">{children}</h2>
);