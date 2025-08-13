import type { QuestionAttachment } from '@forum/entities/question-attachment.entity';

export abstract class QuestionAttachmentsRepository {
  abstract findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]>;
  abstract deleteManyByQuestionId(question: string): Promise<void>;
}
