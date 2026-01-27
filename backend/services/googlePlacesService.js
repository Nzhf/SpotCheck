/**
 * Google Places Service
 * 
 * Handles interactions with the Google Places API.
 * Responsibilities:
 * 1. Search for a place by name (Text Search) to get a place_id.
 * 2. Fetch place details (reviews, rating, etc.) using place_id.
 */

const axios = require('axios');

// Base URL for Google Maps Platform APIs
const GOOGLE_PLACES_BASE_URL = 'https://maps.googleapis.com/maps/api/place';

/**
 * Searches for a place by name using the Text Search API.
 * 
 * @param {string} placeName - The name of the location to search for.
 * @returns {Promise<string>} - The place_id of the first result.
 * @throws {Error} - If no place is found or API call fails.
 */
async function searchPlaceByName(placeName) {
    try {
        const apiKey = process.env.GOOGLE_PLACES_API_KEY;
        if (!apiKey) throw new Error('Missing Google Places API Key');

        const url = `${GOOGLE_PLACES_BASE_URL}/textsearch/json`;
        const response = await axios.get(url, {
            params: {
                query: placeName,
                key: apiKey,
            },
        });

        const data = response.data;

        // Check Google API status
        if (data.status !== 'OK') {
            if (data.status === 'ZERO_RESULTS') {
                throw new Error('Location not found. Please try a different name.');
            }
            throw new Error(`Google API Error: ${data.status} - ${data.error_message || ''}`);
        }

        // Return the first result's place_id
        if (data.results && data.results.length > 0) {
            return data.results[0].place_id;
        } else {
            throw new Error('No results found.');
        }

    } catch (error) {
        console.error('Error in searchPlaceByName:', error.message);
        throw error;
    }
}

/**
 * Fetches detailed information about a place, including reviews.
 * 
 * @param {string} placeId - The unique identifier for the place.
 * @returns {Promise<Object>} - The place details (name, formatted_address, rating, reviews).
 */
async function getPlaceDetails(placeId) {
    try {
        const apiKey = process.env.GOOGLE_PLACES_API_KEY;

        // Request specific fields to save data/cost and ensure we get what we need
        // name, formatted_address, rating, reviews, user_ratings_total
        const fields = 'name,formatted_address,rating,reviews,user_ratings_total';
        const url = `${GOOGLE_PLACES_BASE_URL}/details/json`;

        const response = await axios.get(url, {
            params: {
                place_id: placeId,
                fields: fields,
                key: apiKey,
            },
        });

        const data = response.data;

        if (data.status !== 'OK') {
            throw new Error(`Google API Details Error: ${data.status}`);
        }

        return data.result;

    } catch (error) {
        console.error('Error in getPlaceDetails:', error.message);
        throw error;
    }
}

/**
 * Gets place suggestions as user types.
 * 
 * NOTE: We use Text Search API instead of Autocomplete API because:
 * - Autocomplete API: Limited to 5 results (Google's limit, cannot change)
 * - Text Search API: Returns up to 20 results per request
 * 
 * Trade-off: Text Search is slightly slower but returns more options.
 * 
 * @param {string} input - The partial search text entered by user.
 * @returns {Promise<Array>} - Array of place suggestions with description and place_id.
 */
async function getPlaceAutocomplete(input) {
    try {
        const apiKey = process.env.GOOGLE_PLACES_API_KEY;
        if (!apiKey) throw new Error('Missing Google Places API Key');

        // Using Text Search API for more results (up to 20)
        const url = `${GOOGLE_PLACES_BASE_URL}/textsearch/json`;
        const response = await axios.get(url, {
            params: {
                query: input,
                key: apiKey,
            },
        });

        const data = response.data;

        if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
            throw new Error(`Google Text Search Error: ${data.status}`);
        }

        // Format results for frontend display
        // Text Search returns different fields than Autocomplete
        const suggestions = (data.results || []).map(place => ({
            placeId: place.place_id,
            description: place.formatted_address || '', // Full address
            mainText: place.name, // Place name
            secondaryText: place.formatted_address || '', // Address as secondary
        }));

        return suggestions;

    } catch (error) {
        console.error('Error in getPlaceAutocomplete:', error.message);
        throw error;
    }
}

module.exports = {
    searchPlaceByName,
    getPlaceDetails,
    getPlaceAutocomplete,
};
