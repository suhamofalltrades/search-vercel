import { sanitizeQuery, removeAds } from '../../utils/privacyUtils';
import { fetchFromEngines } from '../../utils/searchEngines';

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
