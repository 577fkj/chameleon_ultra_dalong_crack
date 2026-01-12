#!/usr/bin/env python3
"""
Chameleon Ultra Server
Provides firmware management, app version check, and geofence services
"""

import json
import hashlib
import os
import time
from flask import Flask, request, jsonify, send_file
from threading import Thread, Lock
from pathlib import Path
import uuid
from datetime import datetime
from androguard.core.apk import APK

app = Flask(__name__)

# Configuration
VERSION_FILE_PATH = "version.json"
FIRMWARE_DIR = "../firmware"
GEOFENCE_DATABASE_PATH = "geofence.json"
ANDROID_APP_DIR = "../software/Android"
ANDROID_README_PATH = "../software/Android/README.md"
GEOFENCE_APP_DIR = "../software/GeoFence/Android"
GEOFENCE_README_PATH = "../software/GeoFence/Android/README.md"
MONITOR_INTERVAL = 5  # seconds

# Resolve paths
firmware_base_path = Path(FIRMWARE_DIR).resolve()
android_app_base_path = Path(ANDROID_APP_DIR).resolve()
geofence_app_base_path = Path(GEOFENCE_APP_DIR).resolve()

# Global state with locks for thread safety
version_info = {}
version_file_mtime = None
version_lock = Lock()

geofence_data = {}
geofence_lock = Lock()

apk_info_cache = None
apk_dir_mtime = None
apk_lock = Lock()

geofence_apk_info_cache = None
geofence_apk_dir_mtime = None
geofence_apk_lock = Lock()


# ============================================================================
# Firmware Version Management
# ============================================================================

def load_version_info():
    """Load firmware version information from version.json"""
    global version_info, version_file_mtime
    try:
        if not os.path.exists(VERSION_FILE_PATH):
            print(f"Warning: {VERSION_FILE_PATH} not found")
            version_info = {}
            version_file_mtime = None
            return
            
        with open(VERSION_FILE_PATH, "r", encoding="utf-8") as f:
            version_info = json.load(f)
        version_file_mtime = os.path.getmtime(VERSION_FILE_PATH)
        print(f"[Firmware] Loaded version info for {len(version_info)} versions")
    except Exception as e:
        print(f"[Firmware] Error loading version info: {e}")
        version_info = {}
        version_file_mtime = None


def check_and_reload_version():
    """Check if version.json has been modified and reload if needed"""
    global version_file_mtime
    try:
        if not os.path.exists(VERSION_FILE_PATH):
            return False
            
        current_mtime = os.path.getmtime(VERSION_FILE_PATH)
        if version_file_mtime is None or current_mtime != version_file_mtime:
            with version_lock:
                print("[Firmware] version.json modified, reloading...")
                load_version_info()
            return True
    except Exception as e:
        print(f"[Firmware] Error checking version file: {e}")
    return False


def get_firmware_version_string(version_prefix: str):
    """Get formatted firmware version string"""
    if version_prefix not in version_info:
        return None, None
    
    ver_data = version_info[version_prefix]
    version = ver_data.get("version", "")
    sub_version = ver_data.get("sub_version", "")
    commit_hash = ver_data.get("commit_hash", "")
    update_time = ver_data.get("update_time", "")
    
    full_version = f"v{version_prefix}.{version}-{sub_version}-{commit_hash}"
    return full_version, update_time


def extract_version_prefix(version: str):
    """Extract version prefix from version string"""
    if version.startswith("v"):
        return version.split(".")[0][1:]
    return version.split(".")[0]


# ============================================================================
# Android APK Management
# ============================================================================

def load_apk_info():
    """Load APK information from Android directory"""
    global apk_info_cache, apk_dir_mtime
    try:
        if not os.path.exists(ANDROID_APP_DIR):
            print(f"[APK] Warning: {ANDROID_APP_DIR} not found")
            apk_info_cache = None
            apk_dir_mtime = None
            return
            
        apk_files = [f for f in os.listdir(ANDROID_APP_DIR) if f.endswith(".apk")]
        if not apk_files:
            apk_info_cache = None
            apk_dir_mtime = None
            print("[APK] No APK files found")
            return
        
        latest_apk = max(apk_files, key=lambda f: os.path.getmtime(os.path.join(ANDROID_APP_DIR, f)))
        apk_path = os.path.join(ANDROID_APP_DIR, latest_apk)
        
        apk = APK(apk_path)
        version = apk.get_androidversion_name()
        build_number = str(apk.get_androidversion_code())
        file_size = os.path.getsize(apk_path)
        file_mtime = os.path.getmtime(apk_path)
        
        apk_info_cache = {
            "version": version,
            "build_number": build_number,
            "file_name": latest_apk,
            "file_size": file_size,
            "file_path": apk_path
        }
        apk_dir_mtime = file_mtime
        
        print(f"[APK] Loaded: {latest_apk} v{version} build {build_number}")
    except Exception as e:
        print(f"[APK] Error loading APK info: {e}")
        apk_info_cache = None
        apk_dir_mtime = None


def check_and_reload_apk_info():
    """Check if APK directory has been modified and reload if needed"""
    global apk_dir_mtime
    try:
        if not os.path.exists(ANDROID_APP_DIR):
            return False
            
        apk_files = [f for f in os.listdir(ANDROID_APP_DIR) if f.endswith(".apk")]
        if not apk_files:
            if apk_info_cache is not None:
                with apk_lock:
                    load_apk_info()
            return False
        
        latest_apk = max(apk_files, key=lambda f: os.path.getmtime(os.path.join(ANDROID_APP_DIR, f)))
        current_mtime = os.path.getmtime(os.path.join(ANDROID_APP_DIR, latest_apk))
        
        if apk_dir_mtime is None or current_mtime != apk_dir_mtime:
            with apk_lock:
                print("[APK] Directory modified, reloading...")
                load_apk_info()
            return True
    except Exception as e:
        print(f"[APK] Error checking directory: {e}")
    return False


def parse_update_message_from_readme(path: str, version: str, build_number: str):
    """Parse update message for specific version from README.md"""
    try:
        if not os.path.exists(path):
            return ""
        
        with open(path, 'r', encoding='utf-8') as f:
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
        print(f"[APK] Error parsing README: {e}")
        return ""


# ============================================================================
# GeoFence APK Management
# ============================================================================

def load_geofence_apk_info():
    """Load GeoFence APK information from GeoFence/Android directory"""
    global geofence_apk_info_cache, geofence_apk_dir_mtime
    try:
        if not os.path.exists(GEOFENCE_APP_DIR):
            print(f"[GeoFence APK] Warning: {GEOFENCE_APP_DIR} not found")
            geofence_apk_info_cache = None
            geofence_apk_dir_mtime = None
            return
            
        apk_files = [f for f in os.listdir(GEOFENCE_APP_DIR) if f.endswith(".apk")]
        if not apk_files:
            geofence_apk_info_cache = None
            geofence_apk_dir_mtime = None
            print("[GeoFence APK] No APK files found")
            return
        
        latest_apk = max(apk_files, key=lambda f: os.path.getmtime(os.path.join(GEOFENCE_APP_DIR, f)))
        apk_path = os.path.join(GEOFENCE_APP_DIR, latest_apk)
        
        # Parse filename: geofence_v1.0.0_888.apk
        # Format: geofence_v{version}_{build_number}.apk
        import re
        match = re.match(r'geofence_v([\d.]+)_(\d+)\.apk', latest_apk)
        if not match:
            print(f"[GeoFence APK] Warning: Filename format not recognized: {latest_apk}")
            geofence_apk_info_cache = None
            geofence_apk_dir_mtime = None
            return
        
        version = match.group(1)
        build_number = match.group(2)
        file_size = os.path.getsize(apk_path)
        file_mtime = os.path.getmtime(apk_path)
        
        geofence_apk_info_cache = {
            "version": version,
            "build_number": build_number,
            "file_name": latest_apk,
            "file_size": file_size,
            "file_path": apk_path
        }
        geofence_apk_dir_mtime = file_mtime
        
        print(f"[GeoFence APK] Loaded: {latest_apk} v{version} build {build_number}")
    except Exception as e:
        print(f"[GeoFence APK] Error loading APK info: {e}")
        geofence_apk_info_cache = None
        geofence_apk_dir_mtime = None


def check_and_reload_geofence_apk_info():
    """Check if GeoFence APK directory has been modified and reload if needed"""
    global geofence_apk_dir_mtime
    try:
        if not os.path.exists(GEOFENCE_APP_DIR):
            return False
            
        apk_files = [f for f in os.listdir(GEOFENCE_APP_DIR) if f.endswith(".apk")]
        if not apk_files:
            if geofence_apk_info_cache is not None:
                with geofence_apk_lock:
                    load_geofence_apk_info()
            return False
        
        latest_apk = max(apk_files, key=lambda f: os.path.getmtime(os.path.join(GEOFENCE_APP_DIR, f)))
        current_mtime = os.path.getmtime(os.path.join(GEOFENCE_APP_DIR, latest_apk))
        
        if geofence_apk_dir_mtime is None or current_mtime != geofence_apk_dir_mtime:
            with geofence_apk_lock:
                print("[GeoFence APK] Directory modified, reloading...")
                load_geofence_apk_info()
            return True
    except Exception as e:
        print(f"[GeoFence APK] Error checking directory: {e}")
    return False


# ============================================================================
# Geofence Management
# ============================================================================

def get_iso_8601_timestamp():
    """Get current timestamp in ISO 8601 format"""
    return datetime.now().astimezone().isoformat()


def load_geofence_database():
    """Load geofence database from JSON file"""
    global geofence_data
    try:
        if not os.path.exists(GEOFENCE_DATABASE_PATH):
            geofence_data = {}
            return
            
        with open(GEOFENCE_DATABASE_PATH, "r", encoding="utf-8") as f:
            geofence_data = json.load(f)
        print(f"[Geofence] Loaded {len(geofence_data)} subscriptions")
    except Exception as e:
        print(f"[Geofence] Error loading database: {e}")
        geofence_data = {}


def save_geofence_database():
    """Save geofence database to JSON file"""
    try:
        with geofence_lock:
            with open(GEOFENCE_DATABASE_PATH, "w", encoding="utf-8") as f:
                json.dump(geofence_data, f, indent=4, ensure_ascii=False)
    except Exception as e:
        print(f"[Geofence] Error saving database: {e}")


# ============================================================================
# Device Authentication
# ============================================================================

def get_secret_key(chip_id: str, license_key: str):
    """Generate secret key from chip_id and license_key"""
    m = hashlib.sha256()
    m.update(chip_id.encode("utf-8"))
    m.update(license_key.encode("utf-8"))
    m.update(chip_id.encode("utf-8"))
    return m.digest().hex()[:16]


def get_address_key(chip_id: str, license_key: str):
    """Generate address key from chip_id and license_key"""
    m = hashlib.sha256()
    m.update(chip_id.encode("utf-8"))
    m.update(license_key.encode("utf-8"))
    m.update(license_key.encode("utf-8"))
    m.update(chip_id.encode("utf-8"))
    return m.digest().hex()[-16:]


# ============================================================================
# Background Monitor Thread
# ============================================================================

def background_monitor():
    """Background thread to monitor file changes"""
    print("[Monitor] Started")
    while True:
        time.sleep(MONITOR_INTERVAL)
        check_and_reload_version()
        check_and_reload_apk_info()
        check_and_reload_geofence_apk_info()


# ============================================================================
# API Routes - Device Registration
# ============================================================================


@app.route("/ultra/api/v1/device/register", methods=["POST"])
def register():
    """Device registration endpoint"""
    data = request.get_json()
    chip_id = data.get("chip_id")
    license_key = data.get("activation_code")
    firmware_version = data.get("firmware_version")
    
    if not chip_id or not license_key or len(chip_id) != 16 or len(license_key) != 12:
        return jsonify({"code": 400, "message": "请求参数无效"}), 400

    secret_key = get_secret_key(chip_id, license_key)
    address_key = get_address_key(chip_id, license_key)
    
    print(f"[Register] chip_id={chip_id}, firmware={firmware_version}")
    
    return jsonify({
        "code": 200,
        "message": "激活成功",
        "secret_key": secret_key,
        "address_key": address_key,
    })


# ============================================================================
# API Routes - Firmware Management
# ============================================================================

@app.route("/ultra/api/v1/firmware/check", methods=["POST"])
def check_firmware():
    """Check for firmware updates"""
    check_and_reload_version()

    data = request.get_json()
    chip_id = data.get("chip_id")
    client_version = data.get("version")
    
    if not client_version:
        return jsonify({
            "code": 400,
            "message": "请求参数无效",
            "need_update": False
        }), 400

    print(f"[Firmware] Check: chip_id={chip_id}, version={client_version}")

    version_prefix = extract_version_prefix(client_version)
    full_version, update_time = get_firmware_version_string(version_prefix)
    
    if not full_version:
        return jsonify({
            "code": 400,
            "message": "请求参数无效",
            "need_update": False
        }), 400

    filename = f"{full_version}.zip"
    firmware_path = os.path.join(FIRMWARE_DIR, filename)
    
    file_size = 0
    if os.path.exists(firmware_path):
        file_size = os.path.getsize(firmware_path)
    else:
        print(f"[Firmware] Warning: {firmware_path} not found")
    
    need_update = client_version != full_version
    version_short = full_version.split("-")[0]
    download_url = f"http://{request.host}/ultra/api/v1/firmware/download/{version_short}/{filename}"

    firmware_info = {
        "version": full_version,
        "file_name": filename,
        "file_size": file_size,
        "upload_time": update_time,
        "download_url": download_url,
    }

    message = "有新固件可用" if need_update else "当前固件已是最新版本"

    return jsonify({
        "code": 200,
        "message": message,
        "need_update": need_update,
        "firmware_info": firmware_info,
    })


@app.route("/ultra/api/v1/firmware/download/<version>/<path:filename>", methods=["GET"])
def download_firmware(version, filename):
    """Download firmware file"""
    target = (firmware_base_path / filename).resolve()

    # Security checks
    if not str(target).startswith(str(firmware_base_path) + os.sep):
        return jsonify({"code": 404, "message": "文件不存在"}), 404

    if target.suffix.lower() != ".zip":
        return jsonify({"code": 404, "message": "文件不存在"}), 404

    if not target.exists():
        return jsonify({"code": 404, "message": "文件不存在"}), 404

    return send_file(
        str(target),
        as_attachment=True,
        download_name=target.name,
        mimetype="application/zip",
    )


@app.route("/ultra/api/v1/firmware/download/lastest.zip", methods=["GET"])
def download_latest_firmware():
    """Download latest firmware (version 3.x)"""
    check_and_reload_version()

    full_version, _ = get_firmware_version_string("3")
    if not full_version:
        return jsonify({"code": 404, "message": "最新固件文件不存在"}), 404

    filename = f"{full_version}.zip"
    firmware_path = os.path.join(FIRMWARE_DIR, filename)

    if not os.path.exists(firmware_path):
        return jsonify({"code": 404, "message": "最新固件文件不存在"}), 404

    return send_file(
        firmware_path,
        as_attachment=True,
        download_name=filename,
        mimetype="application/zip",
    )


@app.route("/ultra/api/v1/firmware/download/lastest4.zip", methods=["GET"])
def download_latest_firmware4():
    """Download latest firmware (version 4.x)"""
    check_and_reload_version()

    full_version, _ = get_firmware_version_string("4")
    if not full_version:
        return jsonify({"code": 404, "message": "最新固件文件不存在"}), 404

    filename = f"{full_version}.zip"
    firmware_path = os.path.join(FIRMWARE_DIR, filename)

    if not os.path.exists(firmware_path):
        return jsonify({"code": 404, "message": "最新固件文件不存在"}), 404

    return send_file(
        firmware_path,
        as_attachment=True,
        download_name=filename,
        mimetype="application/zip",
    )


@app.route("/ultra/api/v1/firmware/download/lastest5.zip", methods=["GET"])
def download_latest_firmware5():
    """Download latest firmware (version 5.x)"""
    check_and_reload_version()

    full_version, _ = get_firmware_version_string("5")
    if not full_version:
        return jsonify({"code": 404, "message": "最新固件文件不存在"}), 404

    filename = f"{full_version}.zip"
    firmware_path = os.path.join(FIRMWARE_DIR, filename)

    if not os.path.exists(firmware_path):
        return jsonify({"code": 404, "message": "最新固件文件不存在"}), 404

    return send_file(
        firmware_path,
        as_attachment=True,
        download_name=filename,
        mimetype="application/zip",
    )


# ============================================================================
# API Routes - Android App Management
# ============================================================================

@app.route("/ultra/api/v1/app/version/check", methods=["POST"])
def check_app_version():
    """Check for app updates"""
    data = request.get_json()
    client_version = data.get("version")
    client_build_number = str(data.get("build_number", ""))
    platform = data.get("platform")
    package_name = data.get("package_name", "")

    if not client_version or not client_build_number or platform != "android":
        return jsonify({
            "code": 400,
            "message": "请求参数无效",
            "need_update": False
        }), 400

    print(f"[App] Check: version={client_version}, build={client_build_number}, package={package_name}")

    # Determine which APK to check based on package_name
    if package_name == "geofence":
        check_and_reload_geofence_apk_info()
        apk_cache = geofence_apk_info_cache
        download_base_url = "/ultra/api/v1/geofence/app/download"
    else:
        check_and_reload_apk_info()
        apk_cache = apk_info_cache
        download_base_url = "/ultra/api/v1/app/download"

    # Check if we have APK info
    if not apk_cache:
        return jsonify({
            "code": 200,
            "message": "当前版本已是最新版本",
            "need_update": False,
            "force_update": False
        })
    
    latest_version = apk_cache.get("version")
    latest_build_number = apk_cache.get("build_number")
    
    # Compare build numbers
    try:
        client_build = int(client_build_number)
        latest_build = int(latest_build_number)
        need_update = latest_build > client_build
    except ValueError:
        need_update = False
    
    if need_update:
        # Parse update message from README (only for main app)
        update_message = ""
        if package_name == "geofence":
            update_message = parse_update_message_from_readme(GEOFENCE_README_PATH, latest_version, latest_build_number)
        else:
            update_message = parse_update_message_from_readme(ANDROID_README_PATH, latest_version, latest_build_number)
        
        download_url = f"http://{request.host}{download_base_url}/{apk_cache.get('file_name')}"
        
        version_info_data = {
            "version": latest_version,
            "download_url": download_url,
            "force_update": False,
            "update_message": update_message
        }
        
        return jsonify({
            "code": 200,
            "message": "发现新版本,建议更新",
            "need_update": True,
            "force_update": False,
            "version_info": version_info_data,
        })
    else:
        return jsonify({
            "code": 200,
            "message": "当前版本已是最新版本",
            "need_update": False,
            "force_update": False
        })


@app.route("/ultra/api/v1/app/download/<path:filename>", methods=["GET"])
def download_app(filename):
    """Download Android APK file"""
    target = (android_app_base_path / filename).resolve()

    # Security checks
    if not str(target).startswith(str(android_app_base_path) + os.sep):
        return jsonify({"code": 404, "message": "文件不存在"}), 404

    if target.suffix.lower() != ".apk":
        return jsonify({"code": 404, "message": "文件不存在"}), 404

    if not target.exists():
        return jsonify({"code": 404, "message": "文件不存在"}), 404

    return send_file(
        str(target),
        as_attachment=True,
        download_name=target.name,
        mimetype="application/vnd.android.package-archive",
    )


@app.route("/ultra/api/v1/geofence/app/download/<path:filename>", methods=["GET"])
def download_geofence_app(filename):
    """Download GeoFence APK file"""
    target = (geofence_app_base_path / filename).resolve()

    # Security checks
    if not str(target).startswith(str(geofence_app_base_path) + os.sep):
        return jsonify({"code": 404, "message": "文件不存在"}), 404

    if target.suffix.lower() != ".apk":
        return jsonify({"code": 404, "message": "文件不存在"}), 404

    if not target.exists():
        return jsonify({"code": 404, "message": "文件不存在"}), 404

    return send_file(
        str(target),
        as_attachment=True,
        download_name=target.name,
        mimetype="application/vnd.android.package-archive",
    )


# ============================================================================
# API Routes - Geofence Management
# ============================================================================


@app.route("/ultra/api/v1/geofence/subscription/create", methods=["POST"])
def create_geofence_subscription():
    """Create a new geofence subscription"""
    data = request.get_json()
    encrypted_data = data.get("encryptedData")
    admin_password = data.get("adminPassword")
    device_id = data.get("deviceId")

    if not encrypted_data or not admin_password or not device_id:
        return jsonify({"success": False, "error": "请求参数无效"}), 200

    sub_id = str(uuid.uuid4())
    timestamp = get_iso_8601_timestamp()

    with geofence_lock:
        geofence_data[sub_id] = {
            "encryptedData": encrypted_data,
            "adminPassword": admin_password,
            "deviceId": device_id,
            "subscriptionDevice": {},
            "createAt": timestamp,
            "updateAt": timestamp,
        }
        save_geofence_database()

    print(f"[Geofence] Created subscription: {sub_id}")
    
    return jsonify({
        "success": True,
        "subscriptionId": sub_id,
        "subscriptionUrl": f"http://{request.host}/ultra/api/v1/geofence/subscription/{sub_id}",
    })


@app.route("/ultra/api/v1/geofence/subscription/update", methods=["POST"])
def update_geofence_subscription():
    """Update an existing geofence subscription"""
    data = request.get_json()
    sub_id = data.get("subscriptionId")
    encrypted_data = data.get("encryptedData")
    admin_password = data.get("adminPassword")
    device_id = data.get("deviceId")

    if not sub_id or not encrypted_data or not admin_password or not device_id:
        return jsonify({"success": False, "error": "请求参数无效"}), 200

    if sub_id not in geofence_data:
        return jsonify({"success": False, "error": "订阅ID不存在"}), 200
    
    subscription = geofence_data[sub_id]
    if subscription["adminPassword"] != admin_password:
        return jsonify({"success": False, "error": "管理密码错误"}), 200
    
    if subscription["deviceId"] != device_id:
        return jsonify({"success": False, "error": "设备ID不匹配"}), 200

    with geofence_lock:
        subscription["encryptedData"] = encrypted_data
        subscription["updateAt"] = get_iso_8601_timestamp()
        save_geofence_database()

    print(f"[Geofence] Updated subscription: {sub_id}")
    return jsonify({"success": True})


@app.route("/ultra/api/v1/geofence/subscription/delete", methods=["POST"])
def delete_geofence_subscription():
    """Delete a geofence subscription"""
    data = request.get_json()
    sub_id = data.get("subscriptionId")
    admin_password = data.get("adminPassword")
    device_id = data.get("deviceId")

    if not sub_id or not admin_password or not device_id:
        return jsonify({"success": False, "error": "请求参数无效"}), 200

    if sub_id not in geofence_data:
        return jsonify({"success": True})
    
    subscription = geofence_data[sub_id]
    if subscription["adminPassword"] != admin_password:
        return jsonify({"success": False, "error": "管理密码错误"}), 200
    
    if subscription["deviceId"] != device_id:
        return jsonify({"success": False, "error": "设备ID不匹配"}), 200

    with geofence_lock:
        del geofence_data[sub_id]
        save_geofence_database()

    print(f"[Geofence] Deleted subscription: {sub_id}")
    return jsonify({"success": True})


@app.route("/ultra/api/v1/geofence/subscription/<subscriptionId>", methods=["GET", "POST"])
def get_geofence_subscription(subscriptionId):
    """Get geofence data for a subscription"""
    device_id = request.args.get("deviceId")
    if not device_id:
        return jsonify({"success": False, "error": "请求参数无效"}), 200

    if subscriptionId not in geofence_data:
        return jsonify({"success": False, "error": "订阅ID不存在"}), 200
    
    subscription = geofence_data[subscriptionId]
    timestamp = get_iso_8601_timestamp()
    
    # Register or update device access
    with geofence_lock:
        if device_id not in subscription["subscriptionDevice"]:
            subscription["subscriptionDevice"][device_id] = {
                "name": "",
                "enabled": True,
                "createdAt": timestamp,
                "lastAccessAt": timestamp
            }
        else:
            subscription["subscriptionDevice"][device_id]["lastAccessAt"] = timestamp
        
        save_geofence_database()
    
    # Check if device is enabled
    if not subscription["subscriptionDevice"][device_id]["enabled"]:
        return jsonify({"success": False, "error": "该设备已被禁用，无法获取订阅数据"}), 200

    return jsonify({
        "success": True,
        "encryptedData": subscription["encryptedData"],
    })


@app.route("/ultra/api/v1/geofence/subscription/device/name", methods=["POST"])
def name_geofence_subscription_device():
    """Set device name for a subscription"""
    data = request.get_json()
    sub_id = data.get("subscriptionId")
    target_device_id = data.get("targetDeviceId")
    device_name = data.get("deviceName")
    admin_password = data.get("adminPassword")
    device_id = data.get("deviceId")

    if not all([sub_id, target_device_id, device_name, admin_password, device_id]):
        return jsonify({"success": False, "error": "请求参数无效"}), 200

    if sub_id not in geofence_data:
        return jsonify({"success": False, "error": "订阅ID不存在"}), 200
    
    subscription = geofence_data[sub_id]
    if subscription["adminPassword"] != admin_password:
        return jsonify({"success": False, "error": "管理密码错误"}), 200
    
    if subscription["deviceId"] != device_id:
        return jsonify({"success": False, "error": "设备ID不匹配"}), 200
    
    if target_device_id not in subscription["subscriptionDevice"]:
        return jsonify({"success": False, "error": "目标设备ID不存在"}), 200
    
    with geofence_lock:
        subscription["subscriptionDevice"][target_device_id]["name"] = device_name
        save_geofence_database()

    return jsonify({"success": True})


@app.route("/ultra/api/v1/geofence/subscription/device/<mode>", methods=["POST"])
def set_geofence_subscription_device_mode(mode):
    """Enable or disable a device in a subscription"""
    data = request.get_json()
    sub_id = data.get("subscriptionId")
    target_device_id = data.get("targetDeviceId")
    admin_password = data.get("adminPassword")
    device_id = data.get("deviceId")

    if not all([sub_id, target_device_id, admin_password, device_id]):
        return jsonify({"success": False, "error": "请求参数无效"}), 200

    if sub_id not in geofence_data:
        return jsonify({"success": False, "error": "订阅ID不存在"}), 200
    
    subscription = geofence_data[sub_id]
    if subscription["adminPassword"] != admin_password:
        return jsonify({"success": False, "error": "管理密码错误"}), 200
    
    if subscription["deviceId"] != device_id:
        return jsonify({"success": False, "error": "设备ID不匹配"}), 200
    
    if target_device_id not in subscription["subscriptionDevice"]:
        return jsonify({"success": False, "error": "目标设备ID不存在"}), 200
    
    if mode not in ["disable", "enable"]:
        return jsonify({"success": False, "error": "请求参数无效"}), 200
    
    with geofence_lock:
        subscription["subscriptionDevice"][target_device_id]["enabled"] = (mode == "enable")
        save_geofence_database()

    return jsonify({"success": True})


@app.route("/ultra/api/v1/geofence/subscription/devices", methods=["POST"])
def list_geofence_subscription_devices():
    """List all devices in a subscription"""
    data = request.get_json()
    sub_id = data.get("subscriptionId")
    admin_password = data.get("adminPassword")
    device_id = data.get("deviceId")

    if not all([sub_id, admin_password, device_id]):
        return jsonify({"success": False, "error": "请求参数无效"}), 200

    if sub_id not in geofence_data:
        return jsonify({"success": False, "error": "订阅ID不存在"}), 200
    
    subscription = geofence_data[sub_id]
    if subscription["adminPassword"] != admin_password:
        return jsonify({"success": False, "error": "管理密码错误"}), 200
    
    if subscription["deviceId"] != device_id:
        return jsonify({"success": False, "error": "设备ID不匹配"}), 200

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

    return jsonify({
        "success": True,
        "devices": devices
    })


# ============================================================================
# Application Entry Point
# ============================================================================

if __name__ == "__main__":
    print("=" * 60)
    print("Chameleon Ultra Server Starting...")
    print("=" * 60)
    
    # Load initial data
    load_version_info()
    load_geofence_database()
    load_apk_info()
    load_geofence_apk_info()
    
    # Start background monitor thread
    monitor_thread = Thread(target=background_monitor, daemon=True, name="MonitorThread")
    monitor_thread.start()
    
    print("\n[Server] Ready on http://0.0.0.0:8080")
    print("=" * 60 + "\n")
    
    # Start Flask server
    app.run(host="0.0.0.0", port=8080, debug=False)
