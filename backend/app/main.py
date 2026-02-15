from fastapi import FastAPI, Depends, HTTPException, status, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from datetime import timedelta
from typing import List
import json

from .database import get_db, engine
from .models import Base, User, Portfolio, PortfolioHistory, Feedback
from .schemas import (
    ContactEmailRequest, UserCreate, User as UserSchema, Token, UserLogin,
    PortfolioData, PortfolioResponse, PortfolioUpdate,
    PortfolioHistoryResponse,
    FeedbackCreate, FeedbackResponse, FeedbackApprove,
)
from .auth import (
    authenticate_user, create_access_token, get_password_hash,
    get_current_active_user, get_current_admin_user,
    ACCESS_TOKEN_EXPIRE_MINUTES
)
from .init_admin import init_admin

app = FastAPI(
    title="Portfolio API",
    description="Backend API for portfolio management with authentication",
    version="1.0.0"
)

# Startup event - create tables and initialize admin
@app.on_event("startup")
async def startup_event():
    """Run on application startup"""
    print("🚀 Starting up Portfolio API...")
    Base.metadata.create_all(bind=engine)
    init_admin()
    print("✅ Portfolio API ready!")

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://0.0.0.0:3000",
        "https://portfolio-alex-git-main-alexreminoels-projects.vercel.app",
        "https://portfolio-alex-alexreminoels-projects.vercel.app",
        "https://portfolio-alex-2h4y.onrender.com"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================================================================
# Authentication Routes
# ============================================================================

@app.post("/auth/register", response_model=UserSchema, status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user (for development - restrict in production)"""
    db_user = db.query(User).filter(User.username == user.username).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already registered"
        )
    
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    hashed_password = get_password_hash(user.password)
    new_user = User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password,
        is_admin=False
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/auth/login", response_model=Token)
def login(
    response: Response,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Login and receive access token"""
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    
    response.set_cookie(
        key="access_token",
        value=f"Bearer {access_token}",
        httponly=True,
        max_age=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        expires=ACCESS_TOKEN_EXPIRE_MINUTES * 60,
        samesite="lax",
        secure=False
    )
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/auth/logout")
def logout(response: Response):
    """Logout and clear cookie"""
    response.delete_cookie(key="access_token")
    return {"message": "Successfully logged out"}

@app.get("/auth/me", response_model=UserSchema)
def get_current_user_info(current_user: User = Depends(get_current_active_user)):
    """Get current user information"""
    return current_user

# ============================================================================
# Portfolio Routes
# ============================================================================

@app.get("/portfolio", response_model=PortfolioResponse)
def get_portfolio(db: Session = Depends(get_db)):
    portfolio = db.query(Portfolio).first()
    
    if not portfolio:
        default_data = {
            "name": "Your Name",
            "hero": {
                "headline": "Welcome to My Portfolio",
                "subheadline": "I'm a developer creating amazing digital experiences."
            },
            "about": {"title": "About Me", "content": "Tell your story here..."},
            "skills": {
                "title": "Skills",
                "categories": [
                    {"name": "Frontend", "items": "React, Next.js, TypeScript"},
                    {"name": "Backend", "items": "Python, FastAPI, PostgreSQL"}
                ]
            },
            "projects": {
                "title": "Projects",
                "items": [{
                    "name": "Sample Project",
                    "description": "A sample project description",
                    "projectUrl": "#",
                    "githubUrl": "#"
                }]
            },
            "contact": {
                "title": "Contact",
                "message": "Let's get in touch!",
                "email": "your@email.com", # <--- This is now in the DB save
                "links": [
                    {"name": "Email", "url": "mailto:your@email.com"},
                    {"name": "GitHub", "url": "https://github.com/yourusername"}
                ]
            },
            "footer": {"year": "2024", "name": "Your Name"}
        }
        
        portfolio = Portfolio(name="default", data=json.dumps(default_data))
        db.add(portfolio)
        db.commit()
        db.refresh(portfolio)
    
    # Get the dictionary from the JSON field
    data_content = portfolio.get_data()
    
    # IMPORTANT: If your DB record is old, it might still lack 'email'.
    # This line ensures the 'email' key exists before it hits the validator.
    if "email" not in data_content.get("contact", {}):
        data_content["contact"]["email"] = "your@email.com"

    return {
        "id": portfolio.id,
        "name": portfolio.name,
        "data": data_content,
        "updated_at": portfolio.updated_at
    }

@app.put("/portfolio", response_model=PortfolioResponse)
def update_portfolio(
    portfolio_update: PortfolioUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Update portfolio data (protected - admin only)"""
    portfolio = db.query(Portfolio).first()
    
    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found"
        )
    
    history = PortfolioHistory(
        portfolio_id=portfolio.id,
        data=portfolio.data,
        updated_by=current_user.id,
        change_description="Portfolio updated"
    )
    db.add(history)
    
    portfolio.set_data(portfolio_update.data.model_dump())
    portfolio.updated_by = current_user.id
    
    db.commit()
    db.refresh(portfolio)
    
    return {
        "id": portfolio.id,
        "name": portfolio.name,
        "data": portfolio.get_data(),
        "updated_at": portfolio.updated_at
    }

@app.get("/portfolio/history", response_model=List[PortfolioHistoryResponse])
def get_portfolio_history(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get portfolio edit history (protected - admin only)"""
    history = db.query(PortfolioHistory)\
        .order_by(PortfolioHistory.updated_at.desc())\
        .offset(skip)\
        .limit(limit)\
        .all()
    
    return [
        {
            "id": h.id,
            "portfolio_id": h.portfolio_id,
            "data": json.loads(h.data),
            "updated_by": h.updated_by,
            "updated_at": h.updated_at,
            "change_description": h.change_description
        }
        for h in history
    ]

# ============================================================================
# Feedback Routes
# ============================================================================

@app.post("/feedback", response_model=FeedbackResponse, status_code=status.HTTP_201_CREATED)
def create_feedback(feedback: FeedbackCreate, db: Session = Depends(get_db)):
    """Submit feedback (public endpoint - no auth required)"""
    new_feedback = Feedback(
        name=feedback.name,
        email=feedback.email,
        message=feedback.message,
        rating=feedback.rating,
        is_approved=False
    )
    db.add(new_feedback)
    db.commit()
    db.refresh(new_feedback)
    return new_feedback

@app.get("/feedback/approved", response_model=List[FeedbackResponse])
def get_approved_feedback(db: Session = Depends(get_db)):
    """Get all approved feedback (public endpoint)"""
    feedback_list = db.query(Feedback)\
        .filter(Feedback.is_approved == True)\
        .order_by(Feedback.created_at.desc())\
        .all()
    return feedback_list

@app.get("/feedback/pending", response_model=List[FeedbackResponse])
def get_pending_feedback(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get all pending feedback (admin only)"""
    feedback_list = db.query(Feedback)\
        .filter(Feedback.is_approved == False)\
        .order_by(Feedback.created_at.desc())\
        .all()
    return feedback_list

@app.get("/feedback/all", response_model=List[FeedbackResponse])
def get_all_feedback(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Get all feedback (admin only)"""
    feedback_list = db.query(Feedback)\
        .order_by(Feedback.created_at.desc())\
        .all()
    return feedback_list

@app.patch("/feedback/{feedback_id}/approve", response_model=FeedbackResponse)
def approve_feedback(
    feedback_id: int,
    approval: FeedbackApprove,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Approve or reject feedback (admin only)"""
    from sqlalchemy.sql import func as sql_func
    
    feedback = db.query(Feedback).filter(Feedback.id == feedback_id).first()
    if not feedback:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Feedback not found"
        )
    
    feedback.is_approved = approval.approve
    if approval.approve:
        feedback.approved_at = sql_func.now()
        feedback.approved_by = current_user.id
    else:
        feedback.approved_at = None
        feedback.approved_by = None
    
    db.commit()
    db.refresh(feedback)
    return feedback

@app.delete("/feedback/{feedback_id}")
def delete_feedback(
    feedback_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Delete feedback (admin only)"""
    feedback = db.query(Feedback).filter(Feedback.id == feedback_id).first()
    if not feedback:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Feedback not found"
        )
    
    db.delete(feedback)
    db.commit()
    return {"message": "Feedback deleted successfully"}

# ============================================================================
# Health Check
# ============================================================================

@app.get("/")
def root():
    """Health check endpoint"""
    return {
        "message": "Portfolio API is running",
        "version": "1.0.0",
        "status": "healthy"
    }

@app.get("/health")
def health_check():
    """Detailed health check"""
    return {
        "status": "healthy",
        "database": "connected"
    }

@app.post("/contact/send-email")
async def send_contact_email(
    contact_request: ContactEmailRequest,
    db: Session = Depends(get_db)
):
    """Send contact email to portfolio owner"""
    import aiosmtplib
    from email.mime.text import MIMEText
    from email.mime.multipart import MIMEMultipart
    import os
    
    # Get portfolio owner's email from portfolio data
    portfolio = db.query(Portfolio).first()
    if not portfolio:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Portfolio not found"
        )
    
    portfolio_data = portfolio.get_data()
    recipient_email = portfolio_data.get("contact", {}).get("email")
    
    if not recipient_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Contact email not configured"
        )
    
    # Create email
    message = MIMEMultipart("alternative")
    message["From"] = os.getenv("SMTP_FROM_EMAIL", contact_request.email)
    message["To"] = recipient_email
    message["Subject"] = f"Portfolio Contact: {contact_request.subject}"
    message["Reply-To"] = contact_request.email
    
    # Email body
    text = f"""
New contact form submission from your portfolio:

Name: {contact_request.name}
Email: {contact_request.email}
Subject: {contact_request.subject}

Message:
{contact_request.message}

---
This email was sent from your portfolio contact form.
Reply directly to this email to respond to {contact_request.name}.
    """
    
    html = f"""
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
    <h2 style="color: #2563eb;">New Contact Form Submission</h2>
    <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <p><strong>Name:</strong> {contact_request.name}</p>
        <p><strong>Email:</strong> <a href="mailto:{contact_request.email}">{contact_request.email}</a></p>
        <p><strong>Subject:</strong> {contact_request.subject}</p>
    </div>
    <div style="margin: 20px 0;">
        <strong>Message:</strong>
        <p style="background: white; padding: 15px; border-left: 4px solid #2563eb; margin-top: 10px;">
            {contact_request.message}
        </p>
    </div>
    <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
    <p style="color: #6b7280; font-size: 0.9em;">
        This email was sent from your portfolio contact form.<br>
        Reply directly to this email to respond to {contact_request.name}.
    </p>
</body>
</html>
    """
    
    message.attach(MIMEText(text, "plain"))
    message.attach(MIMEText(html, "html"))
    
    # Send email
    try:
        # Get SMTP settings from environment (with fallback to console logging)
        smtp_host = os.getenv("SMTP_HOST")
        smtp_port = int(os.getenv("SMTP_PORT", "587"))
        smtp_username = os.getenv("SMTP_USERNAME")
        smtp_password = os.getenv("SMTP_PASSWORD")
        
        if not all([smtp_host, smtp_username, smtp_password]):
            # Fallback: Just log the email (for development)
            print("=" * 50)
            print("📧 CONTACT EMAIL (SMTP not configured, logging instead)")
            print("=" * 50)
            print(f"To: {recipient_email}")
            print(f"From: {contact_request.email}")
            print(f"Subject: {contact_request.subject}")
            print(f"\n{text}")
            print("=" * 50)
            
            return {
                "message": "Email logged successfully (SMTP not configured for production)",
                "status": "logged"
            }
        
        # Send via SMTP
        await aiosmtplib.send(
            message,
            hostname=smtp_host,
            port=smtp_port,
            username=smtp_username,
            password=smtp_password,
            start_tls=True,
        )
        
        return {
            "message": "Email sent successfully",
            "status": "sent"
        }
        
    except Exception as e:
        print(f"Error sending email: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to send email: {str(e)}"
        )
if __name__ == "__main__":
    import uvicorn
    import os
    
    port = int(os.getenv("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)