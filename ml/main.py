import pandas as pd
import numpy as np
# import seaborn as sns
# import matplotlib.pyplot as plt

from prophet import Prophet
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

# from sklearn.metrics import mean_squared_error, mean_absolute_error

import psycopg2

# plt.style.use('ggplot')
# plt.style.use('fivethrityeight')

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

#test connection
@app.get("/test-db")
def test_db():
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM sales_header")
    count = cursor.fetchone()[0]
    cursor.close()
    conn.close()
    return {"sales_count": count}

#sales forecast
@app.get("/sales")
def sales():
    con = get_connection()
    cursor = con.cursor()
    cursor.execute("SELECT DATE(sale_time) as df, SUM(total_amount) as y FROM sales_header" \
    " GROUP BY DATE(sale_time) ORDER BY DATE(sale_time) ASC")
    result = cursor.fetchall()
    cursor.close()
    con.close()
    return result


#venv\Scripts\activate
#uvicorn main:app --reload --port 8000