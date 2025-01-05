import { showToast, Toast } from '@raycast/api';
import { useCallback, useEffect, useState } from 'react';
import { findBrunoFiles, parseCollectionFile, parseRequestFile } from '../utils/fileUtils';
import { BrunoCollection, BrunoRequest } from '../utils/types';

interface CollectionsState {
  collections: BrunoCollection[];
  requests: BrunoRequest[];
  isLoading: boolean;
  error: Error | null;
}

export function useCollections() {
  const [state, setState] = useState<CollectionsState>({
    collections: [],
    requests: [],
    isLoading: true,
    error: null,
  });

  const loadCollections = useCallback(async () => {
    setState(prev => ({ ...prev, isLoading: true, error: null }));
    try {
      const files = await findBrunoFiles();
      const collections: BrunoCollection[] = [];
      const requests: BrunoRequest[] = [];

      for (const file of files) {
        try {
          if (file.endsWith('.bru')) {
            const content = await parseRequestFile(file);
            if (content.method) {
              requests.push(content);
            } else {
              collections.push(await parseCollectionFile(file));
            }
          }
        } catch (error) {
          console.error(`Error processing file ${file}:`, error);
        }
      }

      setState({
        collections,
        requests,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load collections';
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: new Error(message),
      }));
      await showToast({
        style: Toast.Style.Failure,
        title: 'Failed to load collections',
        message,
      });
    }
  }, []);

  useEffect(() => {
    loadCollections();
  }, [loadCollections]);

  const getRequestsByCollection = useCallback((collectionPath: string) => {
    return state.requests.filter(request => request.collection === collectionPath);
  }, [state.requests]);

  const getCollectionByPath = useCallback((path: string) => {
    return state.collections.find(collection => collection.path === path);
  }, [state.collections]);

  return {
    ...state,
    refresh: loadCollections,
    getRequestsByCollection,
    getCollectionByPath,
  };
}
