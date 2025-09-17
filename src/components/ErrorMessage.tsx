import React from 'react';
import { AlertCircle, X } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onDismiss: () => void;
}

export default function ErrorMessage({ message, onDismiss }: ErrorMessageProps) {
  return (
    <div className="mx-4 mb-4 p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3">
      <AlertCircle className="text-red-500 flex-shrink-0" size={20} />
      <p className="text-red-700 text-sm flex-1">{message}</p>
      <button
        onClick={onDismiss}
        className="text-red-500 hover:text-red-700 focus:outline-none"
      >
        <X size={16} />
      </button>
    </div>
  );
}