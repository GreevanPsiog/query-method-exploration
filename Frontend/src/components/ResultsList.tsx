import { useState } from 'react';
import type { SearchResponse } from '../types';

interface ResultsListProps {
  response: SearchResponse;
}

export function ResultsList({ response }: ResultsListProps) {
  const [showRaw, setShowRaw] = useState(false);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>
          Found {response.total} {response.total === 1 ? 'result' : 'results'}
        </h2>
        {response.message && (
          <span style={styles.message}>{response.message}</span>
        )}
      </div>

      {response.results.length > 0 ? (
        <div style={styles.grid}>
          {response.results.map((product: any) => (
            <div key={product.id} style={styles.card}>
              <div style={styles.cardHeader}>
                <span style={styles.category}>{product.category}</span>
                {product.inStock ? (
                  <span style={styles.inStock}>✓ In Stock</span>
                ) : (
                  <span style={styles.outOfStock}>Out of Stock</span>
                )}
              </div>
              
              <h3 style={styles.productName}>{product.name}</h3>
              
              <div style={styles.rating}>
                {'★'.repeat(Math.floor(product.rating))}
                {'☆'.repeat(5 - Math.floor(product.rating))}
                <span style={styles.ratingText}>
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              <div style={styles.brand}>Brand: {product.brand}</div>
              
              <div style={styles.price}>${product.price.toFixed(2)}</div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.noResults}>
          <div style={styles.noResultsIcon}>🔍</div>
          <h3>No products found</h3>
          <p>Try adjusting your search criteria</p>
        </div>
      )}

      <details style={styles.details}>
        <summary 
          onClick={() => setShowRaw(!showRaw)}
          style={styles.summary}
        >
          {showRaw ? 'Hide' : 'Show'} Raw Response ({response.total} items)
        </summary>
        {showRaw && (
          <pre style={styles.raw}>
            {JSON.stringify(response, null, 2)}
          </pre>
        )}
      </details>
    </div>
  );
}

const styles = {
  container: { marginTop: '2rem' },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '1rem',
    flexWrap: 'wrap' as const,
    gap: '1rem'
  },
  title: { margin: 0, color: '#333' },
  message: {
    backgroundColor: '#fff3cd',
    color: '#856404',
    padding: '0.5rem 1rem',
    borderRadius: '4px',
    fontSize: '0.875rem'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginBottom: '1.5rem'
  },
  card: {
    padding: '1.5rem',
    border: '1px solid #e0e0e0',
    borderRadius: '8px',
    backgroundColor: '#fafafa',
    transition: 'transform 0.2s, box-shadow 0.2s',
    cursor: 'pointer'
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '0.75rem'
  },
  category: {
    fontSize: '0.75rem',
    textTransform: 'uppercase' as const,
    color: '#666',
    backgroundColor: '#e0e0e0',
    padding: '0.25rem 0.5rem',
    borderRadius: '4px'
  },
  inStock: {
    fontSize: '0.75rem',
    color: '#2e7d32',
    fontWeight: 600
  },
  outOfStock: {
    fontSize: '0.75rem',
    color: '#c00',
    fontWeight: 600
  },
  productName: {
    margin: '0 0 0.75rem 0',
    fontSize: '1.1rem',
    color: '#333',
    lineHeight: 1.3
  },
  rating: {
    marginBottom: '0.5rem',
    color: '#ffc107'
  },
  ratingText: {
    color: '#666',
    fontSize: '0.875rem',
    marginLeft: '0.5rem'
  },
  brand: {
    fontSize: '0.875rem',
    color: '#666',
    marginBottom: '0.75rem'
  },
  price: {
    fontSize: '1.5rem',
    fontWeight: 700,
    color: '#2e7d32'
  },
  noResults: {
    textAlign: 'center' as const,
    padding: '3rem',
    backgroundColor: '#f8f9fa',
    borderRadius: '8px'
  },
  noResultsIcon: {
    fontSize: '3rem',
    marginBottom: '1rem',
    opacity: 0.5
  },
  details: {
    marginTop: '2rem',
    padding: '1rem',
    backgroundColor: '#f9f9f9',
    borderRadius: '4px'
  },
  summary: {
    cursor: 'pointer',
    fontWeight: 500,
    userSelect: 'none' as const
  },
  raw: {
    marginTop: '1rem',
    padding: '1rem',
    backgroundColor: '#fff',
    border: '1px solid #ddd',
    borderRadius: '4px',
    overflow: 'auto',
    fontSize: '0.85rem'
  }
};