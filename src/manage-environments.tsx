import { Action, ActionPanel, Detail, Icon, List } from '@raycast/api';
import { useState } from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useEnvironments } from './hooks/useEnvironments';
import { BrunoEnvironment } from './utils/types';

function EnvironmentDetail({ environment }: { environment: BrunoEnvironment }) {
  const variables = Object.entries(environment.variables);

  return (
    <Detail
      markdown={`# ${environment.name}

## Variables
\`\`\`json
${JSON.stringify(environment.variables, null, 2)}
\`\`\`
`}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.Label
            title="Variables"
            text={variables.length.toString()}
          />
        </Detail.Metadata>
      }
    />
  );
}

export default function Command() {
  const { environments, isLoading } = useEnvironments();
  const [selectedEnvironment, setSelectedEnvironment] = useState<BrunoEnvironment | null>(null);

  if (selectedEnvironment) {
    return (
      <ErrorBoundary>
        <EnvironmentDetail environment={selectedEnvironment} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <List
        isLoading={isLoading}
        searchBarPlaceholder="Search environments..."
      >
        {environments.map((env) => (
          <List.Item
            key={env.name}
            title={env.name}
            subtitle={`${Object.keys(env.variables).length} variables`}
            actions={
              <ActionPanel>
                <Action
                  title="View Details"
                  icon={Icon.Eye}
                  onAction={() => setSelectedEnvironment(env)}
                />
                <Action.CopyToClipboard
                  title="Copy Variables"
                  content={JSON.stringify(env.variables, null, 2)}
                />
              </ActionPanel>
            }
          />
        ))}
      </List>
    </ErrorBoundary>
  );
} 