import { Entity } from '@core/entities/entity.entity';
import type { UniqueEntityId } from '@core/entities/unique-entity-id.entity';
import type { Optional } from '@core/types/optional';

export interface NotificationProps {
  recipientId: UniqueEntityId;
  title: string;
  content: string;
  createdAt: Date;
  readAt?: Date;
}

export class Notification extends Entity<NotificationProps> {
  get recipientId(): UniqueEntityId {
    return this.props.recipientId;
  }

  get title(): string {
    return this.props.title;
  }

  get content(): string {
    return this.props.content;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get readAt(): Date | undefined {
    return this.props.readAt;
  }

  read(): void {
    this.props.readAt = new Date();
  }

  static create(props: Optional<NotificationProps, 'createdAt'>, id?: UniqueEntityId): Notification {
    return new Notification(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
  }
}
