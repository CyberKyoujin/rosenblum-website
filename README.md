# Rosenblum - Translation Bureau Website

Full-stack web application for a professional translation bureau based in Germany. Includes a client-facing website, admin panel, and REST API.

[![codecov](https://codecov.io/gh/CyberKyoujin/rosenblum-website/graph/badge.svg?token=UHMLZUFA8H)](https://codecov.io/gh/CyberKyoujin/rosenblum-website)

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Frontend** | React 18, TypeScript, Vite, MUI, Zustand, i18next (DE/RU/UA) |
| **Admin Panel** | React 18, TypeScript, Vite, MUI + Joy UI, MUI X-Charts |
| **Backend** | Django 5, Django REST Framework, PostgreSQL 16, JWT Auth |
| **Infrastructure** | Docker Compose, Nginx, Gunicorn |
| **CI/CD** | GitHub Actions, Codecov |
| **External APIs** | Google OAuth2, Google Cloud Storage, Gemini AI, DeepL, Google Places |

## Project Structure

```
rosenblum-website/
├── backend/              # Django REST API
├── frontend/             # Client-facing React app
├── frontend-admin/       # Admin panel React app
├── nginx/                # Nginx reverse proxy config
├── docker-compose.yml
└── .github/workflows/    # CI/CD pipeline
```

## Getting Started

### Prerequisites

- Docker & Docker Compose
- Node.js 20+
- Python 3.11+

### Local Development (Docker)

```bash
# Clone the repository
git clone <repo-url>
cd rosenblum-website

# Create .env file (see .env.example)
cp .env.example .env

# Start all services
docker compose up -d --build

# Run migrations
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py collectstatic --noinput
```

The app will be available at `http://localhost`.

### Local Development (Without Docker)

**Backend:**
```bash
cd backend/backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

**Frontend:**
```bash
cd frontend/frontend
npm ci
npm run dev
```

**Admin Panel:**
```bash
cd frontend-admin/frontend-admin
npm ci
npm run dev
```

## Testing

**Backend:**
```bash
cd backend/backend
pytest
```

**Frontend (Unit Tests):**
```bash
cd frontend/frontend
npm run test
```

**Frontend (E2E Tests):**
```bash
cd frontend/frontend
npx playwright test
```

## CI/CD Pipeline

The GitHub Actions pipeline runs 4 parallel jobs on every push/PR to `master`:

1. **Backend Tests** - Django unit tests with PostgreSQL
2. **Frontend Unit Tests** - Vitest for both frontends
3. **E2E Mocked Tests** - Playwright with mocked API
4. **E2E Integration Tests** - Playwright with real backend

On successful completion, the `deploy` job deploys to Hetzner via SSH.

## Deployment

Production deployment is automated via GitHub Actions to a Hetzner server using Docker Compose with Nginx as a reverse proxy.