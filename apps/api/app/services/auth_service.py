from fastapi import HTTPException, status
from sqlmodel import Session

from app.core.security import create_access_token, hash_password, verify_password
from app.models.user import User
from app.repositories.user_repository import UserRepository
from app.schemas.auth import Token, UserCreate, UserLogin, UserRead


class AuthService:
    def __init__(self, session: Session):
        self.repository = UserRepository(session)

    def register(self, data: UserCreate) -> Token:
        existing_user = self.repository.get_by_email(data.email)
        if existing_user is not None:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="A user with this email already exists.",
            )

        user = self.repository.create(
            email=data.email,
            password_hash=hash_password(data.password),
            name=data.name,
        )
        return self._build_token(user)

    def login(self, data: UserLogin) -> Token:
        user = self.repository.get_by_email(data.email)
        if user is None or not verify_password(data.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid email or password.",
            )
        return self._build_token(user)

    def _build_token(self, user: User) -> Token:
        access_token = create_access_token(subject=str(user.id))
        return Token(access_token=access_token, user=UserRead.model_validate(user))