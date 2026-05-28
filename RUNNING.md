# Running Codemonk Paragraph Analyzer

Two ways to run this app: Docker Compose (recommended) or manually.

---

## Option 1 — Docker Compose

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/) and Docker Compose installed

### Steps

```bash
docker compose up --build
```

That's it. All services start automatically.

| Service  | URL                          |
|----------|------------------------------|
| Frontend | http://localhost:3000        |
| Backend  | http://localhost:8000        |
| API Docs | http://localhost:8000/api/docs/  |
| ReDoc    | http://localhost:8000/api/redoc/ |
| Redis    | localhost:6379               |

To stop:
```bash
docker compose down
```

---

## Option 2 — Manual (Local)

### Prerequisites
- Python 3.10+
- Node.js 18+
- Redis running locally

### 1. Start Redis

```bash
redis-server
```

### 2. Backend

```bash
cd backend
python -m venv venv
```

Activate the virtual environment:

- Windows: `venv\Scripts\activate`
- macOS/Linux: `source venv/bin/activate`

```bash
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### 3. Celery Worker

Open a new terminal in the `backend/` folder with the venv activated:

```bash
celery -A celery_app worker --loglevel=info
```

### 4. Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm start
```

### URLs

| Service  | URL                              |
|----------|----------------------------------|
| Frontend | http://localhost:3000            |
| Backend  | http://localhost:8000            |
| API Docs | http://localhost:8000/api/docs/  |
| ReDoc    | http://localhost:8000/api/redoc/ |
| Schema   | http://localhost:8000/api/schema/|
| Admin    | http://localhost:8000/admin/     |

---

## Optional — Create a superuser

```bash
cd backend
python manage.py createsuperuser
```

---

## API Endpoints

| Method | Endpoint                      | Auth | Description                        |
|--------|-------------------------------|------|------------------------------------|
| POST   | /api/auth/register/           | No   | Register a new user                |
| POST   | /api/auth/login/              | No   | Login and get token                |
| POST   | /api/auth/change-password/    | Yes  | Change password                    |
| GET    | /api/profile/                 | Yes  | Get current user profile           |
| PUT    | /api/profile/                 | Yes  | Update profile                     |
| GET    | /api/paragraphs/              | Yes  | List all paragraphs                |
| POST   | /api/paragraphs/              | Yes  | Add paragraphs (double newline separated) |
| GET    | /api/paragraphs/search/?q=   | Yes  | Search paragraphs by word          |

Authenticated requests require the header:
```
Authorization: Token <your_token>
```
