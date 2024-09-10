import { PlusIcon } from '@heroicons/react/24/solid';
import React from 'react';

interface FloatingActionButtonProps {
  onClick: () => void;
}

const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg focus:outline-none"
    >
      <PlusIcon className="h-6 w-6" />
    </button>
  );
};

export default FloatingActionButton;
