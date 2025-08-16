# Templates Directory

This directory contains templates for creating new components in the Clean DDD project.

## Available Templates

### Entity Template

**File**: `entity.template.ts`
**Usage**: Use this template when creating new entities in the domain layer.

**Placeholders to replace**:

- `[EntityName]` - The name of your entity (PascalCase)
- `[entity-name]` - The kebab-case version of your entity name
- `[domain]` - The domain name (e.g., `forum`, `notification`)

**Example**:

```bash
# Copy the template
cp entity.template.ts src/domain/forum/enterprise/entities/user.entity.ts

# Replace placeholders:
# [EntityName] -> User
# [entity-name] -> user
# [domain] -> forum
```

### Use Case Template

**File**: `use-case.template.ts`
**Usage**: Use this template when creating new use cases in the application layer.

**Placeholders to replace**:

- `[ActionName]` - The action name (PascalCase, e.g., `Create`, `Update`, `Delete`)
- `[EntityName]` - The entity name (PascalCase)
- `[entity-name]` - The kebab-case version of your entity name
- `[domain]` - The domain name

**Example**:

```bash
# Copy the template
cp use-case.template.ts src/domain/forum/application/use-cases/create-user.use-case.ts

# Replace placeholders:
# [ActionName] -> Create
# [EntityName] -> User
# [entity-name] -> user
# [domain] -> forum
```

### Use Case Test Template

**File**: `use-case-test.template.ts`
**Usage**: Use this template when creating tests for use cases.

**Placeholders to replace**:

- `[ActionName]` - The action name (PascalCase)
- `[EntityName]` - The entity name (PascalCase)
- `[entity-name]` - The kebab-case version of your entity name
- `[domain]` - The domain name
- `[action]` - The action in lowercase (e.g., `create`, `update`, `delete`)

### Repository Template

**File**: `repository.template.ts`
**Usage**: Use this template when creating repository interfaces.

**Placeholders to replace**:

- `[EntityName]` - The entity name (PascalCase)
- `[entity-name]` - The kebab-case version of your entity name
- `[domain]` - The domain name

### In-Memory Repository Template

**File**: `in-memory-repository.template.ts`
**Usage**: Use this template when creating in-memory repository implementations for testing.

**Placeholders to replace**:

- `[EntityName]` - The entity name (PascalCase)
- `[entity-name]` - The kebab-case version of your entity name
- `[domain]` - The domain name

### Test Factory Template

**File**: `test-factory.template.ts`
**Usage**: Use this template when creating test factories for entities.

**Placeholders to replace**:

- `[EntityName]` - The entity name (PascalCase)
- `[entity-name]` - The kebab-case version of your entity name
- `[domain]` - The domain name

### Component Documentation Template

**File**: `component-documentation.template.md`
**Usage**: Use this template when documenting new domain components.

**Placeholders to replace**:

- `[Component Name]` - The name of your component (PascalCase)
- `[component-name]` - The kebab-case version of your component name
- `[domain]` - The domain name
- All sections marked with `[description]` - Replace with actual descriptions

### Domain Event Template

**File**: `domain-event.template.ts`
**Usage**: Use this template when creating new domain events.

**Placeholders to replace**:

- `[ActionName]` - The action name (PascalCase, e.g., `Created`, `Updated`, `Deleted`)
- `[EntityName]` - The entity name (PascalCase)
- `[entity-name]` - The kebab-case version of your entity name
- `[domain]` - The domain name

### Event Subscriber Template

**File**: `event-subscriber.template.ts`
**Usage**: Use this template when creating event subscribers.

**Placeholders to replace**:

- `[ActionName]` - The action name (PascalCase)
- `[EntityName]` - The entity name (PascalCase)
- `[entity-name]` - The kebab-case version of your entity name
- `[domain]` - The domain where the event is defined
- `[target-domain]` - The domain where the subscriber is located
- `[RepositoryName]` - The repository name (PascalCase)
- `[repository-name]` - The kebab-case version of repository name
- `[UseCaseName]` - The use case name (PascalCase)
- `[use-case-name]` - The kebab-case version of use case name

## Usage Workflow

1. **Copy the appropriate template** to your target location
2. **Replace all placeholders** with your actual values
3. **Customize the code** according to your specific requirements
4. **Follow the Cursor Rules** for additional guidance

## Integration with Cursor Rules

These templates are referenced in the Cursor Rules:

- [new-domain-component.mdc](../.cursor/rules/new-domain-component.mdc) - Complete workflow
- [new-entity.mdc](../.cursor/rules/new-entity.mdc)
- [new-use-case.mdc](../.cursor/rules/new-use-case.mdc)
- [new-repository.mdc](../.cursor/rules/new-repository.mdc)
- [new-domain-event.mdc](../.cursor/rules/new-domain-event.mdc) - Domain event creation rules
- [testing.mdc](../.cursor/rules/testing.mdc)

The rules provide additional context and best practices for using these templates effectively.
