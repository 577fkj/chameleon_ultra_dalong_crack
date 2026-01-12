#!/usr/bin/env python3
"""
Configuration Management for Chameleon Ultra Server
"""

import os
from pathlib import Path


class Config:
    """Base configuration class"""
    
    # Server Configuration
    HOST = os.getenv("SERVER_HOST", "0.0.0.0")
    PORT = int(os.getenv("SERVER_PORT", 8080))
    DEBUG = os.getenv("DEBUG", "False").lower() == "true"
    
    # File Paths
    BASE_DIR = Path(__file__).parent.resolve()
    VERSION_FILE_PATH = BASE_DIR / "version.json"
    GEOFENCE_DATABASE_PATH = BASE_DIR / "geofence.json"
    FIRMWARE_DIR = BASE_DIR.parent / "firmware"
    ANDROID_APP_DIR = BASE_DIR.parent / "software" / "Android"
    ANDROID_README_PATH = ANDROID_APP_DIR / "README.md"
    GEOFENCE_APP_DIR = BASE_DIR.parent / "software" / "GeoFence" / "Android"
    GEOFENCE_README_PATH = GEOFENCE_APP_DIR / "README.md"
    
    # Monitor Configuration
    MONITOR_INTERVAL = int(os.getenv("MONITOR_INTERVAL", 5))  # seconds
    
    # API Configuration
    API_PREFIX = "/ultra/api/v1"
    
    @classmethod
    def get_download_url(cls, request, path):
        """Generate download URL"""
        return f"http://{request.host}{cls.API_PREFIX}{path}"


class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    MONITOR_INTERVAL = 2


class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False


# Configuration dictionary
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'default': ProductionConfig
}


def get_config():
    """Get configuration based on environment"""
    env = os.getenv('FLASK_ENV', 'production')
    return config.get(env, config['default'])
