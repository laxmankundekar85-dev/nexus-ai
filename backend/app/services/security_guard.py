import re
from typing import Tuple, Optional

INJECTION_PATTERNS = [
    re.compile(r"ignore\s+(all\s+)?(previous|prior|above)\s+instructions", re.IGNORECASE),
    re.compile(r"disregard\s+(all\s+)?(previous|prior|above)\s+instructions", re.IGNORECASE),
    re.compile(r"system\s+prompt\s+override", re.IGNORECASE),
    re.compile(r"you\s+are\s+now\s+a\s+(jailbroken|dan|unrestricted)", re.IGNORECASE),
    re.compile(r"bypass\s+(all\s+)?content\s+filters?", re.IGNORECASE),
    re.compile(r"reveal\s+(your\s+)?(system\s+prompt|secret\s+key|api\s+key)", re.IGNORECASE),
    re.compile(r"__import__\s*\(", re.IGNORECASE),
    re.compile(r"eval\s*\(", re.IGNORECASE),
    re.compile(r"exec\s*\(", re.IGNORECASE),
    re.compile(r"<script[\s>]", re.IGNORECASE),
]

def sanitize_input(text: str) -> Tuple[str, bool, Optional[str]]:
    if not text:
        return "", True, None

    clean = text.strip()
    for pattern in INJECTION_PATTERNS:
        if pattern.search(clean):
            sanitized = pattern.sub("[REDACTED_ADVERSARIAL_INSTRUCTION]", clean)
            return sanitized, False, f"Potential prompt injection detected: {pattern.pattern}"

    return clean, True, None
