# Agents

## About the project

Nex0 is a SaaS focused on providing brands and enterprises with an AI-accessible knowledge brain.

The knowledge system is based on Markdown files and connections between them, allowing AI agents to access, understand and navigate structured information about a brand, product or enterprise.

The project is built with TypeScript, React, Next.js and Tailwind CSS.

The existing codebase, configuration and design system are the source of truth.

---

# Core Principles

* Understand the existing code before modifying it.
* Prefer simple solutions over sophisticated abstractions.
* Reuse existing components, utilities, types and libraries.
* Preserve the existing architecture.
* Make the smallest change necessary to accomplish the task.
* Do not modify unrelated code.
* Do not introduce patterns only for theoretical architectural purity.
* Prioritize maintainability and readability.
* Follow existing project conventions before applying personal preferences.

---

# Project Architecture

The project intentionally uses a simple structure:

```text
src/
├── app/
│   ├── api/
│   └── ...
├── lib/
├── utils/
└── types/
```

Use directories according to their responsibility:

* `src/app` → Pages, layouts and route-specific UI.
* `src/app/api` → API route handlers.
* `src/lib` → Node.js packages, integrations, SDKs and application infrastructure.
* `src/utils` → Reusable utility functions.
* `src/types` → Shared TypeScript types.

Do not create new architectural directories or restructure the project without explicit approval.

---

# Development Workflow

Always follow this workflow:

## 1. Inspect

Before writing code:

* Inspect the relevant files.
* Understand the existing implementation.
* Identify reusable components.
* Identify existing utilities and types.
* Check how related features are implemented.
* Check existing dependencies and configuration.

Do not start coding based only on assumptions.

## 2. Plan

Create a concise implementation plan before making significant changes.

The plan should identify:

* Files to modify.
* Files to create, if necessary.
* Main implementation steps.
* Potential risks or ambiguities.

For small, obvious changes, keep the plan minimal.

## 3. Build

Implement the planned solution.

During implementation:

* Follow the existing architecture.
* Reuse existing code.
* Keep changes focused.
* Avoid unnecessary refactors.
* Keep TypeScript strongly typed.
* Follow React and Next.js best practices.
* Follow the existing Tailwind design system.

## 4. Verify

After implementation:

* Run the project's linter.
* Run relevant tests.
* Run the build when appropriate.
* Check for TypeScript errors.
* Review the final diff for unintended changes.

Fix issues introduced by your implementation before considering the task complete.

---

# TypeScript

Use strict and idiomatic TypeScript.

Rules:

* Avoid `any`.
* Prefer type inference when obvious.
* Define explicit types for public/shared interfaces and complex data.
* Keep component-local types local.
* Move types to `src/types` only when they are shared.
* Do not duplicate existing types.
* Reuse existing domain types when available.

Prefer:

```ts
type Item = {
  name: string;
  link: string;
};
```

over unnecessarily complex abstractions.

---

# React & Next.js

Follow modern React and Next.js practices.

* Prefer Server Components by default.
* Use Client Components only when required.
* Do not add `"use client"` unnecessarily.
* Prefer `next/link` for internal navigation.
* Prefer `next/image` for images when appropriate.
* Use stable keys.
* Avoid array indexes as keys when a stable identifier exists.
* Avoid unnecessary `useEffect`.
* Avoid unnecessary `useMemo`.
* Avoid unnecessary `useCallback`.
* Avoid derived state when it can be calculated directly.
* Keep components focused and composable.
* Prefer composition over large monolithic components.

Do not introduce state-management libraries unless explicitly approved or clearly required by the project.

---

# Styling & Design

Tailwind CSS is the primary styling system.

Inspect the existing styles before introducing new values.

Reuse existing:

* Colors
* Design tokens
* Typography
* Spacing
* Borders
* Radii
* Animations
* Responsive patterns

Prefer existing theme tokens over hardcoded values.

Do not introduce a separate styling system.

Do not add arbitrary colors when an existing design token can be used.

The UI should feel like part of the same product, not like an independently designed feature.

---

# Prettier & Code Style

All code must follow the project's Prettier configuration.

Maintain:

* Consistent formatting.
* Clean imports.
* Correct indentation.
* Readable JSX.
* Consistent naming.
* No unused imports.
* No unused variables.
* No dead code.

Do not manually fight Prettier.

If a formatter configuration already exists, follow it instead of creating a new one.

---

# Dependencies

Do not install packages without approval.

Before requesting a new dependency:

1. Check whether the project already has an equivalent dependency.
2. Check whether the functionality can reasonably be implemented with existing tools.
3. Explain why the dependency is necessary.
4. Ask for approval before installing it.

Never install a package silently.

---

# Project Structure

Do not alter the project's architecture or directory structure without explicit approval.

Do not:

* Rename architectural directories.
* Move large groups of files.
* Introduce new architectural layers.
* Create duplicate implementations.
* Reorganize the repository for personal preference.

If a structural change appears necessary, explain the reason and ask first.

---

# Environment & Secrets

Never read or expose:

```text
.env
.env.local
.env.prod
```

Environment variables already exist and should be treated as configured.

Never:

* Print secrets.
* Include secrets in source code.
* Commit secrets.
* Expose server-only environment variables to client-side code.
* Ask the user to paste secret values unless absolutely necessary.

Use existing environment variables through the project's established configuration.

---

# Git Restrictions

Do not perform Git operations that modify repository history or staging state.

Never:

* `git add`
* `git commit`
* `git push`
* Create commits.
* Push branches.
* Modify Git history.

You may inspect Git state or diffs when necessary for understanding the current implementation.

---

# Self-Modification

You may inspect `/agents` to understand your operating rules.

Do not modify your own agent instructions automatically.

If you identify an improvement to the agent rules:

1. Explain the proposed improvement.
2. Ask for approval.
3. Only modify `/agents` after explicit approval.

Never silently change your own rules.

---

# Ambiguity

If the requested behavior is ambiguous and different interpretations could produce materially different implementations:

**Ask before implementing.**

Do not guess about:

* Business logic.
* API contracts.
* Data models.
* Authentication behavior.
* Destructive operations.
* Major UI behavior.
* Architectural decisions.

For minor implementation details where the intent is obvious, use reasonable engineering judgment.

---

# Error Handling

Handle errors at system boundaries.

For API endpoints:

* Validate inputs.
* Handle expected failures.
* Return appropriate HTTP status codes.
* Avoid exposing internal implementation details.
* Do not silently swallow errors.

Do not add excessive defensive code where the surrounding architecture already handles the concern.

---

# Security

Treat all external input as untrusted.

Pay particular attention to:

* API endpoints.
* Authentication.
* Authorization.
* User-provided content.
* Markdown content.
* File operations.
* External API responses.
* Database queries.

Never expose secrets or internal server information to clients.

---

# Performance

Prefer simple, efficient implementations.

Avoid premature optimization.

Do not add:

* Memoization without a reason.
* Complex caching.
* Unnecessary client-side rendering.
* Additional network requests.
* Large dependencies.

When performance matters, identify the actual bottleneck before optimizing.

---

# Refactoring

Do not refactor unrelated code while implementing a feature.

A refactor is appropriate when:

* The current code prevents the requested implementation.
* The existing code contains a clear bug affecting the task.
* A small refactor significantly improves correctness or maintainability.

Keep unrelated improvements separate.

---

# Completion Criteria

A task is complete when:

* The requested functionality is implemented.
* The implementation follows the existing architecture.
* TypeScript is valid.
* Lint passes.
* Relevant tests pass.
* The build passes when applicable.
* No unnecessary dependencies were introduced.
* No unrelated files were modified.
* No Git state was modified.
* No secrets were exposed.

At the end, briefly report:

1. What was changed.
2. What was verified.
3. Any remaining issue or limitation.

---

# Engineering Priority

When making decisions, use this priority:

1. Correctness
2. User requirements
3. Existing project conventions
4. Security
5. Type safety
6. Simplicity
7. Maintainability
8. Performance
9. Abstraction

Do not sacrifice correctness or project consistency for theoretical elegance.

---

# Final Rule

Act as an engineer working inside an existing production codebase.

Do not behave like a greenfield project generator.

**Inspect → Plan → Build → Verify.**

Make deliberate changes, keep the architecture simple, and leave the codebase in a cleaner and more maintainable state than you found it.
