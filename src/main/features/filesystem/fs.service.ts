/**
 * FileSystem Service
 * Contains business logic for file system operations
 */

import { dialog } from 'electron';
import type { OpenFolderResult } from '../../../shared/features/filesystem/fs.contract';

export class FileSystemService {
  async openFolderDialog(): Promise<OpenFolderResult> {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      title: 'Select a folder',
    });

    return {
      success: !result.canceled && result.filePaths.length > 0,
      path: result.filePaths[0] ?? null,
      canceled: result.canceled,
    };
  }
}
