export default function AISummary({ summary, query }) {
  return (
    <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
      <h2 className="text-lg font-medium text-blue-800 mb-3">
        Summary for "{query}"
      </h2>
      <p className="text-gray-700">{summary}</p>
      <p className="mt-4 text-xs text-gray-500">
        This summary is generated based on search results. It aims to provide a quick overview but may not be comprehensive.
      </p>
    </div>
  );
}
