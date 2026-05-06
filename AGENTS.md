# AGENTS.md

AI coding agents must use this file as the repository-level workflow contract for `my-api-project`.

## Project Profile

- This is an Express 5 REST API backend for the MG Motor portfolio project.
- The stack is Node.js, CommonJS, Sequelize 6, MySQL 8, JWT auth, bcryptjs, Nodemailer, and dotenv.
- The backend is part of a Supabase-deployed portfolio workflow; do not change deployment settings unless an issue explicitly asks for it.
- Use `npm` as the package manager.

## Work Style

- Keep tasks small, issue-driven, and limited to the requested scope.
- Read the relevant issue, existing code, and local conventions before editing.
- Prefer the existing project structure and CommonJS style.
- Do not create broad refactors while completing a narrow issue.
- Do not create extra markdown files unless the user or issue explicitly requests them.
- Do not add `WORKFLOW.md`, `TODO.md`, `PROJECT_BRIEF.md`, `ARCHITECTURE.md`, `NOTES.md`, or similar files unless explicitly requested.

## Branch Strategy

- `main`: stable default branch.
- `feature/*`: new product or API behavior.
- `fix/*`: bug fixes and regressions.
- `docs/*`: documentation-only changes.

Use the branch type that matches the issue. Documentation-only work should use `docs/*`.

## Commands

- `npm start`: run the server with `node index.js`.
- `npm run db:setup`: initialize the database.
- `npm run db:seed`: load seed data.
- `npm test`: run Jest tests.

Do not switch package managers or introduce lockfiles from another package manager.

## Backend Rules

- Use Sequelize ORM for database access. Do not add raw SQL queries in application code.
- Do not change database schema, migrations, seed data, or setup scripts unless the issue explicitly asks for schema/data work.
- Keep route, controller, model, and middleware changes scoped to the requested API behavior.
- Preserve the API response format:

```js
res.json({ success: true, data: result });
res.status(400).json({ success: false, message: "error message" });
res.status(500).json({ success: false, message: "internal server error" });
```

- Protect authenticated endpoints with `check-auth` when auth is required.
- Do not expose stack traces, SQL statements, secrets, or internal error details in API responses.
- Do not hardcode database passwords, JWT secrets, email credentials, or other sensitive values.
- Use environment variables through `dotenv` for configuration.
- Do not use `sequelize.sync({ force: true })` in production paths.

## Documentation-Only Tasks

For documentation issues:

- Modify only the requested documentation file.
- Do not change application code, routes, controllers, models, migrations, seeders, database schema, deployment config, or `package.json`.
- Check the diff before committing to confirm only the intended file changed.

## Validation

Before finishing:

- Run the most relevant lightweight check for the task.
- For docs-only changes, inspect `git diff -- AGENTS.md`.
- Confirm `git status --short` only includes intended files for the branch or stage only the intended files.
