import type { QuestionAttachment } from '@entities/question-attachment.entity';

export abstract class QuestionAttachmentsRepository {
  abstract findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]>;
  abstract deleteManyByQuestionId(question: string): Promise<void>;
}
