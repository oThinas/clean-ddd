import { AggregateRoot } from '@core/entities/aggregate-root.entity';
import type { UniqueEntityId } from '@core/entities/unique-entity-id.entity';
import type { Optional } from '@core/types/optional';
import { AnswerAttachmentList } from '@forum/entities/answer-attachment-list.entity';
import { AnswerCreatedEvent } from '@forum/events/answer-created.event';

export interface AnswerProps {
  authorId: UniqueEntityId;
  questionId: UniqueEntityId;
  content: string;
  attachments: AnswerAttachmentList;
  createdAt: Date;
  updatedAt?: Date;
}

export class Answer extends AggregateRoot<AnswerProps> {
  get authorId(): UniqueEntityId {
    return this.props.authorId;
  }

  get questionId(): UniqueEntityId {
    return this.props.questionId;
  }

  get content(): string {
    return this.props.content;
  }

  get attachments(): AnswerAttachmentList {
    return this.props.attachments;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  get excerpt(): string {
    return this.content.substring(0, 120).trimEnd().concat('...');
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  set content(value: string) {
    this.props.content = value;
    this.touch();
  }

  set attachments(value: AnswerAttachmentList) {
    this.props.attachments = value;
    this.touch();
  }

  static create(props: Optional<AnswerProps, 'createdAt' | 'attachments'>, id?: UniqueEntityId): Answer {
    const answer = new Answer(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
        attachments: props.attachments ?? new AnswerAttachmentList(),
      },
      id,
    );

    const isNewAnswer = !id;
    if (isNewAnswer) {
      answer.addDomainEvent(new AnswerCreatedEvent(answer));
    }

    return answer;
  }
}
