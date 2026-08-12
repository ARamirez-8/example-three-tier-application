'use client';

import { Task } from './actions';

export default function TaskItem({
  task,
  onToggle,
}: {
  task: Task;
  onToggle: (id: number, completed: boolean) => Promise<void>;
}) {
  return (
    <li className="flex items-center gap-3 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 px-4 py-3">
      {/* 
        This form lives in a client component because it needs to handle
        user interactions (click events) and manage form submission on the client.
        Server actions are invoked from here, but the interactive behavior
        must be in a client component.
      */}
      <form
        action={async () => {
          await onToggle(task.id, !task.completed);
        }}
      >
        <button
          type="submit"
          className={`h-5 w-5 rounded border-2 flex-shrink-0 transition-colors ${
            task.completed
              ? 'bg-zinc-900 dark:bg-zinc-50 border-zinc-900 dark:border-zinc-50'
              : 'border-zinc-300 dark:border-zinc-600 hover:border-zinc-500'
          }`}
          aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
        >
          {task.completed && (
            <svg viewBox="0 0 12 12" className="text-white dark:text-zinc-900 w-full h-full p-0.5">
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </button>
      </form>
      <span
        className={`flex-1 text-sm ${
          task.completed
            ? 'line-through text-zinc-400'
            : 'text-zinc-800 dark:text-zinc-100'
        }`}
      >
        {task.title}
      </span>
    </li>
  );
}
