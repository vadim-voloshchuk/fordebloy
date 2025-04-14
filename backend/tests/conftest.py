import sys
import os
import pytest

# Добавляем backend в sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from main import app
from fastapi.testclient import TestClient

@pytest.fixture
def client():
    return TestClient(app)
