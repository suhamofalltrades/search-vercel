export default function SearchForm({ query, setQuery, handleSearch }) {
  return (
    <form onSubmit={handleSearch} className="flex w-full">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search the web privately..."
        className="w-full p-4 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-r-lg transition duration-200"
      >
        Search
      </button>
    </form>
  );
          }
  
