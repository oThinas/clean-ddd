import { type Either, failure, success } from '@core/either';
import { NotAllowedError } from '@core/errors/not-allowed.error';
import { ResourceNotFoundError } from '@core/errors/resource-not-found.error';
import type { EmptyObject } from '@core/types/empty-object';
import type { QuestionCommentsRepository } from '@forum/repositories/question-comments.repository';

interface DeleteQuestionCommentUseCaseRequest {
  authorId: string;
  questionCommentId: string;
}

type DeleteQuestionCommentUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, EmptyObject>;

export class DeleteQuestionCommentUseCase {
  constructor(private questionCommentsRepository: QuestionCommentsRepository) {}

  async execute({
    authorId,
    questionCommentId,
  }: DeleteQuestionCommentUseCaseRequest): Promise<DeleteQuestionCommentUseCaseResponse> {
    const questionComment = await this.questionCommentsRepository.findById(questionCommentId);
    if (!questionComment) {
      return failure(new ResourceNotFoundError());
    }

    if (authorId !== questionComment.authorId.toString()) {
      return failure(new NotAllowedError());
    }

    await this.questionCommentsRepository.delete(questionComment);
    return success({});
  }
}
