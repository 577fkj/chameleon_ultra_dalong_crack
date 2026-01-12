#!/usr/bin/env python3
"""
Device API Routes
Handles device registration and authentication
"""

from flask import Blueprint, request, jsonify

from services import AuthService

device_bp = Blueprint('device', __name__)
auth_service = AuthService()


@device_bp.route("/device/register", methods=["POST"])
def register():
    """Device registration endpoint"""
    data = request.get_json()
    if not data:
        print("[DeviceAPI] Error: Request body is empty or invalid JSON")
        return jsonify({
            "code": 400,
            "message": "请求参数无效"
        }), 400
    
    chip_id = data.get("chip_id")
    license_key = data.get("activation_code")
    firmware_version = data.get("firmware_version")
    
    try:
        result = auth_service.register_device(chip_id, license_key, firmware_version)
        
        return jsonify({
            "code": 200,
            "message": "激活成功",
            "secret_key": result["secret_key"],
            "address_key": result["address_key"],
        })
    except ValueError as e:
        print(f"[DeviceAPI] ValueError: {e}")
        return jsonify({
            "code": 400,
            "message": "请求参数无效"
        }), 400
    except Exception as e:
        print(f"[DeviceAPI] Error: {e}")
        return jsonify({
            "code": 500,
            "message": "服务器内部错误"
        }), 500
