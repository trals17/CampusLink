// components/ChooseStatus.tsx
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/solid';
import { useState } from 'react';

interface ChooseStatusProps {
  onChange: (value: string | null) => void;
}

const statusLabels: { [key: string]: string } = {
  connected: '생방송',
  disconnected: '녹화본',
  null: '준비중', // Use 'null' for consistency
};

const statusValues: { [key: string]: string | null } = {
  생방송: 'connected',
  녹화본: 'disconnected',
  준비중: null, // Use null
};

export default function ChooseStatus({ onChange }: ChooseStatusProps) {
  const [status, setStatus] = useState<string>('생방송');
  const [click, setClick] = useState(false);

  const handleStatusChange = (label: string) => {
    // Convert undefined to null before calling onChange
    const value = statusValues[label] ?? null;
    setStatus(label);
    onChange(value);
    setClick(false);
  };

  const handleClick = () => {
    setClick(!click);
  };

  return (
    <div className="relative flex flex-col items-start">
      <div
        className="flex items-center cursor-pointer bg-red-600 p-2 rounded"
        onClick={handleClick}
      >
        <span className="flex-1 text-white">{status}</span>
        {click ? (
          <ChevronUpIcon className="h-5 w-7 pl-3" />
        ) : (
          <ChevronDownIcon className="h-5 w-7 pl-3" />
        )}
      </div>
      {click && (
        <ul className="absolute top-full mt-1 bg-red-500 rounded shadow-lg">
          {Object.keys(statusLabels).map((key) => (
            <li
              key={key}
              className="p-2 hover:bg-red-700 cursor-pointer"
              onClick={() => handleStatusChange(statusLabels[key])}
            >
              {statusLabels[key]}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
