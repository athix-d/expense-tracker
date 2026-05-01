from fastapi import FastAPI
from pydantic import BaseModel
import sqlite3
from datetime import datetime

app = FastAPI()

conn = sqlite3.connect("expenses.db", check_same_thread=False)
cursor = conn.cursor()

cursor.execute("""
CREATE TABLE IF NOT EXISTS expenses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    amount REAL,
    category TEXT,
    created_at TEXT
)
""")
conn.commit()

class Expense(BaseModel):
    amount: float
    category: str

@app.post("/expenses")
def add_expense(expense: Expense):
    cursor.execute(
        "INSERT INTO expenses (amount, category, created_at) VALUES (?, ?, ?)",
        (expense.amount, expense.category, datetime.now().isoformat())
    )
    conn.commit()
    return {"message": "Expense added"}

@app.get("/expenses")
def get_expenses():
    cursor.execute("SELECT * FROM expenses ORDER BY created_at DESC")
    return cursor.fetchall()

@app.delete("/expenses/{id}")
def delete_expense(id: int):
    cursor.execute("DELETE FROM expenses WHERE id=?", (id,))
    conn.commit()
    return {"message": "Deleted"}

@app.get("/summary")
def monthly_summary():
    cursor.execute("""
        SELECT category, SUM(amount)
        FROM expenses
        WHERE strftime('%Y-%m', created_at) = strftime('%Y-%m', 'now')
        GROUP BY category
    """)
    return cursor.fetchall()