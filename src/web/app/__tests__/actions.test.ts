/**
 * Example test for server actions
 * 
 * To run these tests, first set up Jest:
 * npm install --save-dev jest @types/jest
 * 
 * Then run: npm test
 */

import { getTasks, createTask, toggleTask } from '../actions';

// Mock fetch globally
global.fetch = jest.fn();

// Mock next/cache
jest.mock('next/cache', () => ({
  revalidatePath: jest.fn(),
}));

describe('Server Actions - API Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getTasks', () => {
    it('fetches tasks from the API endpoint', async () => {
      const mockTasks = [
        { id: 1, title: 'Task 1', completed: false, created_at: '2024-01-01' },
      ];
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockTasks,
      });

      const result = await getTasks();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/tasks',
        { cache: 'no-store' }
      );
      expect(result).toEqual(mockTasks);
    });

    it('throws error when API request fails', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
      });

      await expect(getTasks()).rejects.toThrow('Failed to fetch tasks');
    });

    it('uses custom API_URL from environment variable', async () => {
      const originalEnv = process.env.API_URL;
      process.env.API_URL = 'http://custom-api:3001';

      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      await getTasks();

      expect(global.fetch).toHaveBeenCalledWith(
        'http://custom-api:3001/tasks',
        { cache: 'no-store' }
      );

      process.env.API_URL = originalEnv;
    });

    it('returns empty array when no tasks exist', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      });

      const result = await getTasks();

      expect(result).toEqual([]);
    });
  });

  describe('createTask', () => {
    it('sends POST request with task title', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
      });

      const formData = new FormData();
      formData.append('title', 'New Task');

      await createTask(formData);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/tasks',
        expect.objectContaining({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: 'New Task' }),
        })
      );
    });

    it('handles special characters in task title', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
      });

      const formData = new FormData();
      formData.append('title', 'Task with "quotes" & special chars');

      await createTask(formData);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/tasks',
        expect.objectContaining({
          body: JSON.stringify({ title: 'Task with "quotes" & special chars' }),
        })
      );
    });
  });

  describe('toggleTask', () => {
    it('sends PATCH request to mark task as complete', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
      });

      await toggleTask(1, true);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/tasks/1',
        expect.objectContaining({
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completed: true }),
        })
      );
    });

    it('sends PATCH request to mark task as incomplete', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
      });

      await toggleTask(2, false);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/tasks/2',
        expect.objectContaining({
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ completed: false }),
        })
      );
    });

    it('handles different task IDs correctly', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
      });

      await toggleTask(42, true);

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/tasks/42',
        expect.any(Object)
      );
    });
  });

  describe('Error Handling', () => {
    it('handles network errors gracefully', async () => {
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );

      await expect(getTasks()).rejects.toThrow();
    });

    it('handles malformed JSON responses', async () => {
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => {
          throw new Error('Invalid JSON');
        },
      });

      await expect(getTasks()).rejects.toThrow();
    });
  });
});
