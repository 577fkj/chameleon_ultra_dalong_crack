#!/usr/bin/env python3
"""
App Version API Routes
Handles Android app version check and download
"""

from flask import Blueprint, request, jsonify, send_file

from services.apk_service import APKService
from config import get_config

app_version_bp = Blueprint('app_version', __name__)

# Initialize services
config = get_config()
main_apk_service = APKService(
    config.ANDROID_APP_DIR,
    config.ANDROID_README_PATH,
    "Main"
)
geofence_apk_service = APKService(
    config.GEOFENCE_APP_DIR,
    config.GEOFENCE_README_PATH,
    "GeoFence"
)


@app_version_bp.route("/app/version/check", methods=["POST"])
def check_app_version():
    """Check for app updates"""
    data = request.get_json()
    if not data:
        print("[AppVersionAPI] Error: Request body is empty or invalid JSON")
        return jsonify({
            "code": 400,
            "message": "请求参数无效",
            "need_update": False
        }), 400
    
    client_version = data.get("version")
    client_build_number = str(data.get("build_number", ""))
    platform = data.get("platform")
    package_name = data.get("package_name", "")
    
    if not client_version or not client_build_number or platform != "android":
        print(f"[AppVersionAPI] Invalid params: version={client_version}, build={client_build_number}, platform={platform}")
        return jsonify({
            "code": 400,
            "message": "请求参数无效",
            "need_update": False
        }), 400
    
    print(f"[AppVersionAPI] Check: version={client_version}, build={client_build_number}, package={package_name}")
    
    # Determine which APK to check based on package_name
    if package_name == "geofence":
        geofence_apk_service.check_and_reload()
        apk_cache = geofence_apk_service.get_apk_info()
        download_path = "/ultra/api/v1/geofence/app/download"
    else:
        main_apk_service.check_and_reload()
        apk_cache = main_apk_service.apk_info_cache
        download_path = "/ultra/api/v1/app/download"
    
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
        if package_name == "geofence":
            # GeoFence APK service doesn't have README parsing yet
            update_message = ""
        else:
            update_message = main_apk_service.parse_update_message(latest_version, latest_build_number)
        
        download_url = f"http://{request.host}{download_path}/{apk_cache.get('file_name')}"
        
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


@app_version_bp.route("/app/download/<path:filename>", methods=["GET"])
def download_app(filename):
    """Download Android APK file"""
    target = main_apk_service.get_apk_path(filename)
    
    if not target:
        return jsonify({"code": 404, "message": "文件不存在"}), 404
    
    return send_file(
        str(target),
        as_attachment=True,
        download_name=target.name,
        mimetype="application/vnd.android.package-archive",
    )


@app_version_bp.route("/geofence/app/download/<path:filename>", methods=["GET"])
def download_geofence_app(filename):
    """Download GeoFence APK file"""
    target = geofence_apk_service.get_apk_path(filename)
    
    if not target:
        return jsonify({"code": 404, "message": "文件不存在"}), 404
    
    return send_file(
        str(target),
        as_attachment=True,
        download_name=target.name,
        mimetype="application/vnd.android.package-archive",
    )
