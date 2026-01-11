/**
 * Vitest Test Setup
 * Global test configuration and mocks
 */

import '@testing-library/react'
import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'

// Automatically cleanup after each test
afterEach(() => {
  cleanup()
})
