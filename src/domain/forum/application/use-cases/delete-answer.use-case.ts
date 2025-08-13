import { type Either, failure, success } from '@core/either';
import { NotAllowedError } from '@core/errors/not-allowed.error';
import { ResourceNotFoundError } from '@core/errors/resource-not-found.error';
import type { EmptyObject } from '@core/types/empty-object';
import type { AnswersRepository } from '@forum/repositories/answers.repository';

interface DeleteAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
}

type DeleteAnswerUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, EmptyObject>;

export class DeleteAnswerUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute({ authorId, answerId }: DeleteAnswerUseCaseRequest): Promise<DeleteAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);
    if (!answer) {
      return failure(new ResourceNotFoundError());
    }

    if (authorId !== answer.authorId.toString()) {
      return failure(new NotAllowedError());
    }

    await this.answersRepository.delete(answer);
    return success({});
  }
}
