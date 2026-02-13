echo "Waiting for database to be ready..."
sleep 5

echo "Creating database tables..."
docker-compose exec backend python -c "from app.database import engine; from app.models import Base; Base.metadata.create_all(bind=engine)"

echo "Creating admin user..."
docker-compose exec backend python create_admin.py

echo "Database initialized!"