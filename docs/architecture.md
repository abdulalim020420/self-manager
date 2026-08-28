# Architecture

**Status:** Draft

This document describes the current and planned architecture of SelfManager. It will evolve alongside the implementation.

---

## 1. Architecture Goals

* Keep the initial system simple enough to develop and operate independently.
* Maintain clear separation between application responsibilities.
* Support future real-time, AI, analytics, media, and payment functionality.
* Prefer modularity over premature microservices.
* Allow components to be extracted or scaled independently when justified.

---

## 2. Initial Architecture

```text
Frontend
    │
    ▼
Backend API
    │
    ├── PostgreSQL
    ├── Redis
    └── Background Workers
```

Additional external services:

```text
Backend
 ├── AI Provider
 ├── Payment Gateway
 └── Object Storage
```

---

## 3. Planned Evolution

```text
Core Application
       │
       ├── Real-Time
       ├── Background Processing
       ├── Media
       ├── AI
       ├── Analytics
       └── Payments
```

Analytics may eventually evolve into:

```text
Application
     │
     ▼
Domain Events
     │
     ▼
Message Queue
     │
     ▼
Analytics Processing
     │
     ▼
Analytics Storage
     │
     ├── Dashboard
     └── AI
```

Large-scale technologies such as Kafka, distributed processing, data lakes, or dedicated search infrastructure will only be introduced if they provide a meaningful benefit.

---

## 4. Architecture Decisions

Important architectural decisions will be recorded as the project develops.

```text
docs/architecture/decisions/
```

Example:

```text
001-database-choice.md
002-modular-monolith.md
003-event-driven-analytics.md
004-ai-provider-abstraction.md
```

---

## 5. Current Status

The architecture is currently in the planning stage. Technology choices and component boundaries may change as implementation progresses.


---
v0.1
Modular monolith
↓
v0.3
+ Redis + Workers
  ↓
  v0.5
+ WebSockets + Object Storage
  ↓
  v0.7
+ AI Gateway
  ↓
  v0.9
+ Event-driven Analytics
  ↓
  v1.x
+ Search / Observability / Scaling