// Simple text summarization without external APIs
export function generateSummary(text, query) {
  try {
    if (!text) {
      return `No information found for "${query}".`;
    }

    // Extract sentences from the text
    const sentences = extractSentences(text);
    
    if (sentences.length === 0) {
      return `Found results for "${query}", but couldn't generate a summary.`;
    }
    
    // Score sentences based on relevance to the query
    const scoredSentences = sentences.map(sentence => ({
      text: sentence,
      score: scoreForRelevance(sentence, query)
    }));
    
    // Sort by score and take top sentences
    scoredSentences.sort((a, b) => b.score - a.score);
    
    // Take top 3-5 sentences depending on length
    const numSentences = Math.min(scoredSentences.length, 
      scoredSentences.length < 10 ? 3 : 5);
    
    const topSentences = scoredSentences
      .slice(0, numSentences)
      .map(item => item.text);
    
    // Join sentences and clean up the text
    return topSentences.join(' ');
  } catch (error) {
    console.error('Error generating summary:', error);
    return `Found results for "${query}". You can explore them below.`;
  }
}

// Helper to extract sentences from text
function extractSentences(text) {
  // Simple sentence extraction - not perfect but works for most cases
  return text
    .replace(/\n/g, '. ')
    .replace(/\s+/g, ' ')
    .split(/\.|\!|\?/)
    .filter(sentence => sentence.trim().length > 20)
    .map(sentence => sentence.trim());
}

// Score sentences based on relevance to query
function scoreForRelevance(sentence, query) {
  const sentenceLower = sentence.toLowerCase();
  const queryTerms = query.toLowerCase().split(/\s+/);
  
  // Count how many query terms appear in the sentence
  let termScore = 0;
  queryTerms.forEach(term => {
    if (sentenceLower.includes(term)) {
      termScore += 1;
    }
  });
  
  // Give higher scores to sentences with more query terms
  const termFraction = termScore / queryTerms.length;
  
  // Consider sentence length - penalize very short or very long sentences
  const lengthScore = 
    sentence.length > 30 && sentence.length < 200 
      ? 1 
      : 0.5;
  
  // Calculate final score
  return (termFraction * 2 + lengthScore) / 3;
}
