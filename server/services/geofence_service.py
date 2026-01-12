#!/usr/bin/env python3
"""
Geofence Service
Handles geofence subscription management
"""

import json
import uuid
from threading import Lock
from pathlib import Path
from typing import Optional

from utils.helpers import get_iso_8601_timestamp


class GeofenceService:
    """Service for geofence management"""
    
    def __init__(self, database_path: Path):
        """
        Initialize geofence service
        
        Args:
            database_path: Path to geofence database JSON file
        """
        self.database_path = database_path
        self.geofence_data = {}
        self.lock = Lock()
        
        # Load initial data
        self.load_database()
    
    def load_database(self):
        """Load geofence database from JSON file"""
        try:
            if not self.database_path.exists():
                self.geofence_data = {}
                print("[GeofenceService] Database file not found, starting with empty data")
                return
            
            with open(self.database_path, "r", encoding="utf-8") as f:
                self.geofence_data = json.load(f)
            
            print(f"[GeofenceService] Loaded {len(self.geofence_data)} subscriptions")
        except Exception as e:
            print(f"[GeofenceService] Error loading database: {e}")
            self.geofence_data = {}
    
    def save_database(self):
        """Save geofence database to JSON file"""
        try:
            with open(self.database_path, "w", encoding="utf-8") as f:
                json.dump(self.geofence_data, f, indent=4, ensure_ascii=False)
        except Exception as e:
            print(f"[GeofenceService] Error saving database: {e}")
    
    def create_subscription(self, encrypted_data: str, admin_password: str, device_id: str) -> dict:
        """
        Create a new geofence subscription
        
        Args:
            encrypted_data: Encrypted geofence data
            admin_password: Admin password for management
            device_id: Creating device ID
            
        Returns:
            dict: Subscription information
            
        Raises:
            ValueError: If parameters are invalid
        """
        if not encrypted_data or not admin_password or not device_id:
            raise ValueError("Missing required parameters")
        
        sub_id = str(uuid.uuid4())
        timestamp = get_iso_8601_timestamp()
        
        with self.lock:
            self.geofence_data[sub_id] = {
                "encryptedData": encrypted_data,
                "adminPassword": admin_password,
                "deviceId": device_id,
                "subscriptionDevice": {},
                "createAt": timestamp,
                "updateAt": timestamp,
            }
            self.save_database()
        
        print(f"[GeofenceService] Created subscription: {sub_id}")
        
        return {
            "subscriptionId": sub_id,
            "timestamp": timestamp
        }
    
    def update_subscription(self, sub_id: str, encrypted_data: str, admin_password: str, device_id: str):
        """
        Update an existing geofence subscription
        
        Args:
            sub_id: Subscription ID
            encrypted_data: New encrypted geofence data
            admin_password: Admin password for verification
            device_id: Device ID for verification
            
        Raises:
            ValueError: If parameters are invalid or verification fails
        """
        if not sub_id or not encrypted_data or not admin_password or not device_id:
            raise ValueError("Missing required parameters")
        
        if sub_id not in self.geofence_data:
            raise ValueError("Subscription ID not found")
        
        subscription = self.geofence_data[sub_id]
        
        if subscription["adminPassword"] != admin_password:
            raise ValueError("Incorrect admin password")
        
        if subscription["deviceId"] != device_id:
            raise ValueError("Device ID mismatch")
        
        with self.lock:
            subscription["encryptedData"] = encrypted_data
            subscription["updateAt"] = get_iso_8601_timestamp()
            self.save_database()
        
        print(f"[GeofenceService] Updated subscription: {sub_id}")
    
    def delete_subscription(self, sub_id: str, admin_password: str, device_id: str):
        """
        Delete a geofence subscription
        
        Args:
            sub_id: Subscription ID
            admin_password: Admin password for verification
            device_id: Device ID for verification
            
        Raises:
            ValueError: If parameters are invalid or verification fails
        """
        if not sub_id or not admin_password or not device_id:
            raise ValueError("Missing required parameters")
        
        if sub_id not in self.geofence_data:
            # Already deleted, return success
            return
        
        subscription = self.geofence_data[sub_id]
        
        if subscription["adminPassword"] != admin_password:
            raise ValueError("Incorrect admin password")
        
        if subscription["deviceId"] != device_id:
            raise ValueError("Device ID mismatch")
        
        with self.lock:
            del self.geofence_data[sub_id]
            self.save_database()
        
        print(f"[GeofenceService] Deleted subscription: {sub_id}")
    
    def get_subscription_data(self, sub_id: str, device_id: str) -> str:
        """
        Get geofence data for a subscription and register device access
        
        Args:
            sub_id: Subscription ID
            device_id: Accessing device ID
            
        Returns:
            Encrypted geofence data
            
        Raises:
            ValueError: If subscription not found or device disabled
        """
        if not device_id:
            raise ValueError("Device ID is required")
        
        if sub_id not in self.geofence_data:
            raise ValueError("Subscription ID not found")
        
        subscription = self.geofence_data[sub_id]
        timestamp = get_iso_8601_timestamp()
        
        # Register or update device access
        with self.lock:
            if device_id not in subscription["subscriptionDevice"]:
                subscription["subscriptionDevice"][device_id] = {
                    "name": "",
                    "enabled": True,
                    "createdAt": timestamp,
                    "lastAccessAt": timestamp
                }
            else:
                subscription["subscriptionDevice"][device_id]["lastAccessAt"] = timestamp
            
            self.save_database()
        
        # Check if device is enabled
        if not subscription["subscriptionDevice"][device_id]["enabled"]:
            raise ValueError("Device is disabled")
        
        return subscription["encryptedData"]
    
    def set_device_name(self, sub_id: str, target_device_id: str, device_name: str, admin_password: str, device_id: str):
        """
        Set device name for a subscription
        
        Args:
            sub_id: Subscription ID
            target_device_id: Target device ID to rename
            device_name: New device name
            admin_password: Admin password for verification
            device_id: Admin device ID for verification
            
        Raises:
            ValueError: If parameters are invalid or verification fails
        """
        if not all([sub_id, target_device_id, device_name, admin_password, device_id]):
            raise ValueError("Missing required parameters")
        
        if sub_id not in self.geofence_data:
            raise ValueError("Subscription ID not found")
        
        subscription = self.geofence_data[sub_id]
        
        if subscription["adminPassword"] != admin_password:
            raise ValueError("Incorrect admin password")
        
        if subscription["deviceId"] != device_id:
            raise ValueError("Device ID mismatch")
        
        if target_device_id not in subscription["subscriptionDevice"]:
            raise ValueError("Target device ID not found")
        
        with self.lock:
            subscription["subscriptionDevice"][target_device_id]["name"] = device_name
            self.save_database()
    
    def set_device_enabled(self, sub_id: str, target_device_id: str, enabled: bool, admin_password: str, device_id: str):
        """
        Enable or disable a device in a subscription
        
        Args:
            sub_id: Subscription ID
            target_device_id: Target device ID
            enabled: Enable or disable
            admin_password: Admin password for verification
            device_id: Admin device ID for verification
            
        Raises:
            ValueError: If parameters are invalid or verification fails
        """
        if not all([sub_id, target_device_id, admin_password, device_id]):
            raise ValueError("Missing required parameters")
        
        if sub_id not in self.geofence_data:
            raise ValueError("Subscription ID not found")
        
        subscription = self.geofence_data[sub_id]
        
        if subscription["adminPassword"] != admin_password:
            raise ValueError("Incorrect admin password")
        
        if subscription["deviceId"] != device_id:
            raise ValueError("Device ID mismatch")
        
        if target_device_id not in subscription["subscriptionDevice"]:
            raise ValueError("Target device ID not found")
        
        with self.lock:
            subscription["subscriptionDevice"][target_device_id]["enabled"] = enabled
            self.save_database()
    
    def list_devices(self, sub_id: str, admin_password: str, device_id: str) -> list:
        """
        List all devices in a subscription
        
        Args:
            sub_id: Subscription ID
            admin_password: Admin password for verification
            device_id: Admin device ID for verification
            
        Returns:
            List of device information
            
        Raises:
            ValueError: If parameters are invalid or verification fails
        """
        if not all([sub_id, admin_password, device_id]):
            raise ValueError("Missing required parameters")
        
        if sub_id not in self.geofence_data:
            raise ValueError("Subscription ID not found")
        
        subscription = self.geofence_data[sub_id]
        
        if subscription["adminPassword"] != admin_password:
            raise ValueError("Incorrect admin password")
        
        if subscription["deviceId"] != device_id:
            raise ValueError("Device ID mismatch")
        
        devices = [
            {
                "deviceId": dev_id,
                "deviceName": dev_info["name"],
                "enabled": dev_info["enabled"],
                "lastAccessAt": dev_info["lastAccessAt"],
                "createdAt": dev_info["createdAt"]
            }
            for dev_id, dev_info in subscription["subscriptionDevice"].items()
        ]
        
        return devices
