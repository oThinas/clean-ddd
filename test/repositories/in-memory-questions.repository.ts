import type { PaginationParams } from '@core/repositories/pagination-params.repository';
import type { Question } from '@forum/entities/question.entity';
import type { QuestionsRepository } from '@forum/repositories/questions.repository';
import type { InMemoryQuestionAttachmentsRepository } from '@test-repositories/in-memory-question-attachments.repository';

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = [];

  constructor(private readonly questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository) {}

  async create(question: Question): Promise<void> {
    this.items.push(question);
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = this.items.find((item) => item.slug.value === slug);
    return question ?? null;
  }

  async findById(id: string): Promise<Question | null> {
    const question = this.items.find((item) => item.id.toString() === id);
    return question ?? null;
  }

  async findManyRecent({ page }: PaginationParams): Promise<Question[]> {
    const questions = this.items
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice((page - 1) * 20, page * 20);

    return questions;
  }

  async delete(question: Question): Promise<void> {
    const questionIndex = this.items.findIndex((item) => item.id.toString() === question.id.toString());
    this.items.splice(questionIndex, 1);

    await this.questionAttachmentsRepository.deleteManyByQuestionId(question.id.toString());
  }

  async save(question: Question): Promise<void> {
    const questionIndex = this.items.findIndex((item) => item.id.toString() === question.id.toString());
    this.items[questionIndex] = question;
  }
}
