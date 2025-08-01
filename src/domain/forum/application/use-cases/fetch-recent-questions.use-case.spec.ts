import { FetchRecentQuestionsUseCase } from '@use-cases/fetch-recent-questions.use-case';
import { makeQuestion } from '@factories/make-question';
import { InMemoryQuestionsRepository } from '@test-repositories/in-memory-questions.repository';
import { beforeEach, describe, expect, it } from 'vitest';

let questionsRepository: InMemoryQuestionsRepository;
let sut: FetchRecentQuestionsUseCase;

describe('Fetch Recent Questions', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository();
    sut = new FetchRecentQuestionsUseCase(questionsRepository);
  });

  it('should be able to fetch recent questions', async () => {
    await questionsRepository.create(makeQuestion({ createdAt: new Date(2025, 6, 20) }));
    await questionsRepository.create(makeQuestion({ createdAt: new Date(2025, 6, 18) }));
    await questionsRepository.create(makeQuestion({ createdAt: new Date(2025, 6, 23) }));

    const { questions } = await sut.execute({ page: 1 });

    expect(questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2025, 6, 23) }),
      expect.objectContaining({ createdAt: new Date(2025, 6, 20) }),
      expect.objectContaining({ createdAt: new Date(2025, 6, 18) }),
    ]);
  });

  it('should be able to fetch paginated recent questions', async () => {
    for (let i = 0; i < 22; i++) {
      await questionsRepository.create(makeQuestion());
    }

    const { questions } = await sut.execute({ page: 2 });

    expect(questions).toHaveLength(2);
  });
});
