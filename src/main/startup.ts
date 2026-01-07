/**
 * Application Startup
 * Registers all features and their IPC handlers using manual dependency injection
 */

import { createFileSystemFeature } from './features/filesystem';
import { createGitFeature } from './features/git';

interface RegisteredFeatures {
  filesystem: ReturnType<typeof createFileSystemFeature>;
  git: ReturnType<typeof createGitFeature>;
}

let registeredFeatures: RegisteredFeatures | null = null;

/**
 * Registers all feature handlers
 * Call this once during app initialization
 */
export function registerFeatures(): RegisteredFeatures {
  if (registeredFeatures) {
    console.warn('[Startup] Features already registered');
    return registeredFeatures;
  }

  console.log('[Startup] Registering features...');

  // Create features with dependency injection
  const filesystem = createFileSystemFeature();
  const git = createGitFeature();

  // Register IPC handlers
  filesystem.handler.register();
  git.handler.register();

  registeredFeatures = { filesystem, git };

  console.log('[Startup] All features registered successfully');

  return registeredFeatures;
}

/**
 * Unregisters all feature handlers
 * Call this during app shutdown or for testing
 */
export function unregisterFeatures(): void {
  if (!registeredFeatures) {
    console.warn('[Startup] No features to unregister');
    return;
  }

  console.log('[Startup] Unregistering features...');

  registeredFeatures.filesystem.handler.unregister();
  registeredFeatures.git.handler.unregister();

  registeredFeatures = null;

  console.log('[Startup] All features unregistered');
}

/**
 * Gets the registered features
 * Useful for accessing services from other parts of the main process
 */
export function getFeatures(): RegisteredFeatures | null {
  return registeredFeatures;
}
