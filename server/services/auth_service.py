#!/usr/bin/env python3
"""
Authentication Service
Handles device authentication and key generation
"""

from utils.helpers import calculate_secret_key, calculate_address_key


class AuthService:
    """Service for device authentication"""
    
    @staticmethod
    def register_device(chip_id: str, license_key: str, firmware_version: str):
        """
        Register a device and generate authentication keys
        
        Args:
            chip_id: Device chip ID (16 characters)
            license_key: Activation code (12 characters)
            firmware_version: Firmware version string
            
        Returns:
            dict: Registration result with keys
            
        Raises:
            ValueError: If parameters are invalid
        """
        # Validate parameters
        if not chip_id or len(chip_id) != 16:
            raise ValueError("Invalid chip_id: must be 16 characters")
        
        if not license_key or len(license_key) != 12:
            raise ValueError("Invalid license_key: must be 12 characters")
        
        # Generate keys
        secret_key = calculate_secret_key(chip_id, license_key)
        address_key = calculate_address_key(chip_id, license_key)
        
        print(f"[AuthService] Device registered: chip_id={chip_id}, firmware={firmware_version}")
        
        return {
            "secret_key": secret_key,
            "address_key": address_key
        }
