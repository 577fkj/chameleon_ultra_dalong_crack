import json
import time
from typing import Any, Dict

from flask import Response, current_app

from .signature import sign_response


def register_response_signer(app):
    """
    Register an `after_request` handler on the Flask app that adds
    `timestamp` and `signature` to JSON responses.
    """

    @app.after_request
    def sign_json_response(response: Response) -> Response:
        # Only handle JSON responses
        content_type = response.headers.get("Content-Type", "")
        if not content_type.startswith("application/json"):
            return response

        try:
            body_text = response.get_data(as_text=True)
            data = json.loads(body_text) if body_text else {}
        except Exception:
            # If body isn't valid JSON, skip signing
            return response

        if not isinstance(data, dict):
            return response

        # Add/replace timestamp (seconds)
        data["timestamp"] = int(time.time())

        # Compute signature using project's signing util
        try:
            signature = sign_response(data)
            data["signature"] = signature
        except Exception:
            # On any signing failure, return original response
            return response

        # Serialize deterministically (no spaces)
        new_body = json.dumps(data, separators=(",", ":"), ensure_ascii=False)
        response.set_data(new_body)
        response.headers["Content-Type"] = "application/json; charset=utf-8"
        response.headers["Content-Length"] = str(len(new_body.encode("utf-8")))

        return response
