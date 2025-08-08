import { UniqueEntityId } from '@core/entities/unique-entity-id.entity';
import { makeAnswer } from '@factories/make-answer';
import { makeAnswerAttachment } from '@factories/make-answer-attachment';
import { InMemoryAnswerAttachmentsRepository } from '@test-repositories/in-memory-answer-attachments.repository';
import { InMemoryAnswersRepository } from '@test-repositories/in-memory-answers.repository';
import { EditAnswerUseCase } from '@use-cases/edit-answer.use-case';
import { NotAllowedError } from '@use-cases/errors/not-allowed.error';
import { beforeEach, describe, expect, it } from 'vitest';

let answersRepository: InMemoryAnswersRepository;
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: EditAnswerUseCase;

describe('Edit Answer Use Case', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
    answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository);
    sut = new EditAnswerUseCase(answersRepository, answerAttachmentsRepository);
  });

  it('should be able to edit a answer', async () => {
    const authorId = 'author-1';
    const answerId = 'answer-1';

    const newAnswer = makeAnswer({ authorId: new UniqueEntityId(authorId) }, new UniqueEntityId(answerId));
    await answersRepository.create(newAnswer);
    answerAttachmentsRepository.items.push(
      makeAnswerAttachment({ answerId: newAnswer.id, attachmentId: new UniqueEntityId('1') }),
      makeAnswerAttachment({ answerId: newAnswer.id, attachmentId: new UniqueEntityId('2') }),
    );

    await sut.execute({
      authorId,
      answerId,
      content: 'New content',
      attachmentsIds: ['1', '3'],
    });

    expect(answersRepository.items[0]).toMatchObject({
      content: 'New content',
    });
    expect(answersRepository.items[0].attachments.currentItems).toHaveLength(2);
    expect(answersRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
    ]);
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
      attachmentsIds: [],
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
