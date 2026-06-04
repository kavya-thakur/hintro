# Technical Decisions

This document explains the major technical decisions made during the implementation of the Hintro Meeting Intelligence API, including the rationale, alternatives considered, and associated trade-offs.

---

# 1. Database Choice

## Selected

MongoDB with Mongoose

## Why It Was Chosen

Meeting transcripts, AI-generated insights, citations, participants, and action items all contain nested and flexible data structures.

MongoDB's document-based model maps naturally to these requirements without requiring complex relational schemas.

Example:

- Meeting
  - Participants
  - Transcript Entries
  - Analysis
    - Summary
    - Decisions
    - Follow-Ups
    - Action Items

Storing these structures as documents simplifies both development and querying.

## Alternatives Considered

### PostgreSQL

Pros:

- Strong relational integrity
- Powerful querying capabilities

Cons:

- Requires multiple related tables
- More complex schema design for nested transcript and analysis structures

### MySQL

Pros:

- Mature relational database

Cons:

- Similar complexity concerns for nested AI-generated content

## Trade-Offs

MongoDB provides flexibility and faster development for document-oriented data at the cost of weaker relational constraints compared to traditional SQL databases.

---

# 2. Authentication Strategy

## Selected

JWT Authentication using HTTP-only Cookies

## Why It Was Chosen

The assignment required authentication but did not mandate a specific implementation.

JWT-based authentication was selected because:

- Stateless authentication
- Simple deployment architecture
- No session storage required
- Easy integration with APIs

Tokens are stored inside HTTP-only cookies to reduce exposure to client-side JavaScript.

## Alternatives Considered

### Session-Based Authentication

Pros:

- Easier token invalidation
- Traditional server-managed authentication

Cons:

- Requires session storage
- Additional infrastructure complexity

### JWT in Local Storage

Pros:

- Simple frontend integration

Cons:

- More vulnerable to XSS attacks

## Trade-Offs

JWT cookies provide a good balance between simplicity and security for this project.

---

# 3. AI Provider Selection

## Selected

Gemini 2.5 Flash

## Why It Was Chosen

The meeting analysis workflow requires:

- Structured JSON responses
- Fast response times
- Low operational cost
- Good instruction following

Gemini 2.5 Flash performs well in structured extraction tasks while maintaining low latency.

## Alternatives Considered

### OpenAI

Pros:

- Excellent structured outputs

Cons:

- Higher cost

### Claude

Pros:

- Strong reasoning capabilities

Cons:

- Additional setup requirements

### Groq

Pros:

- Extremely fast inference

Cons:

- Different model ecosystem

## Trade-Offs

Gemini Flash provides an effective balance of performance, cost, and structured output quality.

---

# 4. Citation-Based Grounding Strategy

## Selected

Timestamp-based citations extracted directly from meeting transcripts.

## Why It Was Chosen

A core assignment requirement was preventing hallucinated outputs.

Every AI-generated insight must reference transcript evidence.

The system therefore requires:

- Summary citations
- Decision citations
- Follow-up citations
- Action item citations

Generated timestamps are validated against actual transcript timestamps before results are persisted.

## Alternatives Considered

### Trusting LLM Output Directly

Pros:

- Simpler implementation

Cons:

- Increased hallucination risk
- No verification mechanism

## Trade-Offs

Additional validation logic increases implementation complexity but significantly improves reliability.

---

# 5. Validation Strategy

## Selected

Zod Schema Validation

## Why It Was Chosen

Validation requirements included:

- Email validation
- Required field validation
- Date validation
- Status validation

Zod provides:

- Declarative schemas
- Consistent validation errors
- Runtime validation
- Clean middleware integration

## Alternatives Considered

### Manual Validation

Pros:

- No additional dependency

Cons:

- Repetitive code
- Harder maintenance

### Joi

Pros:

- Mature validation library

Cons:

- Larger API surface area

## Trade-Offs

Zod improved maintainability and reduced controller complexity.

---

# 6. Reminder Integration Selection

## Selected

Resend Email API

## Why It Was Chosen

The assignment required a real third-party integration actively used by the reminder workflow.

Resend was selected because:

- Simple API
- Excellent developer experience
- Reliable email delivery
- Good Node.js support

The reminder workflow:

1. Detects overdue action items
2. Identifies assigned participants
3. Sends email reminders
4. Records reminder history

## Alternatives Considered

### Slack Webhooks

Pros:

- Simple integration

Cons:

- Requires Slack workspace

### Telegram Bot API

Pros:

- Lightweight

Cons:

- Requires bot setup and user interaction

### Discord Webhooks

Pros:

- Easy integration

Cons:

- Less suitable for task reminders

## Trade-Offs

Email reminders provide a familiar notification channel and align well with action item management workflows.

---

# 7. Background Job Processing

## Selected

node-cron

## Why It Was Chosen

The project requires periodic overdue action item detection.

node-cron provides:

- Lightweight scheduling
- No additional infrastructure
- Easy deployment on Render

The scheduler executes every minute and processes overdue action items.

## Alternatives Considered

### BullMQ

Pros:

- Advanced job processing

Cons:

- Requires Redis

### Cloud-Based Schedulers

Pros:

- Highly scalable

Cons:

- Additional infrastructure complexity

## Trade-Offs

node-cron is sufficient for the scale and requirements of this project.

---

# 8. Error Handling Architecture

## Selected

Centralized Error Handling Middleware

## Why It Was Chosen

A centralized approach ensures:

- Consistent error responses
- Structured logging
- Trace ID propagation
- Reduced controller complexity

Custom AppError objects are used for expected application errors.

## Trade-Offs

Requires additional abstraction but improves maintainability and consistency.

---

# 9. Logging Strategy

## Selected

Winston Structured Logging

## Why It Was Chosen

The assignment requires:

- Timestamp logging
- Trace IDs
- Request metadata
- Error details

Structured logs are easier to search, monitor, and debug than plain console output.

## Trade-Offs

Slightly more setup compared to console logging but significantly better observability.

---

# 10. Project Structure

## Selected

Layered Architecture

```text
routes
→ middlewares
→ controllers
→ services
→ models

```

## Why It Was Chosen

This separation improves:

* Maintainability
* Testability
* Scalability
* Responsibility isolation

Controllers focus on request handling while business logic remains reusable and isolated.

## Trade-Offs

Introduces additional files but results in a cleaner and more maintainable codebase.

```

```
