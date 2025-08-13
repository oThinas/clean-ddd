import { NotAllowedError } from '@core/errors/not-allowed.error';
import { makeQuestionComment } from '@factories/make-question-comment';
import { DeleteQuestionCommentUseCase } from '@forum/use-cases/delete-question-comment.use-case';
import { InMemoryQuestionCommentsRepository } from '@test-repositories/in-memory-question-comments.repository';
import { beforeEach, describe, expect, it } from 'vitest';

let questionCommentsRepository: InMemoryQuestionCommentsRepository;
let sut: DeleteQuestionCommentUseCase;

describe('Delete Question Comment Use Case', () => {
  beforeEach(() => {
    questionCommentsRepository = new InMemoryQuestionCommentsRepository();
    sut = new DeleteQuestionCommentUseCase(questionCommentsRepository);
  });

  it('should be able to delete a question comment', async () => {
    const questionComment = makeQuestionComment();
    await questionCommentsRepository.create(questionComment);

    await sut.execute({
      authorId: questionComment.authorId.toString(),
      questionCommentId: questionComment.id.toString(),
    });

    expect(questionCommentsRepository.items).toHaveLength(0);
  });

  it('should not be able to delete a question comment from another user', async () => {
    const questionComment = makeQuestionComment();
    await questionCommentsRepository.create(questionComment);

    const result = await sut.execute({
      authorId: 'another-user-id',
      questionCommentId: questionComment.id.toString(),
    });

    expect(result.isFailure()).toBe(true);
    expect(result.value).toBeInstanceOf(NotAllowedError);
  });
});
