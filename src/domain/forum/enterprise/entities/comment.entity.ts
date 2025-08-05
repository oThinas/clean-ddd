import { Entity } from '@core/entities/entity.entity';
import type { UniqueEntityId } from '@core/entities/unique-entity-id.entity';

export interface CommentProps {
  authorId: UniqueEntityId;
  content: string;
  createdAt: Date;
  updatedAt?: Date;
}

export abstract class Comment<Props extends CommentProps> extends Entity<Props> {
  get authorId(): UniqueEntityId {
    return this.props.authorId;
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

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  set content(value: string) {
    this.props.content = value;
    this.touch();
  }
}
