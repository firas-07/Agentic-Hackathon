```markdown
# Agentic-Hackathon Development Patterns

> Auto-generated skill from repository analysis

## Overview
This skill teaches you the core development patterns and workflows used in the Agentic-Hackathon repository, a Python-based project with a frontend (TypeScript/React) and backend (Python). You'll learn the project's coding conventions, how to update deployment configurations, manage authentication pages, update backend services and pipelines, and maintain frontend components. This guide also covers testing patterns and provides handy command shortcuts for common tasks.

## Coding Conventions

- **File Naming:**  
  Uses camelCase for files (e.g., `pipelineCore.py`, `LoginPage.tsx`).

- **Import Style:**  
  Python code uses relative imports.  
  **Example:**
  ```python
  from .services import agent
  from .core import pipeline
  ```

- **Export Style:**  
  Named exports are used in both Python and TypeScript.  
  **Python Example:**
  ```python
  def process_data(...):
      ...
  ```
  **TypeScript Example:**
  ```typescript
  export function Sidebar(props) { ... }
  ```

- **Commit Messages:**  
  - Freeform, often prefixed with `feat`
  - Average length: ~40 characters  
  **Example:**  
  ```
  feat: add knowledge base service
  ```

## Workflows

### Deployment Configuration Update
**Trigger:** When you need to add, update, or fix deployment settings (e.g., Render, Vercel, Docker).  
**Command:** `/update-deployment-config`

1. Edit deployment configuration files (e.g., `backend/render.yaml`, `Frontend/vercel.json`, `backend/Dockerfile`).
2. Optionally update environment files (`backend/.env.example`, `backend/.python-version`).
3. Optionally update `backend/requirements.txt` if dependencies change.
4. Commit all related files together.

**Example:**
```yaml
# backend/render.yaml
services:
  - type: web
    name: agentic-backend
    env: python
    ...
```

### Frontend Auth Pages Workflow
**Trigger:** When implementing or modifying user authentication (login/signup) in the frontend.  
**Command:** `/add-auth-pages`

1. Create or update `LoginPage.tsx` and `SignupPage.tsx` in `Frontend/pages/`.
2. Optionally update `Sidebar.tsx` or `LandingPage.tsx` to reflect authentication state.
3. Commit all related frontend files together.

**Example:**
```typescript
// Frontend/pages/LoginPage.tsx
export function LoginPage() {
  return <form>...</form>;
}
```

### Backend Service and Pipeline Update
**Trigger:** When adding or modifying backend processing logic or services.  
**Command:** `/update-backend-service`

1. Edit `backend/core/pipeline.py` and/or files in `backend/services/` (e.g., `agent.py`, `knowledge_base.py`).
2. Optionally update `backend/main.py` or `backend/requirements.txt`.
3. Commit all related backend files together.

**Example:**
```python
# backend/services/agent.py
def run_agent_task(...):
    ...
```

### Frontend Component Update
**Trigger:** When implementing or improving a UI feature in the frontend.  
**Command:** `/update-frontend-component`

1. Edit or create component files in `Frontend/components/` (e.g., `Sidebar.tsx`, `ChatArea.tsx`).
2. Optionally update related page files in `Frontend/pages/`.
3. Commit all related frontend files together.

**Example:**
```typescript
// Frontend/components/Sidebar.tsx
export function Sidebar(props) {
  return <nav>...</nav>;
}
```

## Testing Patterns

- **Framework:** Unknown (not detected).
- **File Pattern:** Test files follow the `*.test.*` naming convention.
- **Example:**
  ```
  backend/services/agent.test.py
  Frontend/components/Sidebar.test.tsx
  ```

## Commands

| Command                     | Purpose                                                      |
|-----------------------------|--------------------------------------------------------------|
| /update-deployment-config   | Update or fix deployment configuration files                  |
| /add-auth-pages             | Add or update authentication-related frontend pages           |
| /update-backend-service     | Update backend core logic, services, or pipelines            |
| /update-frontend-component  | Add or update major frontend components                      |
```
