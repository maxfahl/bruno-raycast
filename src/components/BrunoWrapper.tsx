import { Action, ActionPanel, Detail } from "@raycast/api";
import { FC, PropsWithChildren, useEffect, useState } from "react";
import { checkBrunoInstallation } from "../utils/brunoRunner";
import { ErrorBoundary } from "./ErrorBoundary";

export const BrunoWrapper: FC<PropsWithChildren> = ({ children }) => {
  const [isBrunoAvailable, setIsBrunoAvailable] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const check = async () => {
      try {
        const isAvailable = await checkBrunoInstallation();
        if (isMounted) {
          console.log('BrunoWrapper: CLI availability check result:', isAvailable);
          setIsBrunoAvailable(isAvailable);
          setError(null);
        }
      } catch (e) {
        if (isMounted) {
          console.error('BrunoWrapper: Error checking CLI:', e);
          setIsBrunoAvailable(false);
          setError(e instanceof Error ? e.message : 'Unknown error');
        }
      }
    };

    check();

    return () => {
      isMounted = false;
    };
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
  if (!isBrunoAvailable || error) {
    console.log('BrunoWrapper: CLI not available or error occurred, showing instructions');
    return (
      <ErrorBoundary>
        <Detail
          markdown={`# Bruno CLI ${error ? 'Error' : 'Installation Required'}

${error ? `An error occurred: ${error}` : 'Bruno CLI is required but not found on your system. Please install it using npm or Homebrew:'}

\`\`\`bash
# Using npm
npm install -g @usebruno/cli

# Using Homebrew
brew install --cask bruno
\`\`\`

Note: This is different from the Bruno desktop application. We specifically need the CLI tool for this extension to work.

---
Once installed, please try your action again.`}
          navigationTitle={error ? 'Bruno CLI Error' : 'Bruno CLI Installation Required'}
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
  return <ErrorBoundary>{children}</ErrorBoundary>;
}; 