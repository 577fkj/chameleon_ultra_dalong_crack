import requests
import os
from androguard.core.apk import APK
import time

VERSION_FILE_PATH = "version.json"
APP_DIR = "./"
OLD_APP_DIR = "./Old"

headers = {
    "User-agent": "Dart/3.10 (dart:io)"
}

check = "https://i.tlq520.cn/ultra/api/v1/app/version/check"

ignore_commit = [
    '请养成经常备份配置的好习惯～',
    '必须更新',
    '强制更新',
    '紧急修复',
    'GUI',
    '安卓GUI',
    '安卓',
    '安卓版本',
]

def move_all_to_old():
    if not os.path.exists(OLD_APP_DIR):
        os.makedirs(OLD_APP_DIR)
    for filename in os.listdir(APP_DIR):
        if filename.endswith(".apk"):
            src_path = os.path.join(APP_DIR, filename)
            dst_path = os.path.join(OLD_APP_DIR, filename)
            os.rename(src_path, dst_path)
            print(f"Moved old app {filename} to {OLD_APP_DIR}")

def get_last_apk_info() -> tuple[str, int]:
    apk_files = [f for f in os.listdir(APP_DIR) if f.endswith(".apk")]
    if not apk_files:
        return "", 0
    latest_apk = max(apk_files, key=lambda f: os.path.getmtime(os.path.join(APP_DIR, f)))
    apk_path = os.path.join(APP_DIR, latest_apk)
    return get_apk_info(apk_path)

def get_apk_info(apk_path: str) -> tuple[str, int]:
    a = APK(apk_path)
    version = a.get_androidversion_name()
    build_number = a.get_androidversion_code()
    return version, int(build_number)

def download_file(url, save_path, chunk_size=8192, timeout=(5, 60)):
    """
    Download file with progress, stream to disk (no memory buffering).
    """
    with requests.get(url, stream=True, timeout=timeout, headers=headers) as r:
        r.raise_for_status()

        total = int(r.headers.get("Content-Length", 0))
        downloaded = 0
        start = time.time()

        with open(save_path, "wb") as f:
            for chunk in r.iter_content(chunk_size=chunk_size):
                if not chunk:
                    continue

                f.write(chunk)
                downloaded += len(chunk)

                if total:
                    percent = downloaded * 100 / total
                    elapsed = time.time() - start
                    speed = downloaded / elapsed if elapsed > 0 else 0

                    print(
                        f"\r{percent:6.2f}% "
                        f"{downloaded}/{total} "
                        f"{speed/1024:.1f} KB/s",
                        end=""
                    )

    print("\nDownload finished")

def download():
    version, build_number = get_last_apk_info()
    payload = {
        "version": version,
        "build_number": str(build_number),
        "platform": 'android'
    }
    try:
        response = requests.post(check, json=payload, headers=headers, timeout=10)
        response.raise_for_status()
        data = response.json()
        print(f"Current Version: {version}")
        print("  Response:", data)

        if not data.get("need_update"):
            return
        
        app_info = data.get("version_info", {})
        print(f"  Update Available: {app_info.get('version')}, URL: {app_info.get('download_url')}, Force Update: {data.get('force_update')}, Force Update 2: {app_info.get('force_update')}")
        
        download_url = app_info.get("download_url")

        download_file(download_url, "apk.tmp", chunk_size=8192, timeout=(5, 60))

        move_all_to_old()

        app_filename = "apk.tmp"
        app_path = os.path.join(APP_DIR, app_filename)
        new_version, new_build_number = get_apk_info(app_path)
        final_app_filename = f"app_v{new_version}_b{new_build_number}.apk"
        final_app_path = os.path.join(APP_DIR, final_app_filename)
        os.rename(app_path, final_app_path)

        update_message = app_info.get("update_message", "").split('\n')
        
        # Write to README.md for history (prepend to the beginning)
        new_content = f"# App Version {new_version} Build {new_build_number} Download url {download_url}\n\n"
        for line in update_message:
            if line.strip() and line.strip() not in ignore_commit:
                new_content += f"- {line}\n"
        new_content += "\n"
        
        # Read existing content and prepend new content
        existing_content = ""
        if os.path.exists('README.md'):
            with open('README.md', 'r', encoding='utf-8') as f:
                existing_content = f.read()
        
        with open('README.md', 'w', encoding='utf-8') as changelog_file:
            changelog_file.write(new_content + existing_content)
        
        # Write current version update to separate file for GitHub release
        with open('current_release_notes.txt', 'w', encoding='utf-8') as release_file:
            for line in update_message:
                if line.strip() and line.strip() not in ignore_commit:
                    release_file.write(f"- {line}\n")

        print(f"  app downloaded and saved to: {app_path}")
    except Exception as e:
        print(f"Error checking app {version}: {e}")
    
    if os.path.exists("apk.tmp"):
        os.unlink("apk.tmp")

build_numbers = {}

def rename_all_apk():
    for filename in os.listdir(OLD_APP_DIR):
        if filename.endswith(".apk") and not filename.startswith("app_v"):
            names = filename.split('.apk')[0].split("-")
            commits = []
            for name in names:
                if name.strip() == "":
                    continue
                if name.strip() in ignore_commit:
                    continue
                if '.' in name:
                    continue
                commits.append(name.strip())
            
            apk_path = os.path.join(OLD_APP_DIR, filename)
            version, build_number = get_apk_info(apk_path)
            new_filename = f"app_v{version}_b{build_number}.apk"
            new_path = os.path.join(OLD_APP_DIR, new_filename)
            count = 1
            while os.path.exists(new_path):
                new_filename = f"app_v{version}_b{build_number}_{count}.apk"
                new_path = os.path.join(OLD_APP_DIR, new_filename)
                count += 1
            os.rename(apk_path, new_path)
            print(f"Renamed {filename} to {new_filename}")

            key = (version, build_number)
            build_numbers[key] = f"# App Version {version} Build {build_number} Renamed {filename} to {new_filename}\n\n"
            for commit in commits:
                build_numbers[key] += f"- {commit}\n"
            build_numbers[key] += "\n"

    # sort by version and build number
    sorted_keys = sorted(build_numbers.keys(), key=lambda x: (list(map(int, x[0].split('.'))), x[1]), reverse=True)
    with open('README.md', 'a', encoding='utf-8') as changelog_file:
        for key in sorted_keys:
            changelog_file.write(build_numbers[key])

if __name__ == "__main__":
    download()
    # rename_all_apk()
