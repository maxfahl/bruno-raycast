import { LocalStorage, showToast, Toast } from '@raycast/api';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { useCallback, useEffect, useState } from 'react';
import { getBrunoDirectory } from '../utils/fileUtils';
import { BrunoEnvironment } from '../utils/types';

const STORAGE_KEY = 'defaultEnvironment';

interface UseEnvironmentsResult {
  environments: BrunoEnvironment[];
  isLoading: boolean;
  error: Error | null;
  setDefaultEnvironment: (name: string) => Promise<void>;
  getDefaultEnvironment: () => Promise<string | undefined>;
}

export function useEnvironments(): UseEnvironmentsResult {
  const [environments, setEnvironments] = useState<BrunoEnvironment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadEnvironments = useCallback(async () => {
    try {
      const brunoDir = await getBrunoDirectory();
      const envPath = join(brunoDir, 'environments');
      
      // Read environments.json
      const envContent = await readFile(join(envPath, 'environments.json'), 'utf-8');
      const envData = JSON.parse(envContent);
      
      const loadedEnvs: BrunoEnvironment[] = [];
      
      // Load each environment file
      for (const env of envData.environments) {
        try {
          const envFilePath = join(envPath, `${env.name}.json`);
          const envFileContent = await readFile(envFilePath, 'utf-8');
          const variables = JSON.parse(envFileContent);
          
          loadedEnvs.push({
            name: env.name,
            variables,
          });
        } catch (error) {
          console.error(`Error loading environment ${env.name}:`, error);
        }
      }
      
      setEnvironments(loadedEnvs);
      setError(null);
    } catch (error) {
      setError(error instanceof Error ? error : new Error('Failed to load environments'));
      await showToast({
        style: Toast.Style.Failure,
        title: 'Failed to load environments',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    } finally {
      setIsLoading(false);
    }
  }, []);

  const setDefaultEnvironment = useCallback(async (name: string) => {
    try {
      await LocalStorage.setItem(STORAGE_KEY, name);
      await showToast({
        style: Toast.Style.Success,
        title: 'Default environment set',
        message: `Set ${name} as default environment`,
      });
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: 'Failed to set default environment',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }, []);

  const getDefaultEnvironment = useCallback(async () => {
    try {
      return await LocalStorage.getItem<string>(STORAGE_KEY);
    } catch {
      return undefined;
    }
  }, []);

  useEffect(() => {
    loadEnvironments();
  }, [loadEnvironments]);

  return {
    environments,
    isLoading,
    error,
    setDefaultEnvironment,
    getDefaultEnvironment,
  };
} 