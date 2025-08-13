import type { QuestionAttachment } from '@forum/entities/question-attachment.entity';
import type { QuestionAttachmentsRepository } from '@forum/repositories/question-attachments.repository';

export class InMemoryQuestionAttachmentsRepository implements QuestionAttachmentsRepository {
  public items: QuestionAttachment[] = [];

  async findManyByQuestionId(questionId: string): Promise<QuestionAttachment[]> {
    return this.items.filter((item) => item.questionId.toString() === questionId);
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    this.items = this.items.filter((item) => item.questionId.toString() !== questionId);
  }
}
