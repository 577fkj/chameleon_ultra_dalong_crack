import requests
import json
import random
import os

VERSION_FILE_PATH = "version.json"
FIRMWARE_DIR = "../firmware"

def random_chip_id():
    return ''.join(random.choices('0123456789abcdef', k=16))

def pasre_version(version_str):
    # vX.Y-Z-commit_hash
    if version_str.startswith('v'):
        version_str = version_str[1:]
    parts = version_str.split('-')
    if len(parts) < 3:
        return None, None, None
    main_version = parts[0]
    sub_version = parts[1]
    commit_hash = parts[2]

    parts = main_version.split('.')
    if len(parts) < 2:
        return None, None, None

    major = parts[0]
    minor = parts[1]
    return major, minor, sub_version, commit_hash

with open(VERSION_FILE_PATH, "r", encoding="utf-8") as f:
    version_info = json.load(f)

headers = {
    "User-agent": "Dart/3.9 (dart:io)"
}

check = "https://i.tlq520.cn/ultra/api/v1/firmware/check"

def download():
    for major, info in version_info.items():
        version = f"v{major}.{info['version']}-{info['sub_version']}-{info['commit_hash']}"
        payload = {
            "version": version,
            "chip_id": random_chip_id()
        }
        try:
            response = requests.post(check, json=payload, headers=headers, timeout=10)
            response.raise_for_status()
            data = response.json()
            print(f"Current Version: {version}")
            print("  Response:", data)

            if not data.get("need_update"):
                continue
            
            firmware_info = data.get("firmware_info", {})
            print(f"  Update Available: {firmware_info.get('version')}, URL: {firmware_info.get('download_url')}")
            
            response = requests.get(firmware_info.get("download_url"), headers=headers, timeout=20)
            response.raise_for_status()
            firmware_filename = f"{firmware_info.get('file_name')}"
            firmware_path = os.path.join(FIRMWARE_DIR, firmware_filename)
            with open(firmware_path, "wb") as fw_file:
                fw_file.write(response.content)
            print(f"  Firmware downloaded and saved to: {firmware_path}")

            major_ret, minor_ret, sub_version_ret, commit_hash_ret = pasre_version(firmware_info.get("version"))
            if major_ret is None or minor_ret is None or sub_version_ret is None or commit_hash_ret is None:
                print(f"  Failed to parse version string: {firmware_info.get('version')}")
                continue

            # Update version_info
            version_info[major] = {
                "version": minor_ret,
                "sub_version": sub_version_ret,
                "commit_hash": commit_hash_ret,
                "update_time": info.get("update_time", "")
            }
        except Exception as e:
            print(f"Error checking firmware {version}: {e}")

    with open(VERSION_FILE_PATH, "w", encoding="utf-8") as f:
        json.dump(
            version_info,
            f,
            indent=4,
            ensure_ascii=False,
        )
    print(f"Updated version info saved to {VERSION_FILE_PATH}")

if __name__ == "__main__":
    download()
