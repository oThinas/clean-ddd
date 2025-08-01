import { CreateQuestionUseCase } from '@use-cases/create-question.use-case';
import { InMemoryQuestionsRepository } from '@test-repositories/in-memory-questions.repository';
import { beforeEach, describe, expect, it } from 'vitest';

let questionsRepository: InMemoryQuestionsRepository;
let sut: CreateQuestionUseCase;

describe('Create Question', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository();
    sut = new CreateQuestionUseCase(questionsRepository);
  });

  it('should be able to create a question', async () => {
    const { question } = await sut.execute({
      authorId: '1',
      title: 'New question',
      content: 'New question content',
    });

    expect(question.id).toBeTruthy();
    expect(questionsRepository.items[0].id).toEqual(question.id);
  });
});
