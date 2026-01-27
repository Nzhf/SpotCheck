/**
 * LoadingSpinner Component
 * 
 * Displays a rotating generic loader icon.
 */
import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => {
  return (
    <div className="flex justify-center items-center p-8">
      <Loader2 className="w-10 h-10 text-primary-blue animate-spin" />
      <span className="ml-3 text-gray-600 font-medium">Analyzing reviews...</span>
    </div>
  );
};

export default LoadingSpinner;
