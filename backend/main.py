import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

configured_origins = os.getenv("FRONTEND_URLS") or os.getenv("FRONTEND_URL")
allowed_origins = [
    origin.strip()
    for origin in (configured_origins or "http://localhost:3000,http://127.0.0.1:3000").split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "Backend running"}

@app.get("/health")
def health():
    return {"status": "healthy"}