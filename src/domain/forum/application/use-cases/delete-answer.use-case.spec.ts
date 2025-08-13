import { UniqueEntityId } from '@core/entities/unique-entity-id.entity';
import { NotAllowedError } from '@core/errors/not-allowed.error';
import { makeAnswer } from '@factories/make-answer';
import { makeAnswerAttachment } from '@factories/make-answer-attachment';
import { DeleteAnswerUseCase } from '@forum/use-cases/delete-answer.use-case';
import { InMemoryAnswerAttachmentsRepository } from '@test-repositories/in-memory-answer-attachments.repository';
import { InMemoryAnswersRepository } from '@test-repositories/in-memory-answers.repository';
import { beforeEach, describe, expect, it } from 'vitest';

let answersRepository: InMemoryAnswersRepository;
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: DeleteAnswerUseCase;

describe('Delete Answer Use Case', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
    answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository);
    sut = new DeleteAnswerUseCase(answersRepository);
  });

  it('should be able to delete an answer', async () => {
    const authorId = 'author-1';
    const answerId = 'answer-1';

    const newAnswer = makeAnswer({ authorId: new UniqueEntityId(authorId) }, new UniqueEntityId(answerId));
    await answersRepository.create(newAnswer);
    answerAttachmentsRepository.items.push(
      makeAnswerAttachment({ answerId: newAnswer.id, attachmentId: new UniqueEntityId('1') }),
      makeAnswerAttachment({ answerId: newAnswer.id, attachmentId: new UniqueEntityId('2') }),
    );
    await sut.execute({ authorId, answerId });

    expect(answersRepository.items).toHaveLength(0);
    expect(answerAttachmentsRepository.items).toHaveLength(0);
  });

  it('should not be able to delete an answer with wrong author', async () => {
    const authorId = 'author-1';
    const answerId = 'answer-1';

    const newAnswer = makeAnswer({ authorId: new UniqueEntityId(authorId) }, new UniqueEntityId(answerId));
    await answersRepository.create(newAnswer);

    const result = await sut.execute({ authorId: 'author-2', answerId });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
