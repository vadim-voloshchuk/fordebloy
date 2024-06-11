# Используем официальный образ Python в качестве базового
FROM python:3.9-slim

# Устанавливаем переменную окружения для предотвращения буферизации stdout и stderr
ENV PYTHONUNBUFFERED=1

# Устанавливаем рабочую директорию внутри контейнера
WORKDIR /app

# Копируем файл requirements.txt в рабочую директорию
COPY requirements.txt ./

# Устанавливаем зависимости
RUN pip install --no-cache-dir -r requirements.txt

# Копируем остальное приложение в рабочую директорию
COPY . .

ENV FLASK_APP=app.py  # замените 'main_log.py' на имя вашего основного файла Flask приложения

# Открываем порт 5000 для доступа к приложению
EXPOSE 5000

# Команда для запуска приложения
CMD ["flask", "run", "--host=0.0.0.0"]
