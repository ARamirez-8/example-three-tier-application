/**
 * Example test for the Home page component
 * 
 * To run these tests, first set up Jest and React Testing Library:
 * npm install --save-dev jest @testing-library/react @testing-library/jest-dom @types/jest jest-environment-jsdom
 * 
 * Then run: npm test
 */

import { render, screen } from '@testing-library/react';
import Home from '../page';
import * as actions from '../actions';

// Mock the server actions
jest.mock('../actions', () => ({
  getTasks: jest.fn(),
  createTask: jest.fn(),
  toggleTask: jest.fn(),
}));

describe('Home Page - To-Do List UI', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Page Structure', () => {
    it('renders the to-do list title', async () => {
      (actions.getTasks as jest.Mock).mockResolvedValue([]);
      render(await Home());
      expect(screen.getByText('To-Do List')).toBeInTheDocument();
    });

    it('renders the add task input field', async () => {
      (actions.getTasks as jest.Mock).mockResolvedValue([]);
      render(await Home());
      const input = screen.getByPlaceholderText('Add a new task...');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('type', 'text');
      expect(input).toHaveAttribute('required');
    });

    it('renders the add button', async () => {
      (actions.getTasks as jest.Mock).mockResolvedValue([]);
      render(await Home());
      const button = screen.getByRole('button', { name: /add/i });
      expect(button).toBeInTheDocument();
    });
  });

  describe('Empty State', () => {
    it('displays empty state message when no tasks exist', async () => {
      (actions.getTasks as jest.Mock).mockResolvedValue([]);
      render(await Home());
      expect(screen.getByText('No tasks yet. Add one above!')).toBeInTheDocument();
    });
  });

  describe('Task Display', () => {
    it('renders tasks when they exist', async () => {
      const mockTasks = [
        { id: 1, title: 'Test Task 1', completed: false, created_at: '2024-01-01' },
        { id: 2, title: 'Test Task 2', completed: true, created_at: '2024-01-02' },
      ];
      (actions.getTasks as jest.Mock).mockResolvedValue(mockTasks);
      render(await Home());
      expect(screen.getByText('Test Task 1')).toBeInTheDocument();
      expect(screen.getByText('Test Task 2')).toBeInTheDocument();
    });

    it('displays task completion count', async () => {
      const mockTasks = [
        { id: 1, title: 'Task 1', completed: false, created_at: '2024-01-01' },
        { id: 2, title: 'Task 2', completed: true, created_at: '2024-01-02' },
        { id: 3, title: 'Task 3', completed: true, created_at: '2024-01-03' },
      ];
      (actions.getTasks as jest.Mock).mockResolvedValue(mockTasks);
      render(await Home());
      expect(screen.getByText('2 / 3 completed')).toBeInTheDocument();
    });
  });

  describe('Task Styling', () => {
    it('applies strikethrough styling to completed tasks', async () => {
      const mockTasks = [
        { id: 1, title: 'Completed Task', completed: true, created_at: '2024-01-01' },
      ];
      (actions.getTasks as jest.Mock).mockResolvedValue(mockTasks);
      render(await Home());
      const taskSpan = screen.getByText('Completed Task');
      expect(taskSpan).toHaveClass('line-through');
    });

    it('does not apply strikethrough to incomplete tasks', async () => {
      const mockTasks = [
        { id: 1, title: 'Incomplete Task', completed: false, created_at: '2024-01-01' },
      ];
      (actions.getTasks as jest.Mock).mockResolvedValue(mockTasks);
      render(await Home());
      const taskSpan = screen.getByText('Incomplete Task');
      expect(taskSpan).not.toHaveClass('line-through');
    });
  });

  describe('Task Interactions', () => {
    it('renders checkbox buttons for each task', async () => {
      const mockTasks = [
        { id: 1, title: 'Task 1', completed: false, created_at: '2024-01-01' },
        { id: 2, title: 'Task 2', completed: true, created_at: '2024-01-02' },
      ];
      (actions.getTasks as jest.Mock).mockResolvedValue(mockTasks);
      render(await Home());
      const buttons = screen.getAllByRole('button', { name: /mark (complete|incomplete)/i });
      expect(buttons).toHaveLength(2);
    });

    it('renders correct aria-label for incomplete tasks', async () => {
      const mockTasks = [
        { id: 1, title: 'Task', completed: false, created_at: '2024-01-01' },
      ];
      (actions.getTasks as jest.Mock).mockResolvedValue(mockTasks);
      render(await Home());
      const button = screen.getByRole('button', { name: /mark complete/i });
      expect(button).toHaveAttribute('aria-label', 'Mark complete');
    });

    it('renders correct aria-label for completed tasks', async () => {
      const mockTasks = [
        { id: 1, title: 'Task', completed: true, created_at: '2024-01-01' },
      ];
      (actions.getTasks as jest.Mock).mockResolvedValue(mockTasks);
      render(await Home());
      const button = screen.getByRole('button', { name: /mark incomplete/i });
      expect(button).toHaveAttribute('aria-label', 'Mark incomplete');
    });
  });
});
