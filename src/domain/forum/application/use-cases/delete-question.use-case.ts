import { type Either, failure, success } from '@core/either';
import { NotAllowedError } from '@core/errors/not-allowed.error';
import { ResourceNotFoundError } from '@core/errors/resource-not-found.error';
import type { EmptyObject } from '@core/types/empty-object';
import type { QuestionsRepository } from '@forum/repositories/questions.repository';

interface DeleteQuestionUseCaseRequest {
  authorId: string;
  questionId: string;
}

type DeleteQuestionUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, EmptyObject>;

export class DeleteQuestionUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute({ authorId, questionId }: DeleteQuestionUseCaseRequest): Promise<DeleteQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId);
    if (!question) {
      return failure(new ResourceNotFoundError());
    }

    if (authorId !== question.authorId.toString()) {
      return failure(new NotAllowedError());
    }

    await this.questionsRepository.delete(question);
    return success({});
  }
}
