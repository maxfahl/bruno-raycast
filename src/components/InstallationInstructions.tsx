import { Action, ActionPanel, Detail, openExtensionPreferences } from "@raycast/api";
import { FC } from "react";

interface InstallationInstructionsProps {
  error?: string;
}

const DEFAULT_BRUNO_PATH = '/usr/local/bin/bru';

const INSTALLATION_INSTRUCTIONS = `# Bruno CLI Installation Required

Bruno CLI is required but not found on your system. Please install it using npm:

\`\`\`bash
npm install -g @usebruno/cli
\`\`\`

After installing, the CLI will be available at \`${DEFAULT_BRUNO_PATH}\`

Note: This is different from the Bruno desktop application. We specifically need the CLI tool for this extension to work.

---
Once installed, please try your action again.`;

export const InstallationInstructions: FC<InstallationInstructionsProps> = ({ error }) => {
  const markdown = error 
    ? `${INSTALLATION_INSTRUCTIONS}\n\n## Error Details\n\`\`\`\n${error}\n\`\`\``
    : INSTALLATION_INSTRUCTIONS;

  return (
    <Detail 
      markdown={markdown}
      navigationTitle="Bruno CLI Installation Required"
      actions={
        <ActionPanel>
          <Action
            title="Open Extension Settings"
            onAction={openExtensionPreferences}
          />
          {error && (
            <Action.CopyToClipboard
              title="Copy Error Details"
              content={error}
              shortcut={{ modifiers: ["cmd"], key: "c" }}
            />
          )}
        </ActionPanel>
      }
    />
  );
}; 