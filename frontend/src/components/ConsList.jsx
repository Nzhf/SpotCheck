/**
 * ConsList Component
 * 
 * Displays negative points with red X icons.
 */
import { X } from 'lucide-react';

const ConsList = ({ cons }) => {
  if (!cons || cons.length === 0) return null;

  return (
    <div className="bg-red-50/50 rounded-xl p-6 border border-red-100 h-full">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
        <span className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
          <X className="w-5 h-5 text-red-500" />
        </span>
        Potential Cons
      </h3>
      <ul className="space-y-3">
        {cons.map((con, index) => (
          <li key={index} className="flex items-start">
            <X className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{con}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ConsList;
