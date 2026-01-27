/**
 * ErrorMessage Component
 * 
 * Displays error text in a red-tinted alert box.
 */
import { AlertCircle } from 'lucide-react';

const ErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start max-w-2xl mx-auto my-6">
      <AlertCircle className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" />
      <div>
        <h3 className="text-red-800 font-semibold">Oops! Something went wrong</h3>
        <p className="text-red-600 mt-1">{message}</p>
      </div>
    </div>
  );
};

export default ErrorMessage;
