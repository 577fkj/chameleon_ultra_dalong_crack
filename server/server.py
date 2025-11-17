import json
import hashlib
import os
import time
from flask import Flask, request, jsonify, send_file
from threading import Thread
from pathlib import Path
import uuid
from datetime import datetime

app = Flask(__name__)

version_info = None
version_file_mtime = None
VERSION_FILE_PATH = "version.json"
FIRMWARE_DIR = "../firmware"
GEOFENCE_DATABASE_PATH = "geofence.json"

firmware_base_path = Path(FIRMWARE_DIR).resolve()
geofence_data = {}

def load_version_info():
    global version_info, version_file_mtime
    try:
        with open(VERSION_FILE_PATH, "r", encoding="utf-8") as f:
            version_info = json.load(f)
        version_file_mtime = os.path.getmtime(VERSION_FILE_PATH)
        print(f"Loaded version info: {version_info}")
    except Exception as e:
        print(f"Error loading version info: {e}")
        version_info = {}
        version_file_mtime = None


def check_and_reload_version():
    global version_file_mtime
    try:
        current_mtime = os.path.getmtime(VERSION_FILE_PATH)
        if version_file_mtime is None or current_mtime != version_file_mtime:
            print("version.json has been modified, reloading...")
            load_version_info()
            return True
    except Exception as e:
        print(f"Error checking version file: {e}")
    return False


def version_monitor():
    while True:
        time.sleep(5)
        check_and_reload_version()

def get_secret_key(chip_id: str, license_key: str) -> str:
    m = hashlib.sha256()
    m.update(chip_id.encode("utf-8"))
    m.update(license_key.encode("utf-8"))
    m.update(chip_id.encode("utf-8"))
    digest = m.digest()
    return digest.hex()[:16]


def get_address_key(chip_id: str, license_key: str) -> str:
    m = hashlib.sha256()
    m.update(chip_id.encode("utf-8"))
    m.update(license_key.encode("utf-8"))
    m.update(license_key.encode("utf-8"))
    m.update(chip_id.encode("utf-8"))
    digest = m.digest()
    return digest.hex()[-16:]


@app.route("/ultra/api/v1/device/register", methods=["POST"])
def register():
    data = request.get_json()
    chip_id = data.get("chip_id")
    license_key = data.get("activation_code")
    firmware_version = data.get("firmware_version")
    if not chip_id or not license_key or len(chip_id) != 16 or len(license_key) != 12:
        return (
            jsonify({"code": 400, "message": "请求参数无效"}),
            400,
        )

    secret_key = get_secret_key(chip_id, license_key)
    address_key = get_address_key(chip_id, license_key)
    print(
        f"Register device: chip_id={chip_id}, license_key={license_key}, firmware_version={firmware_version}, secret_key={secret_key}, address_key={address_key}"
    )
    return jsonify(
        {
            "code": 200,
            "message": "激活成功",
            "secret_key": secret_key,
            "address_key": address_key,
        }
    )


def get_firmware_name(version_prefix: str):
    if version_prefix not in version_info:
        return None, None
    version = version_info[version_prefix].get("version", "")
    sub_version = version_info[version_prefix].get("sub_version", "")
    commit_hash = version_info[version_prefix].get("commit_hash", "")

    update_time = version_info[version_prefix].get("update_time", "")
    return f"v{version_prefix}.{version}-{sub_version}-{commit_hash}", update_time


def get_version(version: str):
    if version.startswith("v"):
        return version.split(".")[0][1:]
    return version.split(".")[0]


@app.route("/ultra/api/v1/firmware/check", methods=["POST"])
def check_firmware():
    check_and_reload_version()

    data = request.get_json()
    chip_id = data.get("chip_id")
    client_version = data.get("version")
    if not client_version:
        return (
            jsonify({"code": 400, "message": "请求参数无效", "need_update": False}),
            400,
        )

    print(f"Check firmware: chip_id={chip_id}, version={client_version}")

    full_version, update_time = get_firmware_name(get_version(client_version))
    if not full_version:
        return (
            jsonify({"code": 400, "message": "请求参数无效", "need_update": False}),
            400,
        )

    filename = f"{full_version}.zip"

    file_size = 0
    need_update = False
    firmware_path = os.path.join("firmware", filename)
    if os.path.exists(firmware_path):
        file_size = os.path.getsize(firmware_path)
    else:
        print(f"Firmware file not found: {firmware_path}")
    need_update = client_version != full_version
    version = full_version.split("-")[0]

    download_url = f"http://{request.host}/ultra/api/v1/firmware/download/{version}/{filename}"

    firmware_info = {
        "version": full_version,
        "file_name": filename,
        "file_size": file_size,
        "upload_time": update_time,
        "download_url": download_url,
    }

    message = "有新固件可用" if need_update else "当前固件已是最新版本"

    return jsonify(
        {
            "code": 200,
            "message": message,
            "need_update": need_update,
            "firmware_info": firmware_info,
        }
    )


@app.route("/ultra/api/v1/firmware/download/<version>/<path:filename>", methods=["GET"])
def download_firmware(version, filename):
    target = (firmware_base_path / filename).resolve()

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
    check_and_reload_version()

    full_version, _ = get_firmware_name("3")
    if not full_version:
        return jsonify({"code": 404, "message": "最新固件文件不存在"}), 404

    filename = f"{full_version}.zip"

    firmware_path = os.path.join("firmware", filename)

    if not os.path.exists(firmware_path):
        return jsonify({"code": 404, "message": "最新固件文件不存在"}), 404

    return send_file(
        firmware_path,
        as_attachment=True,
        download_name=filename,
        mimetype="application/zip",
    )


# 16 灯固件 4.0 下载接口
@app.route("/ultra/api/v1/firmware/download/lastest4.zip", methods=["GET"])
def download_latest_firmware4():
    check_and_reload_version()

    full_version, _ = get_firmware_name("4")
    if not full_version:
        return jsonify({"code": 404, "message": "最新固件文件不存在"}), 404

    filename = f"{full_version}.zip"

    firmware_path = os.path.join("firmware", filename)

    if not os.path.exists(firmware_path):
        return jsonify({"code": 404, "message": "最新固件文件不存在"}), 404

    return send_file(
        firmware_path,
        as_attachment=True,
        download_name=filename,
        mimetype="application/zip",
    )


# 16 灯固件 5.0 下载接口
@app.route("/ultra/api/v1/firmware/download/lastest5.zip", methods=["GET"])
def download_latest_firmware5():
    check_and_reload_version()

    full_version, _ = get_firmware_name("5")
    if not full_version:
        return jsonify({"code": 404, "message": "最新固件文件不存在"}), 404

    filename = f"{full_version}.zip"

    firmware_path = os.path.join("firmware", filename)

    if not os.path.exists(firmware_path):
        return jsonify({"code": 404, "message": "最新固件文件不存在"}), 404

    return send_file(
        firmware_path,
        as_attachment=True,
        download_name=filename,
        mimetype="application/zip",
    )

def get_iso_8601_timestamp():
    now_with_tz = datetime.now().astimezone()
    return now_with_tz.isoformat()

def load_geofence_database():
    global geofence_data
    try:
        with open(GEOFENCE_DATABASE_PATH, "r", encoding="utf-8") as f:
            geofence_data = json.load(f)
        print(f"Loaded geofence database: {geofence_data}")
        return geofence_data
    except Exception as e:
        print(f"Error loading geofence database: {e}")
        return {}

def save_geofence_database():
    try:
        with open(GEOFENCE_DATABASE_PATH, "w", encoding="utf-8") as f:
            json.dump(geofence_data, f, indent=4, ensure_ascii=False)
        print(f"Saved geofence database: {geofence_data}")
    except Exception as e:
        print(f"Error saving geofence database: {e}")

@app.route("/ultra/api/v1/geofence/subscription/create", methods=["POST"])
def create_geofence_subscription():
    data = request.get_json()
    encryptedData = data.get("encryptedData")
    adminPassword = data.get("adminPassword")
    deviceId = data.get("deviceId")

    if not encryptedData or not adminPassword or not deviceId:
        return (
            jsonify({"success": False, "error": "请求参数无效"}),
            200,
        )

    subid = str(uuid.uuid4())

    geofence_data[subid] = {
        "encryptedData": encryptedData,
        "adminPassword": adminPassword,
        "deviceId": deviceId,
        "subscriptionDevice": {},
        "createAt": get_iso_8601_timestamp(),
        "updateAt": get_iso_8601_timestamp(),
    }

    save_geofence_database()

    return jsonify(
        {
            "success": True,
            "subscriptionId": subid,
            "subscriptionUrl": f"http://{request.host}/ultra/api/v1/geofence/subscription/{subid}",
        }
    )

@app.route("/ultra/api/v1/geofence/subscription/update", methods=["POST"])
def update_geofence_subscription():
    data = request.get_json()
    subscriptionId = data.get("subscriptionId")
    encryptedData = data.get("encryptedData")
    adminPassword = data.get("adminPassword")
    deviceId = data.get("deviceId")

    if not subscriptionId or not encryptedData or not adminPassword or not deviceId:
        return (
            jsonify({"success": False, "error": "请求参数无效"}),
            200,
        )

    if subscriptionId not in geofence_data:
        return (
            jsonify({"success": False, "error": "订阅ID不存在"}),
            200,
        )
    
    if geofence_data[subscriptionId]["adminPassword"] != adminPassword:
        return (
            jsonify({"success": False, "error": "管理密码错误"}),
            200,
        )
    
    if geofence_data[subscriptionId]["deviceId"] != deviceId:
        return (
            jsonify({"success": False, "error": "设备ID不匹配"}),
            200,
        )

    geofence_data[subscriptionId]["encryptedData"] = encryptedData
    geofence_data[subscriptionId]["updateAt"] = get_iso_8601_timestamp()

    save_geofence_database()

    return jsonify(
        {
            "success": True,
        }
    )

@app.route("/ultra/api/v1/geofence/subscription/delete", methods=["POST"])
def delete_geofence_subscription():
    data = request.get_json()
    subscriptionId = data.get("subscriptionId")
    adminPassword = data.get("adminPassword")
    deviceId = data.get("deviceId")

    if not subscriptionId or not adminPassword or not deviceId:
        return (
            jsonify({"success": False, "error": "请求参数无效"}),
            200,
        )

    if subscriptionId not in geofence_data:
        return jsonify(
            {
                "success": True,
            }
        )
    
    if geofence_data[subscriptionId]["adminPassword"] != adminPassword:
        return (
            jsonify({"success": False, "error": "管理密码错误"}),
            200,
        )
    
    if geofence_data[subscriptionId]["deviceId"] != deviceId:
        return (
            jsonify({"success": False, "error": "设备ID不匹配"}),
            200,
        )

    del geofence_data[subscriptionId]

    save_geofence_database()

    return jsonify(
        {
            "success": True,
        }
    )

@app.route("/ultra/api/v1/geofence/subscription/<subscriptionId>", methods=["GET", "POST"])
def get_geofence_subscription(subscriptionId):
    deviceId = request.args.get("deviceId")
    if not deviceId:
        return (
            jsonify({"success": False, "error": "请求参数无效"}),
            200,
        )

    if subscriptionId not in geofence_data:
        return (
            jsonify({"success": False, "error": "订阅ID不存在"}),
            200,
        )
    
    if deviceId not in geofence_data[subscriptionId]["subscriptionDevice"]:
        geofence_data[subscriptionId]["subscriptionDevice"][deviceId] = {
            "name": "",
            "enabled": True,
            "createdAt": get_iso_8601_timestamp(),
            "lastAccessAt": get_iso_8601_timestamp()
        }
    else:
        geofence_data[subscriptionId]["subscriptionDevice"][deviceId]["lastAccessAt"] = get_iso_8601_timestamp()
    
    if not geofence_data[subscriptionId]["subscriptionDevice"][deviceId]["enabled"]:
        return (
            jsonify({"success": False, "error": "该设备已被禁用，无法获取订阅数据"}),
            200,
        )

    save_geofence_database()

    return jsonify(
        {
            "success": True,
            "encryptedData": geofence_data[subscriptionId]["encryptedData"],
        }
    )

@app.route("/ultra/api/v1/geofence/subscription/device/name", methods=["POST"])
def name_geofence_subscription_device():
    data = request.get_json()
    subscriptionId = data.get("subscriptionId")
    targetDeviceId = data.get("targetDeviceId")
    deviceName = data.get("deviceName")
    adminPassword = data.get("adminPassword")
    deviceId = data.get("deviceId")

    if not subscriptionId or not targetDeviceId or not deviceName or not adminPassword or not deviceId:
        return (
            jsonify({"success": False, "error": "请求参数无效"}),
            200,
        )

    if subscriptionId not in geofence_data:
        return (
            jsonify({"success": False, "error": "订阅ID不存在"}),
            200,
        )
    
    if geofence_data[subscriptionId]["adminPassword"] != adminPassword:
        return (
            jsonify({"success": False, "error": "管理密码错误"}),
            200,
        )
    
    if geofence_data[subscriptionId]["deviceId"] != deviceId:
        return (
            jsonify({"success": False, "error": "设备ID不匹配"}),
            200,
        )
    
    if targetDeviceId not in geofence_data[subscriptionId]["subscriptionDevice"]:
        return (
            jsonify({"success": False, "error": "目标设备ID不存在"}),
            200,
        )
    
    geofence_data[subscriptionId]["subscriptionDevice"][targetDeviceId]["name"] = deviceName

    save_geofence_database()

    return jsonify(
        {
            "success": True,
        }
    )

@app.route("/ultra/api/v1/geofence/subscription/device/<mode>", methods=["POST"])
def set_geofence_subscription_device_mode(mode):
    data = request.get_json()
    subscriptionId = data.get("subscriptionId")
    targetDeviceId = data.get("targetDeviceId")
    adminPassword = data.get("adminPassword")
    deviceId = data.get("deviceId")

    if not subscriptionId or not targetDeviceId or not adminPassword or not deviceId:
        return (
            jsonify({"success": False, "error": "请求参数无效"}),
            200,
        )

    if subscriptionId not in geofence_data:
        return (
            jsonify({"success": False, "error": "订阅ID不存在"}),
            200,
        )
    
    if geofence_data[subscriptionId]["adminPassword"] != adminPassword:
        return (
            jsonify({"success": False, "error": "管理密码错误"}),
            200,
        )
    
    if geofence_data[subscriptionId]["deviceId"] != deviceId:
        return (
            jsonify({"success": False, "error": "设备ID不匹配"}),
            200,
        )
    
    if targetDeviceId not in geofence_data[subscriptionId]["subscriptionDevice"]:
        return (
            jsonify({"success": False, "error": "目标设备ID不存在"}),
            200,
        )
    
    if mode == "disable":
        geofence_data[subscriptionId]["subscriptionDevice"][targetDeviceId]["enabled"] = False
    elif mode == "enable":
        geofence_data[subscriptionId]["subscriptionDevice"][targetDeviceId]["enabled"] = True
    else:
        return (
            jsonify({"success": False, "error": "请求参数无效"}),
            200,
        )

    save_geofence_database()

    return jsonify(
        {
            "success": True,
        }
    )

@app.route("/ultra/api/v1/geofence/subscription/devices", methods=["POST"])
def list_geofence_subscription_devices():
    data = request.get_json()
    subscriptionId = data.get("subscriptionId")
    adminPassword = data.get("adminPassword")
    deviceId = data.get("deviceId")

    if not subscriptionId or not adminPassword or not deviceId:
        return (
            jsonify({"success": False, "error": "请求参数无效"}),
            200,
        )

    if subscriptionId not in geofence_data:
        return (
            jsonify({"success": False, "error": "订阅ID不存在"}),
            200,
        )
    
    if geofence_data[subscriptionId]["adminPassword"] != adminPassword:
        return (
            jsonify({"success": False, "error": "管理密码错误"}),
            200,
        )
    
    if geofence_data[subscriptionId]["deviceId"] != deviceId:
        return (
            jsonify({"success": False, "error": "设备ID不匹配"}),
            200,
        )

    devices = []
    for dev_id, dev_info in geofence_data[subscriptionId]["subscriptionDevice"].items():
        devices.append(
            {
                "deviceId": dev_id,
                "deviceName": dev_info["name"],
                "enabled": dev_info["enabled"],
                "lastAccessAt": dev_info["lastAccessAt"],
                "createdAt": dev_info["createdAt"]
            }
        )

    return jsonify(
        {
            "success": True,
            "devices": devices
        }
    )

if __name__ == "__main__":
    load_version_info()
    load_geofence_database()

    monitor_thread = Thread(target=version_monitor, daemon=True)
    monitor_thread.start()

    app.run(host="0.0.0.0", port=8080)
