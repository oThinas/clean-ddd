import { type Either, failure, success } from '@core/either';
import type { EmptyObject } from '@core/types/empty-object';
import type { AnswersRepository } from '@repositories/answers.repository';
import { NotAllowedError } from '@use-cases/errors/not-allowed.error';
import { ResourceNotFoundError } from '@use-cases/errors/resource-not-found.error';

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
