import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug.use-case';
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug';
import { makeQuestion } from 'test/factories/make-question';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions.repository';
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
    const { question } = await sut.execute({ slug: 'new-question' });

    expect(question.id).toBeTruthy();
    expect(questionsRepository.items[0].id).toEqual(question.id);
  });
});
