import { useState } from 'react';
import type { SearchRequest, SearchResponse } from './types';
import { SearchForm } from './components/SearchForm';
import { ResultsList } from './components/ResultsList';
import { ComparisonDemo } from './components/ComparisonDemo';
import { StressTest } from './components/StressTest';

function App() {
  const [activeTab, setActiveTab] = useState<'demo' | 'comparison' | 'stress'>('demo');
  const [result, setResult] = useState<SearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentRequest, setCurrentRequest] = useState<SearchRequest | null>(null);

  const handleSearch = async (request: SearchRequest) => {
    setLoading(true);
    setError(null);
    setCurrentRequest(request);

    try {
      const response = await fetch('/api/search', {
        method: 'QUERY',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request)
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data: SearchResponse = await response.json();
      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed. Ensure backend is running on port 5245.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      {/* Header Section */}
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <div style={styles.logo}>🔍</div>
          <div>
            <h1 style={styles.title}>HTTP QUERY Method Demo</h1>
            <p style={styles.subtitle}>
              Exploring the future of safe, idempotent API requests with JSON bodies
            </p>
          </div>
        </div>
        
        {/* Navigation Tabs */}
        <nav style={styles.nav}>
          <button
            onClick={() => setActiveTab('demo')}
            style={activeTab === 'demo' ? styles.navButtonActive : styles.navButton}
          >
            📋 Live Demo
          </button>
          <button
            onClick={() => setActiveTab('comparison')}
            style={activeTab === 'comparison' ? styles.navButtonActive : styles.navButton}
          >
            📊 Method Comparison
          </button>
          <button
            onClick={() => setActiveTab('stress')}
            style={activeTab === 'stress' ? styles.navButtonActive : styles.navButton}
          >
            ⚡ Stress Testing
          </button>
        </nav>
      </header>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Demo Tab */}
        {activeTab === 'demo' && (
          <div style={styles.tabContent}>
            <section style={styles.section}>
              <div style={styles.sectionHeader}>
                <h2>Try the QUERY Method</h2>
                <p>Experience how QUERY handles complex search parameters in the request body</p>
              </div>
              
              <SearchForm onSubmit={handleSearch} loading={loading} />
              
              {error && (
                <div style={styles.errorBanner}>
                  <span style={styles.errorIcon}>️</span>
                  <div>
                    <strong>Error</strong>
                    <p style={{margin: '0.25rem 0 0 0'}}>{error}</p>
                  </div>
                </div>
              )}

              {result && <ResultsList response={result} />}
            </section>

            {/* Info Cards */}
            <section style={styles.infoGrid}>
              <div style={styles.infoCard}>
                <h3 style={styles.infoCardTitle}>What is HTTP QUERY?</h3>
                <p>
                  QUERY is an emerging HTTP method (IETF Draft) designed for safe, 
                  idempotent requests that require a body. Unlike POST, it's cacheable 
                  and doesn't imply state changes.
                </p>
              </div>
              
              <div style={styles.infoCard}>
                <h3 style={styles.infoCardTitle}>Why Use QUERY?</h3>
                <ul style={styles.infoList}>
                  <li>Send complex JSON without URL length limits</li>
                  <li>Maintain cacheability like GET</li>
                  <li>Keep sensitive data out of URLs</li>
                  <li>Better for GraphQL-like operations</li>
                </ul>
              </div>
            </section>
          </div>
        )}

        {/* Comparison Tab */}
        {activeTab === 'comparison' && currentRequest && (
          <div style={styles.tabContent}>
            <section style={styles.section}>
              <div style={styles.sectionHeader}>
                <h2>Side-by-Side Comparison</h2>
                <p>See how GET and QUERY handle the same search parameters differently</p>
              </div>
              <ComparisonDemo request={currentRequest} />
            </section>
          </div>
        )}

        {activeTab === 'comparison' && !currentRequest && (
          <div style={styles.emptyState}>
            <div style={styles.emptyStateIcon}>📊</div>
            <h3>Run a Search First</h3>
            <p>Go to the Live Demo tab and send a QUERY request to enable comparison features.</p>
            <button 
              onClick={() => setActiveTab('demo')}
              style={styles.primaryButton}
            >
              Go to Live Demo
            </button>
          </div>
        )}

        {/* Stress Test Tab */}
        {activeTab === 'stress' && currentRequest && (
          <div style={styles.tabContent}>
            <section style={styles.section}>
              <div style={styles.sectionHeader}>
                <h2>Performance & Limits Testing</h2>
                <p>Push both methods to their breaking points and see where they fail</p>
              </div>
              <StressTest baseRequest={currentRequest} />
            </section>
          </div>
        )}

        {activeTab === 'stress' && !currentRequest && (
          <div style={styles.emptyState}>
            <div style={styles.emptyStateIcon}>⚡</div>
            <h3>Run a Search First</h3>
            <p>Go to the Live Demo tab and send a QUERY request to enable stress testing.</p>
            <button 
              onClick={() => setActiveTab('demo')}
              style={styles.primaryButton}
            >
              Go to Live Demo
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer style={styles.footer}>
        <p>
          HTTP QUERY Method Demo | Built with .NET 10 + React + TypeScript | 
          <a href="https://datatracker.ietf.org/doc/draft-ietf-httpbis-safe-method-w-body/" target="_blank" rel="noopener noreferrer" style={styles.link}>
            Learn More
          </a>
        </p>
      </footer>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  },
  header: {
    backgroundColor: 'white',
    borderBottom: '1px solid #e2e8f0',
    padding: '2rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    gap: '1.5rem',
    marginBottom: '1.5rem'
  },
  logo: {
    fontSize: '3rem',
    lineHeight: 1
  },
  title: {
    margin: 0,
    fontSize: '2rem',
    fontWeight: 700,
    color: '#1e293b',
    letterSpacing: '-0.025em'
  },
  subtitle: {
    margin: '0.5rem 0 0 0',
    color: '#64748b',
    fontSize: '1.125rem'
  },
  nav: {
    display: 'flex',
    gap: '0.5rem',
    borderBottom: '1px solid #e2e8f0',
    paddingBottom: '0'
  },
  navButton: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'transparent',
    border: 'none',
    color: '#64748b',
    fontSize: '1rem',
    fontWeight: 500,
    cursor: 'pointer',
    borderRadius: '6px 6px 0 0',
    transition: 'all 0.2s',
    borderBottom: '2px solid transparent',
    marginBottom: '-1px'
  },
  navButtonActive: {
    padding: '0.75rem 1.5rem',
    backgroundColor: 'white',
    border: 'none',
    color: '#2563eb',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    borderRadius: '6px 6px 0 0',
    borderBottom: '2px solid #2563eb',
    marginBottom: '-1px'
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem',
    minHeight: 'calc(100vh - 300px)'
  },
  tabContent: {
    animation: 'fadeIn 0.3s ease-in'
  },
  section: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '2rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    marginBottom: '2rem'
  },
  sectionHeader: {
    marginBottom: '2rem'
  },
  errorBanner: {
    backgroundColor: '#fef3c7',
    border: '1px solid #f59e0b',
    borderRadius: '8px',
    padding: '1rem 1.5rem',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '1rem',
    marginTop: '1.5rem',
    color: '#92400e'
  },
  errorIcon: {
    fontSize: '1.5rem',
    flexShrink: 0
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1.5rem'
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: '12px',
    padding: '1.5rem',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    border: '1px solid #e2e8f0'
  },
  infoCardTitle: {
    margin: '0 0 1rem 0',
    fontSize: '1.25rem',
    color: '#1e293b'
  },
  infoList: {
    margin: 0,
    paddingLeft: '1.25rem',
    color: '#475569'
  },
  emptyState: {
    textAlign: 'center' as const,
    padding: '4rem 2rem',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
  },
  emptyStateIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
    opacity: 0.5
  },
  primaryButton: {
    padding: '0.75rem 2rem',
    backgroundColor: '#2563eb',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    marginTop: '1.5rem'
  },
  footer: {
    backgroundColor: 'white',
    borderTop: '1px solid #e2e8f0',
    padding: '2rem',
    textAlign: 'center' as const,
    color: '#64748b',
    fontSize: '0.875rem'
  },
  link: {
    color: '#2563eb',
    textDecoration: 'none',
    marginLeft: '0.25rem'
  }
};

export default App;