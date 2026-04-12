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

def getConnection():
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
def testDb():
    conn = getConnection()
    cursor = conn.cursor()
    cursor.execute("SELECT COUNT(*) FROM sales_header")
    count = cursor.fetchone()[0]
    cursor.close()
    conn.close()
    return {"sales_count": count}

#sales forecast
def sales():
    con = getConnection()
    cursor = con.cursor()
    cursor.execute("""SELECT DATE(sale_time) as df, SUM(total_amount) as y FROM sales_header
    GROUP BY DATE(sale_time) ORDER BY DATE(sale_time) ASC""")
    result = cursor.fetchall()
    cursor.close()
    con.close()
    return result

@app.get("/sales")
def forecastSales(days: int = 7):
    try:
        result = sales()
        df = pd.DataFrame(result, columns=["ds", "y"])
        df["ds"] = pd.to_datetime(df["ds"])
        df["y"] = df["y"].astype(float)

        model = Prophet()
        model.fit(df)
        
        future = model.make_future_dataframe(periods = days)
        forecast = model.predict(future)

        result_df = forecast[['ds', 'yhat', 'yhat_lower', 'yhat_upper']].tail(days) 
        
        result = []
        for _, row in result_df.iterrows():
            result.append({
                "date": row["ds"].strftime("%Y-%m-%d"),
                "predicted_sales": round(float(row["yhat"]), 2),
                "lower_bound": round(float(row["yhat_lower"]), 2),
                "upper_bound": round(float(row["yhat_upper"]), 2),
            })

        return {"forecast": result}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



#venv\Scripts\activate
#uvicorn main:app --reload --port 8000