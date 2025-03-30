import { sanitizeQuery } from '../../utils/privacyUtils';
import { fetchFromEngines } from '../../utils/searchEngines';
import { generateSummary } from '../../utils/summarization';

export default async function handler(req, res) {
  const { q } = req.query;
  
  if (!q) {
    return res.status(400).json({ error: 'Query parameter is required' });
  }

  try {
    // Sanitize the query to prevent tracking
    const sanitizedQuery = sanitizeQuery(q);
    
    // Fetch results from search engines
    const results = await fetchFromEngines(sanitizedQuery);
    
    // Extract relevant text for summarization
    const contextText = results
      .slice(0, 5)
      .map(r => `${r.title}: ${r.snippet}`)
      .join('\n\n');
    
    // Generate summary using our free summarization utility
    const summary = generateSummary(contextText, sanitizedQuery);
    
    res.status(200).json({ summary });
  } catch (error) {
    console.error('Summary API error:', error);
    res.status(500).json({ 
      error: 'Failed to generate summary',
      fallbackSummary: `Here are search results for "${q}".`
    });
  }
}
