import { exec } from 'child_process';
import { promisify } from 'util';
import { BrunoResponse } from './types';

const execAsync = promisify(exec);

export async function runBrunoRequest(
  requestPath: string,
  env?: string,
  variables?: Record<string, string>
): Promise<BrunoResponse> {
  try {
    let command = `bru run "${requestPath}"`;
    
    if (env) {
      command += ` --env ${env}`;
    }

    if (variables) {
      Object.entries(variables).forEach(([key, value]) => {
        command += ` --env-var ${key}=${value}`;
      });
    }

    const startTime = Date.now();
    const { stdout, stderr } = await execAsync(command);
    const endTime = Date.now();

    if (stderr) {
      throw new Error(stderr);
    }

    const response = JSON.parse(stdout);
    return {
      ...response,
      time: endTime - startTime,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to run Bruno request: ${error.message}`);
    }
    throw new Error('Failed to run Bruno request: Unknown error');
  }
}

export async function listCollections(directory: string): Promise<string[]> {
  try {
    const { stdout } = await execAsync(`find "${directory}" -name "*.bru" -type f`);
    return stdout.split('\n').filter(Boolean);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to list collections: ${error.message}`);
    }
    throw new Error('Failed to list collections: Unknown error');
  }
}

export async function createCollection(
  name: string,
  path: string,
  description?: string
): Promise<void> {
  try {
    const command = `mkdir -p "${path}" && touch "${path}/${name}.bru"`;
    await execAsync(command);
    
    if (description) {
      await execAsync(`echo "# ${description}" > "${path}/${name}.bru"`);
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to create collection: ${error.message}`);
    }
    throw new Error('Failed to create collection: Unknown error');
  }
}

export async function createRequest(
  name: string,
  method: string,
  url: string,
  collectionPath: string,
  description?: string
): Promise<void> {
  try {
    const requestContent = `# ${description || name}
meta {
  name: ${name}
  type: http
  seq: 1
}

${method} ${url}

headers {
  Content-Type: application/json
}
`;
    
    await execAsync(`echo '${requestContent}' > "${collectionPath}/${name}.bru"`);
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(`Failed to create request: ${error.message}`);
    }
    throw new Error('Failed to create request: Unknown error');
  }
}
