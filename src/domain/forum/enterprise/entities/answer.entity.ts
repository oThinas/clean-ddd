import { Entity } from '@/core/entities/entity.entity';
import type { UniqueEntityId } from '@/core/entities/unique-entity-id.entity';
import type { Optional } from '@/core/types/optional';

export interface AnswerProps {
  authorId: UniqueEntityId;
  questionId: UniqueEntityId;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

export class Answer extends Entity<AnswerProps> {
  get authorId(): UniqueEntityId {
    return this.props.authorId;
  }

  get questionId(): UniqueEntityId {
    return this.props.questionId;
  }

  get content(): string {
    return this.props.content;
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

  static create(props: Optional<AnswerProps, 'createdAt'>, id?: UniqueEntityId): Answer {
    return new Answer(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
  }
}
