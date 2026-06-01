---
name: deployment-configuration-update
description: Workflow command scaffold for deployment-configuration-update in Agentic-Hackathon.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /deployment-configuration-update

Use this workflow when working on **deployment-configuration-update** in `Agentic-Hackathon`.

## Goal

Updates deployment-related configuration files to support new environments, fix deployment issues, or add deployment targets.

## Common Files

- `backend/render.yaml`
- `Frontend/vercel.json`
- `backend/vercel.json`
- `backend/Dockerfile`
- `.gitignore`
- `backend/.env.example`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Edit or add deployment config files (e.g., backend/render.yaml, Frontend/vercel.json, backend/vercel.json, backend/Dockerfile)
- Optionally update .gitignore or environment/example files
- Optionally update backend/requirements.txt or related backend files

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.