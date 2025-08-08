import { UniqueEntityId } from '@core/entities/unique-entity-id.entity';
import { makeAnswer } from '@factories/make-answer';
import { InMemoryAnswersRepository } from '@test-repositories/in-memory-answers.repository';
import { EditAnswerUseCase } from '@use-cases/edit-answer.use-case';
import { NotAllowedError } from '@use-cases/errors/not-allowed.error';
import { beforeEach, describe, expect, it } from 'vitest';

let answersRepository: InMemoryAnswersRepository;
let sut: EditAnswerUseCase;

describe('Edit Answer', () => {
  beforeEach(() => {
    answersRepository = new InMemoryAnswersRepository();
    sut = new EditAnswerUseCase(answersRepository);
  });

  it('should be able to edit a answer', async () => {
    const authorId = 'author-1';
    const answerId = 'answer-1';

    const newAnswer = makeAnswer({ authorId: new UniqueEntityId(authorId) }, new UniqueEntityId(answerId));
    await answersRepository.create(newAnswer);
    await sut.execute({
      authorId,
      answerId,
      content: 'New content',
    });

    expect(answersRepository.items[0]).toMatchObject({
      content: 'New content',
    });
  });

  it('should not be able to edit a answer from another user', async () => {
    const authorId = 'author-1';
    const answerId = 'answer-1';

    const newAnswer = makeAnswer({ authorId: new UniqueEntityId(authorId) }, new UniqueEntityId(answerId));
    await answersRepository.create(newAnswer);
    const result = await sut.execute({
      answerId,
      authorId: 'author-2',
      content: 'New content',
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
