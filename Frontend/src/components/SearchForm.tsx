import { useState } from 'react';
import type { SearchRequest } from '../types';

interface SearchFormProps {
  onSubmit: (request: SearchRequest) => void;
  loading: boolean;
}

export function SearchForm({ onSubmit, loading }: SearchFormProps) {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const request: SearchRequest = {
      keyword: keyword || undefined,
      category: category || undefined,
      minPrice: minPrice ? Number(minPrice) : undefined,
      maxPrice: maxPrice ? Number(maxPrice) : undefined
    };

    onSubmit(request);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.grid}>
        <div style={styles.field}>
          <label style={styles.label}>Keyword</label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g., wireless"
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Category</label>
          <input
            type="text"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            placeholder="e.g., electronics"
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Min Price</label>
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            placeholder="0"
            style={styles.input}
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Max Price</label>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            placeholder="1000"
            style={styles.input}
          />
        </div>
      </div>

      <button type="submit" disabled={loading} style={styles.button}>
        {loading ? 'Sending QUERY...' : 'Send QUERY Request'}
      </button>
    </form>
  );
}

const styles = {
  form: { marginBottom: '2rem' },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem'
  },
  field: { display: 'flex', flexDirection: 'column' as const },
  label: { marginBottom: '0.5rem', fontWeight: 500, fontSize: '0.9rem' },
  input: {
    padding: '0.5rem',
    border: '1px solid #ddd',
    borderRadius: '4px',
    fontSize: '1rem'
  },
  button: {
    padding: '0.75rem 1.5rem',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '1rem',
    cursor: 'pointer',
    fontWeight: 500,
    opacity: 1,
    transition: 'opacity 0.2s'
  }
};