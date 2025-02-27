export default {
  preset: 'ts-jest', // Use ts-jest for TypeScript
  testEnvironment: 'node', // Use Node.js environment
  moduleFileExtensions: ['ts', 'tsx', 'js', 'json'], // File extensions to handle
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest', // Transform TypeScript files with ts-jest
  },
  testMatch: ['**/*.test.ts'],
  moduleNameMapper: {
    '^src/(.*)$': '<rootDir>/src/$1', // Map 'src/*' to the correct path
    '^dao/(.*)$': '<rootDir>/src/dao/$1', // Existing mapping
  },
  extensionsToTreatAsEsm: ['.ts'], // Treat .ts files as ESM
};