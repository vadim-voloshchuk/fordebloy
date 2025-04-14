# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import graph, clustering, generate, storage

app = FastAPI(title="Fordebloy Graph API")

# CORS config
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routers
app.include_router(graph.router, prefix="/graph")
app.include_router(clustering.router, prefix="/graph")
app.include_router(generate.router, prefix="/graph")
app.include_router(storage.router, prefix="/graph")

@app.get("/")
def read_root():
    return {"message": "Fordebloy Graph API is running!"}
