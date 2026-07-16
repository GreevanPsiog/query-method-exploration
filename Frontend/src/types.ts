export interface SearchRequest {
  keyword?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface Product {
  id: number;
  name: string;
  price: number;
}

export interface SearchResponse {
  query: SearchRequest;
  results: Product[];
  total: number;
}