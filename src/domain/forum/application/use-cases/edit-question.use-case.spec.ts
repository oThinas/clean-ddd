import { UniqueEntityId } from '@/core/entities/unique-entity-id.entity';
import { makeQuestion } from 'test/factories/make-question';
import { InMemoryQuestionsRepository } from 'test/repositories/in-memory-questions.repository';
import { beforeEach, describe, expect, it } from 'vitest';
import { EditQuestionUseCase } from './edit-question.use-case';

let questionsRepository: InMemoryQuestionsRepository;
let sut: EditQuestionUseCase;

describe('Edit Question', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository();
    sut = new EditQuestionUseCase(questionsRepository);
  });

  it('should be able to edit a question', async () => {
    const authorId = 'author-1';
    const questionId = 'question-1';

    const newQuestion = makeQuestion({ authorId: new UniqueEntityId(authorId) }, new UniqueEntityId(questionId));
    await questionsRepository.create(newQuestion);
    await sut.execute({
      authorId,
      questionId,
      title: 'New title',
      content: 'New content',
    });

    expect(questionsRepository.items[0]).toMatchObject({
      title: 'New title',
      content: 'New content',
    });
  });

  it('should not be able to edit a question from another author', async () => {
    const authorId = 'author-1';
    const questionId = 'question-1';

    const newQuestion = makeQuestion({ authorId: new UniqueEntityId(authorId) }, new UniqueEntityId(questionId));
    await questionsRepository.create(newQuestion);

    await expect(
      sut.execute({
        questionId,
        authorId: 'author-2',
        title: 'New title',
        content: 'New content',
      }),
    ).rejects.toThrow(new Error('Question not found'));
  });
});
