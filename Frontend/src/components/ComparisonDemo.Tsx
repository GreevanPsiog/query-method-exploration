import { useState } from 'react';
import type { SearchRequest, SearchResponse } from '../types';

interface ComparisonDemoProps {
  request: SearchRequest;
}

export function ComparisonDemo({ request }: ComparisonDemoProps) {
  const [getResult, setGetResult] = useState<any>(null);
  const [queryResult, setQueryResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const buildGetUrl = () => {
    const params = new URLSearchParams();
    if (request.keyword) params.append('keyword', request.keyword);
    if (request.category) params.append('category', request.category);
    if (request.minPrice !== undefined) params.append('minPrice', request.minPrice.toString());
    if (request.maxPrice !== undefined) params.append('maxPrice', request.maxPrice.toString());
    return `/api/search?${params.toString()}`;
  };

  const runComparison = async () => {
    setLoading(true);
    
    try {
      // GET request
      const getUrl = buildGetUrl();
      const getRes = await fetch(getUrl, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      });
      const getData = await getRes.json();
      setGetResult({ ...getData, url: getUrl, urlLength: getUrl.length });

      // QUERY request
      const queryRes = await fetch('/api/search', {
        method: 'QUERY',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });
      const queryData = await queryRes.json();
      setQueryResult({ ...queryData, bodyLength: JSON.stringify(request).length });
      
    } catch (err) {
      console.error('Comparison failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📊 Method Comparison</h2>
      
      <button onClick={runComparison} disabled={loading} style={styles.button}>
        {loading ? 'Running Comparison...' : 'Run Side-by-Side Comparison'}
      </button>

      {getResult && queryResult && (
        <div style={styles.comparison}>
          {/* GET Method */}
          <div style={styles.panel}>
            <h3 style={styles.panelTitle}>GET with Query Params</h3>
            <div style={styles.codeBlock}>
              <code>{getResult.url}</code>
            </div>
            <ul style={styles.list}>
              <li><strong>URL Length:</strong> {getResult.urlLength} chars</li>
              <li><strong>Data in:</strong> URL (visible)</li>
              <li><strong>Caching:</strong> Browser/CDN cacheable</li>
              <li><strong>Limit:</strong> ~2000 chars (browser dependent)</li>
              <li><strong>Body:</strong> Not allowed</li>
            </ul>
          </div>

          {/* QUERY Method */}
          <div style={styles.panel}>
            <h3 style={styles.panelTitle}>QUERY with Body</h3>
            <div style={styles.codeBlock}>
              <code>/api/search</code>
            </div>
            <ul style={styles.list}>
              <li><strong>URL Length:</strong> 13 chars</li>
              <li><strong>Data in:</strong> Request body (JSON)</li>
              <li><strong>Caching:</strong> Cacheable (when implemented)</li>
              <li><strong>Limit:</strong> Server config (typically MBs)</li>
              <li><strong>Body:</strong> Allowed (safe method)</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  container: {
    marginTop: '2rem',
    padding: '1.5rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    border: '1px solid #dee2e6'
  },
  title: {
    marginBottom: '1rem',
    color: '#495057'
  },
  button: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: 500,
    marginBottom: '1.5rem'
  },
  comparison: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  },
  panel: {
    backgroundColor: 'white',
    padding: '1rem',
    borderRadius: '6px',
    border: '1px solid #dee2e6'
  },
  panelTitle: {
    margin: '0 0 1rem 0',
    fontSize: '1.1rem',
    color: '#495057'
  },
  codeBlock: {
    backgroundColor: '#e9ecef',
    padding: '0.75rem',
    borderRadius: '4px',
    marginBottom: '1rem',
    wordBreak: 'break-all' as const,
    fontSize: '0.85rem'
  },
  list: {
    margin: 0,
    paddingLeft: '1.2rem',
    fontSize: '0.9rem'
  }
};