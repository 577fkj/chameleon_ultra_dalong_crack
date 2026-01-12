#!/usr/bin/env python3
"""
Firmware API Routes
Handles firmware version check and download
"""

from flask import Blueprint, request, jsonify, send_file

from services import FirmwareService
from config import get_config

firmware_bp = Blueprint('firmware', __name__)

# Initialize service
config = get_config()
firmware_service = FirmwareService(
    config.VERSION_FILE_PATH,
    config.FIRMWARE_DIR
)


@firmware_bp.route("/firmware/check", methods=["POST"])
def check_firmware():
    """Check for firmware updates"""
    firmware_service.check_and_reload()
    
    data = request.get_json()
    if not data:
        print("[FirmwareAPI] Error: Request body is empty or invalid JSON")
        return jsonify({
            "code": 400,
            "message": "请求参数无效",
            "need_update": False
        }), 400
    
    chip_id = data.get("chip_id")
    client_version = data.get("version")
    
    try:
        result = firmware_service.check_for_update(client_version, request.host)
        
        print(f"[FirmwareAPI] Check: chip_id={chip_id}, version={client_version}")
        
        message = "有新固件可用" if result["need_update"] else "当前固件已是最新版本"
        
        return jsonify({
            "code": 200,
            "message": message,
            "need_update": result["need_update"],
            "firmware_info": result["firmware_info"],
        })
    except ValueError as e:
        print(f"[FirmwareAPI] ValueError: {e}")
        return jsonify({
            "code": 400,
            "message": "请求参数无效",
            "need_update": False
        }), 400
    except Exception as e:
        print(f"[FirmwareAPI] Error: {e}")
        return jsonify({
            "code": 500,
            "message": "服务器内部错误",
            "need_update": False
        }), 500


@firmware_bp.route("/firmware/download/<version>/<path:filename>", methods=["GET"])
def download_firmware(version, filename):
    """Download firmware file"""
    target = firmware_service.get_firmware_path(filename)
    
    if not target:
        return jsonify({"code": 404, "message": "文件不存在"}), 404
    
    return send_file(
        str(target),
        as_attachment=True,
        download_name=target.name,
        mimetype="application/zip",
    )


@firmware_bp.route("/firmware/download/lastest.zip", methods=["GET"])
def download_latest_firmware():
    """Download latest firmware (version 3.x)"""
    firmware_service.check_and_reload()
    
    full_version, _ = firmware_service.get_version_string("3")
    if not full_version:
        return jsonify({"code": 404, "message": "最新固件文件不存在"}), 404
    
    filename = f"{full_version}.zip"
    target = firmware_service.get_firmware_path(filename)
    
    if not target:
        return jsonify({"code": 404, "message": "最新固件文件不存在"}), 404
    
    return send_file(
        str(target),
        as_attachment=True,
        download_name=filename,
        mimetype="application/zip",
    )


@firmware_bp.route("/firmware/download/lastest4.zip", methods=["GET"])
def download_latest_firmware4():
    """Download latest firmware (version 4.x)"""
    firmware_service.check_and_reload()
    
    full_version, _ = firmware_service.get_version_string("4")
    if not full_version:
        return jsonify({"code": 404, "message": "最新固件文件不存在"}), 404
    
    filename = f"{full_version}.zip"
    target = firmware_service.get_firmware_path(filename)
    
    if not target:
        return jsonify({"code": 404, "message": "最新固件文件不存在"}), 404
    
    return send_file(
        str(target),
        as_attachment=True,
        download_name=filename,
        mimetype="application/zip",
    )


@firmware_bp.route("/firmware/download/lastest5.zip", methods=["GET"])
def download_latest_firmware5():
    """Download latest firmware (version 5.x)"""
    firmware_service.check_and_reload()
    
    full_version, _ = firmware_service.get_version_string("5")
    if not full_version:
        return jsonify({"code": 404, "message": "最新固件文件不存在"}), 404
    
    filename = f"{full_version}.zip"
    target = firmware_service.get_firmware_path(filename)
    
    if not target:
        return jsonify({"code": 404, "message": "最新固件文件不存在"}), 404
    
    return send_file(
        str(target),
        as_attachment=True,
        download_name=filename,
        mimetype="application/zip",
    )
