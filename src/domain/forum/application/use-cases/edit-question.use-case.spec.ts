import { UniqueEntityId } from '@core/entities/unique-entity-id.entity';
import { NotAllowedError } from '@core/errors/not-allowed.error';
import { makeQuestion } from '@factories/make-question';
import { makeQuestionAttachment } from '@factories/make-question-attachment';
import { EditQuestionUseCase } from '@forum/use-cases/edit-question.use-case';
import { InMemoryQuestionAttachmentsRepository } from '@test-repositories/in-memory-question-attachments.repository';
import { InMemoryQuestionsRepository } from '@test-repositories/in-memory-questions.repository';
import { beforeEach, describe, expect, it } from 'vitest';

let questionsRepository: InMemoryQuestionsRepository;
let questionAttachmentsRepository: InMemoryQuestionAttachmentsRepository;
let sut: EditQuestionUseCase;

describe('Edit Question', () => {
  beforeEach(() => {
    questionAttachmentsRepository = new InMemoryQuestionAttachmentsRepository();
    questionsRepository = new InMemoryQuestionsRepository(questionAttachmentsRepository);
    sut = new EditQuestionUseCase(questionsRepository, questionAttachmentsRepository);
  });

  it('should be able to edit a question', async () => {
    const authorId = 'author-1';
    const questionId = 'question-1';

    const newQuestion = makeQuestion({ authorId: new UniqueEntityId(authorId) }, new UniqueEntityId(questionId));
    await questionsRepository.create(newQuestion);
    questionAttachmentsRepository.items.push(
      makeQuestionAttachment({ questionId: newQuestion.id, attachmentId: new UniqueEntityId('1') }),
      makeQuestionAttachment({ questionId: newQuestion.id, attachmentId: new UniqueEntityId('2') }),
    );
    await sut.execute({
      authorId,
      questionId,
      title: 'New title',
      content: 'New content',
      attachmentsIds: ['1', '3'],
    });

    expect(questionsRepository.items[0]).toMatchObject({
      title: 'New title',
      content: 'New content',
    });
    expect(questionsRepository.items[0].attachments.currentItems).toHaveLength(2);
    expect(questionsRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityId('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityId('3') }),
    ]);
  });

  it('should not be able to edit a question from another author', async () => {
    const authorId = 'author-1';
    const questionId = 'question-1';

    const newQuestion = makeQuestion({ authorId: new UniqueEntityId(authorId) }, new UniqueEntityId(questionId));
    await questionsRepository.create(newQuestion);

    const result = await sut.execute({
      questionId,
      authorId: 'author-2',
      title: 'New title',
      content: 'New content',
      attachmentsIds: [],
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
