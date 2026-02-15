from mangum import Mangum
import sys
import os

# Add the backend app directory to Python path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..', 'backend'))

from app.main import app

# Mangum adapter for AWS Lambda/Vercel
handler = Mangum(app, lifespan="off")