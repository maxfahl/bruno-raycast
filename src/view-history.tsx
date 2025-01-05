import { Action, ActionPanel, Icon, List } from '@raycast/api';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { ResponseView } from './components/ResponseView';
import { useBrunoCommands } from './hooks/useBrunoCommands';
import { useHistory } from './hooks/useHistory';

export default function Command() {
  const { history, isLoading, clearHistory } = useHistory();
  const { executeRequest } = useBrunoCommands();
  const [selectedEntry, setSelectedEntry] = useState<typeof history[0] | null>(null);

  async function handleRerun(entry: typeof history[0]) {
    try {
      const response = await executeRequest(
        entry.request.path,
        entry.environment,
        entry.environment ? entry.response.variables : undefined
      );
      setSelectedEntry({
        ...entry,
        response,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.error('Error rerunning request:', error);
    }
  }

  if (selectedEntry) {
    return (
      <ErrorBoundary>
        <ResponseView
          response={selectedEntry.response}
          onCopy={() => {}}
        />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <List
        isLoading={isLoading}
        searchBarPlaceholder="Search history..."
        actions={
          <ActionPanel>
            <Action
              title="Clear History"
              icon={Icon.Trash}
              onAction={clearHistory}
            />
          </ActionPanel>
        }
      >
        {history.map((entry) => (
          <List.Item
            key={entry.timestamp}
            title={entry.request.name}
            subtitle={entry.request.url}
            accessories={[
              {
                text: formatDistanceToNow(entry.timestamp, { addSuffix: true })
              },
              {
                tag: {
                  value: entry.response.status.toString(),
                  color: entry.response.status < 400 ? '#2ecc71' : '#e74c3c'
                }
              },
              ...(entry.environment ? [{
                tag: {
                  value: entry.environment,
                  color: '#3498db'
                }
              }] : [])
            ]}
            actions={
              <ActionPanel>
                <Action
                  title="View Response"
                  icon={Icon.Eye}
                  onAction={() => setSelectedEntry(entry)}
                />
                <Action
                  title="Rerun Request"
                  icon={Icon.ArrowClockwise}
                  onAction={() => handleRerun(entry)}
                />
              </ActionPanel>
            }
          />
        ))}
      </List>
    </ErrorBoundary>
  );
} 