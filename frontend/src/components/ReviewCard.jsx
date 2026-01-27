/**
 * ReviewCard Component
 * 
 * Displays a single Google Maps review text, rating, and author.
 */
import { Star, User } from 'lucide-react';

const ReviewCard = ({ review }) => {
  const { author_name, rating, text, relative_time_description, profile_photo_url } = review;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 flex flex-col h-full hover:shadow-md transition-shadow">
      <div className="flex items-center mb-4">
        {profile_photo_url ? (
          <img 
            src={profile_photo_url} 
            alt={author_name} 
            className="w-10 h-10 rounded-full object-cover mr-3 border border-gray-200"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mr-3 text-blue-500">
            <User className="w-6 h-6" />
          </div>
        )}
        
        <div>
          <h4 className="font-semibold text-gray-900 text-sm">{author_name}</h4>
          <div className="flex items-center">
            {/* Render stars */}
            <div className="flex mr-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-xs text-gray-400">{relative_time_description}</span>
          </div>
        </div>
      </div>
      
      <p className="text-gray-600 text-sm leading-relaxed line-clamp-4 hover:line-clamp-none transition-all">
        {text}
      </p>
    </div>
  );
};

export default ReviewCard;
