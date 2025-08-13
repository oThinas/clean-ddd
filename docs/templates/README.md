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

## Usage Workflow

1. **Copy the appropriate template** to your target location
2. **Replace all placeholders** with your actual values
3. **Customize the code** according to your specific requirements
4. **Follow the Cursor Rules** for additional guidance

## Integration with Cursor Rules

These templates are referenced in the Cursor Rules:

- [new-entity.mdc](../.cursor/rules/new-entity.mdc)
- [new-use-case.mdc](../.cursor/rules/new-use-case.mdc)
- [new-repository.mdc](../.cursor/rules/new-repository.mdc)
- [testing.mdc](../.cursor/rules/testing.mdc)

The rules provide additional context and best practices for using these templates effectively.
