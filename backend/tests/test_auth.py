from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

# 🔹 Test Register User
def test_register():
    res = client.post(
        "/register",
        json={
            "email": "test@test.com",
            "password": "123456"
        }
    )
    assert res.status_code == 200
    assert res.json()["email"] == "test@test.com"


# 🔹 Test Login User
def test_login():
    res = client.post(
        "/login",
        json={
            "email": "test@test.com",
            "password": "123456"
        }
    )
    assert res.status_code == 200
    data = res.json()
    assert "access_token" in data


# 🔹 Test Wrong Password
def test_wrong_password():
    res = client.post(
        "/login",
        json={
            "email": "test@test.com",
            "password": "wrong"
        }
    )
    assert res.status_code == 401