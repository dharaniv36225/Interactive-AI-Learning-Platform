# AI-Navajeevan

## AI System to Reduce Infant Mortality Rate

AI-Navajeevan is an internship-submission-ready full-stack healthcare innovation prototype. It helps rural care teams identify concerning maternal and newborn patterns early, explain the next action in plain language, coordinate follow-ups and referrals, and view community health trends.

> **Medical safety:** This project is an educational decision-support demonstration. It is not a medical device, does not provide a diagnosis, and must not replace a qualified healthcare professional. The included data, outcomes and case studies are synthetic or simulated.

## What is included

- Premium responsive landing page and rural health worker dashboard
- Maternal risk prediction with confidence, explanation and recommended action
- Infant early-warning prediction with possible risk patterns and urgent escalation
- English, Hindi and Telugu rule-based health assistant (no paid API key)
- Responsible computer-vision/jaundice UI simulation with prominent safeguards
- Mothers/infants queue, alerts, reminders, vaccination status and PHC referral actions
- Print-ready awareness poster
- 1,000+ word research article with references
- Complete AI solution proposal, implementation roadmap and cost estimate
- Demonstration case studies and interactive Recharts analytics
- Light/dark themes, responsive sidebar, loading/error/empty states and animations
- FastAPI REST service, SQLite persistence and reproducible scikit-learn models

## Architecture

```text
frontend/                   React + Vite application
  src/
    api/                    Typed fetch client
    components/             Layout and reusable UI
    data/                   Research, proposal and demo content
    pages/                  All required product experiences
    utils/                  Formatting helpers
    App.jsx                 Route map
    main.jsx                Browser entry point
    index.css               Design system and core styles

backend/                    FastAPI application
  ml_models/                Training/loading service + generated .joblib files
  routes/                   REST route definitions
  database.py               SQLite setup, queries and seed data
  models.py                 Required table definitions
  schemas.py                Pydantic request/response schemas
  chat_service.py           Curated multilingual assistant
  main.py                   FastAPI entry point
```

The unrelated legacy Next.js learning project that was already present in this workspace remains untouched outside these new folders.

## Local setup

### 1. Backend

Python 3.11+ is recommended.

```powershell
cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
Copy-Item .env.example .env
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

The first startup creates `navajeevan.db`, trains two deterministic demo random-forest models on synthetic data, saves them in `backend/ml_models/`, and seeds realistic demonstration records.

API documentation: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### 2. Frontend

In a second terminal:

```powershell
cd frontend
npm install
Copy-Item .env.example .env
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

## REST API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/health` | Service and model readiness |
| POST | `/api/predict/maternal-risk` | Explainable maternal triage |
| POST | `/api/predict/infant-risk` | Newborn early-warning triage |
| POST | `/api/chat` | Curated multilingual guidance |
| GET | `/api/dashboard/stats` | Rural dashboard data |
| GET | `/api/case-studies` | Demonstration cases |
| GET | `/api/research` | Research metadata |
| GET | `/api/proposal` | Proposal summary |
| POST | `/api/reports/save` | Persist an analytics report |

## Verification

```powershell
# Frontend production build
cd frontend
npm run build

# API smoke test (after installing requirements)
cd ..\backend
python -m pytest test_api.py
```

You can also run `python test_api.py` through pytest-compatible tooling or exercise the OpenAPI interface at `/docs`.

## Deployment

### Frontend on Vercel

1. Import the repository in Vercel.
2. Set **Root Directory** to `frontend`.
3. Use build command `npm run build` and output directory `dist`.
4. Add `VITE_API_URL=https://your-render-service.onrender.com/api`.
5. Deploy, then add the final Vercel origin to `FRONTEND_ORIGINS` on Render.

### Backend on Render

1. Create a Python web service with **Root Directory** `backend`.
2. Build command: `pip install -r requirements.txt`.
3. Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`.
4. Set `APP_ENV=production` and `FRONTEND_ORIGINS=https://your-app.vercel.app`.
5. For persistent SQLite data, attach a Render disk and set `DATABASE_PATH` to its mounted path. For a production clinical system, migrate to a managed encrypted database.

## Screenshots

Add final submission captures here after deployment:

| Landing page | Rural dashboard |
| --- | --- |
| `docs/screenshots/landing.png` | `docs/screenshots/dashboard.png` |

| Risk prediction | Awareness poster |
| --- | --- |
| `docs/screenshots/predictor.png` | `docs/screenshots/poster.png` |

## Responsible-AI limitations

- Training data are synthetic and intentionally not valid for clinical use.
- Risk thresholds are demonstration rules informed by common screening patterns, not local clinical protocols.
- Image analysis is simulated because camera-only jaundice screening can be unsafe across lighting and skin tones.
- Any real deployment requires ethics review, consent/lawful basis, privacy controls, prospective validation, calibration, subgroup audits, worker training, incident response and ongoing clinician oversight.

## License and submission note

Created as an AI Innovation Internship Assignment. Use the source for learning and demonstration; do not use it for real patient care.
