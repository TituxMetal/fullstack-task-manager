# Fullstack Architecture: Fullstack Task Manager

## Document Information

- **Project Name**: Fullstack Task Manager
- **Document Version**: 1.0
- **Last Updated**: 2025-08-02
- **Document Status**: Draft

## 1. Architecture Overview

### 1.1 System Context

The Fullstack Task Manager is a fullstack web application built as a monorepo using Turborepo. It
provides task management functionality with a clean, responsive dark-themed UI. The system consists
of:

1. **Frontend**: Astro + React application with Tailwind CSS
2. **Backend**: NestJS API with clean architecture and DDD principles
3. **Database**: SQLite managed through Prisma ORM
4. **Deployment**: Docker containers on a Debian 12 server

### 1.2 Architectural Principles

- **Clean Architecture**: Separation of concerns with layered architecture
- **Domain-Driven Design**: Business logic organized around domain concepts
- **Type Safety**: End-to-end type safety using TypeScript
- **Testing First**: Comprehensive test coverage with Jest and Vitest
- **Single Source of Truth**: Shared types between frontend and backend
- **Minimal Dependencies**: Carefully selected dependencies to minimize bloat

## 2. Monorepo Structure

### 2.1 Repository Organization

```treeview
simple-task-manager/
├── apps/
│   ├── web/                 # Astro + React frontend
│   └── api/                 # NestJS backend
├── packages/
│   ├── eslint-config/       # Shared ESLint configuration
│   ├── tsconfig/            # Shared TypeScript configuration
│   └── shared/              # Shared types and utilities
├── docker/                  # Docker configuration files
│   ├── Dockerfile.frontend  # Frontend Dockerfile
│   └── Dockerfile.backend   # Backend Dockerfile
├── .github/                 # GitHub Actions workflows
├── turbo.json               # Turborepo configuration
├── package.json             # Root package.json
└── README.md                # Project documentation
```

### 2.2 Workspace Configuration

```json
{
  "$schema": "https://turbo.build/schema.json",
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "lint": {
      "outputs": []
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": []
    }
  }
}
```

## 3. Backend Architecture

### 3.1 Module-Based Structure with Clean Architecture

```treeview
api/
├── prisma/
│   └── schema.prisma            # Prisma schema in default location
├── src/
│   ├── main.ts                  # Application entry point
│   ├── app.module.ts            # Root application module
│   │
│   ├── database/                # Database module
│   │   ├── application/
│   │   │   └── services/
│   │   │       └── database.service.ts  # Database interface
│   │   └── infrastructure/
│   │       ├── database.module.ts       # Database module definition
│   │       └── prisma.service.ts        # Prisma service implementation
│   │
│   ├── shared/                  # Shared utilities only
│   │   ├── infrastructure/
│   │   │   └── shared.module.ts # Shared module definition
│   │   └── utils/               # Shared utilities
│   │
│   ├── tasks/                   # Tasks module
│   │   ├── domain/              # Domain layer
│   │   │   ├── entities/        # Task entity
│   │   │   │   └── task.entity.ts
│   │   │   └── value-objects/   # Task-related value objects
│   │   │       └── taskStatus.vo.ts
│   │   ├── application/         # Application layer
│   │   │   ├── services/        # Repository interfaces
│   │   │   │   └── taskRepository.service.ts
│   │   │   ├── use-cases/       # Task use cases
│   │   │   │   ├── createTask.uc.ts
│   │   │   │   └── getTasks.uc.ts
│   │   │   └── dtos/            # Task DTOs
│   │   │       └── createTask.dto.ts
│   │   └── infrastructure/      # Infrastructure layer
│   │       ├── tasks.module.ts  # Module definition
│   │       ├── controllers/     # Task controllers
│   │       │   └── tasks.controller.ts
│   │       └── repositories/    # Task repository with mappers
│   │           └── task.repository.ts
│   │
│   ├── tags/                    # Tags module
│   │   ├── domain/              # Domain layer
│   │   │   ├── entities/
│   │   │   └── value-objects/
│   │   ├── application/         # Application layer
│   │   │   ├── services/
│   │   │   ├── use-cases/
│   │   │   └── dtos/
│   │   └── infrastructure/      # Infrastructure layer
│   │       ├── tags.module.ts
│   │       ├── controllers/
│   │       └── repositories/
│   │
│   └── config/                  # Application configuration
```

### 3.2 Task Module Domain Layer

```typescript
// Task Entity
// tasks/domain/entities/task.entity.ts
export class Task {
  private _id: string
  private _title: string
  private _description?: string
  private _status: TaskStatus
  private _dueDate?: Date
  private _createdAt: Date
  private _updatedAt: Date
  private _tags: Tag[]

  // Constructor, getters, setters and business methods

  public updateStatus(status: TaskStatus): void {
    this._status = status
    this._updatedAt = new Date()
  }

  public addTag(tag: Tag): void {
    if (!this._tags.some(t => t.id === tag.id)) {
      this._tags.push(tag)
      this._updatedAt = new Date()
    }
  }

  public removeTag(tagId: string): void {
    this._tags = this._tags.filter(t => t.id !== tagId)
    this._updatedAt = new Date()
  }

  // Additional business logic
}

// TaskStatus Value Object
// tasks/domain/value-objects/taskStatus.vo.ts
export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}
```

### 3.3 Task Module Application Layer

```typescript
// Task Repository Interface
// tasks/application/services/taskRepository.service.ts
export interface ITaskRepository {
  findAll(): Promise<Task[]>
  findById(id: string): Promise<Task | null>
  findByStatus(status: TaskStatus): Promise<Task[]>
  findByTag(tagId: string): Promise<Task[]>
  save(task: Task): Promise<Task>
  delete(id: string): Promise<void>
}

// Create Task Use Case
// tasks/application/use-cases/createTask.uc.ts
@Injectable()
export class CreateTaskUseCase {
  constructor(
    private readonly taskRepository: ITaskRepository,
    private readonly tagRepository: ITagRepository
  ) {}

  async execute(dto: CreateTaskDto): Promise<Task> {
    // Business logic for creating a task
    const task = new Task(dto.title, dto.description, TaskStatus.TODO, dto.dueDate)

    // Handle tags
    if (dto.tagIds && dto.tagIds.length > 0) {
      for (const tagId of dto.tagIds) {
        const tag = await this.tagRepository.findById(tagId)
        if (tag) {
          task.addTag(tag)
        }
      }
    }

    return this.taskRepository.save(task)
  }
}
```

### 3.4 Task Module Infrastructure Layer

```typescript
// Task Repository with Mappers
// tasks/infrastructure/repositories/task.repository.ts
@Injectable()
export class TaskRepository implements ITaskRepository {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Task[]> {
    const tasks = await this.prisma.task.findMany({
      include: { tags: true },
    });
    return tasks.map(this.toDomain);
  }

  async findById(id: string): Promise<Task | null> {
    const task = await this.prisma.task.findUnique({
      where: { id },
      include: { tags: true },
    });
    if (!task) return null;
    return this.toDomain(task);
  }

  async save(task: Task): Promise<Task> {
    const data = this.toPersistence(task);
    const saved = await this.prisma.task.create({ data });
    return this.toDomain(saved);
  }

  // Simple mappers - no separate presenter files
  private toDomain(prismaTask: any): Task {
    return new Task(prismaTask.title, prismaTask.description, ...);
  }

  private toPersistence(task: Task): any {
    return { title: task.title, description: task.description, ... };
  }
}
```

### 3.5 Task Module Interface Layer

```typescript
// Task Controller
// tasks/infrastructure/controllers/tasks.controller.ts
@Controller('tasks')
export class TaskController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase,
    private readonly getTasksUseCase: GetTasksUseCase
  ) {}

  @Post()
  async create(@Body() dto: CreateTaskDto): Promise<TaskResponseDto> {
    const task = await this.createTaskUseCase.execute(dto)
    return this.toResponse(task)
  }

  @Get()
  async findAll(
    @Query('status') status?: string,
    @Query('tagId') tagId?: string
  ): Promise<TaskResponseDto[]> {
    const tasks = await this.getTasksUseCase.execute({ status, tagId })
    return tasks.map(task => this.toResponse(task))
  }

  // Simple response mapper
  private toResponse(task: Task): TaskResponseDto {
    return {
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status
      // ... other fields
    }
  }
}
```

## 4. Frontend Architecture

### 4.1 Astro + React Structure

```treeview
web/
├── public/              # Static assets
├── src/
│   ├── components/      # React components by type
│   │   ├── forms/       # Form components including task/tag forms
│   │   ├── ui/          # UI components (buttons, inputs, etc.)
│   │   ├── layout/      # Layout components (header, sidebar, etc.)
│   │   └── icons/       # Icon components
│   │
│   ├── hooks/           # Custom React hooks
│   │
│   ├── lib/             # External library integrations
│   │   ├── api/         # API client using Fetch
│   │   ├── schemas/     # Zod schemas
│   │   └── utils/       # Helper utilities
│   │
│   ├── pages/           # Astro pages
│   │   ├── index.astro  # Home page
│   │   └── tasks/       # Task-related pages
│   │
│   └── types/           # Frontend-specific types
│
└── astro.config.mjs     # Astro configuration
```

### 4.2 Frontend Components

Components organized by their function rather than domain:

- **Layout components**: Header, Sidebar, Footer, Container
- **UI components**: Button, Input, Modal, Card, Badge, etc.
- **Form components**: TaskForm, TagForm, FilterForm
- **Icon components**: StatusIcon, TagIcon, etc.

### 4.3 API Integration

```typescript
// API client
// lib/api/index.ts
export const api = {
  // Tasks
  async getTasks(filters?: TaskFilters): Promise<TaskDTO[]> {
    const queryParams = new URLSearchParams()
    if (filters?.status) queryParams.append('status', filters.status)
    if (filters?.tagId) queryParams.append('tagId', filters.tagId)

    const response = await fetch(`/api/tasks?${queryParams}`)
    if (!response.ok) throw new Error('Failed to fetch tasks')
    return response.json()
  },

  async createTask(task: CreateTaskDTO): Promise<TaskDTO> {
    const response = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(task)
    })
    if (!response.ok) throw new Error('Failed to create task')
    return response.json()
  }

  // Additional API methods...
}
```

### 4.4 Shared Types

Located in the `packages/shared` directory to ensure type consistency:

```typescript
// Task Types
export enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE'
}

export interface TaskDTO {
  id: string
  title: string
  description?: string
  status: TaskStatus
  dueDate?: string
  createdAt: string
  updatedAt: string
  tags: TagDTO[]
}

export interface CreateTaskDTO {
  title: string
  description?: string
  status?: TaskStatus
  dueDate?: string
  tagIds?: string[]
}

// Tag Types
export interface TagDTO {
  id: string
  name: string
  color: string
}

export interface CreateTagDTO {
  name: string
  color: string
}
```

### 4.5 Design System

#### 4.5.1 Color Palette

**Primary Colors**

- **Background (Dark)**: `#121212` (Not pure black, dark charcoal)
- **Surface Elements**: `#1E1E1E` (Slightly lighter than background)
- **Text Primary**: `#E0E0E0` (Off-white, not pure white)
- **Text Secondary**: `#A0A0A0` (Medium gray)

**Accent Colors**

- **Primary Accent**: `#7C3AED` (Violet purple)
- **Secondary Accent**: `#3B82F6` (Blue)
- **Success**: `#10B981` (Emerald green)
- **Warning**: `#F59E0B` (Amber)
- **Error**: `#EF4444` (Red)

**Status Colors**

- **To Do**: `#3B82F6` (Blue)
- **In Progress**: `#F59E0B` (Amber)
- **Done**: `#10B981` (Emerald green)

**Tag Colors (Default Options)**

- `#EC4899` (Pink)
- `#8B5CF6` (Purple)
- `#3B82F6` (Blue)
- `#10B981` (Green)
- `#F59E0B` (Amber)
- `#EF4444` (Red)

#### 4.5.2 Typography

- **Primary Font**: Inter, system-ui, sans-serif
- **Base Font Size**: 16px
- **Scale Ratio**: 1.2 (Minor Third)

**Font Sizes**

- **Heading 1**: 2.074rem
- **Heading 2**: 1.728rem
- **Heading 3**: 1.44rem
- **Heading 4**: 1.2rem
- **Body**: 1rem
- **Small**: 0.833rem

**Font Weights**

- **Regular**: 400
- **Medium**: 500
- **Semi-Bold**: 600
- **Bold**: 700

#### 4.5.3 Spacing

Using a 4px base unit:

- **xs**: 4px (0.25rem)
- **sm**: 8px (0.5rem)
- **md**: 16px (1rem)
- **lg**: 24px (1.5rem)
- **xl**: 32px (2rem)
- **2xl**: 48px (3rem)
- **3xl**: 64px (4rem)

#### 4.5.4 Border Radius

- **sm**: 4px (0.25rem)
- **md**: 8px (0.5rem)
- **lg**: 12px (0.75rem)
- **pill**: 9999px

#### 4.5.5 Animations and Transitions

- **Default Transition**: 150ms ease-in-out
- **Hover Effects**: 100ms ease

### 4.6 Layout and Responsive Design

#### 4.6.1 Breakpoints

- **Mobile**: 0-639px
- **Tablet**: 640px-1023px
- **Desktop**: 1024px+

#### 4.6.2 Grid System

- 12-column grid system using Tailwind CSS
- Container max-width: 1280px
- Standard padding: 1rem (16px) on mobile, 1.5rem (24px) on tablet+

#### 4.6.3 Layout Structure

**Desktop Layout**

```mermaid
+----------------------------------------------------+
|                      Header                        |
+-------------+------------------------------------+
| Sidebar     |                                    |
| - Filters   |                                    |
| - Tags      |           Main Content             |
|             |                                    |
|             |                                    |
+-------------+------------------------------------+
|                      Footer                        |
+----------------------------------------------------+
```

**Mobile Layout**

```mermaid
+----------------------------------------------------+
|                      Header                        |
+----------------------------------------------------+
|                                                    |
|                 Main Content                       |
|                                                    |
|                                                    |
+----------------------------------------------------+
|                Filter Bar (Collapsible)            |
+----------------------------------------------------+
|                      Footer                        |
+----------------------------------------------------+
```

### 4.7 Technical Implementation Details

#### 4.7.1 Frontend Stack Specifics

- **Astro**: Used for the application shell and routing
- **React**: Used for interactive components
- **Tailwind CSS V4**: For styling all components
- **React Hook Form**: For form handling and validation
- **Zod**: Schema validation for form inputs
- **Vitest + React Testing Library**: For component testing

#### 4.7.2 Component Implementation

All components will be built following these guidelines:

- Type-safe props using TypeScript
- Pure functional components with hooks
- Composition over inheritance
- Separation of concerns (presentation vs. logic)

#### 4.7.3 State Management

- Local component state using React's useState for simple components
- Context API for sharing state across components when needed
- Custom hooks for reusable logic

#### 4.7.4 Data Fetching

- API client using Fetch API
- Type-safe API request/response handling
- Loading, error, and success states for all data operations

#### 4.7.5 Validation

- Client-side validation using Zod schemas
- Form validation with React Hook Form
- Error messages displayed inline with form fields

#### 4.7.6 Accessibility

- Semantic HTML
- ARIA attributes where needed
- Keyboard navigation support
- Color contrast meeting WCAG AA standards
- Focus management for modals and dialogs

#### 4.7.7 Responsive Implementation

- Mobile-first approach
- Fluid typography
- Responsive layout adjustments using Tailwind breakpoints
- Touch-friendly UI elements

### 4.8 Implementation Considerations

#### 4.8.1 Performance Optimization

- Lazy loading for non-critical components
- Image optimization
- Optimized bundling with Astro
- Code splitting

#### 4.8.2 Frontend Testing Strategy

- Unit tests for all components
- Integration tests for key user flows
- Accessibility tests
- Responsive testing across device sizes

## 5. Database Schema

### 5.1 Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}

model Task {
  id          String    @id @default(cuid())
  title       String
  description String?
  status      String    // "TODO", "IN_PROGRESS", "DONE"
  dueDate     DateTime?
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  tags        Tag[]     @relation("TaskToTag")
}

model Tag {
  id     String @id @default(cuid())
  name   String @unique
  color  String
  tasks  Task[] @relation("TaskToTag")
}
```

## 6. API Endpoints

### 6.1 Tasks API

| Method | Endpoint            | Description      | Request Body  | Response |
| ------ | ------------------- | ---------------- | ------------- | -------- |
| GET    | /api/tasks          | Get all tasks    | -             | Task[]   |
| GET    | /api/tasks?status=X | Filter by status | -             | Task[]   |
| GET    | /api/tasks?tagId=X  | Filter by tag    | -             | Task[]   |
| GET    | /api/tasks/:id      | Get task by ID   | -             | Task     |
| POST   | /api/tasks          | Create task      | CreateTaskDTO | Task     |
| PUT    | /api/tasks/:id      | Update task      | UpdateTaskDTO | Task     |
| DELETE | /api/tasks/:id      | Delete task      | -             | -        |

### 6.2 Tags API

| Method | Endpoint      | Description   | Request Body | Response |
| ------ | ------------- | ------------- | ------------ | -------- |
| GET    | /api/tags     | Get all tags  | -            | Tag[]    |
| GET    | /api/tags/:id | Get tag by ID | -            | Tag      |
| POST   | /api/tags     | Create tag    | CreateTagDTO | Tag      |
| PUT    | /api/tags/:id | Update tag    | UpdateTagDTO | Tag      |
| DELETE | /api/tags/:id | Delete tag    | -            | -        |

## 7. Testing Strategy

### 7.1 Backend Testing

- **Unit Tests**: Test individual domain entities, value objects, and use cases
- **Integration Tests**: Test repositories and external services
- **API Tests**: Test controllers and API endpoints

```typescript
// Example domain entity test
describe('Task Entity', () => {
  it('should create a task with correct default values', () => {
    const task = new Task('Test Task')
    expect(task.title).toBe('Test Task')
    expect(task.status).toBe(TaskStatus.TODO)
  })

  it('should update status correctly', () => {
    const task = new Task('Test Task')
    task.updateStatus(TaskStatus.IN_PROGRESS)
    expect(task.status).toBe(TaskStatus.IN_PROGRESS)
  })

  // Additional tests...
})

// Example use case test
describe('CreateTaskUseCase', () => {
  let useCase: CreateTaskUseCase
  let taskRepository: MockTaskRepository
  let tagRepository: MockTagRepository

  beforeEach(() => {
    taskRepository = new MockTaskRepository()
    tagRepository = new MockTagRepository()
    useCase = new CreateTaskUseCase(taskRepository, tagRepository)
  })

  it('should create a task', async () => {
    const dto = { title: 'New Task' }
    const task = await useCase.execute(dto)
    expect(task.title).toBe('New Task')
    expect(taskRepository.save).toHaveBeenCalled()
  })

  // Additional tests...
})
```

### 7.2 Frontend Testing

- **Component Tests**: Test individual React components with Vitest and React Testing Library
- **Hook Tests**: Test custom React hooks
- **Integration Tests**: Test component interactions

```typescript
// Example component test
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { TaskCard } from './ui/TaskCard'

describe('TaskCard', () => {
  const mockTask = {
    id: '1',
    title: 'Test Task',
    status: 'TODO',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    tags: []
  }

  it('should render task details correctly', () => {
    render(<TaskCard task={mockTask} />)
    expect(screen.getByText('Test Task')).toBeInTheDocument()
    expect(screen.getByText('TODO')).toBeInTheDocument()
  })

  it('should call onEdit when edit button is clicked', async () => {
    const onEdit = vi.fn()
    render(<TaskCard task={mockTask} onEdit={onEdit} />)
    await userEvent.click(screen.getByLabelText('Edit task'))
    expect(onEdit).toHaveBeenCalledWith(mockTask.id)
  })

  // Additional tests...
})
```

## 8. Deployment Architecture

### 8.1 Docker Configuration

```dockerfile
# docker/Dockerfile.frontend
FROM node:22-alpine AS builder
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn workspace web build

FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=builder /app/apps/web/dist ./dist
COPY --from=builder /app/apps/web/package.json .
EXPOSE 3000
CMD ["node", "./dist/server/entry.mjs"]

# docker/Dockerfile.backend
FROM node:22-alpine AS builder
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn workspace api build

FROM node:22-alpine AS runner
WORKDIR /app
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/apps/api/package.json .
COPY --from=builder /app/apps/api/prisma ./prisma
EXPOSE 3001
CMD ["node", "dist/main.js"]
```

## 9. Development Workflow

### 9.1 Local Development

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

## 10. Implementation Plan

### 10.1 Phase 1: Project Setup

1. Initialize Turborepo with Yarn Corepack
2. Set up shared packages (ESLint, TypeScript config)
3. Set up NestJS backend with module structure
4. Set up Astro frontend
5. Configure development environment

### 10.2 Phase 2: Backend Implementation

1. Implement domain entities and value objects
2. Create application use cases
3. Develop infrastructure repositories
4. Build API controllers and endpoints
5. Write tests for all layers

### 10.3 Phase 3: Frontend Implementation

1. Implement UI components based on frontend spec
2. Create pages and layouts
3. Integrate with backend API
4. Write component tests

### 10.4 Phase 4: Integration and Deployment

1. Integrate frontend and backend
2. Set up Docker containers

## 11. Technical Debt and Future Considerations

This architecture provides a solid foundation while allowing for future growth. Considerations for
future iterations:

1. User authentication
2. Task priorities
3. Rich text formatting for descriptions
4. Drag-and-drop task reordering
5. Task attachments

Each of these features can be added by extending the existing architecture without major
refactoring, thanks to the modular structure and clean architecture principles within modules.
