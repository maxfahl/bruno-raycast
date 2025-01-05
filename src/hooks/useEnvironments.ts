import { showToast, Toast } from '@raycast/api';
import { useCallback, useEffect, useState } from 'react';
import { runBrunoCommand } from '../utils/brunoRunner';

interface Environment {
  name: string;
  variables: Record<string, string>;
}

export function useEnvironments() {
  const [environments, setEnvironments] = useState<Environment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadEnvironments = useCallback(async () => {
    try {
      const output = await runBrunoCommand('env', ['list', '--json']);
      setEnvironments(JSON.parse(output));
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to load environments'));
      await showToast({
        style: Toast.Style.Failure,
        title: 'Failed to load environments',
        message: error instanceof Error ? error.message : 'Unknown error'
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEnvironments();
  }, [loadEnvironments]);

  return {
    environments,
    isLoading,
    error,
    refresh: loadEnvironments
  };
} 