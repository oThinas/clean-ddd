import type { UniqueEntityId } from '@core/entities/unique-entity-id.entity';
import type { DomainEvent } from '@core/events/domain.events';
import type { [EntityName] } from '@[domain]/entities/[entity-name].entity';

export class [ActionName][EntityName]Event implements DomainEvent {
  public ocurredAt: Date;

  constructor(public readonly [entity-name]: [EntityName]) {
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityId {
    return this.[entity-name].id;
  }
}
