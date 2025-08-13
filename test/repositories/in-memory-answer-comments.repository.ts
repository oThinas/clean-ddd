import type { PaginationParams } from '@core/repositories/pagination-params.repository';
import type { AnswerComment } from '@forum/entities/answer-comment.entity';
import type { AnswerCommentsRepository } from '@forum/repositories/answer-comments.repository';

export class InMemoryAnswerCommentsRepository implements AnswerCommentsRepository {
  public items: AnswerComment[] = [];

  async findById(id: string): Promise<AnswerComment | null> {
    const answerComment = this.items.find((item) => item.id.toString() === id);
    return answerComment ?? null;
  }

  async findManyByAnswerId(answerId: string, { page }: PaginationParams): Promise<AnswerComment[]> {
    const answerComments = this.items
      .filter((item) => item.answerId.toString() === answerId)
      .slice((page - 1) * 20, page * 20);

    return answerComments;
  }

  async create(answerComment: AnswerComment): Promise<void> {
    this.items.push(answerComment);
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    const answerCommentIndex = this.items.findIndex((item) => item.id.toString() === answerComment.id.toString());
    this.items.splice(answerCommentIndex, 1);
  }
}
