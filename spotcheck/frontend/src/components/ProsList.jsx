/**
 * ProsList Component
 * 
 * Displays positive points with green checkmark icons.
 */
import { Check } from 'lucide-react';

const ProsList = ({ pros }) => {
  if (!pros || pros.length === 0) return null;

  return (
    <div className="bg-green-50/50 rounded-xl p-6 border border-green-100 h-full">
      <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center">
        <span className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
          <Check className="w-5 h-5 text-green-600" />
        </span>
        Top Pros
      </h3>
      <ul className="space-y-3">
        {pros.map((pro, index) => (
          <li key={index} className="flex items-start">
            <Check className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-gray-700">{pro}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ProsList;
