import { sanitizeQuery, removeAds } from '../../utils/privacyUtils';
import { fetchFromEngines } from '../../utils/searchEngines';

export default async function handler(req, res) {
  // Validate query parameter
  if (typeof req.query.q !== 'string' || !req.query.q.trim()) {
    return res.status(400).json({ 
      error: 'Valid query parameter (q) is required',
      example: '/api/search?q=hello' 
    });
  }

  try {
    const sanitizedQuery = req.query.q.trim();
    console.log(`Processing search for: "${sanitizedQuery}"`);
    
    // Rest of your existing search logic...
    const rawResults = await fetchFromEngines(sanitizedQuery);
    const cleanResults = removeAds(rawResults);
    
    return res.status(200).json({ 
      success: true,
      results: cleanResults,
      query: sanitizedQuery
    });
    
  } catch (error) {
    console.error('Search API error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch search results',
      details: error.message 
    });
  }
}
export default async function handler(req, res) {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    // Sanitize the query to prevent tracking
    const sanitizedQuery = sanitizeQuery(q);
    
    // Fetch results from multiple search engines
    const rawResults = await fetchFromEngines(sanitizedQuery);
    
    // Remove ads, sponsored content, and duplicates
    const cleanResults = removeAds(rawResults);
    
    // Return the results
    res.status(200).json({ results: cleanResults });
  } catch (error) {
    console.error('Search API error:', error);
    res.status(500).json({ error: 'Failed to fetch search results' });
  }
}
