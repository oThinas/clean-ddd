import { UniqueEntityId } from '@core/entities/unique-entity-id.entity';
import { InMemoryAnswerAttachmentsRepository } from '@test-repositories/in-memory-answer-attachments.repository';
import { InMemoryAnswersRepository } from '@test-repositories/in-memory-answers.repository';
import { AnswerQuestionUseCase } from '@use-cases/answer-question.use-case';
import { beforeEach, describe, expect, it } from 'vitest';

let answersRepository: InMemoryAnswersRepository;
let answerAttachmentsRepository: InMemoryAnswerAttachmentsRepository;
let sut: AnswerQuestionUseCase;

describe('Answer Question Use Case', () => {
  beforeEach(() => {
    answerAttachmentsRepository = new InMemoryAnswerAttachmentsRepository();
    answersRepository = new InMemoryAnswersRepository(answerAttachmentsRepository);
    sut = new AnswerQuestionUseCase(answersRepository);
  });

  it('should be able to answer a question', async () => {
    const result = await sut.execute({
      instructorId: '1',
      questionId: '1',
      content: 'New answer',
      attachmentsIds: ['1', '2'],
    });

    expect(result.isSuccess()).toBe(true);
    expect(answersRepository.items[0].id).toEqual(result.value?.answer.id);
    expect(answersRepository.items[0].attachments.currentItems).toHaveLength(2);
    expect(answersRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('2') }),
    ]);
  });
});
