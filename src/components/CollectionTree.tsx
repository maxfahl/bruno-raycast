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

  if (tree.length === 0) {
    return <List.EmptyView title="No Collections" description="No collections found in the workspace." />;
  }

  // Flatten the tree into sections
  const sections: ReactElement[] = [];
  
  function addNodeToSections(node: CollectionNode, level = 0) {
    // Add this node's requests as a section
    if (node.requests.length > 0) {
      sections.push(
        <List.Section key={node.name} title={`${node.name} (${node.requests.length})`}>
          {node.requests.map(request => (
            <RequestItem
              key={request.name}
              request={request}
              onAction={() => onRequestSelect(request)}
            />
          ))}
        </List.Section>
      );
    }

    // Process children
    node.children.forEach(child => addNodeToSections(child, level + 1));
  }

  // Process each root node
  tree.forEach(node => addNodeToSections(node));

  return <>{sections}</>;
}
