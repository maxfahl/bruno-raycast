import { List } from '@raycast/api';
import { ReactElement } from 'react';
import { BrunoCollection, BrunoRequest } from '../utils/types';
import { RequestItem } from './RequestItem';

interface CollectionTreeProps {
  collections: BrunoCollection[];
  requests: BrunoRequest[];
  onRequestSelect: (request: BrunoRequest) => void;
}

interface CollectionNode extends BrunoCollection {
  children: CollectionNode[];
  requests: BrunoRequest[];
}

function buildCollectionTree(
  collections: BrunoCollection[],
  requests: BrunoRequest[]
): CollectionNode[] {
  const rootCollections = collections.filter(c => !c.parent);
  const tree: CollectionNode[] = [];

  function buildNode(collection: BrunoCollection): CollectionNode {
    const children = collections
      .filter(c => c.parent === collection.name)
      .map(buildNode);

    const collectionRequests = requests.filter(r => r.collection === collection.name);

    return {
      ...collection,
      children,
      requests: collectionRequests,
    };
  }

  rootCollections.forEach(root => {
    tree.push(buildNode(root));
  });

  return tree;
}

export function CollectionTree({ collections, requests, onRequestSelect }: CollectionTreeProps) {
  const tree = buildCollectionTree(collections, requests);

  function renderCollection(node: CollectionNode): ReactElement {
    return (
      <>
        <List.Section key={node.name} title={node.name}>
          {node.requests.map(request => (
            <RequestItem
              key={request.name}
              request={request}
              onAction={() => onRequestSelect(request)}
            />
          ))}
        </List.Section>
        {node.children.map(renderCollection)}
      </>
    );
  }

  return (
    <>
      {tree.map(renderCollection)}
    </>
  );
}
