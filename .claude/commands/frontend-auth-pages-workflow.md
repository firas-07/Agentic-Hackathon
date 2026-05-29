---
name: frontend-auth-pages-workflow
description: Workflow command scaffold for frontend-auth-pages-workflow in Agentic-Hackathon.
allowed_tools: ["Bash", "Read", "Write", "Grep", "Glob"]
---

# /frontend-auth-pages-workflow

Use this workflow when working on **frontend-auth-pages-workflow** in `Agentic-Hackathon`.

## Goal

Add or update authentication-related pages and logic in the frontend.

## Common Files

- `Frontend/pages/LoginPage.tsx`
- `Frontend/pages/SignupPage.tsx`
- `Frontend/pages/LandingPage.tsx`
- `Frontend/components/Sidebar.tsx`

## Suggested Sequence

1. Understand the current state and failure mode before editing.
2. Make the smallest coherent change that satisfies the workflow goal.
3. Run the most relevant verification for touched files.
4. Summarize what changed and what still needs review.

## Typical Commit Signals

- Create or update LoginPage.tsx and SignupPage.tsx in Frontend/pages.
- Optionally update Sidebar or LandingPage to reflect authentication state.
- Commit all related frontend files together.

## Notes

- Treat this as a scaffold, not a hard-coded script.
- Update the command if the workflow evolves materially.