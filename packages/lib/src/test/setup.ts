import '@testing-library/jest-dom';
import { vi, beforeEach } from 'vitest';

// Mock fetch for posts store tests
const mockFetch = vi.fn();
vi.stubGlobal('fetch', mockFetch);

beforeEach(() => {
  vi.clearAllMocks();
});