import { Action, ActionPanel, Color, Detail, Icon } from '@raycast/api';
import React from 'react';
import { BrunoResponse } from '../utils/types';

interface ResponseViewProps {
  response: BrunoResponse;
  onCopy?: () => void;
}

function formatResponse(response: BrunoResponse): string {
  const headers = Object.entries(response.headers)
    .map(([key, value]) => `${key}: ${value}`)
    .join('\n');

  return `# Response
Status: ${response.status} ${response.statusText}
Time: ${response.time}ms

## Headers
\`\`\`
${headers}
\`\`\`

## Body
\`\`\`json
${JSON.stringify(response.body, null, 2)}
\`\`\``;
}

export function ResponseView({ response, onCopy }: ResponseViewProps) {
  const markdown = formatResponse(response);
  const statusColor = response.status < 400 ? Color.Green : Color.Red;

  return (
    <Detail
      markdown={markdown}
      metadata={
        <Detail.Metadata>
          <Detail.Metadata.TagList title="Status">
            <Detail.Metadata.TagList.Item
              text={response.status.toString()}
              color={statusColor}
            />
          </Detail.Metadata.TagList>
          <Detail.Metadata.Label
            title="Time"
            text={`${response.time}ms`}
          />
        </Detail.Metadata>
      }
      actions={
        <ActionPanel>
          <Action
            title="Copy Response"
            icon={Icon.CopyClipboard}
            onAction={onCopy}
          />
          <Action.CopyToClipboard
            title="Copy Body"
            content={JSON.stringify(response.body, null, 2)}
          />
          <Action.CopyToClipboard
            title="Copy Headers"
            content={Object.entries(response.headers)
              .map(([key, value]) => `${key}: ${value}`)
              .join('\n')}
          />
        </ActionPanel>
      }
    />
  );
}
