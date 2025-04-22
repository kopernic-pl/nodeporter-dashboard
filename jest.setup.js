require('@testing-library/jest-dom');

// Polyfill TextEncoder/TextDecoder for Jest
const { TextEncoder, TextDecoder } = require('util');
global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

// Enable fetch mocking for tests
require('jest-fetch-mock').enableMocks();
