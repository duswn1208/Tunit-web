import '@testing-library/jest-dom/vitest';

// fetch가 정의되어 있지 않은 환경을 위한 폴백
if (typeof globalThis.fetch === 'undefined') {
  globalThis.fetch = vi.fn();
}
