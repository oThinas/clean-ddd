import { failure, success, type Either } from '@core/either';
import { UniqueEntityId } from '@core/entities/unique-entity-id.entity';
import { AnswerComment } from '@entities/answer-comment.entity';
import type { AnswerCommentsRepository } from '@repositories/answer-comments.repository';
import type { AnswersRepository } from '@repositories/answers.repository';
import { ResourceNotFoundError } from '@use-cases/errors/resource-not-found.error';

interface CommentOnAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
  content: string;
}

type CommentOnAnswerUseCaseResponse = Either<ResourceNotFoundError, { answerComment: AnswerComment }>;

export class CommentOnAnswerUseCase {
  constructor(
    private readonly answersRepository: AnswersRepository,
    private readonly answerCommentsRepository: AnswerCommentsRepository,
  ) {}

  async execute({
    answerId,
    authorId,
    content,
  }: CommentOnAnswerUseCaseRequest): Promise<CommentOnAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);
    if (!answer) {
      return failure(new ResourceNotFoundError());
    }

    const answerComment = AnswerComment.create({
      authorId: new UniqueEntityId(authorId),
      answerId: new UniqueEntityId(answerId),
      content,
    });

    await this.answerCommentsRepository.create(answerComment);
    return success({ answerComment });
  }
}
