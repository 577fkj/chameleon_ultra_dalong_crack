#!/usr/bin/env python3
"""
Geofence API Routes
Handles geofence subscription management
"""

from flask import Blueprint, request, jsonify

from services import GeofenceService
from config import get_config

geofence_bp = Blueprint('geofence', __name__)

# Initialize service
config = get_config()
geofence_service = GeofenceService(config.GEOFENCE_DATABASE_PATH)


@geofence_bp.route("/geofence/subscription/create", methods=["POST"])
def create_geofence_subscription():
    """Create a new geofence subscription"""
    data = request.get_json()
    if not data:
        print("[GeofenceAPI] Error: Request body is empty or invalid JSON")
        return jsonify({"success": False, "error": "请求参数无效"}), 200
    
    encrypted_data = data.get("encryptedData")
    admin_password = data.get("adminPassword")
    device_id = data.get("deviceId")
    
    try:
        result = geofence_service.create_subscription(encrypted_data, admin_password, device_id)
        
        return jsonify({
            "success": True,
            "subscriptionId": result["subscriptionId"],
            "subscriptionUrl": f"http://{request.host}/ultra/api/v1/geofence/subscription/{result['subscriptionId']}",
        })
    except ValueError as e:
        return jsonify({"success": False, "error": "请求参数无效"}), 200
    except Exception as e:
        print(f"[GeofenceAPI] Error creating subscription: {e}")
        return jsonify({"success": False, "error": "服务器内部错误"}), 200


@geofence_bp.route("/geofence/subscription/update", methods=["POST"])
def update_geofence_subscription():
    """Update an existing geofence subscription"""
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "error": "请求参数无效"}), 200
    
    sub_id = data.get("subscriptionId")
    encrypted_data = data.get("encryptedData")
    admin_password = data.get("adminPassword")
    device_id = data.get("deviceId")
    
    try:
        geofence_service.update_subscription(sub_id, encrypted_data, admin_password, device_id)
        return jsonify({"success": True})
    except ValueError as e:
        error_msg = str(e)
        if "password" in error_msg.lower():
            return jsonify({"success": False, "error": "管理密码错误"}), 200
        elif "mismatch" in error_msg.lower():
            return jsonify({"success": False, "error": "设备ID不匹配"}), 200
        elif "not found" in error_msg.lower():
            return jsonify({"success": False, "error": "订阅ID不存在"}), 200
        else:
            return jsonify({"success": False, "error": "请求参数无效"}), 200
    except Exception as e:
        print(f"[GeofenceAPI] Error updating subscription: {e}")
        return jsonify({"success": False, "error": "服务器内部错误"}), 200


@geofence_bp.route("/geofence/subscription/delete", methods=["POST"])
def delete_geofence_subscription():
    """Delete a geofence subscription"""
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "error": "请求参数无效"}), 200
    
    sub_id = data.get("subscriptionId")
    admin_password = data.get("adminPassword")
    device_id = data.get("deviceId")
    
    try:
        geofence_service.delete_subscription(sub_id, admin_password, device_id)
        return jsonify({"success": True})
    except ValueError as e:
        error_msg = str(e)
        if "password" in error_msg.lower():
            return jsonify({"success": False, "error": "管理密码错误"}), 200
        elif "mismatch" in error_msg.lower():
            return jsonify({"success": False, "error": "设备ID不匹配"}), 200
        else:
            return jsonify({"success": True})  # Already deleted
    except Exception as e:
        print(f"[GeofenceAPI] Error deleting subscription: {e}")
        return jsonify({"success": False, "error": "服务器内部错误"}), 200


@geofence_bp.route("/geofence/subscription/<subscriptionId>", methods=["GET", "POST"])
def get_geofence_subscription(subscriptionId):
    """Get geofence data for a subscription"""
    device_id = request.args.get("deviceId")
    
    try:
        encrypted_data = geofence_service.get_subscription_data(subscriptionId, device_id)
        
        return jsonify({
            "success": True,
            "encryptedData": encrypted_data,
        })
    except ValueError as e:
        error_msg = str(e)
        if "disabled" in error_msg.lower():
            return jsonify({"success": False, "error": "该设备已被禁用，无法获取订阅数据"}), 200
        elif "not found" in error_msg.lower():
            return jsonify({"success": False, "error": "订阅ID不存在"}), 200
        else:
            return jsonify({"success": False, "error": "请求参数无效"}), 200
    except Exception as e:
        print(f"[GeofenceAPI] Error getting subscription: {e}")
        return jsonify({"success": False, "error": "服务器内部错误"}), 200


@geofence_bp.route("/geofence/subscription/device/name", methods=["POST"])
def name_geofence_subscription_device():
    """Set device name for a subscription"""
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "error": "请求参数无效"}), 200
    
    sub_id = data.get("subscriptionId")
    target_device_id = data.get("targetDeviceId")
    device_name = data.get("deviceName")
    admin_password = data.get("adminPassword")
    device_id = data.get("deviceId")
    
    try:
        geofence_service.set_device_name(sub_id, target_device_id, device_name, admin_password, device_id)
        return jsonify({"success": True})
    except ValueError as e:
        error_msg = str(e)
        if "password" in error_msg.lower():
            return jsonify({"success": False, "error": "管理密码错误"}), 200
        elif "mismatch" in error_msg.lower():
            return jsonify({"success": False, "error": "设备ID不匹配"}), 200
        elif "Target device" in error_msg or "目标设备" in error_msg:
            return jsonify({"success": False, "error": "目标设备ID不存在"}), 200
        elif "not found" in error_msg.lower():
            return jsonify({"success": False, "error": "订阅ID不存在"}), 200
        else:
            return jsonify({"success": False, "error": "请求参数无效"}), 200
    except Exception as e:
        print(f"[GeofenceAPI] Error setting device name: {e}")
        return jsonify({"success": False, "error": "服务器内部错误"}), 200


@geofence_bp.route("/geofence/subscription/device/<mode>", methods=["POST"])
def set_geofence_subscription_device_mode(mode):
    """Enable or disable a device in a subscription"""
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "error": "请求参数无效"}), 200
    
    sub_id = data.get("subscriptionId")
    target_device_id = data.get("targetDeviceId")
    admin_password = data.get("adminPassword")
    device_id = data.get("deviceId")
    
    if mode not in ["disable", "enable"]:
        return jsonify({"success": False, "error": "请求参数无效"}), 200
    
    try:
        enabled = (mode == "enable")
        geofence_service.set_device_enabled(sub_id, target_device_id, enabled, admin_password, device_id)
        return jsonify({"success": True})
    except ValueError as e:
        error_msg = str(e)
        if "password" in error_msg.lower():
            return jsonify({"success": False, "error": "管理密码错误"}), 200
        elif "mismatch" in error_msg.lower():
            return jsonify({"success": False, "error": "设备ID不匹配"}), 200
        elif "Target device" in error_msg or "目标设备" in error_msg:
            return jsonify({"success": False, "error": "目标设备ID不存在"}), 200
        elif "not found" in error_msg.lower():
            return jsonify({"success": False, "error": "订阅ID不存在"}), 200
        else:
            return jsonify({"success": False, "error": "请求参数无效"}), 200
    except Exception as e:
        print(f"[GeofenceAPI] Error setting device mode: {e}")
        return jsonify({"success": False, "error": "服务器内部错误"}), 200


@geofence_bp.route("/geofence/subscription/devices", methods=["POST"])
def list_geofence_subscription_devices():
    """List all devices in a subscription"""
    data = request.get_json()
    if not data:
        return jsonify({"success": False, "error": "请求参数无效"}), 200
    
    sub_id = data.get("subscriptionId")
    admin_password = data.get("adminPassword")
    device_id = data.get("deviceId")
    
    try:
        devices = geofence_service.list_devices(sub_id, admin_password, device_id)
        
        return jsonify({
            "success": True,
            "devices": devices
        })
    except ValueError as e:
        error_msg = str(e)
        if "password" in error_msg.lower():
            return jsonify({"success": False, "error": "管理密码错误"}), 200
        elif "mismatch" in error_msg.lower():
            return jsonify({"success": False, "error": "设备ID不匹配"}), 200
        elif "not found" in error_msg.lower():
            return jsonify({"success": False, "error": "订阅ID不存在"}), 200
        else:
            return jsonify({"success": False, "error": "请求参数无效"}), 200
    except Exception as e:
        print(f"[GeofenceAPI] Error listing devices: {e}")
        return jsonify({"success": False, "error": "服务器内部错误"}), 200
