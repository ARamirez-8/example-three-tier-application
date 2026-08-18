# Pi Terminal

A simple CLI tool for the example-three-tier-application that provides a REPL with slash commands for common development tasks.

## Usage

Start the Pi Terminal:

```bash
npm run pi
```

## Available Commands

- `/todos` - Display all outstanding TODOs in the codebase
- `/help` - Show available commands
- `/exit` - Exit the terminal

## Examples

```
> /todos
📝 Outstanding TODOs in the codebase:

1. src/api/index.js:25
   Add input validation for title length

2. src/api/index.js:45
   Add error handling for database update failures

Total: 2 TODO(s)

> /help
🚀 Pi Terminal - Available Commands:

  /todos    - Show all outstanding TODOs in the codebase
  /help     - Show this help message
  /exit     - Exit the terminal

> /exit
👋 Goodbye!
```

## How it works

The Pi Terminal scans the codebase for TODO comments in the following file types:
- TypeScript (.ts, .tsx)
- JavaScript (.js, .jsx)
- Python (.py)
- Go (.go)
- Java (.java)
- Rust (.rs)
- Terraform (.tf)
- Markdown (.md)

It ignores common directories like `.git`, `node_modules`, `.next`, `dist`, `build`, and `.terraform`.

## Adding new commands

To add a new slash command, add a handler function to the `commands` object in `src/cli/pi.js`:

```javascript
const commands = {
  todos: handleTodos,
  help: handleHelp,
  exit: handleExit,
  mycommand: handleMyCommand, // Add your command here
};

function handleMyCommand() {
  console.log('My command output');
}
```
