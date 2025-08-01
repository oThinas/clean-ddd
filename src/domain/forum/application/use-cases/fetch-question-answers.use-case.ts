import type { Answer } from '../../enterprise/entities/answer.entity';
import type { AnswersRepository } from '../repositories/answers.repository';

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
