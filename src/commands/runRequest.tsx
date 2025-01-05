import { Clipboard, List, showToast, Toast } from '@raycast/api';
import React, { useState } from 'react';
import { CollectionTree } from '../components/CollectionTree';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { ResponseView } from '../components/ResponseView';
import { useBrunoCommands } from '../hooks/useBrunoCommands';
import { useCollections } from '../hooks/useCollections';
import { BrunoRequest, BrunoResponse } from '../utils/types';

export default function Command() {
  const { collections, requests, isLoading } = useCollections();
  const { executeRequest } = useBrunoCommands();
  const [selectedRequest, setSelectedRequest] = useState<BrunoRequest | null>(null);
  const [response, setResponse] = useState<BrunoResponse | null>(null);
  const [searchText, setSearchText] = useState('');

  async function handleRequestSelect(request: BrunoRequest) {
    try {
      const result = await executeRequest(request.path);
      setSelectedRequest(request);
      setResponse(result);
      
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

  return (
    <ErrorBoundary>
      {selectedRequest && response ? (
        <ResponseView
          response={response}
          onCopy={() => Clipboard.copy(JSON.stringify(response.body, null, 2))}
        />
      ) : (
        <List
          isLoading={isLoading}
          onSearchTextChange={setSearchText}
          searchBarPlaceholder="Search requests..."
        >
          <CollectionTree
            collections={filteredCollections}
            requests={filteredRequests}
            onRequestSelect={handleRequestSelect}
          />
        </List>
      )}
    </ErrorBoundary>
  );
}
