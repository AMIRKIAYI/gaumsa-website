const API_BASE = 'https://ummahapi.com/api/hadith';

export interface Collection {
  key: string;
  name: string;
  arabic_name: string;
  author: string;
  reliability: string;
  total_hadiths: number;
}

export interface Hadith {
  id: string;
  collection: string;
  collection_name: string;
  hadithnumber: number;
  arabic: string;
  english: string;
  grade: string;
}

interface CollectionsResponse {
  success: boolean;
  data: {
    collections: Collection[];
    total_hadiths: number;
  };
}

interface SearchResponse {
  success: boolean;
  data: {
    query: string;
    collection: string | null;
    total_found: number;
    hadiths: Hadith[];
  };
}

interface SingleHadithResponse {
  success: boolean;
  data: Hadith;
}

// ✅ Get all collections with metadata
export const fetchCollections = async (): Promise<Collection[]> => {
  const res = await fetch(`${API_BASE}/collections`);
  if (!res.ok) throw new Error('Failed to load collections');
  const data: CollectionsResponse = await res.json();
  return data.data?.collections || [];
};

// ✅ Get a single hadith by collection + number
export const fetchHadith = async (collection: string, number: number | string): Promise<Hadith> => {
  const res = await fetch(`${API_BASE}/${collection}/${number}`);
  if (!res.ok) throw new Error(`Hadith #${number} not found`);
  const data: SingleHadithResponse = await res.json();
  if (!data.success) throw new Error('Hadith not found');
  return data.data;
};

// ✅ Get a random hadith (optionally from a specific collection)
export const fetchRandomHadith = async (collection?: string): Promise<Hadith> => {
  const url = collection
    ? `${API_BASE}/random?collection=${collection}`
    : `${API_BASE}/random`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to load random hadith');
  const data = await res.json();
  return data.data;
};

// ✅ Search hadiths
export const searchHadiths = async (
  q: string,
  options?: { collection?: string; limit?: number }
): Promise<Hadith[]> => {
  const params = new URLSearchParams({ q });
  if (options?.collection) params.append('collection', options.collection);
  if (options?.limit) params.append('limit', String(options.limit));

  const res = await fetch(`${API_BASE}/search?${params.toString()}`);
  if (!res.ok) throw new Error('Search failed');
  const data: SearchResponse = await res.json();
  return data.data?.hadiths || [];
};