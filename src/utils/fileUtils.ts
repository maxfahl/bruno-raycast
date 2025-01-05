import { readdir, readFile } from 'fs/promises';
import { homedir } from 'os';
import { join } from 'path';
import { BrunoCollection, BrunoRequest } from './types';

const BRUNO_DIR = join(homedir(), '.bruno');

export async function getBrunoDirectory(): Promise<string> {
  return BRUNO_DIR;
}

export async function parseRequestFile(filePath: string): Promise<BrunoRequest> {
  try {
    const content = await readFile(filePath, 'utf-8');
    const lines = content.split('\n');
    
    const name = lines.find(line => line.includes('name:'))?.split('name:')[1]?.trim() || '';
    const method = lines.find(line => /^(GET|POST|PUT|DELETE|PATCH)/.test(line))?.split(' ')[0] || '';
    const url = lines.find(line => /^(GET|POST|PUT|DELETE|PATCH)/.test(line))?.split(' ')[1]?.trim() || '';
    const description = lines.find(line => line.startsWith('#'))?.substring(1).trim() || '';
    
    return {
      name,
      method,
      url,
      path: filePath,
      collection: filePath.split('/').slice(-2)[0],
      description,
    };
  } catch (error) {
    console.error('Error parsing request file:', error);
    throw error;
  }
}

export async function parseCollectionFile(filePath: string): Promise<BrunoCollection> {
  try {
    const content = await readFile(filePath, 'utf-8');
    const lines = content.split('\n');
    
    const name = filePath.split('/').slice(-1)[0].replace('.bru', '');
    const description = lines.find(line => line.startsWith('#'))?.substring(1).trim();
    const parent = filePath.split('/').slice(-2)[0];
    
    return {
      name,
      path: filePath,
      description,
      parent: parent !== '.bruno' ? parent : undefined,
    };
  } catch (error) {
    console.error('Error parsing collection file:', error);
    throw error;
  }
}

export async function findBrunoFiles(): Promise<string[]> {
  try {
    const brunoDir = await getBrunoDirectory();
    const files: string[] = [];
    
    async function scanDirectory(dir: string) {
      const entries = await readdir(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = join(dir, entry.name);
        
        if (entry.isDirectory()) {
          await scanDirectory(fullPath);
        } else if (entry.name.endsWith('.bru')) {
          files.push(fullPath);
        }
      }
    }
    
    await scanDirectory(brunoDir);
    return files;
  } catch (error) {
    console.error('Error finding Bruno files:', error);
    throw error;
  }
}
