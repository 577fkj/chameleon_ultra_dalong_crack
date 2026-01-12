"""
API Package
Flask Blueprint-based API routes
"""

from .device import device_bp
from .firmware import firmware_bp
from .app_version import app_version_bp
from .geofence import geofence_bp

__all__ = [
    'device_bp',
    'firmware_bp',
    'app_version_bp',
    'geofence_bp'
]
