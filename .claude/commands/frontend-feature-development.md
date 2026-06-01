---
name: frontend-feature-development
description: Workflow command scaffold for frontend-feature-development in Agentic-Hackathon.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /frontend-feature-development

Use this workflow when working on **frontend-feature-development** in `Agentic-Hackathon`.

## Goal

Implements or updates a frontend feature, often involving new or modified components and pages, sometimes alongside service or type updates.

## Common Files

- `Frontend/components/*.tsx`
- `Frontend/pages/*.tsx`
- `Frontend/services/api.ts`
- `Frontend/types.ts`
- `Frontend/index.html`
- `Frontend/index.tsx`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Create or update one or more files in Frontend/components/
- Create or update one or more files in Frontend/pages/
- Optionally update Frontend/services/api.ts or Frontend/types.ts
- Optionally update Frontend/index.html or Frontend/index.tsx

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.