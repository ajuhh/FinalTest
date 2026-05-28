# Word Finder — Code Documentation

## Architecture

```
React (3000) ──► Django (8000) ──► Redis (6379) ──► Celery Worker
```

---

## Backend

### Models (`api/models.py`)

**`User`** — Custom user model using email as login identifier.

| Field | Type | Notes |
|-------|------|-------|
| `email` | EmailField | Unique, login field |
| `full_name` | CharField | Required |
| `date_of_birth` | DateField | Optional |
| `date_joined` / `updated_at` | DateTimeField | Auto-managed |

**`Paragraph`** — A single paragraph owned by a user.

| Field | Type | Notes |
|-------|------|-------|
| `user` | ForeignKey | Cascades on delete |
| `text` | TextField | Raw paragraph content |
| `analysis_results` | JSONField | Word frequency dict, set by Celery |
| `processed_at` | DateTimeField | Timestamp of last analysis |

Key methods:
- `tokens` — splits text by whitespace, lowercased
- `count_word(word)` — count of word in tokens
- `word_frequencies()` — returns `{word: count}` dict
- `update_analysis()` — runs word_frequencies and saves to `analysis_results`
- `create_from_text(user, raw_text)` — splits on `\n\n`, creates one Paragraph per block

---

### Serializers (`api/serializers.py`)

| Serializer | Purpose |
|-----------|---------|
| `UserSerializer` | Read/update user profile |
| `RegisterSerializer` | Registration input, hashes password |
| `LoginSerializer` | Login input validation |
| `ParagraphSerializer` | Paragraph output with computed `word_count` |
| `ParagraphSearchSerializer` | Extends above, adds `count` (query match count) |

---

### Views & Endpoints (`api/views.py`)

| Method | URL | Auth | Description |
|--------|-----|------|-------------|
| POST | `/api/auth/register/` | No | Create user, returns token |
| POST | `/api/auth/login/` | No | Returns token |
| POST | `/api/auth/change-password/` | Yes | Change password |
| GET | `/api/profile/` | Yes | Get user profile |
| PUT | `/api/profile/` | Yes | Update profile |
| GET | `/api/paragraphs/` | Yes | List user's paragraphs |
| POST | `/api/paragraphs/` | Yes | Add paragraphs, triggers Celery task |
| GET | `/api/paragraphs/search/?q=` | Yes | Search by word, top 10 by match count |
| GET | `/api/docs/` | No | Swagger UI |
| GET | `/api/redoc/` | No | ReDoc |
| GET | `/api/schema/` | No | OpenAPI schema |

**Search ranking:** scores each paragraph with `count_word(q)`, filters zeros, sorts by `(-count, -created_at)`, returns top 10.

---

### Celery Task (`api/tasks.py`)

**`analyze_paragraph_text(paragraph_id)`**  
Fetches the paragraph, runs `update_analysis()`, saves word frequencies to `analysis_results`. Triggered via `.delay()` after each paragraph is created.

> `analysis_results` is stored but not currently used by any endpoint or the frontend.

---

## Frontend

### API Client (`src/api.js`)

Axios instance with `baseURL: http://localhost:8000/api/`. Request interceptor reads `codemonk_token` from localStorage and attaches `Authorization: Token <token>` to every request.

---

### App (`src/App.js`)

Owns all global state. Passes data and handlers down as props.

| State | Description |
|-------|-------------|
| `user` | Authenticated user, initialized from localStorage |
| `paragraphs` | All user paragraphs |
| `searchResults` | Results from last search |

`stats` (memoized from `paragraphs`): `totalParagraphs`, `totalWords`, `uniqueWords`.

On load: if `codemonk_token` exists in localStorage, fetches profile and paragraphs. If profile fetch fails, calls `logout()`.

---

### Components

| Component | Props | Description |
|-----------|-------|-------------|
| `Navbar` | `user, onLogout` | Nav links + user avatar/logout when logged in |
| `LandingPage` | — | Hero section with Get Started CTA |
| `AuthPage` | `mode, onSubmit` | Handles both login and register forms |
| `Dashboard` | `user, stats, paragraphs` | Banner, 3 stat cards, recent paragraphs, profile summary |
| `AddParagraphsPage` | `onSubmit` | Textarea form, submits raw text |
| `SearchPage` | `onSearch, results` | Search input + ranked results list |
| `ProfilePage` | `user, onUpdate, onPasswordChange` | View profile, update form, change password form |

---

## Auth Flow

1. Register/login → backend returns token
2. Token saved to `localStorage` as `codemonk_token`
3. Axios interceptor attaches it to every request
4. Logout → token removed, state cleared
