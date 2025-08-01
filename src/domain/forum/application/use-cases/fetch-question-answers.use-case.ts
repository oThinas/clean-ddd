import type { AnswersRepository } from '@repositories/answers.repository';
import type { Answer } from '@entities/answer.entity';

interface FetchQuestionAnswersUseCaseRequest {
  questionId: string;
  page: number;
}

interface FetchQuestionAnswersUseCaseResponse {
  answers: Answer[];
}

export class FetchQuestionAnswersUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute({
    page,
    questionId,
  }: FetchQuestionAnswersUseCaseRequest): Promise<FetchQuestionAnswersUseCaseResponse> {
    const answers = await this.answersRepository.findManyByQuestionId(questionId, { page });
    return { answers };
  }
}
