#!/usr/bin/env python3
"""
Firmware Service
Handles firmware version management and updates
"""

import os
import json
from threading import Lock
from pathlib import Path
from typing import Optional, Tuple

from utils.helpers import extract_version_prefix


class FirmwareService:
    """Service for firmware management"""
    
    def __init__(self, version_file_path: Path, firmware_dir: Path):
        """
        Initialize firmware service
        
        Args:
            version_file_path: Path to version.json
            firmware_dir: Path to firmware directory
        """
        self.version_file_path = version_file_path
        self.firmware_dir = firmware_dir
        self.version_info = {}
        self.version_file_mtime = None
        self.lock = Lock()
        
        # Load initial data
        self.load_version_info()
    
    def load_version_info(self):
        """Load firmware version information from version.json"""
        try:
            if not self.version_file_path.exists():
                print(f"[FirmwareService] Warning: {self.version_file_path} not found")
                self.version_info = {}
                self.version_file_mtime = None
                return
            
            with open(self.version_file_path, "r", encoding="utf-8") as f:
                self.version_info = json.load(f)
            
            self.version_file_mtime = os.path.getmtime(self.version_file_path)
            print(f"[FirmwareService] Loaded version info for {len(self.version_info)} versions")
        except Exception as e:
            print(f"[FirmwareService] Error loading version info: {e}")
            self.version_info = {}
            self.version_file_mtime = None
    
    def check_and_reload(self) -> bool:
        """Check if version.json has been modified and reload if needed"""
        try:
            if not self.version_file_path.exists():
                return False
            
            current_mtime = os.path.getmtime(self.version_file_path)
            if self.version_file_mtime is None or current_mtime != self.version_file_mtime:
                with self.lock:
                    print("[FirmwareService] version.json modified, reloading...")
                    self.load_version_info()
                return True
        except Exception as e:
            print(f"[FirmwareService] Error checking version file: {e}")
        return False
    
    def get_version_string(self, version_prefix: str) -> Tuple[Optional[str], Optional[str]]:
        """
        Get formatted firmware version string
        
        Args:
            version_prefix: Version prefix (e.g., "3", "4", "5")
            
        Returns:
            tuple: (full_version, update_time) or (None, None) if not found
        """
        if version_prefix not in self.version_info:
            return None, None
        
        ver_data = self.version_info[version_prefix]
        version = ver_data.get("version", "")
        sub_version = ver_data.get("sub_version", "")
        commit_hash = ver_data.get("commit_hash", "")
        update_time = ver_data.get("update_time", "")
        
        full_version = f"v{version_prefix}.{version}-{sub_version}-{commit_hash}"
        return full_version, update_time
    
    def check_for_update(self, client_version: str, request_host: str) -> dict:
        """
        Check if firmware update is available
        
        Args:
            client_version: Current client firmware version
            request_host: Request host for download URL
            
        Returns:
            dict: Update information
            
        Raises:
            ValueError: If client_version is invalid
        """
        if not client_version:
            raise ValueError("Client version is required")
        
        version_prefix = extract_version_prefix(client_version)
        full_version, update_time = self.get_version_string(version_prefix)
        
        if not full_version:
            raise ValueError(f"Invalid version prefix: {version_prefix}")
        
        filename = f"{full_version}.zip"
        firmware_path = self.firmware_dir / filename
        
        # Get file size
        file_size = 0
        if firmware_path.exists():
            file_size = firmware_path.stat().st_size
        else:
            print(f"[FirmwareService] Warning: {firmware_path} not found")
        
        # Check if update is needed
        need_update = client_version != full_version
        version_short = full_version.split("-")[0]
        download_url = f"http://{request_host}/ultra/api/v1/firmware/download/{version_short}/{filename}"
        
        return {
            "need_update": need_update,
            "firmware_info": {
                "version": full_version,
                "file_name": filename,
                "file_size": file_size,
                "upload_time": update_time,
                "download_url": download_url,
            }
        }
    
    def get_firmware_path(self, filename: str) -> Optional[Path]:
        """
        Get firmware file path with security validation
        
        Args:
            filename: Firmware filename
            
        Returns:
            Path object if valid, None otherwise
        """
        try:
            target = (self.firmware_dir / filename).resolve()
            
            # Security checks
            if not str(target).startswith(str(self.firmware_dir.resolve()) + os.sep):
                return None
            
            if target.suffix.lower() != ".zip":
                return None
            
            if not target.exists():
                return None
            
            return target
        except Exception as e:
            print(f"[FirmwareService] Error getting firmware path: {e}")
            return None
