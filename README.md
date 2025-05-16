# AviaSaved Analytics

Проект для анализа и обработки данных авиабилетов.

## Описание

Этот проект представляет собой веб-приложение для анализа данных авиабилетов. Он состоит из двух основных компонентов:
- Backend (FastAPI)
- Frontend (React)

## Требования

- Python 3.8+
- Node.js 14+
- npm или yarn

## Установка

### Backend

1. Создайте виртуальное окружение:
```bash
python -m venv venv
source venv/bin/activate  # для Linux/Mac
venv\Scripts\activate     # для Windows
```

2. Установите зависимости:
```bash
pip install -r requirements.txt
```

3. Запустите сервер:
```bash
cd backend
uvicorn main:app --reload
```

### Frontend

1. Установите зависимости:
```bash
cd frontend
npm install
```

2. Запустите приложение:
```bash
npm start
```

## Использование

1. Запустите backend и frontend серверы
2. Откройте браузер и перейдите по адресу `http://localhost:3000`
3. Загрузите файл с данными авиабилетов через веб-интерфейс
4. Просматривайте и анализируйте данные

## Структура проекта

```
├── backend/           # FastAPI backend
├── frontend/         # React frontend
├── upload/           # Директория для загруженных файлов
├── requirements.txt  # Python зависимости
└── README.md        # Документация проекта
```

## Лицензия

MIT 