/**
 * SearchBar Component
 * 
 * Input field with autocomplete suggestions dropdown.
 * As user types, shows matching places from Google Places API.
 * User can click a suggestion to search for that place.
 */
import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';
import { getAutocompleteSuggestions } from '../services/apiService';

const SearchBar = ({ onSearch, isLoading }) => {
  // State for the text input
  const [query, setQuery] = useState('');
  
  // State for autocomplete suggestions
  const [suggestions, setSuggestions] = useState([]);
  
  // State to show/hide the dropdown
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // State for loading suggestions
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);

  // State for highlighted suggestion index
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  
  // Reference to detect clicks outside the component
  const wrapperRef = useRef(null);

  /**
   * Fetch suggestions when user types.
   * We use a "debounce" effect - wait 300ms after user stops typing
   * before making the API call. This prevents too many API requests.
   */
  useEffect(() => {
    // Don't search if query is too short
    if (query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    // Set a timer to wait before searching (debounce)
    const debounceTimer = setTimeout(async () => {
      setLoadingSuggestions(true);
      try {
        const results = await getAutocompleteSuggestions(query);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      } catch (error) {
        console.error('Failed to fetch suggestions:', error);
        setSuggestions([]);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300); // Wait 300ms after user stops typing

    // Cleanup: cancel the timer if user types again before 300ms
    return () => clearTimeout(debounceTimer);
  }, [query]);

  /**
   * Reset highlighted index to 0 when suggestions list changes.
   */
  useEffect(() => {
    setHighlightedIndex(0);
  }, [suggestions]);

  /**
   * Close suggestions dropdown when clicking outside
   */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  /**
   * Handle form submission (pressing Enter or clicking Search button)
   */
  const handleSubmit = (event) => {
    event.preventDefault();
    if (isLoading) {
      return;
    }

    // If suggestions are visible and there's a highlighted index, search that suggestion
    const hasSuggestions = showSuggestions && suggestions.length > 0;
    const isValidIndex = highlightedIndex >= 0 && highlightedIndex < suggestions.length;
    
    if (hasSuggestions && isValidIndex) {
      const selectedSuggestion = suggestions[highlightedIndex];
      setQuery(selectedSuggestion.mainText);
      setShowSuggestions(false);
      onSearch(selectedSuggestion.mainText);
    } else if (query.trim()) {
      setShowSuggestions(false);
      onSearch(query.trim());
    }
  };

  /**
   * Handle keyboard navigation within the suggestions list
   */
  const handleKeyDown = (event) => {
    if (!showSuggestions || suggestions.length === 0) {
      return;
    }

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setHighlightedIndex((prevIndex) => {
        if (prevIndex === suggestions.length - 1) {
          return 0;
        }
        return prevIndex + 1;
      });
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setHighlightedIndex((prevIndex) => {
        if (prevIndex === 0) {
          return suggestions.length - 1;
        }
        return prevIndex - 1;
      });
    } else if (event.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  /**
   * Handle hover highlighting only for fine pointer devices (like mice) to avoid mobile scrolling issues
   */
  const handleMouseEnter = (index) => {
    const hasFinePointer = window.matchMedia('(pointer: fine)').matches;
    if (hasFinePointer) {
      setHighlightedIndex(index);
    }
  };

  /**
   * Handle clicking on a suggestion
   * We use the mainText (place name) to fill the search and trigger search
   */
  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.mainText);
    setShowSuggestions(false);
    // Trigger the search with the selected place name
    onSearch(suggestion.mainText);
  };

  return (
    <div ref={wrapperRef} className="w-full max-w-2xl mx-auto relative">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Enter a location (e.g., 'Starbucks Times Square')"
            disabled={isLoading}
            className="w-full px-6 py-4 pl-14 text-lg rounded-full border-2 border-gray-100 shadow-lg focus:outline-none focus:border-primary-blue focus:ring-4 focus:ring-blue-100 transition-all disabled:opacity-70 disabled:cursor-not-allowed text-gray-800 placeholder-gray-400"
            autoComplete="off"
          />
          <Search className="absolute left-5 top-1/2 transform -translate-y-1/2 text-gray-400 w-6 h-6" />
          
          {/* Loading indicator for suggestions */}
          {loadingSuggestions && (
            <Loader2 className="absolute right-24 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 animate-spin" />
          )}
          
          <button
            type="submit"
            disabled={!query.trim() || isLoading}
            className="absolute right-2 top-2 bottom-2 bg-primary-blue hover:bg-blue-600 text-white px-6 rounded-full font-medium transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center"
          >
            {isLoading ? 'Searching...' : 'Search'}
          </button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden text-left">
          <ul className="py-2 max-h-80 overflow-y-auto">
            {suggestions.map((suggestion, index) => (
              <li
                key={suggestion.placeId || index}
                onClick={() => handleSuggestionClick(suggestion)}
                onMouseEnter={() => handleMouseEnter(index)}
                className={`px-4 py-3 cursor-pointer transition-colors flex items-start gap-3 ${
                  index === highlightedIndex ? 'bg-blue-50' : ''
                }`}
              >
                {/* Map pin icon */}
                <MapPin className="w-5 h-5 text-primary-blue mt-0.5 flex-shrink-0" />
                
                {/* Place name and address */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">
                    {suggestion.mainText}
                  </p>
                  <p className="text-sm text-gray-500 truncate">
                    {suggestion.secondaryText}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
