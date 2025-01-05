import { showToast, Toast } from '@raycast/api';
import { useCallback, useEffect, useState } from 'react';
import { listCollections, listRequests } from '../utils/brunoRunner';
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
      const [collections, requests] = await Promise.all([
        listCollections(),
        listRequests()
      ]);

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

  const getRequestsByCollection = useCallback((collectionName: string) => {
    return state.requests.filter(request => request.collection === collectionName);
  }, [state.requests]);

  const getCollectionByName = useCallback((name: string) => {
    return state.collections.find(collection => collection.name === name);
  }, [state.collections]);

  return {
    ...state,
    refresh: loadCollections,
    getRequestsByCollection,
    getCollectionByName,
  };
}
