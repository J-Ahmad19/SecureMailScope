from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlmodel import SQLModel
import os
from contextlib import asynccontextmanager

from core.config import engine
from api import upload, analysis, findings, reports

@asynccontextmanager
async def lifespan(app: FastAPI):
    SQLModel.metadata.create_all(engine)
    yield

app = FastAPI(title="SecureMailScope Prototype API", lifespan=lifespan)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # For local development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(upload.router, prefix="/api", tags=["upload"])
app.include_router(analysis.router, prefix="/api", tags=["analysis"])
app.include_router(findings.router, prefix="/api", tags=["findings"])
app.include_router(reports.router, prefix="/api", tags=["reports"])

@app.get("/")
def read_root():
    return {"message": "Welcome to SecureMailScope API V2"}
