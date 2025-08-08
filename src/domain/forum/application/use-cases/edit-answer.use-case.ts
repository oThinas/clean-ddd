import { type Either, failure, success } from '@core/either';
import type { EmptyObject } from '@core/types/empty-object';
import type { AnswersRepository } from '@repositories/answers.repository';
import { NotAllowedError } from '@use-cases/errors/not-allowed.error';
import { ResourceNotFoundError } from '@use-cases/errors/resource-not-found.error';

interface EditAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
  content: string;
}

type EditAnswerUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, EmptyObject>;

export class EditAnswerUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute({ answerId, authorId, content }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);
    if (!answer) {
      return failure(new ResourceNotFoundError());
    }

    if (authorId !== answer.authorId.toString()) {
      return failure(new NotAllowedError());
    }

    answer.content = content;
    await this.answersRepository.save(answer);
    return success({});
  }
}
