import pandas as pd
import numpy as np

from prophet import Prophet
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

import psycopg2

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_connection():
    return psycopg2.connect(
        host="localhost",
        database="retail",
        user="postgres",
        password="the4736251",
        port=5433,
    )

@app.get("/")
def root():
    return {"status": "AI service running"}

@app.get("/test-db")
def test_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM sales_header")
    count = cursor.fetchone()[0]
    cursor.close()
    conn.close()
    return {"sales_count": count}
