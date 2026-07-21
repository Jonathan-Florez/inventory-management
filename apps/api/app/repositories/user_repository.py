from sqlmodel import Session, select

from app.models.user import User


class UserRepository:
    def __init__(self, session: Session):
        self.session = session

    def get_by_email(self, email: str) -> User | None:
        statement = select(User).where(User.email == email)
        return self.session.exec(statement).first()

    def get_by_id(self, user_id: int) -> User | None:
        return self.session.get(User, user_id)


##* este * se utiliza para indicar que estos argumentos se deben pasar si o si como argumentos con nombre
    def create(self, *, email: str, password_hash: str, name: str) -> User:
        user = User(email=email, password_hash=password_hash, name=name)
        self.session.add(user)
        self.session.commit()
        self.session.refresh(user)
        return user