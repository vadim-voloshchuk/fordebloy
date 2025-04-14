from fastapi import APIRouter, HTTPException
from models.graph_models import GraphAlgorithmRequest
import os, json, uuid

router = APIRouter()

STORAGE_DIR = "storage"
os.makedirs(STORAGE_DIR, exist_ok=True)

# Сохраняем граф в файл
@router.post("/save")
def save_graph(data: GraphAlgorithmRequest):
    graph_id = str(uuid.uuid4())  # Генерируем уникальный идентификатор для графа
    path = os.path.join(STORAGE_DIR, f"{graph_id}.json")  # Путь для сохранения

    with open(path, "w", encoding="utf-8") as f:
        json.dump(data.dict(), f, ensure_ascii=False, indent=2)  # Сохраняем граф в JSON

    return {"graph_id": graph_id, "message": "Graph saved successfully."}

# Загружаем граф по ID
@router.get("/load/{graph_id}")
def load_graph(graph_id: str):
    path = os.path.join(STORAGE_DIR, f"{graph_id}.json")
    if not os.path.exists(path):  # Проверяем, существует ли файл
        raise HTTPException(status_code=404, detail="Graph not found")

    with open(path, "r", encoding="utf-8") as f:
        graph_data = json.load(f)  # Читаем данные из файла

    print(graph_data)
    return graph_data

# Получаем список всех графов
@router.get("/list")
def list_graphs():
    try:
        # Сканируем директорию и получаем список файлов с расширением .json
        graph_files = [f for f in os.listdir(STORAGE_DIR) if f.endswith(".json")]
        # Извлекаем только имена графов (без расширения)
        graph_ids = [os.path.splitext(f)[0] for f in graph_files]
        return {"graph_ids": graph_ids}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving graphs: {str(e)}")
