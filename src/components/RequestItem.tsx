import { Action, ActionPanel, List } from '@raycast/api';
import { BrunoRequest } from '../utils/types';

interface RequestItemProps {
  request: BrunoRequest;
  onAction: () => void;
}

export function RequestItem({ request, onAction }: RequestItemProps) {
  return (
    <List.Item
      key={request.name}
      title={request.name}
      subtitle={request.method}
      accessories={[{ text: request.url }]}
      detail={
        <List.Item.Detail
          markdown={`# ${request.name}
${request.description || ''}

## URL
\`${request.url}\`

## Method
\`${request.method}\`
`}
        />
      }
      actions={
        <ActionPanel>
          <Action
            title="Run Request"
            onAction={onAction}
          />
        </ActionPanel>
      }
    />
  );
}
