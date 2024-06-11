# Используем официальный образ Python в качестве базового
FROM python:3.9-slim

# Install system dependencies
RUN apt-get update && apt-get install -y build-essential

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем файл requirements.txt в рабочую директорию
COPY requirements.txt ./

# Устанавливаем зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Копируем остальное приложение в рабочую директорию
COPY . .

EXPOSE 5000

CMD ["python", "simple_server.py"]
