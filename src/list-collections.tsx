import { List } from '@raycast/api';
import { useState } from 'react';
import { BrunoWrapper } from './components/BrunoWrapper';
import { CollectionTree } from './components/CollectionTree';
import { useCollections } from './hooks/useCollections';
import { BrunoRequest } from './utils/types';

export default function Command() {
  const { collections, requests, isLoading, error } = useCollections();
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

  const handleRequestSelect = (request: BrunoRequest) => {
    // Handle request selection
  };

  return (
    <BrunoWrapper error={error}>
      <List
        isLoading={isLoading}
        onSearchTextChange={setSearchText}
        searchBarPlaceholder="Search collections and requests..."
      >
        <CollectionTree
          collections={filteredCollections}
          requests={filteredRequests}
          onRequestSelect={handleRequestSelect}
        />
      </List>
    </BrunoWrapper>
  );
}
