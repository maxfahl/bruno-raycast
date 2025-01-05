import { getPreferenceValues } from '@raycast/api';
import { exec } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';
import { promisify } from 'util';
import { BrunoResponse } from './types';

const execAsync = promisify(exec);

interface Preferences {
  brunoPath?: string;
}

function escapePath(path: string): string {
  return `"${path.replace(/"/g, '\\"')}"`;
}

export async function checkBrunoInstallation(): Promise<boolean> {
  try {
    const preferences = getPreferenceValues<Preferences>();
    const bruPath = preferences.brunoPath || '/Users/maxfahl/.nvm/versions/node/v18.20.5/bin/bru';
    const nodePath = process.execPath;
    const command = `${escapePath(nodePath)} ${escapePath(bruPath)} --version`;
    console.log('Checking Bruno CLI with command:', command);
    const { stdout, stderr } = await execAsync(command);
    console.log('stdout:', stdout);
    console.log('stderr:', stderr);
    
    // Check if stdout contains a version number (e.g. "1.36.3")
    const version = stdout.trim();
    const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/);
    if (!match) {
      console.log('Invalid version format:', version);
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error checking Bruno CLI:', error);
    return false;
  }
}

export async function runBrunoCommand(command: string, args: string[] = []): Promise<string> {
  const isInstalled = await checkBrunoInstallation();
  if (!isInstalled) {
    throw new Error('Bruno CLI is not available');
  }

  const preferences = getPreferenceValues<Preferences>();
  const bruPath = preferences.brunoPath || '/Users/maxfahl/.nvm/versions/node/v18.20.5/bin/bru';
  const nodePath = process.execPath;
  
  const commandArgs = command ? [command, ...args] : args;
  const fullCommand = `${escapePath(nodePath)} ${escapePath(bruPath)} ${commandArgs.join(' ')}`;
  console.log('Running command:', fullCommand);
  
  try {
    const { stdout, stderr } = await execAsync(fullCommand);
    if (stderr) {
      console.log('stderr:', stderr);
    }
    return stdout.trim();
  } catch (error) {
    if (error instanceof Error) {
      console.error('Command failed:', error.message);
      if ('stdout' in error) {
        console.log('stdout:', (error as any).stdout);
      }
      if ('stderr' in error) {
        console.log('stderr:', (error as any).stderr);
      }
    }
    throw error;
  }
}

export async function runBrunoRequest(
  requestId: string,
  env?: string,
  variables?: Record<string, string>
): Promise<BrunoResponse> {
  try {
    const args = ['run', requestId];
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

// Since the CLI doesn't support listing collections, we'll need to read the filesystem
export async function listCollections(): Promise<any[]> {
  try {
    // We need to find .bru files in the current directory
    const collections = await findBrunoFiles(process.cwd());
    return collections.map(file => ({
      name: path.basename(file, '.bru'),
      path: file
    }));
  } catch (error) {
    throw new Error(`Failed to list collections: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function listRequests(): Promise<any[]> {
  try {
    // For now, we'll return the same data as listCollections since requests are stored in .bru files
    const requests = await findBrunoFiles(process.cwd());
    return requests.map(file => ({
      name: path.basename(file, '.bru'),
      path: file
    }));
  } catch (error) {
    throw new Error(`Failed to list requests: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

async function findBrunoFiles(dir: string): Promise<string[]> {
  const files = await fs.readdir(dir, { withFileTypes: true });
  const bruFiles: string[] = [];

  for (const file of files) {
    const fullPath = path.join(dir, file.name);
    if (file.isDirectory() && !file.name.startsWith('.')) {
      bruFiles.push(...await findBrunoFiles(fullPath));
    } else if (file.name.endsWith('.bru')) {
      bruFiles.push(fullPath);
    }
  }

  return bruFiles;
}

export async function createCollection(
  name: string,
  parent?: string,
  description?: string
): Promise<void> {
  throw new Error('Creating collections via CLI is not supported. Please create collections manually in your Bruno workspace.');
}

export async function createRequest(
  name: string,
  method: string,
  url: string,
  collection: string,
  description?: string
): Promise<void> {
  throw new Error('Creating requests via CLI is not supported. Please create requests manually in your Bruno workspace.');
}
