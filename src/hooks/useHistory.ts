import { LocalStorage, showToast, Toast } from '@raycast/api';
import { useCallback, useEffect, useState } from 'react';
import { BrunoRequest, BrunoResponse } from '../utils/types';

interface HistoryEntry {
  timestamp: number;
  request: BrunoRequest;
  response: BrunoResponse;
  environment?: string;
}

interface UseHistoryResult {
  history: HistoryEntry[];
  isLoading: boolean;
  addToHistory: (entry: Omit<HistoryEntry, 'timestamp'>) => Promise<void>;
  clearHistory: () => Promise<void>;
  rerunHistoryEntry: (entry: HistoryEntry) => Promise<void>;
}

const STORAGE_KEY = 'requestHistory';
const MAX_HISTORY_ITEMS = 100;

export function useHistory(): UseHistoryResult {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadHistory = useCallback(async () => {
    try {
      const storedHistory = await LocalStorage.getItem<string>(STORAGE_KEY);
      if (storedHistory) {
        setHistory(JSON.parse(storedHistory));
      }
    } catch (error) {
      console.error('Error loading history:', error);
      await showToast({
        style: Toast.Style.Failure,
        title: 'Failed to load history',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveHistory = useCallback(async (newHistory: HistoryEntry[]) => {
    try {
      await LocalStorage.setItem(STORAGE_KEY, JSON.stringify(newHistory));
    } catch (error) {
      console.error('Error saving history:', error);
      await showToast({
        style: Toast.Style.Failure,
        title: 'Failed to save history',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }, []);

  const addToHistory = useCallback(async (entry: Omit<HistoryEntry, 'timestamp'>) => {
    const newEntry: HistoryEntry = {
      ...entry,
      timestamp: Date.now(),
    };

    const newHistory = [newEntry, ...history].slice(0, MAX_HISTORY_ITEMS);
    setHistory(newHistory);
    await saveHistory(newHistory);
  }, [history, saveHistory]);

  const clearHistory = useCallback(async () => {
    try {
      await LocalStorage.removeItem(STORAGE_KEY);
      setHistory([]);
      await showToast({
        style: Toast.Style.Success,
        title: 'History cleared',
      });
    } catch (error) {
      console.error('Error clearing history:', error);
      await showToast({
        style: Toast.Style.Failure,
        title: 'Failed to clear history',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }, []);

  const rerunHistoryEntry = useCallback(async (entry: HistoryEntry) => {
    // This will be implemented by the component using this hook
    // We'll pass the entry back to be rerun using the brunoRunner
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  return {
    history,
    isLoading,
    addToHistory,
    clearHistory,
    rerunHistoryEntry,
  };
} 