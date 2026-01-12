#!/usr/bin/env python3
"""
Helper Functions
Common utility functions used across the application
"""

import hashlib
from datetime import datetime


def get_iso_8601_timestamp():
    """Get current timestamp in ISO 8601 format"""
    return datetime.now().astimezone().isoformat()


def calculate_secret_key(chip_id: str, license_key: str) -> str:
    """Generate secret key from chip_id and license_key"""
    m = hashlib.sha256()
    m.update(chip_id.encode("utf-8"))
    m.update(license_key.encode("utf-8"))
    m.update(chip_id.encode("utf-8"))
    return m.digest().hex()[:16]


def calculate_address_key(chip_id: str, license_key: str) -> str:
    """Generate address key from chip_id and license_key"""
    m = hashlib.sha256()
    m.update(chip_id.encode("utf-8"))
    m.update(license_key.encode("utf-8"))
    m.update(license_key.encode("utf-8"))
    m.update(chip_id.encode("utf-8"))
    return m.digest().hex()[-16:]


def extract_version_prefix(version: str) -> str:
    """Extract version prefix from version string"""
    if version.startswith("v"):
        return version.split(".")[0][1:]
    return version.split(".")[0]
