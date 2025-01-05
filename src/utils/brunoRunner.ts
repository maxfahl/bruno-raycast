import { captureException, getApplications, getPreferenceValues, showInFinder } from '@raycast/api';
import { exec } from 'child_process';
import * as fs from 'fs/promises';
import * as os from 'os';
import * as path from 'path';
import { promisify } from 'util';
import { BrunoResponse } from './types';

const execAsync = promisify(exec);

interface Preferences {
  workspacePath: string;
}

function expandTilde(filePath: string): string {
  if (filePath.startsWith('~/')) {
    return path.join(os.homedir(), filePath.slice(2));
  }
  return filePath;
}

export async function checkBrunoInstallation(): Promise<boolean> {
  try {
    console.log('Checking Bruno CLI installation...');
    
    // First check if Bruno app is installed
    const apps = await getApplications();
    const brunoApp = apps.find(app => app.bundleId === 'com.usebruno.app');
    
    if (!brunoApp) {
      console.log('Bruno app not found');
      return false;
    }

    // Then check if CLI is available
    try {
      const { stdout } = await execAsync('bru --version', {
        env: {
          ...process.env,
          PATH: `${process.env.PATH}:/usr/local/bin:/opt/homebrew/bin:${os.homedir()}/.nvm/versions/node/v18.20.5/bin`
        }
      });
      
      const version = stdout.trim();
      console.log('Bruno CLI version:', version);
      return true;
    } catch (error) {
      console.error('Bruno CLI not found:', error);
      captureException(error);
      return false;
    }
  } catch (error) {
    console.error('Error checking Bruno installation:', error);
    captureException(error);
    return false;
  }
}

export async function runBrunoCommand(command: string, args: string[] = []): Promise<string> {
  const isInstalled = await checkBrunoInstallation();
  if (!isInstalled) {
    throw new Error('Bruno CLI is not available');
  }

  const commandArgs = command ? [command, ...args] : args;
  const fullCommand = `bru ${commandArgs.join(' ')}`;
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
    const preferences = getPreferenceValues<Preferences>();
    if (!preferences.workspacePath) {
      throw new Error('Bruno workspace path is not configured. Please set it in the extension preferences.');
    }

    const workspacePath = expandTilde(preferences.workspacePath);
    
    // Check if directory exists
    try {
      await fs.access(workspacePath);
    } catch (error) {
      // If the directory doesn't exist, show it in Finder to help the user
      try {
        // Try to create the directory
        await fs.mkdir(workspacePath, { recursive: true });
        await showInFinder(workspacePath);
      } catch (e) {
        console.error('Could not create workspace directory:', e);
        captureException(e);
      }

      throw new Error(
        `Workspace directory created at: ${workspacePath}\n\n` +
        'To set up your workspace:\n' +
        '1. Open Bruno desktop application\n' +
        '2. Go to Settings (gear icon)\n' +
        '3. Look for "Workspace" settings\n' +
        '4. Set the workspace path to the directory opened in Finder\n' +
        '5. Your collections will appear here automatically'
      );
    }

    // We need to find .bru files and JSON files in the workspace directory
    console.log('Searching for collections in:', workspacePath);
    const files = await findBrunoFiles(workspacePath);
    console.log('Found files:', files);
    
    // Process the files to get collections
    const collections = files.map(file => {
      const fileName = path.basename(file);
      const dirName = path.dirname(file);
      const isInRoot = dirName === workspacePath;
      
      // If the file is directly in the workspace root, use its name as the collection name
      return {
        name: isInRoot ? path.basename(fileName, '.json') : path.basename(dirName),
        path: isInRoot ? file : dirName,
        relativePath: path.relative(workspacePath, isInRoot ? file : dirName)
      };
    });
    
    if (collections.length === 0) {
      // Show the empty workspace in Finder
      await showInFinder(workspacePath);
      
      throw new Error(
        `No collections found in workspace: ${workspacePath}\n\n` +
        'To add collections:\n' +
        '1. Open Bruno desktop application\n' +
        '2. Go to Settings (gear icon)\n' +
        '3. Set the workspace path to the directory opened in Finder\n' +
        '4. Your collections will appear here automatically'
      );
    }
    
    return collections;
  } catch (error) {
    console.error('Error listing collections:', error);
    captureException(error);
    throw error;
  }
}

export async function listRequests(): Promise<any[]> {
  try {
    const preferences = getPreferenceValues<Preferences>();
    if (!preferences.workspacePath) {
      throw new Error('Bruno workspace path is not configured. Please set it in the extension preferences.');
    }

    const workspacePath = expandTilde(preferences.workspacePath);
    // For now, we'll return the same data as listCollections since requests are stored in .bru files
    const requests = await findBrunoFiles(workspacePath);
    return requests.map(file => ({
      name: path.basename(file, '.bru'),
      path: file,
      relativePath: path.relative(workspacePath, file)
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
    } else if (
      file.name.endsWith('.bru') || 
      file.name === 'collection.json' ||
      (file.name.endsWith('.json') && !file.name.startsWith('.'))
    ) {
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
