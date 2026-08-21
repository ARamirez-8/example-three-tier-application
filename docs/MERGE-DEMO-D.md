# Merge Demo D

- Demonstrates a three-tier web architecture: Next.js frontend, Express REST API, and PostgreSQL database.
- Runs the full stack locally with a single `docker compose up --build` command.
- Manages schema changes through versioned node-pg-migrate migrations in `src/db/`.
- Deploys to Google Cloud Platform (Cloud Run + Cloud SQL) using Terraform in `src/infrastructure/`.
- Serves as a reference implementation for building and deploying containerised three-tier applications.
