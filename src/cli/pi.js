#!/usr/bin/env node

import readline from 'readline';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readdirSync, readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '..', '..');

// Command handlers
const commands = {
  todos: handleTodos,
  help: handleHelp,
  exit: handleExit,
};

function handleTodos() {
  console.log('\n📝 Outstanding TODOs in the codebase:\n');
  
  const todos = findTodos(projectRoot);
  
  if (todos.length === 0) {
    console.log('✅ No TODOs found! Great job!\n');
    return;
  }
  
  todos.forEach((todo, index) => {
    console.log(`${index + 1}. ${todo.file}:${todo.line}`);
    console.log(`   ${todo.text}\n`);
  });
  
  console.log(`Total: ${todos.length} TODO(s)\n`);
}

function findTodos(rootPath) {
  const todos = [];
  const extensions = ['.ts', '.tsx', '.js', '.jsx', '.py', '.go', '.java', '.rs', '.tf', '.md'];
  const ignoreDirs = ['.git', 'node_modules', '.next', 'dist', 'build', '.terraform'];
  
  function scanDir(dir) {
    try {
      const entries = readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        if (ignoreDirs.includes(entry.name)) continue;
        
        const fullPath = join(dir, entry.name);
        
        if (entry.isDirectory()) {
          scanDir(fullPath);
        } else if (entry.isFile()) {
          const ext = entry.name.substring(entry.name.lastIndexOf('.'));
          if (extensions.includes(ext)) {
            try {
              const content = readFileSync(fullPath, 'utf-8');
              const lines = content.split('\n');
              
              lines.forEach((line, index) => {
                const match = line.match(/TODO[:\s]+(.*)/i);
                if (match) {
                  const relativePath = fullPath.replace(rootPath + '/', '');
                  todos.push({
                    file: relativePath,
                    line: index + 1,
                    text: match[1].trim(),
                  });
                }
              });
            } catch (e) {
              // Skip files that can't be read
            }
          }
        }
      }
    } catch (e) {
      // Skip directories that can't be read
    }
  }
  
  scanDir(rootPath);
  return todos.sort((a, b) => a.file.localeCompare(b.file));
}

function handleHelp() {
  console.log(`
🚀 Pi Terminal - Available Commands:

  /todos    - Show all outstanding TODOs in the codebase
  /help     - Show this help message
  /exit     - Exit the terminal

Examples:
  > /todos
  > /help
  > /exit
`);
}

function handleExit() {
  console.log('\n👋 Goodbye!\n');
  process.exit(0);
}

function processCommand(input) {
  const trimmed = input.trim();
  
  if (!trimmed.startsWith('/')) {
    console.log('❌ Commands must start with /. Type /help for available commands.\n');
    return;
  }
  
  const [command, ...args] = trimmed.slice(1).split(/\s+/);
  const handler = commands[command];
  
  if (!handler) {
    console.log(`❌ Unknown command: /${command}. Type /help for available commands.\n`);
    return;
  }
  
  handler(...args);
}

function startREPL() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  
  console.log(`
╔════════════════════════════════════════╗
║         🥧 Pi Terminal v0.1.0          ║
║  Type /help for available commands     ║
╚════════════════════════════════════════╝
`);
  
  const prompt = () => {
    rl.question('> ', (input) => {
      if (input.trim()) {
        processCommand(input);
      }
      prompt();
    });
  };
  
  prompt();
}

startREPL();
