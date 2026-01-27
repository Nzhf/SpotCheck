/**
 * Hero Component
 * 
 * Landing page header section with title, subtitle, and search bar.
 */
import SearchBar from './SearchBar';
import { MapPin } from 'lucide-react';

const Hero = ({ onSearch, isLoading }) => {
  return (
    <div className="bg-gradient-to-b from-blue-50 to-white pt-20 pb-16 px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
      <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-full mb-6">
        <MapPin className="w-4 h-4 text-primary-blue mr-2" />
        <span className="text-primary-blue text-sm font-semibold uppercase tracking-wide">SpotCheck AI</span>
      </div>
      
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 tracking-tight mb-6">
        Discover What People <br className="hidden sm:block" />
        <span className="text-primary-blue">Really Think</span>
      </h1>
      
      <p className="max-w-2xl mx-auto text-xl text-gray-600 mb-10">
        Stop reading hundreds of reviews. Get instant, AI-powered summaries of Google Maps ratings for any location.
      </p>

      <div className="relative z-10 p-2">
        <SearchBar onSearch={onSearch} isLoading={isLoading} />
      </div>
    </div>
  );
};

export default Hero;
