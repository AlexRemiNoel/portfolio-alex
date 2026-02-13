import os
from dotenv import load_dotenv

from .database import SessionLocal, engine
from .models import Base, User
from .auth import get_password_hash

load_dotenv()

def init_admin():
    """
    Create admin user on startup if it does not exist.
    """
    Base.metadata.create_all(bind=engine)

    db = SessionLocal()
    try:
        admin_username = os.getenv("ADMIN_USERNAME", "admin")
        admin_email = os.getenv("ADMIN_EMAIL", "admin@example.com")
        admin_password = os.getenv("ADMIN_PASSWORD")

        if not admin_password:
            raise RuntimeError("ADMIN_PASSWORD not set")

        existing_admin = (
            db.query(User)
            .filter(User.username == admin_username)
            .first()
        )

        if existing_admin:
            print(f"✓ Admin '{admin_username}' already exists")
            return

        admin_user = User(
            username=admin_username,
            email=admin_email,
            hashed_password=get_password_hash(admin_password),
            is_admin=True,
            is_active=True,
        )

        db.add(admin_user)
        db.commit()

        print("✅ Admin user created")

    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
