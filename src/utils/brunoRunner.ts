import { getPreferenceValues } from '@raycast/api';
import { exec } from 'child_process';
import { promisify } from 'util';
import { BrunoResponse } from './types';

const execAsync = promisify(exec);

interface Preferences {
  brunoPath?: string;
}

export async function runBrunoCommand(command: string, args: string[] = []): Promise<string> {
  const preferences = getPreferenceValues<Preferences>();
  const bruPath = preferences.brunoPath || '/usr/local/bin/bru';

  try {
    const { stdout } = await execAsync(`${bruPath} ${args.join(' ')}`, {
      env: process.env,
      shell: process.env.SHELL
    });
    return stdout.trim();
  } catch (error) {
    console.error(`Failed to run Bruno command: ${command}`, error);
    throw error;
  }
}

export async function runBrunoRequest(
  requestId: string,
  env?: string,
  variables?: Record<string, string>
): Promise<BrunoResponse> {
  try {
    const args = ['run', `"${requestId}"`];
    if (env) {
      args.push('--env', env);
    }
    if (variables) {
      args.push('--vars', JSON.stringify(variables));
    }

    const output = await runBrunoCommand('run', args);
    return JSON.parse(output);
  } catch (error) {
    throw new Error(`Failed to run request: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function listCollections(): Promise<any[]> {
  try {
    const output = await runBrunoCommand('collections', ['list', '--json']);
    return JSON.parse(output);
  } catch (error) {
    throw new Error(`Failed to list collections: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function listRequests(): Promise<any[]> {
  try {
    const output = await runBrunoCommand('requests', ['list', '--json']);
    return JSON.parse(output);
  } catch (error) {
    throw new Error(`Failed to list requests: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function createCollection(
  name: string,
  parent?: string,
  description?: string
): Promise<void> {
  try {
    const args = ['collection', 'create', name];
    if (parent) {
      args.push('--parent', parent);
    }
    if (description) {
      args.push('--description', description);
    }
    await runBrunoCommand('create', args);
  } catch (error) {
    throw new Error(`Failed to create collection: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function createRequest(
  name: string,
  method: string,
  url: string,
  collection: string,
  description?: string
): Promise<void> {
  try {
    const args = ['request', 'create', name, '--method', method, '--url', url, '--collection', collection];
    if (description) {
      args.push('--description', description);
    }
    await runBrunoCommand('create', args);
  } catch (error) {
    throw new Error(`Failed to create request: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}
