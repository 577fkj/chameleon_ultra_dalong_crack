#!/usr/bin/env python3
"""
File Monitor
Background thread to monitor file changes and reload data
"""

import time
from threading import Thread, Lock
from typing import Callable, List


class FileMonitor:
    """Monitor files for changes and trigger reload callbacks"""
    
    def __init__(self, interval: int = 5):
        """
        Initialize file monitor
        
        Args:
            interval: Check interval in seconds
        """
        self.interval = interval
        self.monitors = []
        self.running = False
        self.thread = None
        self.lock = Lock()
    
    def add_monitor(self, check_function: Callable[[], bool]):
        """
        Add a monitor function
        
        Args:
            check_function: Function that checks and reloads if needed
        """
        with self.lock:
            self.monitors.append(check_function)
    
    def _monitor_loop(self):
        """Background monitoring loop"""
        print("[FileMonitor] Started")
        while self.running:
            time.sleep(self.interval)
            with self.lock:
                for check_fn in self.monitors:
                    try:
                        check_fn()
                    except Exception as e:
                        print(f"[FileMonitor] Error in monitor: {e}")
    
    def start(self):
        """Start the monitoring thread"""
        if self.running:
            return
        
        self.running = True
        self.thread = Thread(
            target=self._monitor_loop,
            daemon=True,
            name="FileMonitor"
        )
        self.thread.start()
    
    def stop(self):
        """Stop the monitoring thread"""
        self.running = False
        if self.thread:
            self.thread.join(timeout=self.interval + 1)
