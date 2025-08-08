import { type Either, success } from '@core/either';
import { UniqueEntityId } from '@core/entities/unique-entity-id.entity';
import { Answer } from '@entities/answer.entity';
import type { AnswersRepository } from '@repositories/answers.repository';

interface AnswerQuestionUseCaseRequest {
  instructorId: string;
  questionId: string;
  content: string;
}

type AnswerQuestionUseCaseResponse = Either<null, { answer: Answer }>;

export class AnswerQuestionUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute({
    instructorId,
    questionId,
    content,
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityId(instructorId),
      questionId: new UniqueEntityId(questionId),
    });

    await this.answersRepository.create(answer);
    return success({ answer });
  }
}
