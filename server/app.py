#!/usr/bin/env python3
"""
Chameleon Ultra Server
Main application entry point

Provides firmware management, app version check, and geofence services
in a modular, maintainable architecture.
"""

from flask import Flask
from pathlib import Path

from config import get_config
from api import device_bp, firmware_bp, app_version_bp, geofence_bp
from utils import FileMonitor
from utils.response_signer import register_response_signer


def create_app():
    """
    Application factory pattern
    Creates and configures the Flask application
    """
    # Initialize Flask app
    app = Flask(__name__)
    
    # Load configuration
    config = get_config()
    app.config.from_object(config)
    
    # Register blueprints with API prefix
    api_prefix = config.API_PREFIX
    app.register_blueprint(device_bp, url_prefix=api_prefix)
    app.register_blueprint(firmware_bp, url_prefix=api_prefix)
    app.register_blueprint(app_version_bp, url_prefix=api_prefix)
    app.register_blueprint(geofence_bp, url_prefix=api_prefix)

    # Register global response signer to add timestamp and signature
    register_response_signer(app)
    
    # Setup file monitoring
    setup_file_monitor(config)
    
    return app


def setup_file_monitor(config):
    """
    Setup background file monitoring
    
    Args:
        config: Application configuration
    """
    from api.firmware import firmware_service
    from api.app_version import main_apk_service, geofence_apk_service
    
    monitor = FileMonitor(interval=config.MONITOR_INTERVAL)
    monitor.add_monitor(firmware_service.check_and_reload)
    monitor.add_monitor(main_apk_service.check_and_reload)
    monitor.add_monitor(geofence_apk_service.check_and_reload)
    monitor.start()


def print_startup_banner():
    """Print startup banner with server information"""
    print("=" * 60)
    print("Chameleon Ultra Server Starting...")
    print("=" * 60)
    print("\n[Server] Initializing services...")


def print_ready_banner(config):
    """Print ready banner when server is running"""
    print("\n" + "=" * 60)
    print(f"[Server] Ready on http://{config.HOST}:{config.PORT}")
    print(f"[Server] API Prefix: {config.API_PREFIX}")
    print(f"[Server] Debug Mode: {config.DEBUG}")
    print(f"[Server] Monitor Interval: {config.MONITOR_INTERVAL}s")
    print("=" * 60 + "\n")


if __name__ == "__main__":
    # Print startup banner
    print_startup_banner()
    
    # Create application
    app = create_app()
    config = get_config()
    
    # Print ready banner
    print_ready_banner(config)
    
    # Run Flask server
    app.run(
        host=config.HOST,
        port=config.PORT,
        debug=config.DEBUG
    )
