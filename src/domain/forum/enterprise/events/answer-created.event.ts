import type { UniqueEntityId } from '@core/entities/unique-entity-id.entity';
import type { DomainEvent } from '@core/events/domain.events';
import type { Answer } from '@forum/entities/answer.entity';

export class AnswerCreatedEvent implements DomainEvent {
  public ocurredAt: Date;

  constructor(public readonly answer: Answer) {
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityId {
    return this.answer.id;
  }
}
