import { UniqueEntityId } from '@core/entities/unique-entity-id.entity';
import { makeQuestion } from '@factories/make-question';
import { InMemoryQuestionsRepository } from '@test-repositories/in-memory-questions.repository';
import { DeleteQuestionUseCase } from '@use-cases/delete-question.use-case';
import { NotAllowedError } from '@use-cases/errors/not-allowed.error';
import { beforeEach, describe, expect, it } from 'vitest';

let questionsRepository: InMemoryQuestionsRepository;
let sut: DeleteQuestionUseCase;

describe('Delete Question', () => {
  beforeEach(() => {
    questionsRepository = new InMemoryQuestionsRepository();
    sut = new DeleteQuestionUseCase(questionsRepository);
  });

  it('should be able to delete a question', async () => {
    const authorId = 'author-1';
    const questionId = 'question-1';

    const newQuestion = makeQuestion({ authorId: new UniqueEntityId(authorId) }, new UniqueEntityId(questionId));
    await questionsRepository.create(newQuestion);
    await sut.execute({ authorId, questionId });

    expect(questionsRepository.items).toHaveLength(0);
  });

  it('should not be able to delete a question from another author', async () => {
    const authorId = 'author-1';
    const questionId = 'question-1';

    const newQuestion = makeQuestion({ authorId: new UniqueEntityId(authorId) }, new UniqueEntityId(questionId));
    await questionsRepository.create(newQuestion);

    const result = await sut.execute({ authorId: 'author-2', questionId });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
