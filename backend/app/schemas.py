from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

# User Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    username: str
    password: str

class User(UserBase):
    id: int
    is_active: bool
    is_admin: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# Portfolio Schemas
class HeroSection(BaseModel):
    headline: str
    subheadline: str

class AboutSection(BaseModel):
    title: str
    content: str

class SkillCategory(BaseModel):
    name: str
    items: str

class SkillsSection(BaseModel):
    title: str
    categories: List[SkillCategory]

class Project(BaseModel):
    name: str
    description: str
    projectUrl: str
    githubUrl: str

class ProjectsSection(BaseModel):
    title: str
    items: List[Project]

class ContactLink(BaseModel):
    name: str
    url: str

class ContactSection(BaseModel):
    title: str
    message: str
    email: str  # Primary contact email
    links: List[ContactLink]

class FooterSection(BaseModel):
    year: str
    name: str

class PortfolioData(BaseModel):
    name: str
    hero: HeroSection
    about: AboutSection
    skills: SkillsSection
    projects: ProjectsSection
    contact: ContactSection
    footer: FooterSection

class PortfolioResponse(BaseModel):
    id: int
    name: str
    data: PortfolioData
    updated_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class PortfolioUpdate(BaseModel):
    data: PortfolioData

class PortfolioHistoryResponse(BaseModel):
    id: int
    portfolio_id: int
    data: Dict[str, Any]
    updated_by: Optional[int]
    updated_at: datetime
    change_description: Optional[str]
    
    class Config:
        from_attributes = True

# Feedback Schemas
class FeedbackCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: Optional[str] = Field(None, max_length=100)
    message: str = Field(..., min_length=1, max_length=1000)
    rating: Optional[int] = Field(None, ge=1, le=5)

class FeedbackResponse(BaseModel):
    id: int
    name: str
    email: Optional[str]
    message: str
    rating: Optional[int]
    is_approved: bool
    created_at: datetime
    approved_at: Optional[datetime]
    
    class Config:
        from_attributes = True

class FeedbackApprove(BaseModel):
    approve: bool

# Contact Email Schema
class ContactEmailRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    email: EmailStr
    subject: str = Field(..., min_length=1, max_length=200)
    message: str = Field(..., min_length=1, max_length=2000)