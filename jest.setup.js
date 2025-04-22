require('@testing-library/jest-dom');

// Polyfill TextEncoder/TextDecoder for Jest
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Enable fetch mocking for tests
require('jest-fetch-mock').enableMocks();

// Silence logger for all tests
jest.mock('./utils/logger', () => ({
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
  child: () => ({ error: jest.fn(), info: jest.fn(), warn: jest.fn(), debug: jest.fn() })
}));
