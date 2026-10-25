import math
import statistics
from typing import Dict, Any, List

async def data_analysis_tool(params: Dict[str, Any], user_id: str, execution_id: str) -> Dict[str, Any]:
    dataset = params.get("data", [])
    operation = params.get("operation", "summary")
    numeric_keys = params.get("numeric_keys", [])

    if not dataset or not isinstance(dataset, list):
        return {"error": "Invalid or empty dataset provided", "success": False}

    results: Dict[str, Any] = {
        "record_count": len(dataset),
        "operation": operation,
        "metrics": {}
    }

    # Extract numeric values
    if isinstance(dataset[0], dict):
        if not numeric_keys:
            # Auto-detect numeric fields
            numeric_keys = [
                k for k, v in dataset[0].items()
                if isinstance(v, (int, float)) and not isinstance(v, bool)
            ]

        for key in numeric_keys:
            vals = [
                float(row[key]) for row in dataset
                if isinstance(row, dict) and key in row and isinstance(row[key], (int, float)) and not isinstance(row[key], bool)
            ]
            if vals:
                results["metrics"][key] = {
                    "count": len(vals),
                    "sum": round(sum(vals), 2),
                    "mean": round(statistics.mean(vals), 2),
                    "median": round(statistics.median(vals), 2),
                    "min": min(vals),
                    "max": max(vals),
                    "stdev": round(statistics.stdev(vals), 2) if len(vals) > 1 else 0.0
                }
    elif isinstance(dataset[0], (int, float)):
        vals = [float(x) for x in dataset if isinstance(x, (int, float))]
        if vals:
            results["metrics"]["values"] = {
                "count": len(vals),
                "sum": round(sum(vals), 2),
                "mean": round(statistics.mean(vals), 2),
                "median": round(statistics.median(vals), 2),
                "min": min(vals),
                "max": max(vals)
            }

    return {"success": True, "analysis": results}
