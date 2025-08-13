import { type Either, failure, success } from '@core/either';
import { NotAllowedError } from '@core/errors/not-allowed.error';
import { ResourceNotFoundError } from '@core/errors/resource-not-found.error';
import type { Question } from '@forum/entities/question.entity';
import type { AnswersRepository } from '@forum/repositories/answers.repository';
import type { QuestionsRepository } from '@forum/repositories/questions.repository';

interface ChooseQuestionBestAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
}

type ChooseQuestionBestAnswerUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, { question: Question }>;

export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private readonly answersRepository: AnswersRepository,
    private readonly questionsRepository: QuestionsRepository,
  ) {}

  async execute({
    answerId,
    authorId,
  }: ChooseQuestionBestAnswerUseCaseRequest): Promise<ChooseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);
    if (!answer) {
      return failure(new ResourceNotFoundError());
    }

    const question = await this.questionsRepository.findById(answer.questionId.toString());
    if (!question) {
      return failure(new ResourceNotFoundError());
    }

    if (authorId !== question.authorId.toString()) {
      return failure(new NotAllowedError());
    }

    question.bestAnswerId = answer.id;
    await this.questionsRepository.save(question);

    return success({ question });
  }
}
