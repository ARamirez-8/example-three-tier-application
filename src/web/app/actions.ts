'use server';

import { revalidatePath } from 'next/cache';

const API_URL = process.env.API_URL || 'http://localhost:3001';

export type Task = {
  id: number;
  title: string;
  completed: boolean;
  created_at: string;
};

export async function getTasks(): Promise<Task[]> {
  try {
    console.log('[DEBUG] Fetching tasks from API');
    const res = await fetch(`${API_URL}/tasks`, { cache: 'no-store' });
    if (!res.ok) {
      console.error(`[ERROR] Failed to fetch tasks: ${res.status} ${res.statusText}`);
      throw new Error(`Failed to fetch tasks: ${res.status}`);
    }
    const tasks = await res.json();
    console.log(`[DEBUG] Successfully fetched ${tasks.length} tasks`);
    return tasks;
  } catch (err) {
    console.error('[ERROR] getTasks error:', err instanceof Error ? err.message : String(err));
    throw err;
  }
}

export async function createTask(formData: FormData) {
  try {
    const title = formData.get('title') as string;
    console.log(`[DEBUG] Creating task with title: "${title}"`);
    const res = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (!res.ok) {
      console.error(`[ERROR] Failed to create task: ${res.status} ${res.statusText}`);
      throw new Error(`Failed to create task: ${res.status}`);
    }
    const task = await res.json();
    console.log(`[DEBUG] Task created successfully with id: ${task.id}`);
    revalidatePath('/');
  } catch (err) {
    console.error('[ERROR] createTask error:', err instanceof Error ? err.message : String(err));
    throw err;
  }
}

export async function toggleTask(id: number, completed: boolean) {
  try {
    console.log(`[DEBUG] Toggling task ${id} to completed=${completed}`);
    const res = await fetch(`${API_URL}/tasks/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed }),
    });
    if (!res.ok) {
      console.error(`[ERROR] Failed to toggle task ${id}: ${res.status} ${res.statusText}`);
      throw new Error(`Failed to toggle task: ${res.status}`);
    }
    console.log(`[DEBUG] Task ${id} toggled successfully`);
    revalidatePath('/');
  } catch (err) {
    console.error('[ERROR] toggleTask error:', err instanceof Error ? err.message : String(err));
    throw err;
  }
}
