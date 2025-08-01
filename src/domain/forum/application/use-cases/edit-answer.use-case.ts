import type { AnswersRepository } from '../repositories/answers.repository';

interface EditAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
  content: string;
}

export class EditAnswerUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute({ answerId, authorId, content }: EditAnswerUseCaseRequest): Promise<void> {
    const answer = await this.answersRepository.findById(answerId);
    if (!answer) {
      throw new Error('Answer not found');
    }

    if (authorId !== answer.authorId.toString()) {
      throw new Error('Answer not found');
    }

    answer.content = content;
    await this.answersRepository.save(answer);
  }
}
