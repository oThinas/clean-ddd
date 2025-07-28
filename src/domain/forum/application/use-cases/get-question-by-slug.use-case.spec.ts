import { UniqueEntityId } from '@/core/entities/unique-entity-id.entity';
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug.use-case';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions.repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { Question } from '../../enterprise/entities/question.entity';
import { Slug } from '../../enterprise/entities/value-objects/slug';

let questionsRepository: InMemoryQuestionsRepository;
let sut: GetQuestionBySlugUseCase;

describe('Get Question By Slug', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository();
    sut = new GetQuestionBySlugUseCase(questionsRepository);
  });

  it('should be able to get a question by slug', async () => {
    const newQuestion = Question.create({
      title: 'New question',
      slug: Slug.create('new-question'),
      content: 'New question content',
      authorId: new UniqueEntityId('1'),
    });

    await questionsRepository.create(newQuestion);

    const { question } = await sut.execute({ slug: 'new-question' });

    expect(question.id).toBeTruthy();
    expect(questionsRepository.items[0].id).toEqual(question.id);
  });
});
