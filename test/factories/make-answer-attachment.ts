import { UniqueEntityId } from '@core/entities/unique-entity-id.entity';
import { type AnswerAttachmentProps, AnswerAttachment } from '@forum/entities/answer-attachment.entity';

export function makeAnswerAttachment(override?: Partial<AnswerAttachmentProps>, id?: UniqueEntityId): AnswerAttachment {
  const answerAttachment = AnswerAttachment.create(
    {
      attachmentId: new UniqueEntityId(),
      answerId: new UniqueEntityId(),
      ...override,
    },
    id,
  );

  return answerAttachment;
}
