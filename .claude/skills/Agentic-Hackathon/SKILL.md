```markdown
# Agentic-Hackathon Development Patterns

> Auto-generated skill from repository analysis

## Overview

This skill teaches you the core development patterns, coding conventions, and common workflows used in the Agentic-Hackathon repository. The codebase is primarily Python (backend) and TypeScript/React (frontend), with a focus on modular structure, clear workflow separation, and practical deployment strategies. You'll learn how to contribute features, update deployment configurations, extend backend services, and implement authentication in a manner consistent with the project's established practices.

---

## Coding Conventions

**File Naming**
- Uses camelCase for most files (e.g., `loginPage.tsx`, `authService.py`)
- Test files follow the pattern: `*.test.*` (e.g., `api.test.ts`)

**Import Style**
- Uses relative imports within modules.
  ```python
  # backend/services/user_service.py
  from .models import User
  ```
  ```typescript
  // Frontend/components/Navbar.tsx
  import { apiCall } from '../services/api'
  ```

**Export Style**
- Named exports are preferred.
  ```python
  # backend/services/auth_service.py
  def authenticate_user(...):
      ...
  ```
  ```typescript
  // Frontend/services/api.ts
  export function fetchUserData() { ... }
  ```

**Commit Patterns**
- Commits are mostly freeform, sometimes prefixed with `feat`
- Example: `feat: add user profile page`

---

## Workflows

### Frontend Feature Development

**Trigger:** When adding or updating a user-facing feature in the frontend  
**Command:** `/new-frontend-feature`

1. Create or update one or more files in `Frontend/components/` (e.g., new UI components)
2. Create or update files in `Frontend/pages/` (e.g., new or updated pages)
3. Optionally update `Frontend/services/api.ts` or `Frontend/types.ts` for API calls or type definitions
4. Optionally update `Frontend/index.html` or `Frontend/index.tsx` for app entry changes

**Example:**
```typescript
// Frontend/components/UserCard.tsx
export function UserCard({ user }) {
  return <div>{user.name}</div>
}
```
```typescript
// Frontend/pages/ProfilePage.tsx
import { UserCard } from '../components/UserCard'
```

---

### Deployment Configuration Update

**Trigger:** When changing deployment settings, fixing deployment issues, or adding deployment targets  
**Command:** `/update-deployment-config`

1. Edit or add deployment config files (e.g., `backend/render.yaml`, `Frontend/vercel.json`, `backend/Dockerfile`)
2. Optionally update `.gitignore` or environment/example files
3. Optionally update `backend/requirements.txt` or related backend files

**Example:**
```yaml
# backend/render.yaml
services:
  - type: web
    name: backend
    env: python
    buildCommand: pip install -r requirements.txt
```
```dockerfile
# backend/Dockerfile
FROM python:3.10
COPY . .
RUN pip install -r requirements.txt
CMD ["python", "main.py"]
```

---

### Backend Service or Pipeline Update

**Trigger:** When adding or updating backend business logic or services  
**Command:** `/update-backend-service`

1. Edit one or more files in `backend/services/` or `backend/core/`
2. Optionally update `backend/main.py` or `backend/requirements.txt`
3. Optionally update `backend/models/` or `backend/routers/`

**Example:**
```python
# backend/services/user_service.py
def get_user_by_id(user_id: int):
    ...
```
```python
# backend/routers/user.py
from ..services.user_service import get_user_by_id
```

---

### Authentication Feature Workflow

**Trigger:** When implementing or improving user authentication  
**Command:** `/add-auth-feature`

1. Create or update `Frontend/pages/LoginPage.tsx` and/or `Frontend/pages/SignupPage.tsx`
2. Optionally update `backend/routers/auth.py` or `backend/services/auth_service.py`
3. Optionally update `Frontend/services/api.ts`

**Example:**
```typescript
// Frontend/pages/LoginPage.tsx
import { login } from '../services/api'
```
```python
# backend/routers/auth.py
from ..services.auth_service import authenticate_user
```

---

## Testing Patterns

- Test files follow the pattern `*.test.*` (e.g., `api.test.ts`, `user_service.test.py`)
- Testing framework is not explicitly defined; check for test files in both frontend and backend
- Example test file:
  ```python
  # backend/services/user_service.test.py
  def test_get_user_by_id():
      ...
  ```
  ```typescript
  // Frontend/services/api.test.ts
  test('fetchUserData returns user', () => { ... })
  ```

---

## Commands

| Command                  | Purpose                                                |
|--------------------------|--------------------------------------------------------|
| /new-frontend-feature    | Start a new or update an existing frontend feature     |
| /update-deployment-config| Update deployment configuration files                  |
| /update-backend-service  | Add or modify backend services or pipelines            |
| /add-auth-feature        | Implement or improve authentication features           |
```
