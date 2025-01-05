import { Color, Icon, List } from '@raycast/api';
import React from 'react';
import { BrunoRequest } from '../utils/types';

const methodColors: Record<string, Color> = {
  GET: Color.Green,
  POST: Color.Blue,
  PUT: Color.Yellow,
  DELETE: Color.Red,
  PATCH: Color.Orange,
};

interface RequestItemProps {
  request: BrunoRequest;
  onAction?: () => void;
}

export function RequestItem({ request, onAction }: RequestItemProps) {
  return (
    <List.Item
      title={request.name}
      subtitle={request.url}
      accessories={[
        {
          tag: {
            value: request.method,
            color: methodColors[request.method] || Color.PrimaryText,
          },
        },
      ]}
      actions={
        onAction
          ? <List.Item.Action
              title="Run Request"
              icon={Icon.Terminal}
              onAction={onAction}
            />
          : undefined
      }
    />
  );
}
