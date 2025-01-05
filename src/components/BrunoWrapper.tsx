import { Action, ActionPanel, Detail } from "@raycast/api";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { runBrunoCommand } from "../utils/brunoRunner";
import { ErrorBoundary } from "./ErrorBoundary";

export const BrunoWrapper: FC<PropsWithChildren> = ({ children }) => {
  const [isBrunoAvailable, setIsBrunoAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const check = async () => {
      try {
        // Try to run bru --version to check if it's available
        await runBrunoCommand('version', []);
        console.log('BrunoWrapper: CLI availability check result: true');
        setIsBrunoAvailable(true);
        setError(null);
      } catch (e) {
        console.error('BrunoWrapper: Error checking CLI:', e);
        setIsBrunoAvailable(false);
        setError(e instanceof Error ? e.message : 'Unknown error');
      }
    };
    check();
  }, []);

  // Show loading state while checking
  if (isBrunoAvailable === null) {
    console.log('BrunoWrapper: Still checking CLI availability');
    return (
      <ErrorBoundary>
        <Detail 
          markdown="Checking Bruno CLI installation..."
          navigationTitle="Checking Installation"
        />
      </ErrorBoundary>
    );
  }

  // Show installation instructions if Bruno is not available
  if (!isBrunoAvailable) {
    console.log('BrunoWrapper: CLI not available, showing instructions');
    return (
      <ErrorBoundary>
        <Detail
          markdown={`# Bruno CLI Installation Required

Bruno CLI is required but not found on your system. Please install it using npm or Homebrew:

\`\`\`bash
# Using npm
npm install -g @usebruno/cli

# Using Homebrew
brew install --cask bruno
\`\`\`

${error ? `\n## Error Details\n\`\`\`\n${error}\n\`\`\`\n` : ''}

Note: This is different from the Bruno desktop application. We specifically need the CLI tool for this extension to work.

---
Once installed, please try your action again.`}
          navigationTitle="Bruno CLI Installation Required"
          actions={
            <ActionPanel>
              {error && (
                <Action.CopyToClipboard
                  title="Copy Error Message"
                  content={error}
                  shortcut={{ modifiers: ["cmd"], key: "c" }}
                />
              )}
            </ActionPanel>
          }
        />
      </ErrorBoundary>
    );
  }

  // Show the actual content if Bruno is available
  console.log('BrunoWrapper: CLI available, showing content');
  return (
    <ErrorBoundary>
      {children}
    </ErrorBoundary>
  );
}; 