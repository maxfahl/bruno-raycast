import { showToast, Toast } from '@raycast/api';
import { useCallback, useState } from 'react';
import { createCollection, createRequest, runBrunoRequest } from '../utils/brunoRunner';
import { BrunoResponse } from '../utils/types';

export function useBrunoCommands() {
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<BrunoResponse | null>(null);

  const executeRequest = useCallback(async (
    requestId: string,
    env?: string,
    variables?: Record<string, string>
  ) => {
    setIsLoading(true);
    try {
      const result = await runBrunoRequest(requestId, env, variables);
      setResponse(result);
      return result;
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: 'Failed to execute request',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createNewRequest = useCallback(async (
    name: string,
    method: string,
    url: string,
    collection: string,
    description?: string
  ) => {
    setIsLoading(true);
    try {
      await createRequest(name, method, url, collection, description);
      await showToast({
        style: Toast.Style.Success,
        title: 'Request created',
        message: `Created request ${name}`,
      });
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: 'Failed to create request',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const createNewCollection = useCallback(async (
    name: string,
    parent?: string,
    description?: string
  ) => {
    setIsLoading(true);
    try {
      await createCollection(name, parent, description);
      await showToast({
        style: Toast.Style.Success,
        title: 'Collection created',
        message: `Created collection ${name}`,
      });
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: 'Failed to create collection',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    isLoading,
    response,
    executeRequest,
    createNewRequest,
    createNewCollection,
  };
}
