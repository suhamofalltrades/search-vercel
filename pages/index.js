import { useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import SearchForm from '../components/SearchForm';

export default function Home() {
  const router = useRouter();
  const [query, setQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/results?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <Head>
        <title>PrivSearch - Privacy-Focused Search Engine</title>
        <meta name="description" content="A privacy-focused metasearch engine with AI summaries" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-4 sm:px-20 text-center">
        <h1 className="text-4xl font-bold text-blue-600 mb-8">PrivSearch</h1>
        <p className="text-xl mb-12 max-w-lg">
          Search the web privately. No tracking, no ads, just results.
        </p>
        
        <div className="w-full max-w-2xl">
          <SearchForm 
            query={query} 
            setQuery={setQuery} 
            handleSearch={handleSearch} 
          />
        </div>
        
        <div className="mt-12 text-gray-600">
          <p>Your searches are not logged or tracked.</p>
          <p className="mt-2">Results aggregated from multiple engines, with no paid listings.</p>
        </div>
      </main>

      <footer className="w-full py-4 border-t border-gray-200 text-center text-gray-500">
        <p>PrivSearch - Protecting your privacy while you explore the web</p>
      </footer>
    </div>
  );
              }
