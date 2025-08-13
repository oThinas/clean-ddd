import type { AggregateRoot } from '@core/entities/aggregate-root.entity';
import type { UniqueEntityId } from '@core/entities/unique-entity-id.entity';

export abstract class DomainEvent {
  abstract ocurredAt: Date;
  abstract getAggregateId(): UniqueEntityId;
}

type DomainEventCallback = (event: DomainEvent) => void;

const handlersMap: Map<string, DomainEventCallback[]> = new Map();
const markedAggregates: AggregateRoot<unknown>[] = [];

export function markAggregateForDispatch(aggregate: AggregateRoot<unknown>): void {
  const aggregateFound = !!findMarkedAggregateById(aggregate.id);
  if (!aggregateFound) {
    markedAggregates.push(aggregate);
  }
}

export function dispatchEventsForAggregate(id: UniqueEntityId): void {
  const aggregate = findMarkedAggregateById(id);
  if (aggregate) {
    dispatchAggregateEvents(aggregate);
    aggregate.clearEvents();
    removeAggregateFromMarkedDispatchList(aggregate);
  }
}

export function register(callback: DomainEventCallback, eventClassName: string): void {
  const wasEventRegisteredBefore = handlersMap.has(eventClassName);
  if (!wasEventRegisteredBefore) {
    handlersMap.set(eventClassName, []);
  }

  handlersMap.get(eventClassName)?.push(callback);
}

export function clearHandlers(): void {
  handlersMap.clear();
}

export function clearMarkedAggregates(): void {
  markedAggregates.length = 0;
}

function dispatchAggregateEvents(aggregate: AggregateRoot<unknown>): void {
  aggregate.domainEvents.forEach((event: DomainEvent) => dispatch(event));
}

function removeAggregateFromMarkedDispatchList(aggregate: AggregateRoot<unknown>): void {
  const index = markedAggregates.findIndex((a) => a.equals(aggregate));
  markedAggregates.splice(index, 1);
}

function findMarkedAggregateById(id: UniqueEntityId): AggregateRoot<unknown> | undefined {
  return markedAggregates.find((aggregate) => aggregate.id.equals(id));
}

function dispatch(event: DomainEvent): void {
  const eventClassName: string = event.constructor.name;

  const isEventRegistered = handlersMap.has(eventClassName);

  if (isEventRegistered) {
    const handlers = handlersMap.get(eventClassName);

    for (const handler of handlers ?? []) {
      handler(event);
    }
  }
}
