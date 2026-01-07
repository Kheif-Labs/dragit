/**
 * Git IPC Handler
 * Registers IPC handlers for Git operations
 */

import { ipcMain } from 'electron';
import { GitChannels } from '../../../shared/features/git/git.contract';
import type { GetCommitsRequest } from '../../../shared/features/git/git.contract';
import type { GitService } from './git.service';

export class GitHandler {
  constructor(private readonly gitService: GitService) {}

  /**
   * Registers all IPC handlers for the Git feature
   */
  register(): void {
    ipcMain.handle(GitChannels.GET_COMMITS, async (_event, request: GetCommitsRequest) => {
      return this.gitService.getCommits(request);
    });
  }

  /**
   * Unregisters all IPC handlers (useful for testing/cleanup)
   */
  unregister(): void {
    ipcMain.removeHandler(GitChannels.GET_COMMITS);
  }
}
