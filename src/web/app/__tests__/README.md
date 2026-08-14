# UI Testing Guide

This directory contains UI tests for the To-Do List application.

## Test Structure

The tests are organized by component:

- `page.test.tsx` - Tests for the main Home page component
- `layout.test.tsx` - Tests for the RootLayout component
- `actions.test.ts` - Tests for server actions

## Setting Up Testing

To enable testing in this project, follow these steps:

### 1. Install Testing Dependencies

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @types/jest jest-environment-jsdom
```

### 2. Create Jest Configuration

Create `jest.config.ts` in the root of the web directory:

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

### 4. Update package.json Scripts

Add test scripts to `package.json`:

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
npm test
```

## Test Coverage

The test suite covers:

### Home Page (`page.test.tsx`)
- ✓ Renders the to-do list title
- ✓ Renders the add task input field
- ✓ Renders the add button
- ✓ Displays empty state message when no tasks exist
- ✓ Renders tasks when they exist
- ✓ Displays task completion count
- ✓ Applies strikethrough styling to completed tasks
- ✓ Renders checkbox buttons for each task

### Layout (`layout.test.tsx`)
- ✓ Renders children correctly
- ✓ Renders html and body elements with correct classes

### Server Actions (`actions.test.ts`)
- ✓ Fetches tasks from the API
- ✓ Throws error when fetch fails
- ✓ Uses API_URL environment variable when set
- ✓ Sends POST request with task title
- ✓ Sends PATCH request to update task completion status
- ✓ Handles toggling task to incomplete

## Writing New Tests

When adding new components or features, follow these patterns:

### Testing Server Components

```typescript
import { render, screen } from '@testing-library/react';
import MyComponent from '../my-component';

jest.mock('../actions', () => ({
  getMyData: jest.fn(),
}));

describe('MyComponent', () => {
  it('renders correctly', async () => {
    render(await MyComponent());
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
});
```

### Testing User Interactions

```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import MyComponent from '../my-component';

describe('MyComponent', () => {
  it('handles button click', () => {
    render(<MyComponent />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByText('Updated Text')).toBeInTheDocument();
  });
});
```

## Best Practices

1. **Test user behavior, not implementation** - Focus on what users see and do
2. **Use semantic queries** - Prefer `getByRole`, `getByLabelText` over `getByTestId`
3. **Mock external dependencies** - Mock API calls and server actions
4. **Keep tests focused** - One assertion per test when possible
5. **Use descriptive test names** - Test names should describe what is being tested

## Resources

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Best Practices](https://testing-library.com/docs/queries/about)
