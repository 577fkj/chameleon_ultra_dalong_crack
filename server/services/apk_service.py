#!/usr/bin/env python3
"""
APK Service
Handles Android APK version management and updates
"""

import os
import re
from threading import Lock
from pathlib import Path
from typing import Optional
from androguard.core.apk import APK


class APKService:
    """Service for APK management"""
    
    def __init__(self, apk_dir: Path, readme_path: Path, name: str = "Main"):
        """
        Initialize APK service
        
        Args:
            apk_dir: Directory containing APK files
            readme_path: Path to README.md for update messages
            name: Service name for logging
        """
        self.apk_dir = apk_dir
        self.readme_path = readme_path
        self.name = name
        self.apk_info_cache = None
        self.apk_dir_mtime = None
        self.lock = Lock()
        
        # Load initial data
        self.load_apk_info()
    
    def load_apk_info(self):
        """Load APK information from directory"""
        try:
            if not self.apk_dir.exists():
                print(f"[APKService-{self.name}] Warning: {self.apk_dir} not found")
                self.apk_info_cache = None
                self.apk_dir_mtime = None
                return
            
            apk_files = [f for f in os.listdir(self.apk_dir) if f.endswith(".apk")]
            if not apk_files:
                self.apk_info_cache = None
                self.apk_dir_mtime = None
                print(f"[APKService-{self.name}] No APK files found")
                return
            
            # Get latest APK by modification time
            latest_apk = max(apk_files, key=lambda f: os.path.getmtime(self.apk_dir / f))
            apk_path = self.apk_dir / latest_apk
            
            # Parse APK
            apk = APK(str(apk_path))
            version = apk.get_androidversion_name()
            build_number = str(apk.get_androidversion_code())
            file_size = apk_path.stat().st_size
            file_mtime = os.path.getmtime(apk_path)
            
            self.apk_info_cache = {
                "version": version,
                "build_number": build_number,
                "file_name": latest_apk,
                "file_size": file_size,
                "file_path": str(apk_path)
            }
            self.apk_dir_mtime = file_mtime
            
            print(f"[APKService-{self.name}] Loaded: {latest_apk} v{version} build {build_number}")
        except Exception as e:
            print(f"[APKService-{self.name}] Error loading APK info: {e}")
            self.apk_info_cache = None
            self.apk_dir_mtime = None
    
    def check_and_reload(self) -> bool:
        """Check if APK directory has been modified and reload if needed"""
        try:
            if not self.apk_dir.exists():
                return False
            
            apk_files = [f for f in os.listdir(self.apk_dir) if f.endswith(".apk")]
            if not apk_files:
                if self.apk_info_cache is not None:
                    with self.lock:
                        self.load_apk_info()
                return False
            
            latest_apk = max(apk_files, key=lambda f: os.path.getmtime(self.apk_dir / f))
            current_mtime = os.path.getmtime(self.apk_dir / latest_apk)
            
            if self.apk_dir_mtime is None or current_mtime != self.apk_dir_mtime:
                with self.lock:
                    print(f"[APKService-{self.name}] Directory modified, reloading...")
                    self.load_apk_info()
                return True
        except Exception as e:
            print(f"[APKService-{self.name}] Error checking directory: {e}")
        return False
    
    def parse_update_message(self, version: str, build_number: str) -> str:
        """
        Parse update message for specific version from README.md
        
        Args:
            version: App version
            build_number: Build number
            
        Returns:
            Update message string
        """
        try:
            if not self.readme_path.exists():
                return ""
            
            with open(self.readme_path, 'r', encoding='utf-8') as f:
                content = f.read()
            
            lines = content.split('\n')
            capturing = False
            update_lines = []
            target_header = f"# App Version {version} Build {build_number}"
            
            for line in lines:
                if line.startswith(target_header):
                    capturing = True
                    continue
                
                if capturing:
                    if line.startswith("# App Version"):
                        break
                    if line.strip() and line.strip().startswith('-'):
                        update_lines.append(line.strip()[2:])
            
            return '\n'.join(update_lines)
        except Exception as e:
            print(f"[APKService-{self.name}] Error parsing README: {e}")
            return ""
    
    def check_for_update(self, client_version: str, client_build_number: str, request_host: str, download_path: str) -> dict:
        """
        Check if app update is available
        
        Args:
            client_version: Current client app version
            client_build_number: Current client build number
            request_host: Request host for download URL
            download_path: API path for download
            
        Returns:
            dict: Update information
        """
        # Check if we have APK info
        if not self.apk_info_cache:
            return {
                "need_update": False,
                "force_update": False
            }
        
        latest_version = self.apk_info_cache.get("version")
        latest_build_number = self.apk_info_cache.get("build_number")
        
        # Compare build numbers
        try:
            client_build = int(client_build_number)
            latest_build = int(latest_build_number)
            need_update = latest_build > client_build
        except ValueError:
            need_update = False
        
        if need_update:
            # Parse update message from README
            update_message = self.parse_update_message(latest_version, latest_build_number)
            download_url = f"http://{request_host}{download_path}/{self.apk_info_cache.get('file_name')}"
            
            return {
                "need_update": True,
                "force_update": False,
                "version_info": {
                    "version": latest_version,
                    "download_url": download_url,
                    "force_update": False,
                    "update_message": update_message
                }
            }
        else:
            return {
                "need_update": False,
                "force_update": False
            }
    
    def get_apk_path(self, filename: str) -> Optional[Path]:
        """
        Get APK file path with security validation
        
        Args:
            filename: APK filename
            
        Returns:
            Path object if valid, None otherwise
        """
        try:
            target = (self.apk_dir / filename).resolve()
            
            # Security checks
            if not str(target).startswith(str(self.apk_dir.resolve()) + os.sep):
                return None
            
            if target.suffix.lower() != ".apk":
                return None
            
            if not target.exists():
                return None
            
            return target
        except Exception as e:
            print(f"[APKService-{self.name}] Error getting APK path: {e}")
            return None


class GeofenceAPKService:
    """Service for GeoFence APK management (filename-based version parsing)"""
    
    def __init__(self, apk_dir: Path, readme_path: Path):
        """
        Initialize GeoFence APK service
        
        Args:
            apk_dir: Directory containing GeoFence APK files
            readme_path: Path to README.md for update messages
        """
        self.apk_dir = apk_dir
        self.readme_path = readme_path
        self.apk_info_cache = None
        self.apk_dir_mtime = None
        self.lock = Lock()
        
        # Load initial data
        self.load_apk_info()
    
    def load_apk_info(self):
        """Load GeoFence APK information from directory"""
        try:
            if not self.apk_dir.exists():
                print(f"[GeofenceAPKService] Warning: {self.apk_dir} not found")
                self.apk_info_cache = None
                self.apk_dir_mtime = None
                return
            
            apk_files = [f for f in os.listdir(self.apk_dir) if f.endswith(".apk")]
            if not apk_files:
                self.apk_info_cache = None
                self.apk_dir_mtime = None
                print("[GeofenceAPKService] No APK files found")
                return
            
            latest_apk = max(apk_files, key=lambda f: os.path.getmtime(self.apk_dir / f))
            apk_path = self.apk_dir / latest_apk
            
            # Parse filename: geofence_v1.0.0_888.apk
            # Format: geofence_v{version}_{build_number}.apk
            match = re.match(r'geofence_v([\d.]+)_(\d+)\.apk', latest_apk)
            if not match:
                print(f"[GeofenceAPKService] Warning: Filename format not recognized: {latest_apk}")
                self.apk_info_cache = None
                self.apk_dir_mtime = None
                return
            
            version = match.group(1)
            build_number = match.group(2)
            file_size = apk_path.stat().st_size
            file_mtime = os.path.getmtime(apk_path)
            
            self.apk_info_cache = {
                "version": version,
                "build_number": build_number,
                "file_name": latest_apk,
                "file_size": file_size,
                "file_path": str(apk_path)
            }
            self.apk_dir_mtime = file_mtime
            
            print(f"[GeofenceAPKService] Loaded: {latest_apk} v{version} build {build_number}")
        except Exception as e:
            print(f"[GeofenceAPKService] Error loading APK info: {e}")
            self.apk_info_cache = None
            self.apk_dir_mtime = None
    
    def check_and_reload(self) -> bool:
        """Check if GeoFence APK directory has been modified and reload if needed"""
        try:
            if not self.apk_dir.exists():
                return False
            
            apk_files = [f for f in os.listdir(self.apk_dir) if f.endswith(".apk")]
            if not apk_files:
                if self.apk_info_cache is not None:
                    with self.lock:
                        self.load_apk_info()
                return False
            
            latest_apk = max(apk_files, key=lambda f: os.path.getmtime(self.apk_dir / f))
            current_mtime = os.path.getmtime(self.apk_dir / latest_apk)
            
            if self.apk_dir_mtime is None or current_mtime != self.apk_dir_mtime:
                with self.lock:
                    print("[GeofenceAPKService] Directory modified, reloading...")
                    self.load_apk_info()
                return True
        except Exception as e:
            print(f"[GeofenceAPKService] Error checking directory: {e}")
        return False
    
    def get_apk_info(self) -> Optional[dict]:
        """Get cached APK info"""
        return self.apk_info_cache
    
    def get_apk_path(self, filename: str) -> Optional[Path]:
        """
        Get GeoFence APK file path with security validation
        
        Args:
            filename: APK filename
            
        Returns:
            Path object if valid, None otherwise
        """
        try:
            target = (self.apk_dir / filename).resolve()
            
            # Security checks
            if not str(target).startswith(str(self.apk_dir.resolve()) + os.sep):
                return None
            
            if target.suffix.lower() != ".apk":
                return None
            
            if not target.exists():
                return None
            
            return target
        except Exception as e:
            print(f"[GeofenceAPKService] Error getting APK path: {e}")
            return None
