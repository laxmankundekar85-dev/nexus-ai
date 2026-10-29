import re
from typing import List, Dict, Any
from datetime import datetime, timezone

class ContradictionDetector:
    """
    Identifies conflicting claims, numerical discrepancies, and outdated facts
    across multiple documents and external web sources. Never silently resolves conflicts.
    """

    @staticmethod
    def extract_numerical_assertions(text: str) -> List[Dict[str, Any]]:
        assertions = []
        patterns = [
            r'([a-zA-Z\s_]{3,30})\s*(?:=|is|was|of|at|measures?)\s*([0-9]+(?:\.[0-9]+)?\s*(?:[a-zA-Z%$€£/]+)?)',
            r'([a-zA-Z\s_]{3,30})\s*:\s*([0-9]+(?:\.[0-9]+)?\s*(?:[a-zA-Z%$€£/]+)?)'
        ]
        for pat in patterns:
            for match in re.finditer(pat, text, re.IGNORECASE):
                key = match.group(1).strip().lower()
                val = match.group(2).strip()
                if len(key) > 3 and not key.startswith("http"):
                    assertions.append({
                        "key": key,
                        "value": val,
                        "raw": match.group(0)
                    })
        return assertions

    @classmethod
    def detect_contradictions(cls, sources: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        contradictions = []
        seen_keys: Dict[str, List[Dict[str, Any]]] = {}

        for src in sources:
            source_name = src.get("source_name", "Unknown Source")
            src_type = src.get("source_type", "document")
            date = src.get("date", datetime.now(timezone.utc).isoformat())
            reliability = src.get("reliability_score", 0.95 if src_type == "document" else 0.85)

            for item in src.get("items", []):
                key = item.get("key", "").lower().strip()
                val = item.get("value", "").strip()
                claim_text = item.get("claim_text", f"{key}: {val}")

                if not key or not val:
                    continue

                record = {
                    "source_name": source_name,
                    "source_type": src_type,
                    "date": date,
                    "reliability": reliability,
                    "claim_text": claim_text,
                    "value": val,
                    "raw_passage": item.get("passage", claim_text)
                }

                if key in seen_keys:
                    for prev in seen_keys[key]:
                        if prev["value"].lower() != val.lower():
                            contradictions.append({
                                "id": f"contra_{len(contradictions) + 1}",
                                "parameter": key,
                                "claim_a": {
                                    "source": prev["source_name"],
                                    "source_type": prev["source_type"],
                                    "date": prev["date"],
                                    "reliability": prev["reliability"],
                                    "value": prev["value"],
                                    "text": prev["claim_text"],
                                    "passage": prev["raw_passage"]
                                },
                                "claim_b": {
                                    "source": source_name,
                                    "source_type": src_type,
                                    "date": date,
                                    "reliability": reliability,
                                    "value": val,
                                    "text": claim_text,
                                    "passage": record["raw_passage"]
                                },
                                "discrepancy_type": "numerical_shift" if any(c.isdigit() for c in val) else "factual_divergence",
                                "status": "unresolved_requires_review",
                                "routed_to": "Reviewer Agent / Human Reviewer"
                            })
                    seen_keys[key].append(record)
                else:
                    seen_keys[key] = [record]

        return contradictions

contradiction_detector = ContradictionDetector()
