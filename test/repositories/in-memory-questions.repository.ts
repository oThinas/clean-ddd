import type { PaginationParams } from '@/core/repositories/pagination-params.repository';
import type { QuestionsRepository } from '@/domain/forum/application/repositories/questions.repository';
import type { Question } from '@/domain/forum/enterprise/entities/question.entity';

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = [];

  async create(question: Question): Promise<void> {
    this.items.push(question);
  }

  async findBySlug(slug: string): Promise<Question | null> {
    const question = this.items.find((item) => item.slug.value === slug);
    if (!question) {
      return null;
    }

    return question;
  }

  async findById(id: string): Promise<Question | null> {
    const question = this.items.find((item) => item.id.toString() === id);
    if (!question) {
      return null;
    }

    return question;
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
  }

  async save(question: Question): Promise<void> {
    const questionIndex = this.items.findIndex((item) => item.id.toString() === question.id.toString());
    this.items[questionIndex] = question;
  }
}
