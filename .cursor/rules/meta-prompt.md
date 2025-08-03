# Meta-Prompt: Fullstack Task Manager AI Assistant

## Context Overview

You are an AI assistant working on a **Fullstack Task Manager** built with Clean Architecture and
Domain-Driven Design principles. This is a monorepo project using Turborepo.

## Primary Documentation References

**ALWAYS refer to these documents first:**

- `CLAUDE.md` - Primary project instructions and context
- `docs/architecture.md` - Complete technical architecture specification
- `docs/prd.md` - Product requirements and user stories

## Project Architecture Summary

- **Backend**: NestJS + Clean Architecture + DDD + Prisma + SQLite
- **Frontend**: Astro + React + Tailwind CSS V4 + Zod + React Hook Form
- **Monorepo**: Turborepo with Yarn Corepack
- **Domain**: Task management with Tags (many-to-many relationship)

## AI Assistant Operating Principles

### 1. Documentation First

- NEVER duplicate content from existing docs
- ALWAYS reference `docs/architecture.md` for domain knowledge
- ALWAYS reference `docs/prd.md` for requirements
- Use existing documentation as single source of truth

### 2. Clean Architecture Enforcement

- Respect layer boundaries: Domain → Application → Infrastructure
- Domain entities must not depend on external frameworks
- Repository interfaces belong in Application layer
- Controllers and external services in Infrastructure layer

### 3. Implementation Focus

- Focus on HOW to implement, not WHAT to implement
- Follow patterns defined in `docs/architecture.md`
- Maintain type safety throughout the stack
- Use shared types from `packages/shared`

## Context Switching Guidelines

### When Starting New Work

1. Read relevant sections from `docs/architecture.md`
2. Check `docs/prd.md` for user story context
3. Apply appropriate BMAD agent persona (see BMAD agents section below)
4. Follow patterns from `clean-architecture-patterns.md`

### When Making Changes

1. Maintain architectural consistency
2. Follow git workflow from `git-workflow.md`
3. Ensure tests are written for new functionality
4. Update documentation if architecture changes

## Development Phases

### Phase 1: Planning & Architecture

- Use Winston (@architect) agent persona
- Reference architecture.md for technical decisions
- Validate against PRD requirements

### Phase 2: Implementation

- Use James (@dev) agent persona
- Follow clean architecture patterns
- Implement domain logic first, then infrastructure

### Phase 3: Testing & Quality

- Use Quinn (@qa) agent persona
- Write tests at all architecture layers
- Validate against acceptance criteria

### Phase 4: Documentation & Delivery

- Use John (@pm) agent persona
- Update relevant documentation
- Prepare for deployment

## BMAD Agent Integration

This project uses BMAD agents with specific personas:

- **James (@dev)**: Use for implementation and story development
- **Winston (@architect)**: Use for architecture and system design decisions
- **John (@pm)**: Use for requirements and product management
- **Quinn (@qa)**: Use for code review and quality assurance

### BMAD Agent Activation

- Type `@agent` to activate (e.g., `@dev`, `@architect`)
- Each agent has specific commands via `*help`
- Agents reference `.bmad-core/` resources for tasks and templates
- Follow structured workflows defined in BMAD system

## Key Implementation Reminders

### Domain Layer (apps/api/src/[module]/domain/)

- Pure business logic only
- No external dependencies
- Entities and Value Objects
- Business rules validation

### Application Layer (apps/api/src/[module]/application/)

- Use cases orchestration
- Repository interfaces (not implementations)
- DTOs for data transfer
- Application services

### Infrastructure Layer (apps/api/src/[module]/infrastructure/)

- Repository implementations
- Controllers and API endpoints
- External service integrations
- Framework-specific code

### Frontend Components (apps/web/src/components/)

- Organized by type: ui/, forms/, layout/
- Use React Hook Form + Zod validation
- Follow Tailwind CSS V4 conventions
- Maintain responsive design principles

## Error Prevention

### Common Mistakes to Avoid

- Don't duplicate domain knowledge from docs/
- Don't mix architecture layers
- Don't create new entities without checking existing domain model
- Don't implement without referencing existing patterns

### Quality Gates

- All new code must have tests
- All changes must maintain type safety
- All UI must be responsive and accessible
- All commits must follow conventional commit format

## Resource Efficiency

### Token Management

- Reference existing docs instead of duplicating content
- Use focused, specific queries
- Avoid loading unnecessary context
- Leverage existing comprehensive documentation

### Development Efficiency

- Use BMAD agents for role-specific tasks
- Follow established patterns consistently
- Maintain single source of truth principle
- Build incrementally with proper testing

## Integration Points

This meta-prompt works with:

- `CLAUDE.md` (primary project context)
- `clean-architecture-patterns.md` (implementation patterns)
- `git-workflow.md` (development workflow)
- BMAD agents (`.cursor/rules/*.mdc`) (structured workflows)
- All existing project documentation

Remember: This meta-prompt guides how to use other resources effectively. Always start with existing
documentation and use these rules to implement consistently within the established architecture.
