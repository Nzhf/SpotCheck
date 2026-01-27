/**
 * API Service
 * 
 * Handles all network requests to the backend API.
 */

import axios from 'axios';

// Set the Backend URL dynamically
// 1. In production (hosted), we'll set VITE_API_URL in the dashboard
// 2. In development, it defaults to '/api' which uses the Vite proxy
const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Searches for a location and gets details + AI summary.
 * 
 * @param {string} locationName - The name of the place to search for.
 * @returns {Promise<Object>} - The backend response containing location, reviews, and aiSummary.
 */
export const searchLocation = async (locationName) => {
    try {
        console.log(`Sending search request for: ${locationName}`);

        // Add a minimum delay to show loading animation nice-to-have? 
        // No, keep it fast.

        const response = await api.post('/search-location', { locationName });
        return response.data;
    } catch (error) {
        // Standardize error message
        console.error('API Error:', error);
        const message = error.response?.data?.error ||
            error.response?.data?.message ||
            'Something went wrong. Please try again.';
        throw new Error(message);
    }
};

export const checkHealth = async () => {
    try {
        const response = await api.get('/health');
        return response.data;
    } catch (error) {
        console.error('Health Check Error:', error);
        throw error;
    }
};

/**
 * Gets autocomplete suggestions as user types.
 * 
 * @param {string} input - The partial text entered by user.
 * @returns {Promise<Array>} - Array of place suggestions.
 */
export const getAutocompleteSuggestions = async (input) => {
    try {
        // Don't call API for very short inputs
        if (!input || input.trim().length < 2) {
            return [];
        }

        const response = await api.get('/autocomplete', {
            params: { input: input.trim() }
        });

        return response.data.suggestions || [];
    } catch (error) {
        console.error('Autocomplete Error:', error);
        // Return empty array on error (don't break the UI)
        return [];
    }
};
