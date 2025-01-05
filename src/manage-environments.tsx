import { Action, ActionPanel, Detail, Icon, List } from '@raycast/api';
import { useState } from 'react';
import { BrunoWrapper } from './components/BrunoWrapper';
import { useEnvironments } from './hooks/useEnvironments';
import { BrunoEnvironment } from './utils/types';

function EnvironmentDetail({ environment }: { environment: BrunoEnvironment }) {
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
            text={Object.keys(environment.variables).length.toString()}
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
      <BrunoWrapper>
        <EnvironmentDetail environment={selectedEnvironment} />
      </BrunoWrapper>
    );
  }

  return (
    <BrunoWrapper>
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
    </BrunoWrapper>
  );
} 