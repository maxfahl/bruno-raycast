import { Clipboard, List, showToast, Toast } from '@raycast/api';
import { useEffect, useState } from 'react';
import { CollectionTree } from './components/CollectionTree';
import { EnvironmentSelector } from './components/EnvironmentSelector';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ResponseView } from './components/ResponseView';
import { useBrunoCommands } from './hooks/useBrunoCommands';
import { useCollections } from './hooks/useCollections';
import { useEnvironments } from './hooks/useEnvironments';
import { useHistory } from './hooks/useHistory';
import { BrunoEnvironment, BrunoRequest, BrunoResponse } from './utils/types';

export default function Command() {
  const { collections, requests, isLoading } = useCollections();
  const { executeRequest } = useBrunoCommands();
  const { environments, getDefaultEnvironment } = useEnvironments();
  const { addToHistory } = useHistory();
  const [selectedRequest, setSelectedRequest] = useState<BrunoRequest | null>(null);
  const [response, setResponse] = useState<BrunoResponse | null>(null);
  const [searchText, setSearchText] = useState('');
  const [selectedEnvironment, setSelectedEnvironment] = useState<BrunoEnvironment | null>(null);
  const [showEnvironmentSelector, setShowEnvironmentSelector] = useState(false);

  useEffect(() => {
    // Load default environment
    getDefaultEnvironment().then((defaultEnv) => {
      if (defaultEnv) {
        // Find environment by name
        const env = environments.find((e: BrunoEnvironment) => e.name === defaultEnv);
        if (env) {
          setSelectedEnvironment(env);
        }
      }
    });
  }, [getDefaultEnvironment, environments]);

  async function handleRequestSelect(request: BrunoRequest) {
    try {
      const result = await executeRequest(
        request.path,
        selectedEnvironment?.name,
        selectedEnvironment?.variables
      );
      setSelectedRequest(request);
      setResponse(result);
      
      // Add to history
      await addToHistory({
        request,
        response: result,
        environment: selectedEnvironment?.name,
      });
      
      // Copy response to clipboard (default action)
      await Clipboard.copy(JSON.stringify(result.body, null, 2));
      await showToast({
        style: Toast.Style.Success,
        title: 'Response copied to clipboard',
      });
    } catch (error) {
      await showToast({
        style: Toast.Style.Failure,
        title: 'Failed to execute request',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  }

  const filteredRequests = searchText
    ? requests.filter(request =>
        request.name.toLowerCase().includes(searchText.toLowerCase()) ||
        request.url.toLowerCase().includes(searchText.toLowerCase())
      )
    : requests;

  const filteredCollections = searchText
    ? collections.filter(collection =>
        collection.name.toLowerCase().includes(searchText.toLowerCase())
      )
    : collections;

  if (showEnvironmentSelector) {
    return (
      <ErrorBoundary>
        <EnvironmentSelector
          selectedEnvironment={selectedEnvironment?.name}
          onSelect={(env) => {
            setSelectedEnvironment(env);
            setShowEnvironmentSelector(false);
          }}
        />
      </ErrorBoundary>
    );
  }

  if (selectedRequest && response) {
    return (
      <ErrorBoundary>
        <ResponseView
          response={response}
          onCopy={() => Clipboard.copy(JSON.stringify(response.body, null, 2))}
        />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <List
        isLoading={isLoading}
        onSearchTextChange={setSearchText}
        searchBarPlaceholder="Search requests..."
        searchBarAccessory={
          <List.Dropdown
            tooltip="Environment"
            value={selectedEnvironment?.name || ''}
            onChange={() => setShowEnvironmentSelector(true)}
          >
            <List.Dropdown.Item
              title={selectedEnvironment?.name || 'Select Environment'}
              value=""
            />
          </List.Dropdown>
        }
      >
        <CollectionTree
          collections={filteredCollections}
          requests={filteredRequests}
          onRequestSelect={handleRequestSelect}
        />
      </List>
    </ErrorBoundary>
  );
}
