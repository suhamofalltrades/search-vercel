import axios from 'axios';

// Configure search engines
export const searchEngines = [
  {
    name: 'DuckDuckGo',
    baseUrl: 'https://api.duckduckgo.com/',
    params: (query) => ({
      q: query,
      format: 'json',
      no_html: 1,
      no_redirect: 1,
    }),
    parseResponse: (data) => {
      if (!data.Results) return [];
      return data.Results.map(result => ({
        title: result.Title,
        link: result.FirstURL,
        displayLink: new URL(result.FirstURL).hostname,
        snippet: result.Text,
        source: 'DuckDuckGo',
      }));
    },
  },
  {
    name: 'SearXNG',
    baseUrl: 'https://searx.be/search',
    params: (query) => ({
      q: query,
      format: 'json',
      language: 'en-US',
    }),
    parseResponse: (data) => {
      if (!data.results) return [];
      return data.results.map(result => ({
        title: result.title,
        link: result.url,
        displayLink: new URL(result.url).hostname,
        snippet: result.content,
        source: 'SearXNG',
      }));
    },
  },
  {
    name: 'Mojeek',
    baseUrl: 'https://www.mojeek.com/search',
    params: (query) => ({
      q: query,
      fmt: 'json',
    }),
    parseResponse: (data) => {
      if (!data.results) return [];
      return data.results.map(result => ({
        title: result.title,
        link: result.url,
        displayLink: new URL(result.url).hostname,
        snippet: result.desc,
        source: 'Mojeek',
      }));
    },
  },
];

// Fetch results from all configured search engines
export async function fetchFromEngines(query) {
  try {
    const requests = searchEngines.map(engine => {
      return axios.get(engine.baseUrl, {
        params: engine.params(query),
        headers: {
          'User-Agent': 'PrivSearch/1.0',
        },
      })
      .then(response => engine.parseResponse(response.data))
      .catch(error => {
        console.error(`Error fetching from ${engine.name}:`, error);
        return []; // Return empty array if this engine fails
      });
    });

    const results = await Promise.all(requests);
    
    // Flatten and merge results from all engines
    return results.flat();
  } catch (error) {
    console.error('Error fetching from search engines:', error);
    throw error;
  }
}
