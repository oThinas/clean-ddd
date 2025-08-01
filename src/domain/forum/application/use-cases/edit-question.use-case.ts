import type { QuestionsRepository } from '../repositories/questions.repository';

interface EditQuestionUseCaseRequest {
  authorId: string;
  questionId: string;
  title: string;
  content: string;
}

export class EditQuestionUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute({ authorId, content, questionId, title }: EditQuestionUseCaseRequest): Promise<void> {
    const question = await this.questionsRepository.findById(questionId);
    if (!question) {
      throw new Error('Question not found');
    }

    if (authorId !== question.authorId.toString()) {
      throw new Error('Question not found');
    }

    question.title = title;
    question.content = content;
    await this.questionsRepository.save(question);
  }
}
