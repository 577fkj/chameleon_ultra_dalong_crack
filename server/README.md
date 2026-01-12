# Chameleon Ultra Server

工程化重构的变色龙Ultra服务器，提供固件管理、应用版本检查和围栏服务。

## 项目结构

```
server/
├── app.py                      # 应用入口
├── config.py                   # 配置管理
├── requirements.txt            # 依赖管理
├── server.py                   # 旧版服务器（已弃用）
├── api/                        # API路由层
│   ├── __init__.py
│   ├── device.py              # 设备注册API
│   ├── firmware.py            # 固件管理API
│   ├── app_version.py         # 应用版本API
│   └── geofence.py            # 围栏管理API
├── services/                   # 业务逻辑层
│   ├── __init__.py
│   ├── auth_service.py        # 认证服务
│   ├── firmware_service.py    # 固件服务
│   ├── apk_service.py         # APK服务
│   └── geofence_service.py    # 围栏服务
├── models/                     # 数据模型层
│   └── __init__.py
└── utils/                      # 工具函数
    ├── __init__.py
    ├── helpers.py             # 辅助函数
    └── file_monitor.py        # 文件监控
```

## 主要特性

### 模块化架构
- **API层 (api/)**: 使用 Flask Blueprint 组织路由，职责清晰
- **服务层 (services/)**: 封装业务逻辑，便于测试和复用
- **工具层 (utils/)**: 通用工具函数和文件监控
- **配置管理 (config.py)**: 统一配置管理，支持环境切换

### 核心功能
- **设备注册**: 设备激活和密钥生成
- **固件管理**: 版本检查和固件下载
- **应用版本管理**: Android APK版本检查和下载
- **围栏订阅**: 围栏数据的创建、更新、删除和订阅

### 自动监控
- 后台线程自动监控文件变化
- 自动重新加载固件版本信息
- 自动更新APK信息

## 安装

1. 安装依赖：
```bash
pip install -r requirements.txt
```

2. 确保以下目录和文件存在：
- `../firmware/` - 固件文件目录
- `../software/Android/` - Android APK目录
- `../software/GeoFence/Android/` - GeoFence APK目录
- `version.json` - 固件版本信息
- `geofence.json` - 围栏数据库（自动创建）

## 运行

### 开发模式
```bash
export FLASK_ENV=development  # Linux/Mac
set FLASK_ENV=development     # Windows
python app.py
```

### 生产模式
```bash
python app.py
```

### 环境变量
- `FLASK_ENV`: 运行环境 (`development` 或 `production`)
- `SERVER_HOST`: 服务器地址（默认: `0.0.0.0`）
- `SERVER_PORT`: 服务器端口（默认: `8080`）
- `DEBUG`: 调试模式（默认: `False`）
- `MONITOR_INTERVAL`: 文件监控间隔秒数（默认: `5`）

## API 端点

所有API路径前缀为 `/ultra/api/v1`

### 设备管理
- `POST /device/register` - 设备注册

### 固件管理
- `POST /firmware/check` - 检查固件更新
- `GET /firmware/download/<version>/<filename>` - 下载固件
- `GET /firmware/download/lastest.zip` - 下载最新固件(v3.x)
- `GET /firmware/download/lastest4.zip` - 下载最新固件(v4.x)
- `GET /firmware/download/lastest5.zip` - 下载最新固件(v5.x)

### 应用版本管理
- `POST /app/version/check` - 检查应用更新
- `GET /app/download/<filename>` - 下载主应用APK
- `GET /geofence/app/download/<filename>` - 下载围栏应用APK

### 围栏管理
- `POST /geofence/subscription/create` - 创建订阅
- `POST /geofence/subscription/update` - 更新订阅
- `POST /geofence/subscription/delete` - 删除订阅
- `GET /geofence/subscription/<id>` - 获取订阅数据
- `POST /geofence/subscription/device/name` - 设置设备名称
- `POST /geofence/subscription/device/<enable|disable>` - 启用/禁用设备
- `POST /geofence/subscription/devices` - 列出所有设备

## 开发指南

### 添加新的API端点
1. 在 `api/` 目录创建新的蓝图文件
2. 在 `api/__init__.py` 中导出蓝图
3. 在 `app.py` 中注册蓝图

### 添加新的服务
1. 在 `services/` 目录创建服务类
2. 在 `services/__init__.py` 中导出服务
3. 在相应的API模块中使用服务

### 配置管理
在 `config.py` 中修改配置项，支持通过环境变量覆盖。

## 从旧版本迁移

旧的 `server.py` 已被模块化架构替代。新架构保持了完全的API兼容性，无需修改客户端代码。

主要改进：
- ✅ 模块化设计，易于维护
- ✅ 清晰的职责分离
- ✅ 更好的错误处理
- ✅ 更易于测试
- ✅ 支持环境配置
- ✅ 完整的日志输出

## 许可证

与主项目相同
