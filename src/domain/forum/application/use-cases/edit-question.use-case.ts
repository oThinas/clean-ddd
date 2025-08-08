import { type Either, failure, success } from '@core/either';
import type { EmptyObject } from '@core/types/empty-object';
import type { QuestionsRepository } from '@repositories/questions.repository';
import { NotAllowedError } from '@use-cases/errors/not-allowed.error';
import { ResourceNotFoundError } from '@use-cases/errors/resource-not-found.error';

interface EditQuestionUseCaseRequest {
  authorId: string;
  questionId: string;
  title: string;
  content: string;
}

type EditQuestionUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, EmptyObject>;

export class EditQuestionUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    content,
    questionId,
    title,
  }: EditQuestionUseCaseRequest): Promise<EditQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId);
    if (!question) {
      return failure(new ResourceNotFoundError());
    }

    if (authorId !== question.authorId.toString()) {
      return failure(new NotAllowedError());
    }

    question.title = title;
    question.content = content;
    await this.questionsRepository.save(question);
    return success({});
  }
}
