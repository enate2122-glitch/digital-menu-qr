import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  setupFiles: ['<rootDir>/src/tests/env.setup.ts'],
  setupFilesAfterEnv: ['<rootDir>/src/tests/setup.ts'],
};

export default config;
