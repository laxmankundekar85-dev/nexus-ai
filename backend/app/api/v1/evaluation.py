from fastapi import APIRouter
from typing import List
from pydantic import BaseModel

router = APIRouter(prefix="/evaluation", tags=["Evaluation Lab"])

class ModelScoreSchema(BaseModel):
    model_id: str
    model_name: str
    citation_precision: float
    evidence_coverage: float
    factual_consistency: float
    numerical_accuracy: float
    average_latency_ms: int
    cost_per_1k_runs_usd: float
    overall_score: float

class EvaluationRunSchema(BaseModel):
    id: str
    benchmark_name: str
    test_cases_count: int
    executed_at: str
    status: str
    models_evaluated: List[ModelScoreSchema]
    regression_detected: bool
    notes: str

class TestCaseSchema(BaseModel):
    id: str
    name: str
    category: str
    prompt: str
    ground_truth_reference: str
    expected_facts: List[str]

@router.get("/runs", response_model=List[EvaluationRunSchema])
async def list_runs():
    return [
        {
            "id": "eval-run-88",
            "benchmark_name": "Enterprise Financial & SEC Synthesis Golden Benchmark v3",
            "test_cases_count": 48,
            "executed_at": "2026-10-29T08:00:00Z",
            "status": "completed",
            "regression_detected": False,
            "notes": "Validated against Q1-Q3 audited enterprise data with strict numerical tolerance.",
            "models_evaluated": [
                {
                    "model_id": "gpt-4o",
                    "model_name": "OpenAI GPT-4o",
                    "citation_precision": 96.4,
                    "evidence_coverage": 94.2,
                    "factual_consistency": 97.8,
                    "numerical_accuracy": 98.1,
                    "average_latency_ms": 1850,
                    "cost_per_1k_runs_usd": 12.40,
                    "overall_score": 96.6,
                },
                {
                    "model_id": "claude-3-5-sonnet",
                    "model_name": "Anthropic Claude 3.5 Sonnet",
                    "citation_precision": 98.2,
                    "evidence_coverage": 95.8,
                    "factual_consistency": 98.6,
                    "numerical_accuracy": 97.4,
                    "average_latency_ms": 2120,
                    "cost_per_1k_runs_usd": 14.80,
                    "overall_score": 97.5,
                },
            ],
        }
    ]

@router.get("/test-cases", response_model=List[TestCaseSchema])
async def list_test_cases():
    return [
        {
            "id": "tc-1",
            "name": "Segmental Margin Extraction",
            "category": "factual_extraction",
            "prompt": "Extract Q3 gross margin percentage for APAC cloud infrastructure operations.",
            "ground_truth_reference": "42.8% GAAP gross margin reported in footnote 7.",
            "expected_facts": ["42.8%", "APAC cloud", "GAAP"],
        },
        {
            "id": "tc-2",
            "name": "Consolidated Variance Math",
            "category": "numerical_synthesis",
            "prompt": "Calculate absolute YoY revenue difference and percentage CAGR across 3 fiscal years.",
            "ground_truth_reference": "CAGR: 18.42%, Absolute delta: $1.42B.",
            "expected_facts": ["18.42%", "$1.42B"],
        },
    ]
