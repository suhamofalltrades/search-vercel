import { sanitizeQuery } from '../../utils/privacyUtils';
import { fetchFromEngines } from '../../utils/searchEngines';
import { generateSummary } from '../../utils/summarization';
export default async function handler(req, res) {
  // Validate query parameter
  if (typeof req.query.q !== 'string' || !req.query.q.trim()) {
    return res.status(400).json({ 
      error: 'Valid query parameter (q) is required',
      example: '/api/summary?q=hello' 
    });
  }

  try {
    const sanitizedQuery = req.query.q.trim();
    console.log(`Generating summary for: "${sanitizedQuery}"`);
    
    // Rest of your existing summary logic...
    const results = await fetchFromEngines(sanitizedQuery);
    const contextText = results.slice(0, 5).map(r => `${r.title}: ${r.snippet}`).join('\n\n');
    const summary = generateSummary(contextText, sanitizedQuery);
    
    return res.status(200).json({ 
      success: true,
      summary: summary || 'No summary could be generated',
      query: sanitizedQuery
    });
    
  } catch (error) {
    console.error('Summary API error:', error);
    return res.status(500).json({ 
      error: 'Failed to generate summary',
      details: error.message,
      fallbackSummary: `Showing results for "${req.query.q}"` 
    });
  }
}
