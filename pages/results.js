import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import SearchForm from '../components/SearchForm';
import ResultItem from '../components/ResultItem';
import AISummary from '../components/AISummary';
export default function Results() {
  const router = useRouter();
  // Initialize query state properly
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Wait until router is ready
    if (!router.isReady) return;
    
    // Get query from URL
    const searchQuery = router.query.q;
    
    if (typeof searchQuery === 'string' && searchQuery.trim()) {
      setQuery(searchQuery);
      fetchResults(searchQuery);
    } else {
      setError('Invalid search query');
    }
  }, [router.isReady, router.query.q]);

  const fetchResults = async (searchQuery) => {
    setLoading(true);
    setError(null);
    
    try {
      // Encode the query properly
      const encodedQuery = encodeURIComponent(searchQuery);
      
      // Fetch search results
      const searchResponse = await fetch(`/api/search?q=${encodedQuery}`);
      if (!searchResponse.ok) throw new Error('Search API failed');
      
      const searchData = await searchResponse.json();
      setResults(searchData.results || []);

      // Fetch AI summary
      const summaryResponse = await fetch(`/api/summary?q=${encodedQuery}`);
      if (!summaryResponse.ok) throw new Error('Summary API failed');
      
      const summaryData = await summaryResponse.json();
      setSummary(summaryData.summary || 'No summary available');
      
    } catch (error) {
      console.error("Error:", error);
      setError(error.message);
      setResults([]);
      setSummary('');
    } finally {
      setLoading(false);
    }
  };

  // ... rest of your component code
}

