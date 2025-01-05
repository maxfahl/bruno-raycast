import { Action, ActionPanel, Form, useNavigation } from '@raycast/api';
import { useState } from 'react';
import { useBrunoCommands } from '../../hooks/useBrunoCommands';
import { useCollections } from '../../hooks/useCollections';

interface RequestFormValues {
  name: string;
  method: string;
  url: string;
  collection: string;
  description?: string;
}

const HTTP_METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'];

export function RequestForm() {
  const { createNewRequest } = useBrunoCommands();
  const { collections } = useCollections();
  const { pop } = useNavigation();
  const [error, setError] = useState<string | undefined>();

  async function handleSubmit(values: RequestFormValues) {
    try {
      await createNewRequest(
        values.name,
        values.method,
        values.url,
        values.collection,
        values.description
      );
      
      pop();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create request');
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Create Request"
            onSubmit={handleSubmit}
          />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="name"
        title="Name"
        placeholder="Enter request name"
        error={error}
        onChange={() => setError(undefined)}
      />
      <Form.Dropdown id="method" title="HTTP Method">
        {HTTP_METHODS.map(method => (
          <Form.Dropdown.Item
            key={method}
            value={method}
            title={method}
          />
        ))}
      </Form.Dropdown>
      <Form.TextField
        id="url"
        title="URL"
        placeholder="Enter request URL"
      />
      <Form.Dropdown id="collection" title="Collection">
        {collections.map(collection => (
          <Form.Dropdown.Item
            key={collection.name}
            value={collection.name}
            title={collection.name}
          />
        ))}
      </Form.Dropdown>
      <Form.TextField
        id="description"
        title="Description"
        placeholder="Enter request description (optional)"
      />
    </Form>
  );
}
