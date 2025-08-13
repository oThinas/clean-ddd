import { type Either, failure, success } from '@core/either';
import { UniqueEntityId } from '@core/entities/unique-entity-id.entity';
import { ResourceNotFoundError } from '@core/errors/resource-not-found.error';
import { QuestionComment } from '@forum/entities/question-comment.entity';
import type { QuestionCommentsRepository } from '@forum/repositories/question-comments.repository';
import type { QuestionsRepository } from '@forum/repositories/questions.repository';

interface CommentOnQuestionUseCaseRequest {
  authorId: string;
  questionId: string;
  content: string;
}

type CommentOnQuestionUseCaseResponse = Either<ResourceNotFoundError, { questionComment: QuestionComment }>;

export class CommentOnQuestionUseCase {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly questionCommentsRepository: QuestionCommentsRepository,
  ) {}

  async execute({
    authorId,
    content,
    questionId,
  }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
    const question = await this.questionsRepository.findById(questionId);
    if (!question) {
      return failure(new ResourceNotFoundError());
    }

    const questionComment = QuestionComment.create({
      content,
      authorId: new UniqueEntityId(authorId),
      questionId: new UniqueEntityId(questionId),
    });

    await this.questionCommentsRepository.create(questionComment);
    return success({ questionComment });
  }
}
