# SelfManager

> A personal daily tracker designed to help manage habits, tasks, mood, journals, and personal progress — with analytics and AI-assisted insights.

**Status:** 🚧 Planning / Early Development

---

## Overview

SelfManager is a personal productivity and self-management application.

The goal is to build a complete, production-oriented application while gradually exploring different areas of modern software engineering, including:

* Full-stack application development
* Real-time communication
* Media storage and processing
* Background jobs
* AI integration
* Analytics and data processing
* Payment integration
* Observability
* Containerization and deployment

The project will be developed incrementally, with the architecture evolving as the application grows.

---

## Planned Features

### Core

* [ ] User authentication
* [ ] Daily dashboard
* [ ] Habit tracking
* [ ] Task management
* [ ] Goals
* [ ] Streaks
* [ ] Mood tracking
* [ ] Journal / notes
* [ ] Calendar

### Media

* [ ] Image uploads
* [ ] Audio uploads
* [ ] Video uploads
* [ ] Media management

### Real-Time

* [ ] WebSocket communication
* [ ] Real-time dashboard updates
* [ ] Notifications / synchronization

### AI

* [ ] AI gateway / provider abstraction
* [ ] Daily summaries
* [ ] Personal insights
* [ ] AI-assisted journaling
* [ ] AI-based recommendations
* [ ] AI usage and cost tracking

The application will use external AI providers rather than hosting or training its own models.

### Analytics

* [ ] Application event tracking
* [ ] Analytics pipeline
* [ ] Personal statistics
* [ ] Trend analysis
* [ ] Analytics dashboard
* [ ] AI-powered insights from historical data

The initial analytics architecture will be designed for simplicity and low operational overhead, with the possibility of evolving toward distributed processing if the project eventually requires it.

### Payments

* [ ] Subscription model
* [ ] Payment gateway integration
* [ ] Webhook handling
* [ ] Subscription management

---

## Planned Architecture

The initial architecture is expected to follow a modular-monolith approach, with the possibility of extracting individual services later when there is a clear reason to do so.

```text
                         ┌─────────────────┐
                         │   Frontend      │
                         └────────┬────────┘
                                  │
                                  ▼
                         ┌─────────────────┐
                         │   Backend API   │
                         └────────┬────────┘
                                  │
              ┌───────────────────┼───────────────────┐
              │                   │                   │
              ▼                   ▼                   ▼
        ┌───────────┐       ┌───────────┐       ┌───────────┐
        │ PostgreSQL│       │   Redis   │       │  Workers  │
        └───────────┘       └───────────┘       └─────┬─────┘
                                                      │
                                                      ▼
                                               Background Jobs


        ┌────────────────────────────────────────────────────┐
        │                    External Services                │
        │                                                    │
        │   AI Provider     Payment Gateway    Object Store │
        └────────────────────────────────────────────────────┘
```

### Future Architecture

As the application grows, additional components may be introduced where appropriate:

```text
Application Events
       │
       ▼
 Event / Message Queue
       │
       ▼
 Analytics Processing
       │
       ▼
 Analytics Database
       │
       ├──────────► Dashboard
       │
       └──────────► AI Insights
```

Technologies such as Kafka, Spark/Flink, OpenSearch, data warehouses, or data lakes are considered future possibilities rather than initial requirements.

---

## Project Structure

Current structure:

```text
SelfManager/
├── backend/
├── frontend/
├── docs/
├── infra/
├── docker-compose.yml
├── .env.example
├── .gitignore
└── README.md
```

The structure may change as the architecture develops.

---

## Technology

### Current / Planned

| Area             | Technology            |
| ---------------- | --------------------- |
| Frontend         | TBD                   |
| Backend          | TBD                   |
| Database         | PostgreSQL            |
| Cache            | Redis                 |
| Containerization | Docker                |
| Real-Time        | WebSockets            |
| Media Storage    | Object Storage        |
| AI               | External AI Providers |
| Analytics        | TBD                   |
| Payments         | TBD                   |
| Deployment       | TBD                   |

Technology choices are intentionally not finalized during the planning stage.

---

## Documentation

More detailed documentation will be added as the corresponding components are implemented.

```text
docs/
├── architecture/
│   ├── overview.md
│   └── decisions/
│
├── backend/
│
├── frontend/
│
├── database/
│
├── ai/
│
├── analytics/
│
├── infrastructure/
│
└── deployment/
```

---

## Development Philosophy

The project is being developed incrementally as a long-term personal project.

The focus is not on introducing technologies simply for the sake of complexity. Architectural decisions will be made based on actual requirements and documented as the system evolves.

The project will prioritize:

* Simple solutions before complex ones
* Clear separation of responsibilities
* Incremental architecture
* Maintainability
* Observability
* Security
* Automated testing
* Practical scalability
* Documented architectural decisions

---

## Roadmap

```text
[ ] Project foundation
[ ] Development environment / Docker
[ ] Authentication
[ ] Core tracker
[ ] Initial deployment
[ ] Production hardening
[ ] Real-time features
[ ] Media storage
[ ] AI integration
[ ] Analytics
[ ] Payments
[ ] Search
[ ] Observability
[ ] Advanced scalability
```

This roadmap is intentionally flexible and will evolve with the project.

---

## Project Status

**Current phase:** Planning

The architecture and technology choices are still being evaluated. Implementation will proceed incrementally, with each major phase resulting in a usable and deployable version.

