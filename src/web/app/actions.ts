'use server';

import { revalidatePath } from 'next/cache';

const API_URL = process.env.API_URL || 'http://localhost:3001';

export type Task = {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
};

function log(level: string, message: string, data?: Record<string, any>) {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level: level.toUpperCase(),
    message,
    ...data,
  };
  console.log(JSON.stringify(logEntry));
}

export async function getTasks(): Promise<Task[]> {
  try {
    log('debug', 'Fetching tasks from API', { url: API_URL });
    const res = await fetch(`${API_URL}/tasks`, { cache: 'no-store' });
    
    if (!res.ok) {
      log('error', 'Failed to fetch tasks', { status: res.status });
      throw new Error('Failed to fetch tasks');
    }
    
    const tasks = await res.json();
    log('info', 'Tasks fetched successfully', { count: tasks.length });
    return tasks;
  } catch (err) {
    log('error', 'Error fetching tasks', { 
      error: err instanceof Error ? err.message : String(err) 
    });
    throw err;
  }
}

export async function createTask(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    log('debug', 'Creating task', { title });
    
    const res = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    
    if (!res.ok) {
      log('error', 'Failed to create task', { status: res.status, title });
      throw new Error('Failed to create task');
    }
    
    const task = await res.json();
    log('info', 'Task created successfully', { id: task.id, title: task.title });
    revalidatePath('/');
  } catch (err) {
    log('error', 'Error creating task', { 
      error: err instanceof Error ? err.message : String(err) 
    });
    throw err;
  }
}

export async function toggleTask(id: number, completed: boolean) {
  try {
    log('debug', 'Toggling task', { id, completed });
    
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    });
    
    if (!res.ok) {
      log('error', 'Failed to toggle task', { status: res.status, id });
      throw new Error('Failed to toggle task');
    }
    
    log('info', 'Task toggled successfully', { id, completed });
    revalidatePath('/');
  } catch (err) {
    log('error', 'Error toggling task', { 
      error: err instanceof Error ? err.message : String(err) 
    });
    throw err;
  }
}
