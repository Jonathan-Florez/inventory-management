
##* este archivo lo creo con la finalidad de reutiliza este codigo que tendre que usar en varios lugares, y asi no tener que repetirlo en cada endpoint, y ademas de que si quiero cambiar algo solo lo hago aqui y se cambia en todos los lugares donde se use

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlmodel import Session

from app.core.db import get_session
from app.core.security import decode_access_token
from app.models.user import User
from app.repositories.user_repository import UserRepository

bearer_scheme = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(bearer_scheme),
    session: Session = Depends(get_session),
) -> User:
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials.",
        headers={"WWW-Authenticate": "Bearer"},
    )

    user_id = decode_access_token(credentials.credentials)
    if user_id is None:
        raise credentials_exception

    user = UserRepository(session).get_by_id(int(user_id))
    if user is None:
        raise credentials_exception

    return user