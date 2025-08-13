import { UniqueEntityId } from '@core/entities/unique-entity-id.entity';
import { [EntityName] } from '@[domain]/entities/[entity-name].entity';

export function make[EntityName](override?: Partial<[EntityName]>, id?: UniqueEntityId): [EntityName] {
  const [entityName] = [EntityName].create({
    // Define default properties here
    // Example:
    // name: 'Example [EntityName]',
    // email: 'example@test.com',
    // userId: new UniqueEntityId(),
    ...override,
  });

  return [entityName];
}
