import { Action, ActionPanel, Form, useNavigation } from '@raycast/api';
import { join } from 'path';
import { useState } from 'react';
import { useBrunoCommands } from '../../hooks/useBrunoCommands';
import { getBrunoDirectory } from '../../utils/fileUtils';

interface CollectionFormValues {
  name: string;
  description?: string;
  parent?: string;
}

export function CollectionForm() {
  const { createNewCollection } = useBrunoCommands();
  const { pop } = useNavigation();
  const [error, setError] = useState<string | undefined>();

  async function handleSubmit(values: CollectionFormValues) {
    try {
      const brunoDir = await getBrunoDirectory();
      const collectionPath = values.parent
        ? join(brunoDir, values.parent)
        : brunoDir;

      await createNewCollection(
        values.name,
        collectionPath,
        values.description
      );
      
      pop();
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to create collection');
    }
  }

  return (
    <Form
      actions={
        <ActionPanel>
          <Action.SubmitForm
            title="Create Collection"
            onSubmit={handleSubmit}
          />
        </ActionPanel>
      }
    >
      <Form.TextField
        id="name"
        title="Name"
        placeholder="Enter collection name"
        error={error}
        onChange={() => setError(undefined)}
      />
      <Form.TextField
        id="description"
        title="Description"
        placeholder="Enter collection description (optional)"
      />
      <Form.TextField
        id="parent"
        title="Parent Collection"
        placeholder="Enter parent collection path (optional)"
      />
    </Form>
  );
}
