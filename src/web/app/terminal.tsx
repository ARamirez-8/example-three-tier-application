'use client';

import { useState, useRef, useEffect } from 'react';

type Todo = {
  file: string;
  line: number;
  text: string;
};

export default function Terminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [output, setOutput] = useState<string[]>([]);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  // Open terminal with Cmd+K or Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(!isOpen);
        if (!isOpen) {
          setTimeout(() => inputRef.current?.focus(), 0);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Auto-scroll to bottom
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [output]);

  const fetchTodos = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/todos');
      const data = await res.json();
      setTodos(data);
      if (data.length === 0) {
        setOutput((prev) => [...prev, '> /todos', 'No TODOs found in the codebase.']);
      } else {
        setOutput((prev) => [
          ...prev,
          '> /todos',
          `Found ${data.length} TODO(s):`,
          '',
          ...data.map((todo) => `${todo.file}:${todo.line} — ${todo.text}`),
        ]);
      }
    } catch (error) {
      setOutput((prev) => [...prev, '> /todos', 'Error fetching TODOs']);
    } finally {
      setLoading(false);
    }
  };

  const handleCommand = (cmd: string) => {
    const trimmed = cmd.trim();

    if (trimmed === '/todos') {
      fetchTodos();
    } else if (trimmed === '/help') {
      setOutput((prev) => [
        ...prev,
        '> /help',
        'Available commands:',
        '  /todos — Show all outstanding TODOs in the codebase',
        '  /help — Show this help message',
        '  /clear — Clear the terminal',
      ]);
    } else if (trimmed === '/clear') {
      setOutput([]);
    } else if (trimmed === '') {
      // Do nothing for empty input
    } else {
      setOutput((prev) => [...prev, `> ${trimmed}`, 'Unknown command. Type /help for available commands.']);
    }

    setInput('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommand(input);
    }
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => {
          setIsOpen(true);
          setTimeout(() => inputRef.current?.focus(), 0);
        }}
        className="fixed bottom-4 right-4 rounded-lg bg-zinc-900 dark:bg-zinc-50 px-4 py-2 text-sm font-medium text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 transition-colors"
        title="Open terminal (Cmd+K or Ctrl+K)"
      >
        Terminal
      </button>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-end z-50">
      <div className="w-full max-w-2xl bg-zinc-900 dark:bg-zinc-950 rounded-t-lg shadow-2xl flex flex-col h-96">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-zinc-700 px-4 py-3">
          <h2 className="text-sm font-semibold text-zinc-50">Terminal</h2>
          <button
            onClick={() => setIsOpen(false)}
            className="text-zinc-400 hover:text-zinc-50 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Output */}
        <div
          ref={outputRef}
          className="flex-1 overflow-y-auto px-4 py-3 font-mono text-sm text-zinc-300 space-y-1"
        >
          {output.length === 0 && (
            <div className="text-zinc-500">
              <div>Welcome to the terminal. Type /help for available commands.</div>
              <div>Press Cmd+K (or Ctrl+K) to close.</div>
            </div>
          )}
          {output.map((line, i) => (
            <div key={i} className={line.startsWith('>') ? 'text-zinc-100' : ''}>
              {line}
            </div>
          ))}
          {loading && <div className="text-zinc-400">Loading...</div>}
        </div>

        {/* Input */}
        <div className="border-t border-zinc-700 px-4 py-3 flex items-center gap-2">
          <span className="text-zinc-400">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a command..."
            className="flex-1 bg-transparent text-zinc-50 placeholder-zinc-500 focus:outline-none"
            autoFocus
          />
        </div>
      </div>
    </div>
  );
}
