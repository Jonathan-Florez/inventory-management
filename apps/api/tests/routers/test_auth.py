def test_register_creates_user_and_returns_token(client):
    response = client.post(
        "/auth/register",
        json={"email": "new@example.com", "password": "password123", "name": "New User"},
    )
    assert response.status_code == 201
    body = response.json()
    assert body["user"]["email"] == "new@example.com"
    assert "access_token" in body
    assert "password" not in body["user"]
    assert "password_hash" not in body["user"]


def test_register_duplicate_email_returns_409(client):
    payload = {"email": "dup@example.com", "password": "password123", "name": "User"}
    client.post("/auth/register", json=payload)
    response = client.post("/auth/register", json=payload)
    assert response.status_code == 409


def test_login_with_wrong_password_returns_401(client):
    client.post(
        "/auth/register",
        json={"email": "loginuser@example.com", "password": "correctpass", "name": "User"},
    )
    response = client.post(
        "/auth/login",
        json={"email": "loginuser@example.com", "password": "wrongpass"},
    )
    assert response.status_code == 401


def test_me_without_token_returns_401_or_403(client):
    response = client.get("/auth/me")
    assert response.status_code in (401, 403)