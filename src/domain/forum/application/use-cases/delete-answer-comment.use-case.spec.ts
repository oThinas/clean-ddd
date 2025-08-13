import { NotAllowedError } from '@core/errors/not-allowed.error';
import { makeAnswerComment } from '@factories/make-answer-comment';
import { DeleteAnswerCommentUseCase } from '@forum/use-cases/delete-answer-comment.use-case';
import { InMemoryAnswerCommentsRepository } from '@test-repositories/in-memory-answer-comments.repository';
import { beforeEach, describe, expect, it } from 'vitest';

let answerCommentsRepository: InMemoryAnswerCommentsRepository;
let sut: DeleteAnswerCommentUseCase;

describe('Delete Answer Comment Use Case', () => {
  beforeEach(() => {
    answerCommentsRepository = new InMemoryAnswerCommentsRepository();
    sut = new DeleteAnswerCommentUseCase(answerCommentsRepository);
  });

  it('should be able to delete an answer comment', async () => {
    const answerComment = makeAnswerComment();
    await answerCommentsRepository.create(answerComment);

    await sut.execute({
      authorId: answerComment.authorId.toString(),
      answerCommentId: answerComment.id.toString(),
    });

    expect(answerCommentsRepository.items).toHaveLength(0);
  });

  it('should not be able to delete an answer comment from another user', async () => {
    const answerComment = makeAnswerComment();
    await answerCommentsRepository.create(answerComment);

    const result = await sut.execute({
      authorId: 'another-user-id',
      answerCommentId: answerComment.id.toString(),
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
