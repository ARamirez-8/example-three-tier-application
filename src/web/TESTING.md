# Testing Setup Guide

This document provides instructions for setting up and running UI tests for the Next.js web application.

## Overview

The test suite includes:
- **Component Tests**: Testing React components and their rendering
- **Integration Tests**: Testing server actions and API interactions
- **UI Tests**: Testing user interactions and visual elements

## Quick Start

### 1. Install Testing Dependencies

```bash
npm install --save-dev \
  jest \
  @testing-library/react \
  @testing-library/jest-dom \
  @types/jest \
  jest-environment-jsdom
```

### 2. Create Jest Configuration

Create `jest.config.ts` in the web directory:

```typescript
import type { Config } from 'jest';
import nextJest from 'next/jest';

const createJestConfig = nextJest({
  dir: './',
});

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
  },
  testMatch: [
    '**/__tests__/**/*.[jt]s?(x)',
    '**/?(*.)+(spec|test).[jt]s?(x)',
  ],
};

export default createJestConfig(config);
```

### 3. Create Jest Setup File

Create `jest.setup.ts`:

```typescript
import '@testing-library/jest-dom';
```

### 4. Update package.json

Add test scripts:

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### 5. Run Tests

```bash
# Run all tests once
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

## Test Files

### `app/__tests__/page.test.tsx`
Tests for the main Home page component covering:
- Page structure and layout
- Empty state display
- Task rendering and display
- Task styling (completed/incomplete)
- Task interaction elements

### `app/__tests__/layout.test.tsx`
Tests for the RootLayout component covering:
- Children rendering
- HTML structure and classes
- Font variable application
- Language attribute

### `app/__tests__/actions.test.ts`
Tests for server actions covering:
- `getTasks()` - Fetching tasks from API
- `createTask()` - Creating new tasks
- `toggleTask()` - Updating task completion status
- Error handling and edge cases

## Test Coverage

Current test coverage includes:

| Component | Tests | Coverage |
|-----------|-------|----------|
| Home Page | 11 | Page structure, task display, styling, interactions |
| Layout | 5 | Rendering, HTML structure, fonts |
| Actions | 13 | API calls, error handling, edge cases |

## Writing New Tests

### Example: Testing a New Component

```typescript
import { render, screen } from '@testing-library/react';
import MyComponent from '../my-component';

describe('MyComponent', () => {
  it('renders the component', () => {
    render(<MyComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });

  it('handles user interaction', () => {
    render(<MyComponent />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByText('Updated')).toBeInTheDocument();
  });
});
```

### Example: Testing Server Actions

```typescript
import { myServerAction } from '../actions';

jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

global.fetch = jest.fn();

describe('myServerAction', () => {
  it('calls the API correctly', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    await myServerAction();

    expect(global.fetch).toHaveBeenCalledWith(
      'http://localhost:3001/endpoint',
      expect.any(Object)
    );
  });
});
```

## Best Practices

1. **Test User Behavior**: Focus on what users see and do, not implementation details
2. **Use Semantic Queries**: Prefer `getByRole`, `getByLabelText` over `getByTestId`
3. **Mock External Dependencies**: Mock API calls and server actions
4. **Keep Tests Focused**: One main assertion per test when possible
5. **Use Descriptive Names**: Test names should clearly describe what is being tested
6. **Organize Tests**: Group related tests using `describe` blocks
7. **Clean Up**: Use `beforeEach` to reset mocks between tests

## Debugging Tests

### Run a Single Test File

```bash
npm test -- page.test.tsx
```

### Run Tests Matching a Pattern

```bash
npm test -- --testNamePattern="renders"
```

### Debug Mode

```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

Then open `chrome://inspect` in Chrome DevTools.

## CI/CD Integration

To run tests in CI/CD pipelines:

```bash
npm test -- --coverage --watchAll=false
```

This will:
- Run all tests once
- Generate coverage reports
- Exit with appropriate status code

## Troubleshooting

### Issue: "Cannot find module" errors

**Solution**: Ensure `moduleNameMapper` in `jest.config.ts` matches your `tsconfig.json` paths.

### Issue: Tests timeout

**Solution**: Increase timeout in test:
```typescript
it('slow test', async () => {
  // test code
}, 10000); // 10 second timeout
```

### Issue: Disk space errors during npm install

**Solution**: Clean npm cache:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Queries](https://testing-library.com/docs/queries/about)
- [Next.js Testing](https://nextjs.org/docs/testing)

## Next Steps

1. Install testing dependencies
2. Create Jest configuration files
3. Run `npm test` to verify setup
4. Add more tests as new features are developed
5. Integrate tests into CI/CD pipeline
