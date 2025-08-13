import { UniqueEntityId } from '@core/entities/unique-entity-id.entity';
import { makeAnswer } from '@factories/make-answer';
import { FetchQuestionAnswersUseCase } from '@forum/use-cases/fetch-question-answers.use-case';
import { InMemoryAnswerAttachmentsRepository } from '@test-repositories/in-memory-answer-attachments.repository';
import { InMemoryAnswersRepository } from '@test-repositories/in-memory-answers.repository';
import { beforeEach, describe, expect, it } from 'vitest';

let answersRepository: InMemoryAnswersRepository;
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: FetchQuestionAnswersUseCase;

describe('Fetch Question Answers Use Case', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
    answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository);
    sut = new FetchQuestionAnswersUseCase(answersRepository);
  });

  it('should be able to fetch question answers', async () => {
    const questionId = 'question-1';

    await answersRepository.create(makeAnswer({ questionId: new UniqueEntityId(questionId) }));
    await answersRepository.create(makeAnswer({ questionId: new UniqueEntityId(questionId) }));
    await answersRepository.create(makeAnswer({ questionId: new UniqueEntityId(questionId) }));

    const result = await sut.execute({ page: 1, questionId: questionId });

    expect(result.value?.answers).toHaveLength(3);
  });

  it('should be able to fetch paginated question answers', async () => {
    const questionId = 'question-1';
    for (let i = 0; i < 22; i++) {
      await answersRepository.create(makeAnswer({ questionId: new UniqueEntityId(questionId) }));
    }

    const result = await sut.execute({ page: 2, questionId: questionId });

    expect(result.value?.answers).toHaveLength(2);
  });
});
