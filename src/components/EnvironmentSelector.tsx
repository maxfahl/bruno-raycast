import { Action, ActionPanel, Icon, List } from '@raycast/api';
import React from 'react';
import { useEnvironments } from '../hooks/useEnvironments';
import { BrunoEnvironment } from '../utils/types';

interface EnvironmentSelectorProps {
  onSelect: (env: BrunoEnvironment) => void;
  selectedEnvironment?: string;
}

export function EnvironmentSelector({ onSelect, selectedEnvironment }: EnvironmentSelectorProps) {
  const { environments, isLoading, setDefaultEnvironment } = useEnvironments();

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Search environments..."
    >
      {environments.map((env: BrunoEnvironment) => (
        <List.Item
          key={env.name}
          title={env.name}
          subtitle={`${Object.keys(env.variables).length} variables`}
          icon={env.name === selectedEnvironment ? Icon.CheckCircle : Icon.Circle}
          actions={
            <ActionPanel>
              <Action
                title="Select Environment"
                icon={Icon.ArrowRight}
                onAction={() => onSelect(env)}
              />
              <Action
                title="Set as Default"
                icon={Icon.Star}
                onAction={() => setDefaultEnvironment(env.name)}
              />
            </ActionPanel>
          }
        />
      ))}
    </List>
  );
} 