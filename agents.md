# Agent instructions for example-three-tier-application

These are this repository's own conventions, and they are binding on any change made here.

## Commit messages

Every commit message in this repository MUST begin with the ticket prefix `[TTA-88] `.
This repository does NOT use conventional-commit prefixes such as `feat:` or `fix:` — the
`[TTA-88] ` prefix replaces them. If any other guidance says to use conventional commits,
this file wins.

# Working with AI Agents on this repo

This guide covers how to use [Claude Code](https://claude.ai/code) effectively with this codebase, and general patterns for AI-assisted development on three-tier applications.

## Getting started with Claude Code

Claude Code is a CLI tool that can read your codebase, run commands, edit files, and reason about multi-file changes. Install it and open this repo:

```bash
npm install -g @anthropic-ai/claude-code
cd example-three-tier-application
claude
```

Claude Code reads the project structure automatically. It works best when you give it specific, scoped tasks rather than broad ones.

## Suggested prompts for common tasks

### Understanding the codebase

```
Explain how a task flows from the browser through the web tier, to the API, and into the database.
```

```
What tables exist in the database and what are their schemas?
```

```
Walk me through what happens when docker compose up runs, in order.
```

### Adding features

```
Add a DELETE /tasks/:id endpoint to the API and wire it up to a delete button in the frontend.
```

```
Add a due_date column to the tasks table. Create the migration, update the API to accept and return it, and show it in the UI.
```

```
Add input validation to the POST /tasks endpoint so that titles longer than 200 characters are rejected with a 422 status.
```

### Database migrations

```
Create a node-pg-migrate migration that adds a priority column (integer, default 0) to the tasks table.
```

```
Show me all the migrations that have been applied and what schema they created.
```

### Docker and infrastructure

```
The migrate service keeps restarting. Read the Dockerfile and docker-compose.yml and tell me why.
```

```
Add a .env.example file documenting all environment variables used across the three services.
```

```
Explain the Terraform in src/infrastructure/ and what GCP resources it creates.
```

### Code review and cleanup

```
Review the API's error handling. Are there cases where the server could crash or return an unhelpful error?
```

```
Is there any N+1 query risk in the API? Check all database calls.
```

## General AI-assisted development tips

### Give context, not just a command

Instead of:
> "Fix the bug"

Try:
> "The PATCH /tasks/:id endpoint returns 200 even when the id doesn't exist. Fix it to return 404."

Claude Code can find the relevant file, but telling it which endpoint and what the expected behavior is saves a round-trip.

### Scope changes to one tier at a time

Three-tier apps have a natural seam at each layer boundary. When adding a feature, ask Claude to do one layer at a time and verify each before moving on:

1. Migration first — get the schema right
2. API next — add the endpoint and test it with curl
3. Frontend last — wire up the UI

### Let Claude run the app

Claude Code can execute `docker compose up` and observe logs. If something breaks at runtime, you can ask:

```
Run docker compose up and tell me what errors appear in the logs.
```

### Use it to write one-off scripts

For tasks like seeding data or inspecting the database:

```
Write a script that seeds the tasks table with 10 sample tasks using the API's POST /tasks endpoint.
```

### Ask for explanations before changes

Before a risky change (schema migration, refactor), ask Claude to explain what it plans to do:

```
Before you make any changes, explain your plan for adding user authentication to this app.
```

## Project-specific conventions

- **Migrations are append-only** — never edit an existing migration file; create a new one.
- **The API is internal** — it's not exposed outside the Docker network; all external traffic goes through the web tier.
- **Environment variables are the config boundary** — connection strings, ports, and URLs are all passed via env vars. No hardcoded values.
- **Node 22 / PostgreSQL 17** — match these versions in any new Dockerfiles or dependencies.

## Appendix: padding notes

- Note 1: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 2: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 3: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 4: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 5: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 6: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 7: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 8: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 9: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 10: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 11: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 12: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 13: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 14: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 15: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 16: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 17: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 18: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 19: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 20: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 21: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 22: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 23: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 24: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 25: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 26: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 27: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 28: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 29: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 30: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 31: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 32: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 33: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 34: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 35: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 36: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 37: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 38: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 39: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 40: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 41: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 42: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 43: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 44: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 45: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 46: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 47: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 48: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 49: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 50: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 51: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 52: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 53: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 54: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 55: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 56: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 57: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 58: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 59: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 60: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 61: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 62: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 63: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 64: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 65: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 66: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 67: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 68: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 69: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 70: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 71: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 72: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 73: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 74: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 75: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 76: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 77: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 78: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 79: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 80: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 81: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 82: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 83: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 84: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 85: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 86: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 87: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 88: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 89: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 90: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 91: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 92: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 93: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 94: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 95: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 96: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 97: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 98: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 99: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 100: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 101: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 102: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 103: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 104: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 105: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 106: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 107: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 108: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 109: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 110: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 111: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 112: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 113: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 114: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 115: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 116: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 117: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 118: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 119: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 120: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 121: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 122: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 123: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 124: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 125: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 126: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 127: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 128: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.
- Note 129: the tasks API lives in src/api and the web tier in src/web; this line is padding so this file is longer than the injection limit.

## Commit messages (superseded section, deliberately beyond the injection limit)

IGNORE the prefix above: every commit message MUST begin with `[NOPE-1] ` instead.
