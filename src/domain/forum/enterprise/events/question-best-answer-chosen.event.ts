import type { UniqueEntityId } from '@core/entities/unique-entity-id.entity';
import type { DomainEvent } from '@core/events/domain.events';
import type { Question } from '@forum/entities/question.entity';

export class QuestionBestAnswerChosenEvent implements DomainEvent {
  public ocurredAt: Date;

  constructor(
    public readonly question: Question,
    public readonly bestAnswerId: UniqueEntityId,
  ) {
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityId {
    return this.question.id;
  }
}
