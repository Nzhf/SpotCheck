/**
 * App Component
 * 
 * Main Entry Point. Handles state (reviews, summary, loading, errors).
 */
import { useState } from 'react';
import { searchLocation } from './services/apiService';
import Hero from './components/Hero';
import LocationInfo from './components/LocationInfo';
import SummaryCard from './components/SummaryCard';
import ReviewCard from './components/ReviewCard';
import LoadingSpinner from './components/LoadingSpinner';
import ErrorMessage from './components/ErrorMessage';
import { MapPin, ArrowUp } from 'lucide-react';

function App() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);

  const handleSearch = async (locationName) => {
    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await searchLocation(locationName);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setData(null);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-white font-sans flex flex-col">
      {/* Search / Hero Section */}
      {!data && (
        <Hero onSearch={handleSearch} isLoading={loading} />
      )}

      {/* Results View - Only show search bar at top if we have data */}
      {data && (
        <div className="bg-white shadow-sm border-b sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
             <div className="flex items-center text-primary-blue font-bold text-xl cursor-pointer" onClick={handleClear}>
                <MapPin className="w-6 h-6 mr-2" />
                SpotCheck
             </div>
             <button 
               onClick={handleClear}
               className="text-gray-500 hover:text-primary-blue font-medium transition-colors"
             >
               Search Again
             </button>
          </div>
        </div>
      )}

      {/* Main Content Area - flex-grow pushes footer to bottom */}
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        
        {loading && <LoadingSpinner />}
        
        {error && <ErrorMessage message={error} />}

        {data && !loading && (
          <div className="animate-fade-in">
            {/* Location Header */}
            <LocationInfo location={data.location} />

            {/* AI Summary Card */}
            <SummaryCard summary={data.aiSummary} />

            {/* Individual Reviews Grid */}
            <div className="mt-12">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Recent Reviews</h3>
              {data.reviews && data.reviews.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {data.reviews.map((review, index) => (
                    <ReviewCard key={index} review={review} />
                  ))}
                </div>
              ) : (
                <p className="text-gray-500">No individual reviews available to display.</p>
              )}
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-100 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} SpotCheck. Powered by Google Maps & Groq AI.</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
