import { makeQuestion } from '@factories/make-question';
import { InMemoryQuestionsRepository } from '@test-repositories/in-memory-questions.repository';
import { GetQuestionBySlugUseCase } from '@use-cases/get-question-by-slug.use-case';
import { Slug } from '@value-objects/slug';
import { beforeEach, describe, expect, it } from 'vitest';

let questionsRepository: InMemoryQuestionsRepository;
let sut: GetQuestionBySlugUseCase;

describe('Get Question By Slug', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository();
    sut = new GetQuestionBySlugUseCase(questionsRepository);
  });

  it('should be able to get a question by slug', async () => {
    const newQuestion = makeQuestion({ slug: Slug.create('new-question') });
    await questionsRepository.create(newQuestion);
    const result = await sut.execute({ slug: 'new-question' });

    expect(result.isSuccess()).toBe(true);

    if (result.isSuccess()) {
      expect(result.value.question.id).toEqual(newQuestion.id);
    }
  });
});
