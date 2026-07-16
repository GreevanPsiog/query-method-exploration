import { useState } from 'react';
import type { SearchRequest } from '../types';

interface StressTestProps {
  baseRequest: SearchRequest;
}

interface TestResult {
  method: string;
  success: boolean;
  duration: number;
  urlLength?: number;
  bodyLength?: number;
  error?: string;
  responseSize?: number;
  statusCode?: number;
}

export function StressTest({ baseRequest }: StressTestProps) {
  const [results, setResults] = useState<TestResult[]>([]);
  const [running, setRunning] = useState(false);

  // Generate extremely long strings
  const generateMassiveString = (length: number) => {
    return 'keyword '.repeat(length).trim();
  };

  // Generate massive complex filters
  const generateMassiveFilters = (multiplier: number) => {
    const categories = Array.from({ length: 500 * multiplier }, (_, i) => `category-${i}`);
    const brands = Array.from({ length: 300 * multiplier }, (_, i) => `brand-${i}`);
    const tags = Array.from({ length: 200 * multiplier }, (_, i) => `tag-${i}`);
    
    return {
      ...baseRequest,
      keyword: generateMassiveString(1000 * multiplier),
      categories,
      brands,
      tags,
      filters: {
        price: { min: 0, max: 10000 },
        rating: { min: 1, max: 5 },
        availability: {
          inStock: true,
          warehouses: Array.from({ length: 100 }, (_, i) => `warehouse-${i}`),
          regions: ['US', 'EU', 'ASIA', 'LATAM', 'AFRICA', 'OCEANIA']
        }
      },
      sorting: {
        primary: { field: 'price', order: 'desc' },
        secondary: { field: 'rating', order: 'desc' },
        tertiary: { field: 'sales', order: 'desc' }
      },
      pagination: { page: 1, pageSize: 100 },
      facets: ['brand', 'category', 'price', 'color', 'size', 'material'],
      metadata: {
        userId: 'user-' + 'x'.repeat(1000),
        sessionId: 'session-' + 'y'.repeat(1000),
        trackingId: 'track-' + 'z'.repeat(1000),
        timestamp: new Date().toISOString(),
        location: { lat: 40.7128, lng: -74.0060, accuracy: 10 }
      }
    };
  };

  const runExtremeStressTest = async () => {
    setRunning(true);
    const testResults: TestResult[] = [];

    // Test 1: GET with 5,000 char URL
    const getUrl5kStart = performance.now();
    try {
      const params5k = new URLSearchParams({
        keyword: generateMassiveString(600),
        test: '5000_chars'
      });
      const getUrl5k = `/api/search?${params5k.toString()}`;
      const res = await fetch(getUrl5k, { method: 'GET' });
      const duration = performance.now() - getUrl5kStart;
      const text = await res.text();
      
      testResults.push({
        method: 'GET (5K URL)',
        success: res.ok,
        statusCode: res.status,
        duration: Math.round(duration),
        urlLength: getUrl5k.length,
        responseSize: text.length
      });
    } catch (err: any) {
      testResults.push({
        method: 'GET (5K URL)',
        success: false,
        duration: Math.round(performance.now() - getUrl5kStart),
        error: err.message || 'Request failed'
      });
    }

    // Test 2: QUERY with 5KB body
    const query5kStart = performance.now();
    try {
      const body5k = JSON.stringify(generateMassiveFilters(1));
      const res = await fetch('/api/search', {
        method: 'QUERY',
        headers: { 'Content-Type': 'application/json' },
        body: body5k
      });
      const duration = performance.now() - query5kStart;
      const text = await res.text();
      
      testResults.push({
        method: 'QUERY (5KB Body)',
        success: res.ok,
        statusCode: res.status,
        duration: Math.round(duration),
        bodyLength: body5k.length,
        responseSize: text.length
      });
    } catch (err: any) {
      testResults.push({
        method: 'QUERY (5KB Body)',
        success: false,
        duration: Math.round(performance.now() - query5kStart),
        error: err.message
      });
    }

    // Test 3: GET with 10,000+ char URL (should fail)
    const getUrl10kStart = performance.now();
    try {
      const params10k = new URLSearchParams({
        keyword: generateMassiveString(1200),
        test: '10000_chars'
      });
      const getUrl10k = `/api/search?${params10k.toString()}`;
      const res = await fetch(getUrl10k, { method: 'GET' });
      const duration = performance.now() - getUrl10kStart;
      const text = await res.text();
      
      testResults.push({
        method: 'GET (10K+ URL)',
        success: res.ok,
        statusCode: res.status,
        duration: Math.round(duration),
        urlLength: getUrl10k.length,
        responseSize: text.length,
        error: res.status >= 400 ? `HTTP ${res.status}` : undefined
      });
    } catch (err: any) {
      testResults.push({
        method: 'GET (10K+ URL)',
        success: false,
        duration: Math.round(performance.now() - getUrl10kStart),
        error: err.message || 'Network error (URL too long)'
      });
    }

    // Test 4: QUERY with 50KB body (should work)
    const query50kStart = performance.now();
    try {
      const body50k = JSON.stringify(generateMassiveFilters(10));
      const res = await fetch('/api/search', {
        method: 'QUERY',
        headers: { 'Content-Type': 'application/json' },
        body: body50k
      });
      const duration = performance.now() - query50kStart;
      const text = await res.text();
      
      testResults.push({
        method: 'QUERY (50KB Body)',
        success: res.ok,
        statusCode: res.status,
        duration: Math.round(duration),
        bodyLength: body50k.length,
        responseSize: text.length
      });
    } catch (err: any) {
      testResults.push({
        method: 'QUERY (50KB Body)',
        success: false,
        duration: Math.round(performance.now() - query50kStart),
        error: err.message
      });
    }

    // Test 5: GET with 20,000+ char URL (will definitely fail)
    const getUrl20kStart = performance.now();
    try {
      const params20k = new URLSearchParams({
        keyword: generateMassiveString(2500),
        test: '20000_chars'
      });
      const getUrl20k = `/api/search?${params20k.toString()}`;
      const res = await fetch(getUrl20k, { method: 'GET' });
      const duration = performance.now() - getUrl20kStart;
      const text = await res.text();
      
      testResults.push({
        method: 'GET (20K+ URL)',
        success: res.ok,
        statusCode: res.status,
        duration: Math.round(duration),
        urlLength: getUrl20k.length,
        responseSize: text.length,
        error: res.status >= 400 ? `❌ HTTP ${res.status} - ${res.statusText}` : undefined
      });
    } catch (err: any) {
      testResults.push({
        method: 'GET (20K+ URL)',
        success: false,
        duration: Math.round(performance.now() - getUrl20kStart),
        error: ' Network Error: URL too long for browser/server'
      });
    }

    // Test 6: QUERY with 100KB body (should still work)
    const query100kStart = performance.now();
    try {
      const body100k = JSON.stringify(generateMassiveFilters(20));
      const res = await fetch('/api/search', {
        method: 'QUERY',
        headers: { 'Content-Type': 'application/json' },
        body: body100k
      });
      const duration = performance.now() - query100kStart;
      const text = await res.text();
      
      testResults.push({
        method: 'QUERY (100KB Body)',
        success: res.ok,
        statusCode: res.status,
        duration: Math.round(duration),
        bodyLength: body100k.length,
        responseSize: text.length
      });
    } catch (err: any) {
      testResults.push({
        method: 'QUERY (100KB Body)',
        success: false,
        duration: Math.round(performance.now() - query100kStart),
        error: err.message
      });
    }

    // Test 7: GET with 50,000 char URL (catastrophic failure)
    const getUrl50kStart = performance.now();
    try {
      const params50k = new URLSearchParams({
        keyword: generateMassiveString(6000),
        test: '50000_chars'
      });
      const getUrl50k = `/api/search?${params50k.toString()}`;
      const res = await fetch(getUrl50k, { method: 'GET' });
      const duration = performance.now() - getUrl50kStart;
      const text = await res.text();
      
      testResults.push({
        method: 'GET (50K+ URL)',
        success: res.ok,
        statusCode: res.status,
        duration: Math.round(duration),
        urlLength: getUrl50k.length,
        responseSize: text.length,
        error: res.status >= 400 ? `❌ HTTP ${res.status}` : undefined
      });
    } catch (err: any) {
      testResults.push({
        method: 'GET (50K+ URL)',
        success: false,
        duration: Math.round(performance.now() - getUrl50kStart),
        error: '💥 Catastrophic Failure: URL exceeds all limits'
      });
    }

    // Test 8: QUERY with 500KB body (stress test)
    const query500kStart = performance.now();
    try {
      const body500k = JSON.stringify(generateMassiveFilters(100));
      const res = await fetch('/api/search', {
        method: 'QUERY',
        headers: { 'Content-Type': 'application/json' },
        body: body500k
      });
      const duration = performance.now() - query500kStart;
      const text = await res.text();
      
      testResults.push({
        method: 'QUERY (500KB Body)',
        success: res.ok,
        statusCode: res.status,
        duration: Math.round(duration),
        bodyLength: body500k.length,
        responseSize: text.length
      });
    } catch (err: any) {
      testResults.push({
        method: 'QUERY (500KB Body)',
        success: false,
        duration: Math.round(performance.now() - query500kStart),
        error: err.message
      });
    }

    setResults(testResults);
    setRunning(false);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}> Extreme Stress Test</h2>
      <p style={styles.description}>
        Pushing GET and QUERY to their absolute limits - expect GET to fail catastrophically
      </p>
      
      <button onClick={runExtremeStressTest} disabled={running} style={styles.button}>
        {running ? 'Running Extreme Tests...' : 'Run Extreme Stress Test'}
      </button>

      {results.length > 0 && (
        <div style={styles.results}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Method</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Duration</th>
                <th style={styles.th}>Size</th>
                <th style={styles.th}>Notes</th>
              </tr>
            </thead>
            <tbody>
              {results.map((result, idx) => (
                <tr key={idx} style={{
                  backgroundColor: result.success ? '#f0fff0' : '#fff0f0'
                }}>
                  <td style={styles.td}><strong>{result.method}</strong></td>
                  <td style={styles.td}>
                    {result.success ? '✅ Success' : `❌ Failed (${result.statusCode || 'N/A'})`}
                  </td>
                  <td style={styles.td}>{result.duration}ms</td>
                  <td style={styles.td}>
                    {result.urlLength && <span style={{color: result.urlLength > 8000 ? '#ff0000' : 'inherit'}}>
                      {result.urlLength.toLocaleString()} chars (URL)
                    </span>}
                    {result.bodyLength && `${result.bodyLength.toLocaleString()} bytes (Body)`}
                    {result.responseSize && <div style={{fontSize: '0.85em', color: '#666'}}>
                      Response: {result.responseSize} bytes
                    </div>}
                  </td>
                  <td style={styles.td}>
                    {result.error && <span style={{
                      color: result.success ? '#ff8c00' : '#c00',
                      fontWeight: 'bold'
                    }}>
                      {result.error}
                    </span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div style={styles.summary}>
            <h3> Breaking Point Analysis:</h3>
            <ul>
              <li><strong>GET ~5K chars:</strong> Works, but approaching limits</li>
              <li><strong>GET ~10K chars:</strong> May fail in some browsers/servers</li>
              <li><strong>GET ~20K+ chars:</strong> 💥 Almost certainly fails (IIS: 16KB, Apache: 8KB default)</li>
              <li><strong>GET ~50K+ chars:</strong> 💥💥💥 Catastrophic failure guaranteed</li>
              <li><strong>QUERY 5KB-500KB:</strong> ✅ Works fine (server body size limits apply, typically 1-100MB)</li>
              <li><strong>QUERY 1MB+:</strong> Usually works (configure server max body size if needed)</li>
            </ul>
            <div style={styles.warning}>
              <strong>️ Real-World Limits:</strong><br/>
              • IE/Edge: ~2,083 characters<br/>
              • Chrome/Safari: ~8,000+ characters (but servers often reject earlier)<br/>
              • IIS: 16,384 characters (16KB) default<br/>
              • Apache: 8,190 characters (8KB) default<br/>
              • Nginx: 4-8KB default<br/>
              • QUERY: Limited by server's max body size (usually 1-100MB)
            </div>
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
    backgroundColor: '#ff6b6b',
    borderRadius: '8px',
    border: '3px solid #c92a2a'
  },
  title: {
    margin: '0 0 0.5rem 0',
    color: '#750e0e'
  },
  description: {
    margin: '0 0 1rem 0',
    color: '#750e0e',
    fontWeight: 500
  },
  button: {
    padding: '1rem 2rem',
    backgroundColor: '#c92a2a',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1.1rem',
    cursor: 'pointer',
    fontWeight: 600,
    marginBottom: '1.5rem'
  },
  results: {
    marginTop: '1rem'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    marginBottom: '1.5rem',
    fontSize: '0.85rem'
  },
  th: {
    textAlign: 'left' as const,
    padding: '0.75rem',
    backgroundColor: '#212529',
    color: 'white',
    borderBottom: '3px solid #dee2e6'
  },
  td: {
    padding: '0.75rem',
    borderBottom: '1px solid #dee2e6',
    verticalAlign: 'top' as const
  },
  summary: {
    backgroundColor: 'white',
    padding: '1.5rem',
    borderRadius: '6px',
    border: '2px solid #ffc9c9'
  },
  warning: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#fff3bf',
    border: '2px solid #fcc419',
    borderRadius: '4px',
    fontSize: '0.9rem'
  }
};