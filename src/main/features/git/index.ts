/**
 * Git Feature Index
 * Wires up service and handler with dependency injection
 */

import { GitService } from './git.service';
import { GitHandler } from './git.handler';

export function createGitFeature(): { handler: GitHandler; service: GitService } {
  const service = new GitService();
  const handler = new GitHandler(service);
  
  return { service, handler };
}

export { GitService } from './git.service';
export { GitHandler } from './git.handler';
