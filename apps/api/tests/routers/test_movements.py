def _auth_headers(client, email="stockuser@example.com"):
    client.post(
        "/auth/register",
        json={"email": email, "password": "password123", "name": "Stock User"},
    )
    login = client.post("/auth/login", json={"email": email, "password": "password123"})
    token = login.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}


def _create_category_and_product(client, headers):
    category = client.post("/categories", json={"name": "Test Cat"}, headers=headers).json()
    product = client.post(
        "/products",
        json={
            "category_id": category["id"], "name": "Test Product", "sku": "TEST-001",
            "quantity": 5, "price": "10.00", "min_stock": 2,
        },
        headers=headers,
    ).json()
    return product



def test_movement_out_updates_stock_correctly(client):
    headers = _auth_headers(client)
    product = _create_category_and_product(client, headers)

    response = client.post(
        f"/products/{product['id']}/movements",
        json={"type": "out", "quantity": 3, "note": "Venta de prueba"},
        headers=headers,
    )
    assert response.status_code == 201

    updated = client.get(f"/products/{product['id']}", headers=headers).json()
    assert updated["quantity"] == 2


def test_movement_out_with_insufficient_stock_returns_400(client):
    headers = _auth_headers(client, email="stockuser2@example.com")
    product = _create_category_and_product(client, headers)

    response = client.post(
        f"/products/{product['id']}/movements",
        json={"type": "out", "quantity": 999, "note": "Excede stock"},
        headers=headers,
    )
    assert response.status_code == 400

    unchanged = client.get(f"/products/{product['id']}", headers=headers).json()
    assert unchanged["quantity"] == 5  # no cambió, la transacción se revirtió