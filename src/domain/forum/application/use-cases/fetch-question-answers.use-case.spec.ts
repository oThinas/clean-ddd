import { UniqueEntityId } from '@core/entities/unique-entity-id.entity';
import { makeAnswer } from '@factories/make-answer';
import { InMemoryAnswersRepository } from '@test-repositories/in-memory-answers.repository';
import { FetchQuestionAnswersUseCase } from '@use-cases/fetch-question-answers.use-case';
import { beforeEach, describe, expect, it } from 'vitest';

let answersRepository: InMemoryAnswersRepository;
let sut: FetchQuestionAnswersUseCase;

describe('Fetch Question Answers', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository();
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
