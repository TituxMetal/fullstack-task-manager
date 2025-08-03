# Clean Architecture Patterns for Fullstack Task Manager

## Integration with BMAD

This document provides implementation patterns that work with BMAD agent workflows:

- Use with **James (@dev)** during story implementation
- Reference during **Winston (@architect)** architecture reviews
- Apply patterns during **Quinn (@qa)** code quality reviews

For structured development workflows, use BMAD agents. This document provides the technical patterns
to follow during implementation.

## Overview

This document defines HOW to implement Clean Architecture patterns. For domain knowledge, refer to
`docs/architecture.md`.

## Domain Layer Patterns

### Entity Pattern

```typescript
export class Task {
  private _id: string
  private _title: string
  private _status: TaskStatus
  private _updatedAt: Date

  public updateStatus(status: TaskStatus): void {
    this._status = status
    this._updatedAt = new Date()
  }
}
```

### Value Object Pattern

```typescript
export class TaskStatus {
  constructor(private readonly value: string) {
    if (!['TODO', 'IN_PROGRESS', 'DONE'].includes(value)) {
      throw new Error('Invalid task status')
    }
  }
}
```

## Application Layer Patterns

### Use Case Pattern

```typescript
@Injectable()
export class CreateTaskUseCase {
  constructor(private readonly taskRepository: ITaskRepository) {}

  async execute(dto: CreateTaskDto): Promise<Task> {
    // Business logic here
  }
}
```

### Repository Interface Pattern

```typescript
export interface ITaskRepository {
  findAll(): Promise<Task[]>
  save(task: Task): Promise<Task>
}
```

## Infrastructure Layer Patterns

### Repository Implementation

```typescript
@Injectable()
export class TaskRepository implements ITaskRepository {
  constructor(private prisma: PrismaService) {}

  async save(task: Task): Promise<Task> {
    const data = this.toPersistence(task)
    const saved = await this.prisma.task.upsert({
      where: { id: task.id },
      create: data,
      update: data
    })
    return this.toDomain(saved)
  }
}
```

### Controller Pattern

```typescript
@Controller('tasks')
export class TaskController {
  constructor(private readonly createTaskUseCase: CreateTaskUseCase) {}

  @Post()
  async create(@Body() dto: CreateTaskDto): Promise<TaskResponseDto> {
    const task = await this.createTaskUseCase.execute(dto)
    return this.toResponse(task)
  }
}
```

## NestJS Module Pattern

```typescript
@Module({
  imports: [DatabaseModule],
  controllers: [TaskController],
  providers: [
    CreateTaskUseCase,
    TaskRepository,
    { provide: 'ITaskRepository', useClass: TaskRepository }
  ]
})
export class TasksModule {}
```

## Frontend Patterns

### Component Organization

```treeview
components/
├── ui/       # Reusable components
├── forms/    # Form components
└── layout/   # Layout components
```

### Form Pattern

```typescript
const taskSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional()
})

export function TaskForm() {
  const form = useForm({
    resolver: zodResolver(taskSchema)
  })
}
```

## Testing Patterns

### Domain Testing

```typescript
describe('Task Entity', () => {
  it('should update status', () => {
    const task = new Task('Test')
    task.updateStatus(TaskStatus.IN_PROGRESS)
    expect(task.status).toBe(TaskStatus.IN_PROGRESS)
  })
})
```

### Use Case Testing

```typescript
describe('CreateTaskUseCase', () => {
  it('should create task', async () => {
    const mockRepo = { save: jest.fn() }
    const useCase = new CreateTaskUseCase(mockRepo)
    await useCase.execute({ title: 'Test' })
    expect(mockRepo.save).toHaveBeenCalled()
  })
})
```

## Implementation Guidelines

1. Start with domain entities
2. Define repository interfaces
3. Implement use cases
4. Create infrastructure
5. Build UI components

Reference `docs/architecture.md` for domain specifics.
