/**
 * Search Routes
 * 
 * Defines the API endpoints for searching locations and getting summaries.
 */

const express = require('express');
const router = express.Router();
const googleService = require('../services/googlePlacesService');
const groqService = require('../services/groqService');

/**
 * POST /api/search-location
 * 
 * Body: { locationName: string }
 * Returns: { location: Object, reviews: Array, aiSummary: Object }
 */
router.post('/search-location', async (req, res, next) => {
    try {
        const { locationName } = req.body;

        if (!locationName || typeof locationName !== 'string' || locationName.trim() === '') {
            return res.status(400).json({ error: 'Location name is required.' });
        }

        console.log(`Received search request for: "${locationName}"`);

        // 1. Search for the place to get place_id
        console.log('Fetching place ID...');
        const placeId = await googleService.searchPlaceByName(locationName);
        console.log(`Found Place ID: ${placeId}`);

        // 2. Get details (reviews, rating, etc.)
        console.log('Fetching place details...');
        const placeDetails = await googleService.getPlaceDetails(placeId);
        console.log(`Fetched details for: ${placeDetails.name}`);

        // 3. Generate AI Summary
        console.log('Generating AI summary...');
        // googlePlacesService returns reviews in placeDetails.reviews
        const aiSummary = await groqService.summarizeReviews(placeDetails.name, placeDetails.reviews);
        console.log('AI Summary generated successfully.');

        // 4. Construct Response
        const responsePayload = {
            location: {
                name: placeDetails.name,
                address: placeDetails.formatted_address,
                rating: placeDetails.rating,
                totalRatings: placeDetails.user_ratings_total,
                placeId: placeId,
            },
            reviews: placeDetails.reviews || [],
            aiSummary: aiSummary,
        };

        res.json(responsePayload);

    } catch (error) {
        next(error); // Pass to global error handler in server.js
    }
});

/**
 * GET /api/autocomplete
 * 
 * Query: ?input=partial search text
 * Returns: Array of place suggestions
 */
router.get('/autocomplete', async (req, res, next) => {
    try {
        const { input } = req.query;

        if (!input || input.trim().length < 2) {
            // Don't search for very short strings
            return res.json({ suggestions: [] });
        }

        console.log(`Autocomplete request for: "${input}"`);
        const suggestions = await googleService.getPlaceAutocomplete(input);

        res.json({ suggestions });

    } catch (error) {
        next(error);
    }
});

module.exports = router;
