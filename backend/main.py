from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel
from typing import List, Dict
import pandas as pd
from datetime import datetime
import sqlite3
import os
import logging

# Настройка логирования
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Определяем базовый путь проекта
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")
PUBLIC_DIR = os.path.join(FRONTEND_DIR, "public")
UPLOAD_DIR = os.path.join(BASE_DIR, "upload")

# Создаем директории, если они не существуют
os.makedirs(PUBLIC_DIR, exist_ok=True)
os.makedirs(UPLOAD_DIR, exist_ok=True)

logger.info(f"BASE_DIR: {BASE_DIR}")
logger.info(f"FRONTEND_DIR: {FRONTEND_DIR}")
logger.info(f"PUBLIC_DIR: {PUBLIC_DIR}")
logger.info(f"UPLOAD_DIR: {UPLOAD_DIR}")

app = FastAPI()

# Настройка CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:8000", "http://127.0.0.1:3000", "http://127.0.0.1:8000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Монтируем статические файлы
app.mount("/static", StaticFiles(directory=PUBLIC_DIR), name="static")

# Модель данных
class TicketData(BaseModel):
    department: str
    destination: str
    price: float
    savings: float
    date: str

# Создание базы данных
def init_db():
    conn = sqlite3.connect('tickets.db')
    c = conn.cursor()
    c.execute('''
        CREATE TABLE IF NOT EXISTS tickets
        (id INTEGER PRIMARY KEY AUTOINCREMENT,
         department TEXT,
         destination TEXT,
         price REAL,
         savings REAL,
         date TEXT)
    ''')
    conn.commit()
    conn.close()

# Инициализация базы данных при запуске
init_db()

# Хранилище для данных из optimal_prices_by_route.xlsx
optimal_prices_data = []

# Путь к XLSX файлу
XLSX_PATH = os.path.join(UPLOAD_DIR, "prices.xlsx")

def process_xlsx_data() -> Dict:
    try:
        logger.info(f"Начинаем обработку файла: {XLSX_PATH}")
        
        # Проверяем существование файла
        if not os.path.exists(XLSX_PATH):
            logger.error(f"Файл не найден: {XLSX_PATH}")
            return {
                'totalSpent': 0,
                'totalSaved': 0,
                'departments': {},
                'departmentTotals': {},
                'departmentList': [],
                'employeeTotals': {},
                'departmentFlightsCount': {},
                'routeOptimalDays': [],
                'departmentBookingDays': {}  # Новое поле для хранения данных о времени до вылета
            }
        
        # Читаем XLSX файл
        df = pd.read_excel(XLSX_PATH)
        logger.info(f"Файл успешно прочитан. Колонки: {df.columns.tolist()}")
        
        # Заполняем пропущенные значения в столбце 'Ближайший день к оптимальной цене (0-7)' числом 10
        if 'Ближайший день к оптимальной цене (0-7)' in df.columns:
            df['Ближайший день к оптимальной цене (0-7)'] = df['Ближайший день к оптимальной цене (0-7)'].fillna(10)
        
        # Подсчитываем количество вылетов для каждого маршрута
        route_counts = df.groupby('Маршрут')['Количество вылетов'].sum().to_dict()
        
        # Получаем уникальные значения маршрутов и дней к оптимальной цене
        route_optimal_days = df[['Маршрут', 'Ближайший день к оптимальной цене (0-7)']].drop_duplicates().values.tolist()
        route_optimal_days = [
            {
                'route': route, 
                'optimalDay': int(day),
                'flightCount': int(route_counts.get(route, 0))
            } 
            for route, day in route_optimal_days
        ]
        # Сортируем по количеству вылетов (по убыванию)
        route_optimal_days.sort(key=lambda x: x['flightCount'], reverse=True)
        logger.info(f"Найдено уникальных маршрутов: {len(route_optimal_days)}")
        
        # Преобразуем время в datetime если оно в строковом формате
        if 'Дата и время отправления/заезда' in df.columns:
            df['Дата и время отправления/заезда'] = pd.to_datetime(df['Дата и время отправления/заезда'])
            logger.info("Даты успешно преобразованы")
        
        # Подсчитываем количество полетов для каждого департамента
        dept_flights_count = df.groupby('Департаменты').size().to_dict()
        logger.info(f"Количество полетов по департаментам: {dept_flights_count}")
        
        # Фильтруем департаменты с более чем 10 полетами
        active_departments = [dept for dept, count in dept_flights_count.items() if count > 10]
        logger.info(f"Активные департаменты (более 10 полетов): {active_departments}")
        
        # Группируем данные по департаментам
        departments_data = {}
        total_spent = 0
        total_saved = 0
        dept_totals = {}
        
        # Добавляем обработку данных по сотрудникам
        employees_data = {}
        employee_totals = {}
        
        # Добавляем обработку данных о времени до вылета
        department_booking_days = {}
        
        for dept in active_departments:
            logger.info(f"Обработка департамента: {dept}")
            dept_data = df[df['Департаменты'] == dept]
            flights_count = len(dept_data)
            logger.info(f"Количество полетов для департамента {dept}: {flights_count}")
            
            # Создаем список точек для scatter plot
            scatter_data = []
            dept_spent = 0
            dept_saved = 0
            
            # Обработка данных о времени до вылета
            if 'Время до вылета (дни)' in dept_data.columns:
                avg_booking_days = dept_data['Время до вылета (дни)'].mean()
                department_booking_days[dept] = round(avg_booking_days, 1)
            
            for _, row in dept_data.iterrows():
                try:
                    scatter_data.append({
                        'time': row['Дата и время отправления/заезда'].strftime('%Y-%m-%d %H:%M') if isinstance(row['Дата и время отправления/заезда'], datetime) else str(row['Дата и время отправления/заезда']),
                        'actual_price': float(row['Стоимость']),
                        'optimal_price': float(row['Оптимальная цена по рейсу']),
                        'route': row['Маршрут'],
                        'savings': float(row['Разница между оптимальной ценой и стоимостью']),
                        'employee': row['Сотрудник'] if 'Сотрудник' in row else 'Не указан'
                    })
                    
                    # Обработка данных по сотрудникам
                    employee = row['Сотрудник'] if 'Сотрудник' in row else 'Не указан'
                    if employee not in employee_totals:
                        employee_totals[employee] = {
                            'spent': 0,
                            'saved': 0,
                            'department': dept,
                            'tickets_count': 0
                        }
                    
                    employee_totals[employee]['spent'] += float(row['Стоимость'])
                    employee_totals[employee]['saved'] += float(row['Оптимальная цена по рейсу'])
                    employee_totals[employee]['tickets_count'] += 1
                    
                    dept_spent += float(row['Стоимость'])
                    dept_saved += float(row['Оптимальная цена по рейсу'])
                except Exception as e:
                    logger.error(f"Ошибка при обработке строки: {row.to_dict()}, ошибка: {str(e)}")
                    continue
            
            departments_data[dept] = scatter_data
            dept_totals[dept] = {
                'spent': dept_spent,
                'saved': dept_saved,
                'flights_count': flights_count
            }
            logger.info(f"Данные для департамента {dept}: {dept_totals[dept]}")
            total_spent += dept_spent
            total_saved += dept_saved
        
        # Рассчитываем рейтинг для каждого сотрудника
        for employee in employee_totals:
            totals = employee_totals[employee]
            # Нормализуем показатели от 0 до 1
            max_spent = max(t['spent'] for t in employee_totals.values())
            max_saved = max(t['saved'] for t in employee_totals.values())
            
            # Веса для разных показателей
            weights = {
                'savings_percentage': 0.4,    # Процент экономии
                'savings_amount': 0.3,        # Сумма экономии
                'efficiency': 0.3             # Эффективность расходов
            }
            
            # Расчет процента экономии (0-1)
            savings_percentage = totals['saved'] / totals['spent'] if totals['spent'] > 0 else 0
            
            # Нормализованная сумма экономии (0-1)
            normalized_savings = totals['saved'] / max_saved if max_saved > 0 else 0
            
            # Эффективность расходов (0-1)
            efficiency = 1 - (totals['spent'] / max_spent) if max_spent > 0 else 0
            
            # Итоговый рейтинг
            rating = (
                savings_percentage * weights['savings_percentage'] +
                normalized_savings * weights['savings_amount'] +
                efficiency * weights['efficiency']
            ) * 100
            
            employee_totals[employee]['rating'] = round(rating)
            employee_totals[employee]['details'] = {
                'savings_percentage': round(savings_percentage * 100, 1),
                'normalized_savings': round(normalized_savings * 100, 1),
                'efficiency': round(efficiency * 100, 1)
            }
        
        result = {
            'totalSpent': total_spent,
            'totalSaved': total_saved,
            'departments': departments_data,
            'departmentTotals': dept_totals,
            'departmentList': active_departments,
            'employeeTotals': employee_totals,
            'departmentFlightsCount': dept_flights_count,
            'routeOptimalDays': route_optimal_days,
            'departmentBookingDays': department_booking_days  # Добавляем новые данные в результат
        }
        
        logger.info(f"Обработка завершена. Найдено активных департаментов: {len(active_departments)}")
        logger.info(f"Данные по департаментам: {dept_totals}")
        return result
        
    except Exception as e:
        logger.error(f"Ошибка при обработке XLSX файла: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Ошибка при обработке XLSX файла: {str(e)}")

@app.post("/tickets/")
async def create_ticket(ticket: TicketData):
    conn = sqlite3.connect('tickets.db')
    c = conn.cursor()
    c.execute('''
        INSERT INTO tickets (department, destination, price, savings, date)
        VALUES (?, ?, ?, ?, ?)
    ''', (ticket.department, ticket.destination, ticket.price, ticket.savings, ticket.date))
    conn.commit()
    conn.close()
    return {"message": "Ticket data saved successfully"}

@app.get("/tickets/")
async def get_tickets():
    conn = sqlite3.connect('tickets.db')
    df = pd.read_sql_query("SELECT * FROM tickets", conn)
    conn.close()
    return df.to_dict(orient='records')

@app.get("/export/")
async def export_to_excel():
    conn = sqlite3.connect('tickets.db')
    df = pd.read_sql_query("SELECT * FROM tickets", conn)
    conn.close()
    
    # Создание Excel файла
    filename = f"ticket_savings_{datetime.now().strftime('%Y%m%d_%H%M%S')}.xlsx"
    df.to_excel(filename, index=False)
    
    return {"filename": filename}

@app.post("/upload-xlsx/")
async def upload_xlsx(file: UploadFile = File(...)):
    if not file.filename.endswith('.xlsx'):
        raise HTTPException(status_code=400, detail="Требуется файл формата .xlsx")
    df = pd.read_excel(file.file)
    global optimal_prices_data
    optimal_prices_data = df.to_dict(orient='records')
    return {"message": "Файл успешно загружен и обработан", "rows": len(optimal_prices_data)}

@app.get("/optimal-prices/")
async def get_optimal_prices():
    return optimal_prices_data

@app.get("/")
async def read_root():
    index_path = os.path.join(PUBLIC_DIR, "index.html")
    logger.info(f"Попытка загрузить index.html из: {index_path}")
    if not os.path.exists(index_path):
        logger.error(f"Файл index.html не найден по пути: {index_path}")
        raise HTTPException(status_code=404, detail="index.html не найден")
    return FileResponse(index_path)

@app.get("/api/data")
async def get_data():
    try:
        data = process_xlsx_data()
        return JSONResponse(
            content=data,
            headers={
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            }
        )
    except Exception as e:
        logger.error(f"Ошибка при получении данных: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 