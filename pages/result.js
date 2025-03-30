import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import SearchForm from '../components/SearchForm';
import ResultItem from '../components/ResultItem';
import AISummary from '../components/AISummary';

export default function Results() {
  const router = useRouter();
  const { q } = router.query;
  const [query, setQuery] = useState(q || '');
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchResults = async () => {
      if (!q) return;
      
      setLoading(true);
      try {
        // Fetch search results
        const searchResponse = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
        const searchData = await searchResponse.json();
        setResults(searchData.results);

        // Fetch AI summary
        const summaryResponse = await fetch(`/api/summary?q=${encodeURIComponent(q)}`);
        const summaryData = await summaryResponse.json();
        setSummary(summaryData.summary);
      } catch (error) {
        console.error("Error fetching results:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [q]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/results?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Head>
        <title>{q ? `${q} - PrivSearch` : 'Search Results - PrivSearch'}</title>
        <meta name="description" content="Privacy-focused search results" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center">
            <h1 
              className="text-2xl font-bold text-blue-600 mb-4 md:mb-0 md:mr-8 cursor-pointer"
              onClick={() => router.push('/')}
            >
              PrivSearch
            </h1>
            <div className="flex-grow">
              <SearchForm 
                query={query} 
                setQuery={setQuery} 
                handleSearch={handleSearch} 
              />
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-gray-600">Searching securely...</p>
          </div>
        ) : (
          <>
            {summary && (
              <AISummary summary={summary} query={q} />
            )}

            <div className="mt-6">
              {results.length > 0 ? (
                <div className="space-y-6">
                  {results.map((result, index) => (
                    <ResultItem key={index} result={result} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-gray-600">No results found for "{q}"</p>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      <footer className="bg-white mt-auto py-4 border-t border-gray-200 text-center text-gray-500">
        <p>PrivSearch - Protecting your privacy while you explore the web</p>
      </footer>
    </div>
  );
                  }
