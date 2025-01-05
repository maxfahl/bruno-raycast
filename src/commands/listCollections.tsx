import { Action, ActionPanel, Icon, List } from '@raycast/api';
import React, { useState } from 'react';
import { CollectionTree } from '../components/CollectionTree';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { CollectionForm } from '../components/forms/CollectionForm';
import { RequestForm } from '../components/forms/RequestForm';
import { useCollections } from '../hooks/useCollections';

export default function Command() {
  const { collections, requests, isLoading } = useCollections();
  const [searchText, setSearchText] = useState('');

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
      <List
        isLoading={isLoading}
        onSearchTextChange={setSearchText}
        searchBarPlaceholder="Search collections and requests..."
        actions={
          <ActionPanel>
            <Action.Push
              icon={Icon.Plus}
              title="New Collection"
              target={<CollectionForm />}
            />
            <Action.Push
              icon={Icon.Plus}
              title="New Request"
              target={<RequestForm />}
            />
          </ActionPanel>
        }
      >
        <CollectionTree
          collections={filteredCollections}
          requests={filteredRequests}
          onRequestSelect={() => {}}
        />
      </List>
    </ErrorBoundary>
  );
}
