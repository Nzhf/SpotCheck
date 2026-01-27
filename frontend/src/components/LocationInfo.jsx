/**
 * LocationInfo Component
 * 
 * Displays the name, address, and overall rating of the location.
 */
import { Star, MapPin } from 'lucide-react';

const LocationInfo = ({ location }) => {
  const { name, address, rating, totalRatings } = location;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8 animate-fade-in-up">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">{name}</h2>
          <div className="flex items-center text-gray-600">
            <MapPin className="w-4 h-4 mr-1.5" />
            {address}
          </div>
        </div>
        
        <div className="flex items-center bg-yellow-50 px-4 py-2 rounded-lg border border-yellow-100">
          <Star className="w-6 h-6 text-yellow-500 fill-current mr-2" />
          <div className="flex flex-col">
            <span className="text-2xl font-bold text-gray-900 leading-none">{rating}</span>
            <span className="text-xs text-gray-500">{totalRatings} reviews</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationInfo;
