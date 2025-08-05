import type { PaginationParams } from '@core/repositories/pagination-params.repository';
import type { QuestionComment } from '@entities/question-comment.entity';
import type { QuestionCommentsRepository } from '@repositories/question-comments.repository';

export class InMemoryQuestionCommentsRepository implements QuestionCommentsRepository {
  public items: QuestionComment[] = [];

  async findById(id: string): Promise<QuestionComment | null> {
    const questionComment = this.items.find((item) => item.id.toString() === id);
    return questionComment ?? null;
  }

  async findManyByQuestionId(questionId: string, { page }: PaginationParams): Promise<QuestionComment[]> {
    const questionComments = this.items
      .filter((item) => item.questionId.toString() === questionId)
      .slice((page - 1) * 20, page * 20);

    return questionComments;
  }

  async create(questionComment: QuestionComment): Promise<void> {
    this.items.push(questionComment);
  }

  async delete(questionComment: QuestionComment): Promise<void> {
    const questionCommentIndex = this.items.findIndex((item) => item.id.toString() === questionComment.id.toString());
    this.items.splice(questionCommentIndex, 1);
  }
}
