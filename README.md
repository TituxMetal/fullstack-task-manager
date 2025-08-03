# Fullstack Task Manager

A modern task management application built with Clean Architecture and Domain-Driven Design principles.

## Overview

This is a comprehensive task management system featuring a NestJS backend with Prisma ORM and an Astro + React frontend. The project follows a monorepo structure using Turborepo for efficient development and deployment.

## Features

- ✅ Task CRUD operations with status tracking (TODO, IN_PROGRESS, DONE)
- 🏷️ Tag system for task categorization
- 🔍 Advanced filtering by status and tags
- 🌙 Dark theme UI design
- 📱 Responsive layout for all devices
- ⚡ Type-safe end-to-end development

## Technology Stack

### Backend
- **Framework**: NestJS with TypeScript
- **Database**: SQLite with Prisma ORM
- **Testing**: Jest for unit and integration tests

### Frontend
- **Framework**: Astro + React
- **Styling**: Tailwind CSS V4
- **Validation**: Zod with React Hook Form
- **Testing**: Vitest + React Testing Library

### Development
- **Monorepo**: Turborepo with Yarn Corepack
- **Architecture**: Clean Architecture + Domain-Driven Design
- **Deployment**: Docker containers on Debian 12

## Quick Start

```bash
# Install dependencies
yarn install

# Start development servers
yarn dev

# Run tests
yarn test

# Build for production
yarn build
```

## Project Structure

```
apps/
├── api/                 # NestJS backend
│   └── src/
│       ├── tasks/       # Tasks domain module
│       ├── tags/        # Tags domain module
│       └── database/    # Prisma database module
└── web/                 # Astro + React frontend
    └── src/
        ├── components/  # React components
        ├── pages/       # Astro pages
        └── lib/         # Utilities and API client

packages/
└── shared/              # Shared types between apps
```

## API Endpoints

### Tasks
- `GET /api/tasks` - List tasks with optional filtering
- `POST /api/tasks` - Create new task
- `GET /api/tasks/:id` - Get task by ID
- `PUT /api/tasks/:id` - Update task
- `DELETE /api/tasks/:id` - Delete task

### Tags
- `GET /api/tags` - List all tags
- `POST /api/tags` - Create new tag
- `GET /api/tags/:id` - Get tag by ID
- `PUT /api/tags/:id` - Update tag
- `DELETE /api/tags/:id` - Delete tag

## Development Workflow

This project uses the BMAD (Business-Managed Agile Development) framework with specialized agents:

- `@dev` - Full Stack Developer for implementation
- `@architect` - System Architect for technical decisions
- `@pm` - Product Manager for requirements
- `@qa` - QA Engineer for testing and quality

## Documentation

- [`docs/architecture.md`](docs/architecture.md) - Complete technical specifications
- [`docs/prd.md`](docs/prd.md) - Product requirements and user stories
- [`CLAUDE.md`](CLAUDE.md) - AI assistant guidelines and project context

## License

MIT License - see LICENSE file for details