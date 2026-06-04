# AI Approach

This document describes the AI integration strategy used in the Hintro Meeting Intelligence API, including prompt design, citation grounding, hallucination prevention, output validation, and known limitations.

---

# Overview

The Meeting Intelligence Service uses Gemini 2.5 Flash to analyze meeting transcripts and generate structured meeting insights.

The AI system extracts:

- Meeting Summaries
- Decisions
- Follow-Up Suggestions
- Action Items

A primary objective of the implementation is to ensure that generated insights remain grounded in the original transcript and do not introduce unsupported information.

---

# AI Model Selection

## Selected Model

Gemini 2.5 Flash

## Reasons for Selection

The meeting analysis workflow requires:

- Structured JSON generation
- Fast response times
- Cost-efficient inference
- Reliable instruction following

Gemini 2.5 Flash provides a strong balance between performance, speed, and structured output quality.

---

# Prompt Design

The prompt instructs the model to analyze a meeting transcript and return structured JSON containing:

- Summary
- Decisions
- Follow-Ups
- Action Items

The model is explicitly instructed to:

- Use only information present in the transcript
- Avoid inventing participants
- Avoid inventing tasks
- Avoid inventing decisions
- Avoid inventing meeting outcomes
- Provide citations for every generated insight

The expected output structure mirrors the application's database schema to simplify validation and persistence.

Example structure:

```json
{
   "summary": [],
   "decisions": [],
   "followUps": [],
   "actionItems": []
}

```

---

# Citation Strategy

## Goal

Every AI-generated insight must be traceable to the original transcript.

## Implementation

Transcript entries contain timestamps:

```json
{
   "timestamp": "00:20",
   "speaker": "Alice",
   "text": "I will prepare release notes."
}

```

Generated insights must reference one or more timestamps:

```json
{
   "text": "Alice will prepare release notes.",
   "citations": [
      {
         "timestamp": "00:20"
      }
   ]
}

```

This creates a direct relationship between generated content and transcript evidence.

---

# Grounding Strategy

Grounding is enforced through two mechanisms.

## 1. Prompt-Level Grounding

The model is instructed to generate outputs exclusively from the provided transcript.

The prompt explicitly forbids:

* Invented attendees
* Invented action items
* Invented decisions
* Invented meeting outcomes
* Unsupported assumptions

## 2. Application-Level Validation

AI outputs are not trusted automatically.

Every generated response is validated before persistence.

The validation layer verifies:

* Required output sections exist
* Citations are present
* Citation timestamps exist in the transcript
* Action items contain tasks
* Insights contain text

Only validated outputs are stored in the database.

---

# Hallucination Prevention Approach

A dedicated validation utility is used to detect unsupported AI responses.

The validation process:

1. Extracts all valid transcript timestamps
2. Validates generated citations
3. Rejects missing citations
4. Rejects invalid timestamps
5. Rejects malformed output structures

Example:

```json
{
   "citations": [
      {
         "timestamp": "99:99"
      }
   ]
}

```

This response is rejected because the timestamp does not exist in the original transcript.

This approach prevents unsupported content from being persisted.

---

# Output Validation Strategy

The validateAnalysis utility performs schema-level validation of AI outputs.

Validation checks include:

## Required Sections

The following arrays must exist:

* summary
* decisions
* followUps
* actionItems

## Citation Validation

Every generated insight must contain citations.

## Timestamp Verification

Every citation timestamp must exist in the original transcript.

## Action Item Validation

Every generated action item must contain:

* task
* citations

## Insight Validation

Every generated insight must contain:

* text
* citations

Invalid responses result in application errors and are not persisted.

---

# Error Handling

AI responses that fail validation are rejected and logged.

Example error categories:

* AI_RESPONSE_ERROR
* INVALID_CITATIONS
* INVALID_CITATION

This prevents corrupted or unsupported AI outputs from entering the system.

---

# Known Limitations

## Timestamp Dependency

Grounding relies on transcript timestamps.

If timestamps are missing or inconsistent, citation validation may fail.

## Model Interpretation

The AI model may occasionally omit valid insights that are present in the transcript.

The system prioritizes precision and grounding over aggressive extraction.

## Citation Granularity

Citations currently reference transcript timestamps rather than exact character spans.

Future improvements could include sentence-level or span-level grounding.

## Single-Pass Analysis

Analysis is generated in a single model invocation.

Multi-stage verification workflows could further improve reliability.

---

# Future Improvements

Potential enhancements include:

* Structured output schemas enforced by the model
* Confidence scoring for generated insights
* Multi-stage validation pipelines
* Semantic citation matching
* Human review workflows
* Fine-grained transcript span citations

---

# Summary

The AI integration prioritizes grounded, explainable, and verifiable outputs over unconstrained text generation.

The system combines:

* Prompt-level grounding
* Citation requirements
* Timestamp validation
* Structured output validation

to reduce hallucinations and ensure that all generated insights remain traceable to the original meeting transcript.

```

```
