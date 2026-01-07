/**
 * FileSystem Feature Index
 * Wires up service and handler with dependency injection
 */

import { FileSystemService } from './fs.service';
import { FileSystemHandler } from './fs.handler';

export function createFileSystemFeature(): { handler: FileSystemHandler; service: FileSystemService } {
  const service = new FileSystemService();
  const handler = new FileSystemHandler(service);
  
  return { service, handler };
}

export { FileSystemService } from './fs.service';
export { FileSystemHandler } from './fs.handler';
