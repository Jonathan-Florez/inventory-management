from datetime import timedelta

from app.core.security import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)


def test_hash_password_generates_different_hash_each_time():
    hashed_1 = hash_password("mypassword123")
    hashed_2 = hash_password("mypassword123")
    assert hashed_1 != hashed_2  # salt distinto cada vez


def test_verify_password_succeeds_with_correct_password():
    hashed = hash_password("mypassword123")
    assert verify_password("mypassword123", hashed) is True


def test_verify_password_fails_with_wrong_password():
    hashed = hash_password("mypassword123")
    assert verify_password("wrongpassword", hashed) is False


def test_create_and_decode_access_token_roundtrip():
    token = create_access_token(subject="42")
    subject = decode_access_token(token)
    assert subject == "42"


def test_decode_access_token_returns_none_for_expired_token():
    token = create_access_token(subject="42", expires_delta=timedelta(seconds=-1))
    assert decode_access_token(token) is None


def test_decode_access_token_returns_none_for_invalid_token():
    assert decode_access_token("esto.no.es.un.jwt.valido") is None