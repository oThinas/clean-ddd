import { UniqueEntityId } from '@core/entities/unique-entity-id.entity';
import { QuestionAttachment, type QuestionAttachmentProps } from '@forum/entities/question-attachment.entity';

export function makeQuestionAttachment(
  override?: Partial<QuestionAttachmentProps>,
  id?: UniqueEntityId,
): QuestionAttachment {
  const questionAttachment = QuestionAttachment.create(
    {
      attachmentId: new UniqueEntityId(),
      questionId: new UniqueEntityId(),
      ...override,
    },
    id,
  );

  return questionAttachment;
}
