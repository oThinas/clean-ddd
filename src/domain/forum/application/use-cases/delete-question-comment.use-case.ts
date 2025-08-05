import type { QuestionCommentsRepository } from '@repositories/question-comments.repository';

interface DeleteQuestionCommentUseCaseRequest {
  authorId: string;
  questionCommentId: string;
}

export class DeleteQuestionCommentUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({ authorId, questionCommentId }: DeleteQuestionCommentUseCaseRequest): Promise<void> {
    const questionComment = await this.questionCommentsRepository.findById(questionCommentId);
    if (!questionComment) {
      throw new Error('Question comment not found');
    }

    if (authorId !== questionComment.authorId.toString()) {
      throw new Error('Question comment not found');
    }

    await this.questionCommentsRepository.delete(questionComment);
  }
}
