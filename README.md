# Word Finder

This repository contains a Django backend and a React frontend for a paragraph analyzer application.

## Backend

### Setup
1. Create a Python virtual environment inside `backend/`.
2. Install dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
3. Run database migrations:
   ```bash
   python manage.py migrate
   ```
4. Create a superuser (optional):
   ```bash
   python manage.py createsuperuser
   ```
5. Start Redis locally:
   ```bash
   redis-server
   ```
6. Start a Celery worker:
   ```bash
   celery -A backend worker --loglevel=info
   ```
7. Start the backend server:
   ```bash
   python manage.py runserver
   ```

### Celery and Redis

- Celery is configured in `backend/celery_app.py` and loaded from `backend/__init__.py`.
- Redis is used as both the broker and result backend.
- Paragraph creation now dispatches `analyze_paragraph_text` to Celery for background indexing.

### API Endpoints

- `POST /api/auth/register/`
  - Request: `{ email, full_name, date_of_birth, password }`
  - Response: authentication token and user data
- `POST /api/auth/login/`
  - Request: `{ email, password }`
- `POST /api/auth/change-password/`
  - Request: `{ current_password, new_password }`
- `GET /api/profile/`
- `PUT /api/profile/`
  - Request: `{ email, full_name, date_of_birth }`
- `GET /api/paragraphs/`
- `POST /api/paragraphs/`
  - Request: `{ text }` where paragraphs are separated by two newlines
- `GET /api/paragraphs/search/?q=<word>`

## Frontend

### Setup
1. Install dependencies:
   ```bash
   cd frontend
   npm install
   ```
2. Start the frontend:
   ```bash
   npm start
   ```

### Notes
- The frontend expects the backend to run at `http://localhost:8000`.
- React stores auth tokens in `localStorage` and sends them with every API request.
- The paragraph search endpoint returns the top 10 user paragraphs ranked by the number of matches for the requested word.

## Docker Compose

This project can run entirely with Docker Compose:

1. Build and start all services:
   ```bash
   docker compose up --build
   ```

2. The app will be available at:
   - Frontend: `http://localhost:3000`
   - Backend: `http://localhost:8000`
   - Redis: `localhost:6379`

3. Stop the services:
   ```bash
   docker compose down
   ```

### Services
- `backend`: Django app with the REST API
- `celery`: Celery worker that processes paragraph indexing tasks
- `frontend`: React app served by Nginx
- `redis`: Redis broker for Celery
