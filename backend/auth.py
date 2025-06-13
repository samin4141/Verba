from fastapi import Depends, HTTPException, status
from typing import Dict, Optional

# For development/testing purposes, we'll use a mock user
# In production, this would be replaced with proper authentication
async def get_current_user() -> Dict:
    """
    Mock authentication function for development.
    In production, this would validate JWT tokens or session cookies.
    """
    return {
        "id": 1,
        "email": "test@example.com",
        "full_name": "Test User"
    } 