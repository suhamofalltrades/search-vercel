export default function ResultItem({ result }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <a 
        href={result.link} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="text-xl text-blue-600 hover:underline"
      >
        {result.title}
      </a>
      <p className="text-green-700 text-sm mt-1">{result.displayLink}</p>
      <p className="mt-2 text-gray-700">{result.snippet}</p>
    </div>
  );
}
