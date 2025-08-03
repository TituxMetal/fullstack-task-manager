# Git Workflow Guidelines

## Conventional Commits

### Format

```text
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding/updating tests
- `chore`: Maintenance tasks

### Examples

```text
feat(tasks): add task status update functionality
fix(api): resolve task filtering by tags
docs: update architecture documentation
test(tasks): add unit tests for Task entity
```

## Branch Strategy

### Branch Types

- `main`: Production-ready code
- `feature/task-description`: New features
- `fix/bug-description`: Bug fixes
- `docs/documentation-update`: Documentation updates

### Branch Naming

```text
feature/add-task-filtering
fix/task-status-validation
docs/update-api-documentation
refactor/clean-architecture-implementation
```

## Pull Request Guidelines

### PR Title Format

Follow conventional commit format:

```text
feat(tasks): add task filtering by status and tags
```

### PR Description Template

```markdown
## Summary

Brief description of changes

## Changes Made

- List of key changes
- Reference to user stories if applicable

## Testing

- [ ] Unit tests added/updated
- [ ] Integration tests pass
- [ ] Manual testing completed

## Documentation

- [ ] README updated if needed
- [ ] API documentation updated
- [ ] Architecture docs updated if needed

## Checklist

- [ ] Code follows project conventions
- [ ] Tests are passing
- [ ] No console errors
- [ ] Responsive design verified (if UI changes)
```

## Commit Process

### Before Committing

1. Run linting: `yarn lint`
2. Run type checking: `yarn typecheck`
3. Run tests: `yarn test`
4. Verify build: `yarn build`

### Commit Message Guidelines

- Use imperative mood ("add" not "added")
- Keep first line under 50 characters
- Reference issues when applicable
- Explain what and why, not how

### Example Workflow

```bash
# Create feature branch
git checkout -b feature/add-task-tags

# Make changes and test
yarn test
yarn lint
yarn typecheck

# Commit with conventional format
git add .
git commit -m "feat(tasks): add tag management to tasks

- Add many-to-many relationship between tasks and tags
- Implement tag CRUD operations
- Add tag filtering to task list
- Update API endpoints to support tag operations

Closes #123"

# Push and create PR
git push origin feature/add-task-tags
```

## Code Review Guidelines

### For Authors

- Keep PRs focused and small
- Write clear commit messages
- Include tests for new functionality
- Update documentation when needed
- Self-review before requesting review

### For Reviewers

- Check architectural compliance
- Verify test coverage
- Ensure code follows project conventions
- Test functionality manually if needed
- Provide constructive feedback

## Quality Gates

### Before Merge

- [ ] All tests passing
- [ ] Code review approved
- [ ] No merge conflicts
- [ ] Documentation updated
- [ ] Conventional commit format used

### Automated Checks

- Linting (ESLint)
- Type checking (TypeScript)
- Unit tests (Jest/Vitest)
- Build verification

## Release Process

### Version Bumping

Follow semantic versioning:

- `MAJOR`: Breaking changes
- `MINOR`: New features (backward compatible)
- `PATCH`: Bug fixes (backward compatible)

### Release Notes

Generate from conventional commits:

- Features from `feat:` commits
- Bug fixes from `fix:` commits
- Breaking changes from `BREAKING CHANGE:` footers

## Integration with BMAD

### Agent-Specific Workflows

- `@dev`: Focus on implementation and testing
- `@architect`: Review architectural decisions
- `@pm`: Validate against user stories and requirements
- `@qa`: Ensure quality gates are met

### Workflow Coordination

1. `@pm` validates requirements
2. `@architect` reviews design decisions
3. `@dev` implements features
4. `@qa` verifies quality and testing

This workflow ensures code quality while maintaining development velocity and architectural
integrity.
