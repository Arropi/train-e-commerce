import { ReactNode } from 'react';

interface SectionProps {
  title: string;
  children: ReactNode;
  onViewAll?: () => void;
}

export default function Section({ title, children, onViewAll }: SectionProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        {onViewAll && (
          <button 
            onClick={onViewAll}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            View All →
          </button>
        )}
      </div>
      
      <div className="overflow-x-auto"
      style={{ 
        scrollbarWidth: 'none',
        msOverflowStyle: 'none'
       }} 
      >
        <div className="flex gap-4 pb-4">
          {children}
        </div>
      </div>
    </div>
  );
}