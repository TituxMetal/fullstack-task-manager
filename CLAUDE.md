# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this
repository.

## Project Overview

This is a Fullstack Task Manager application built as a monorepo using Turborepo. The project is
currently in the planning/documentation phase with comprehensive architecture and PRD documents
available in the `docs/` directory.

## Technology Stack

- **Monorepo**: Turborepo with Yarn Corepack
- **Backend**: NestJS, TypeScript, Prisma ORM, SQLite, Jest
- **Frontend**: Astro + React, Tailwind CSS V4, Zod validation, React Hook Form, Vitest
- **Deployment**: Docker containers on Debian 12 server

## Architecture

The project follows Clean Architecture with Domain-Driven Design principles:

### Backend Structure

```treeview
apps/api/
├── src/
│   ├── database/           # Database module with Prisma
│   ├── shared/             # Shared utilities
│   ├── tasks/              # Tasks domain module
│   │   ├── domain/         # Entities and value objects
│   │   ├── application/    # Use cases and repository interfaces
│   │   └── infrastructure/ # Controllers and repositories
│   └── tags/               # Tags domain module (same structure)
```

### Frontend Structure

```treeview
apps/web/
├── src/
│   ├── components/         # React components by type
│   │   ├── forms/          # Form components
│   │   ├── ui/             # UI components
│   │   └── layout/         # Layout components
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # API client and utilities
│   └── pages/              # Astro pages
```

### Shared Types

```treeview
packages/shared/            # Shared types between frontend and backend
```

## Development Commands

**Note**: The actual source code implementation has not yet been created. The following commands are
based on the architectural specifications:

```bash
# Install dependencies
yarn install

# Start development servers (both frontend and backend)
yarn dev

# Run tests
yarn test

# Run linting
yarn lint

# Run type checking
yarn typecheck

# Build for production
yarn build
```

## Key Features

- Task management with CRUD operations
- Task status tracking (TODO, IN_PROGRESS, DONE)
- Tag system for task categorization
- Filtering by status and tags
- Dark theme UI design
- Responsive layout for all devices

## Domain Models

### Task Entity

- id, title, description (optional), status, dueDate (optional)
- createdAt, updatedAt timestamps
- Many-to-many relationship with tags

### Tag Entity

- id, name, color (hex code)
- Many-to-many relationship with tasks

## API Endpoints (Planned)

- **Tasks**: GET, POST `/api/tasks`, GET, PUT, DELETE `/api/tasks/:id`
- **Tags**: GET, POST `/api/tags`, GET, PUT, DELETE `/api/tags/:id`
- Query parameters: `status`, `tagId` for filtering

## Testing Strategy

- **Backend**: Jest for unit, integration, and API tests
- **Frontend**: Vitest + React Testing Library for component tests
- Clean architecture enables comprehensive testing at all layers

## Design System

- **Theme**: Dark theme with specific color palette
- **Primary Colors**: Background #121212, Surface #1E1E1E, Text #E0E0E0
- **Accent**: Violet purple #7C3AED
- **Typography**: Inter font family
- **Spacing**: 4px base unit system

## BMAD Integration

This project uses the BMAD (Business-Managed Agile Development) framework with specialized agent
personas:

- **James (@dev)**: Full Stack Developer - Implementation, coding, debugging, story development
- **Winston (@architect)**: System Architect - Architecture decisions, system design, technical
  strategy
- **John (@pm)**: Product Manager - PRDs, feature planning, requirements validation
- **Quinn (@qa)**: Senior Developer & QA - Code review, testing strategy, quality assurance

### BMAD Agent Usage

- Type `@agent` to activate specific agent persona (e.g., `@dev`, `@architect`)
- Each agent has specific commands accessible via `*help` command
- Agents have access to tasks, templates, and checklists in `.bmad-core/`
- Follow agent-specific workflows for structured development process

## AI Assistant Guidelines

### Primary Documentation References

- **ALWAYS** reference `docs/architecture.md` for complete technical specifications
- **ALWAYS** reference `docs/prd.md` for user stories and requirements
- **NEVER** duplicate domain knowledge - reference existing comprehensive docs

### .cursor/rules/ Integration

This project includes specialized AI rules for consistent development:

- `.cursor/rules/meta-prompt.md` - Master AI guidance and context switching
- `.cursor/rules/clean-architecture-patterns.md` - Implementation patterns
- `.cursor/rules/git-workflow.md` - Git and commit standards
- BMAD agents (`.cursor/rules/*.mdc`) - Structured development workflows

### Development Workflow

1. **Requirements Phase**: Use `@pm` agent to validate against `docs/prd.md`
2. **Architecture Phase**: Use `@architect` agent with `docs/architecture.md`
3. **Implementation Phase**: Use `@dev` agent following clean architecture patterns
4. **Quality Phase**: Use `@qa` agent for testing and code review

### Code Quality Standards

- **Clean Architecture**: Strict layer separation (Domain → Application → Infrastructure)
- **Type Safety**: End-to-end TypeScript with no `any` types
- **Testing**: Comprehensive coverage at domain, application, and infrastructure layers
- **Git Workflow**: Conventional commits with proper PR process

### BMAD Agent Integration

Reference BMAD agents for structured workflows:

- **James (@dev)**: Implementation, coding, technical execution
- **Winston (@architect)**: System design, architecture decisions
- **John (@pm)**: Requirements validation, feature planning
- **Quinn (@qa)**: Testing strategy, quality assurance

### Implementation Priorities

1. Domain entities and business logic first
2. Repository interfaces in application layer
3. Infrastructure implementations (Prisma, controllers)
4. Frontend components following design system
5. Comprehensive testing at all layers

## Important Notes

- Project is currently in planning phase - no source code exists yet
- All technical specifications are documented in `docs/architecture.md`
- Product requirements are in `docs/prd.md`
- Follow clean architecture and DDD principles when implementing
- Maintain type safety throughout the entire stack
- Prioritize responsive design and accessibility
- Use AI rules from `.cursor/rules/` for consistent development
