import { AggregateRoot } from '@core/entities/aggregate-root.entity';
import type { UniqueEntityId } from '@core/entities/unique-entity-id.entity';
import * as DomainEvents from '@core/events/domain.events';
import { describe, expect, it, vi } from 'vitest';

class CustomAggregateCreatedEvent implements DomainEvents.DomainEvent {
  public ocurredAt: Date;

  constructor(private aggregate: CustomAggregate) {
    this.aggregate = aggregate;
    this.ocurredAt = new Date();
  }

  public getAggregateId(): UniqueEntityId {
    return this.aggregate.id;
  }
}

class CustomAggregate extends AggregateRoot<null> {
  static create(): CustomAggregate {
    const aggregate = new CustomAggregate(null);
    aggregate.addDomainEvent(new CustomAggregateCreatedEvent(aggregate));
    return aggregate;
  }
}

describe('Domain Events', () => {
  it('should be able to dispatch and listen to events', () => {
    const callbackSpy = vi.fn();
    DomainEvents.register(callbackSpy, CustomAggregateCreatedEvent.name);
    const aggregate = CustomAggregate.create();

    expect(aggregate.domainEvents).toHaveLength(1);

    DomainEvents.dispatchEventsForAggregate(aggregate.id);

    expect(aggregate.domainEvents).toHaveLength(0);
    expect(callbackSpy).toHaveBeenCalled();
  });
});
