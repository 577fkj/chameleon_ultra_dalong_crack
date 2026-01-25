import json
import hmac
import hashlib
import time
from typing import Dict, Any


SECRET = "hXRCNlqcNm8KBGkdczStijc6bLInHpA2zzBMmNXxvOAk8aqS5Jdvj2SrJwUytUQu"


def _normalize_timestamp(ts: Any) -> int:
    """
    Normalize timestamp to seconds (int).
    Accepts int / str, milliseconds or seconds.
    """
    if ts is None:
        raise ValueError("timestamp missing")

    if isinstance(ts, int):
        timestamp = ts
    else:
        timestamp = int(str(ts))

    # milliseconds → seconds
    if timestamp > 10_000_000_000:
        timestamp //= 1000

    return timestamp

def _sorted_json_without_signature(data: Dict[str, Any]) -> str:
    """
    Remove 'signature', sort keys, and JSON encode.
    """
    copied = dict(data)
    copied.pop("signature", None)

    sorted_items = {k: copied[k] for k in sorted(copied.keys())}

    # Ensure deterministic JSON (no spaces)
    return json.dumps(sorted_items, separators=(",", ":"), ensure_ascii=False)


def sign_response(data: Dict[str, Any], secret: str = SECRET) -> str:
    """
    Generate HMAC-SHA256 signature for response.
    """
    json_str = _sorted_json_without_signature(data)
    digest = hmac.new(
        secret.encode("utf-8"),
        json_str.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()
    return digest


def verify_timestamp(data: Dict[str, Any], window_seconds: int = 60) -> bool:
    """
    Verify timestamp within allowed window.
    """
    try:
        ts = _normalize_timestamp(data.get("timestamp"))
    except Exception:
        return False

    now = int(time.time())
    return abs(now - ts) <= window_seconds


def verify_signature(data: Dict[str, Any], secret: str = SECRET) -> bool:
    """
    Verify response signature.
    """
    signature = data.get("signature")
    if not signature:
        print("Signature missing")
        return False

    expected = sign_response(data, secret)
    print("Expected signature:", expected)
    result = signature == expected
    print("Signature verification result:", result)
    return result


def validate_response(data: Dict[str, Any], secret: str = SECRET, skip_timestamp_check: bool = False) -> bool:
    """
    Full validation: timestamp + signature.
    """
    if not skip_timestamp_check:
        if not verify_timestamp(data):
            print("Timestamp verification failed")
            return False

    return verify_signature(data, secret)
