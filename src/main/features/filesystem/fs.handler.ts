/**
 * FileSystem IPC Handler
 * Registers IPC handlers for file system operations
 */

import { ipcMain } from 'electron';
import { FileSystemChannels } from '../../../shared/features/filesystem/fs.contract';
import type { FileSystemService } from './fs.service';

export class FileSystemHandler {
  constructor(private readonly fileSystemService: FileSystemService) {}

  /**
   * Registers all IPC handlers for the FileSystem feature
   */
  register(): void {
    ipcMain.handle(FileSystemChannels.OPEN_FOLDER_DIALOG, async () => {
      return this.fileSystemService.openFolderDialog();
    });
  }

  /**
   * Unregisters all IPC handlers (useful for testing/cleanup)
   */
  unregister(): void {
    ipcMain.removeHandler(FileSystemChannels.OPEN_FOLDER_DIALOG);
  }
}
