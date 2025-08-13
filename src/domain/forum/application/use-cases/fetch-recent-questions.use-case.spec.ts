import { makeQuestion } from '@factories/make-question';
import { FetchRecentQuestionsUseCase } from '@forum/use-cases/fetch-recent-questions.use-case';
import { InMemoryQuestionAttachmentsRepository } from '@test-repositories/in-memory-question-attachments.repository';
import { InMemoryQuestionsRepository } from '@test-repositories/in-memory-questions.repository';
import { beforeEach, describe, expect, it } from 'vitest';

let questionsRepository: InMemoryQuestionsRepository;
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: FetchRecentQuestionsUseCase;

describe('Fetch Recent Questions Use Case', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    questionsRepository = new InMemoryQuestionsRepository(questionAttachmentsRepository);
    sut = new FetchRecentQuestionsUseCase(questionsRepository);
  });

  it('should be able to fetch recent questions', async () => {
    await questionsRepository.create(makeQuestion({ createdAt: new Date(2025, 6, 20) }));
    await questionsRepository.create(makeQuestion({ createdAt: new Date(2025, 6, 18) }));
    await questionsRepository.create(makeQuestion({ createdAt: new Date(2025, 6, 23) }));

    const result = await sut.execute({ page: 1 });

    expect(result.value?.questions).toEqual([
      expect.objectContaining({ createdAt: new Date(2025, 6, 23) }),
      expect.objectContaining({ createdAt: new Date(2025, 6, 20) }),
      expect.objectContaining({ createdAt: new Date(2025, 6, 18) }),
    ]);
  });

  it('should be able to fetch paginated recent questions', async () => {
    for (let i = 0; i < 22; i++) {
      await questionsRepository.create(makeQuestion());
    }

    const result = await sut.execute({ page: 2 });

    expect(result.value?.questions).toHaveLength(2);
  });
});
