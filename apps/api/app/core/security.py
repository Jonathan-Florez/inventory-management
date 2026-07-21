from datetime import datetime, timedelta, timezone
from typing import Any

from jose import JWTError, jwt
from passlib.context import CryptContext

from app.core.config import settings


pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

##* esta funcion recibe la contraseña en texto plano y lo devuelve inentendible osea encriptada para que no se pueda leer, y no es revercible 
def hash_password(password: str) -> str:
    return pwd_context.hash(password)


##* esta funcion cuando el usuario inicia sesion  recibe la contraseña plana y la hasheada y las compara
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


##* aca creamos la funcion que crea el token, recibe el id de el usuario que es el subject decimos que debe ser string, recibe expires_delta que es opcional, y si no se pasase usa none por default aunque mas abajo le decimos que si es none use el tiempo de expiracion que definimos en settings.py, y devuelve un string que es el token
def create_access_token(subject: str, expires_delta: timedelta | None = None) -> str:
    expire = datetime.now(timezone.utc) + (
        expires_delta or timedelta(seconds=settings.jwt_expires_in)
    )
    to_encode: dict[str, Any] = {"sub": subject, "exp": expire}
    return jwt.encode(to_encode, settings.jwt_secret, algorithm=settings.jwt_algorithm)


##* aca creamos la funcion que decodifica el token, recibe el token y devuelve el subject que es el id del usuario, o none si el token es invalido
def decode_access_token(token: str) -> str | None:
    try:
        payload = jwt.decode(
            token, settings.jwt_secret, algorithms=[settings.jwt_algorithm]
        )
        return payload.get("sub")
    except JWTError:
        return None