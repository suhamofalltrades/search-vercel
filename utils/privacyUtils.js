// Sanitize search query to prevent tracking
export function sanitizeQuery(query) {
  // Remove potential tracking parameters or identifiers
  return query.trim().replace(/\s+/g, ' ');
}

// Remove ads, sponsored content, and duplicates from search results
export function removeAds(results) {
  // Filter out sponsored/ad results
  const nonAdResults = results.filter(result => {
    const lowerTitle = (result.title || '').toLowerCase();
    const lowerSnippet = (result.snippet || '').toLowerCase();
    
    // Filter out common ad indicators
    return !(
      lowerTitle.includes('sponsored') ||
      lowerTitle.includes('advertisement') ||
      lowerSnippet.includes('sponsored') ||
      lowerSnippet.includes('advertisement') ||
      result.isSponsored === true
    );
  });
  
  // Remove duplicates based on URL
  const uniqueResults = [];
  const seenUrls = new Set();
  
  for (const result of nonAdResults) {
    if (!result.link) continue;
    
    // Normalize URL to avoid duplicates with trailing slashes, etc.
    try {
      const normalizedUrl = normalizeUrl(result.link);
      
      if (!seenUrls.has(normalizedUrl)) {
        seenUrls.add(normalizedUrl);
        uniqueResults.push(result);
      }
    } catch (e) {
      // Skip invalid URLs
      console.error('Invalid URL:', result.link);
    }
  }
  
  return uniqueResults;
}

// Helper to normalize URLs for duplicate detection
function normalizeUrl(url) {
  try {
    const parsedUrl = new URL(url);
    // Remove trailing slash and lowercase hostname
    return `${parsedUrl.hostname.toLowerCase()}${parsedUrl.pathname.replace(/\/$/, '')}${parsedUrl.search}`;
  } catch (e) {
    // Return original if invalid URL
    return url;
  }
}
