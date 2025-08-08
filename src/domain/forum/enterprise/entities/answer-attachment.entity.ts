import { Entity } from '@core/entities/entity.entity';
import type { UniqueEntityId } from '@core/entities/unique-entity-id.entity';

export interface AnswerAttachmentProps {
  answerId: UniqueEntityId;
  attachmentId: UniqueEntityId;
}

export class AnswerAttachment extends Entity<AnswerAttachmentProps> {
  get answerId(): UniqueEntityId {
    return this.props.answerId;
  }

  get attachmentId(): UniqueEntityId {
    return this.props.attachmentId;
  }

  static create(props: AnswerAttachmentProps, id?: UniqueEntityId): AnswerAttachment {
    return new AnswerAttachment(props, id);
  }
}
