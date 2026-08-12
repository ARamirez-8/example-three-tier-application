'use client';

import { toggleTask } from './actions';

export function TaskCheckbox({
  taskId,
  completed,
}: {
  taskId: number;
  completed: boolean;
}) {
  return (
    <form
      action={async () => {
        await toggleTask(taskId, !completed);
      }}
    >
      <button
        type="submit"
        className={`h-5 w-5 rounded border-2 flex-shrink-0 transition-colors ${
          completed
            ? 'bg-zinc-900 dark:bg-zinc-50 border-zinc-900 dark:border-zinc-50'
            : 'border-zinc-300 dark:border-zinc-600 hover:border-zinc-500'
        }`}
        aria-label={completed ? 'Mark incomplete' : 'Mark complete'}
      >
        {completed && (
          <svg viewBox="0 0 12 12" className="text-white dark:text-zinc-900 w-full h-full p-0.5">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
    </form>
  );
}
