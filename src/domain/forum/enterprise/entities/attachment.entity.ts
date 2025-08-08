import { Entity } from '@core/entities/entity.entity';
import type { UniqueEntityId } from '@core/entities/unique-entity-id.entity';

interface AttachmentProps {
  title: string;
  link: string;
}

export class Attachment extends Entity<AttachmentProps> {
  get title(): string {
    return this.props.title;
  }

  get link(): string {
    return this.props.link;
  }

  static create(props: AttachmentProps, id?: UniqueEntityId): Attachment {
    return new Attachment(props, id);
  }
}
