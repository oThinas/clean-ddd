import { type Either, success } from '@core/either';
import { UniqueEntityId } from '@core/entities/unique-entity-id.entity';
import { AnswerAttachmentList } from '@entities/answer-attachment-list.entity';
import { AnswerAttachment } from '@entities/answer-attachment.entity';
import { Answer } from '@entities/answer.entity';
import type { AnswersRepository } from '@repositories/answers.repository';

interface AnswerQuestionUseCaseRequest {
  instructorId: string;
  questionId: string;
  content: string;
  attachmentsIds: string[];
}

type AnswerQuestionUseCaseResponse = Either<null, { answer: Answer }>;

export class AnswerQuestionUseCase {
  constructor(private readonly answersRepository: AnswersRepository) {}

  async execute({
    instructorId,
    questionId,
    content,
    attachmentsIds,
  }: AnswerQuestionUseCaseRequest): Promise<AnswerQuestionUseCaseResponse> {
    const answer = Answer.create({
      content,
      authorId: new UniqueEntityId(instructorId),
      questionId: new UniqueEntityId(questionId),
    });

    const answerAttachments = attachmentsIds.map((attachmentId) =>
      AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        answerId: answer.id,
      }),
    );
    answer.attachments = new AnswerAttachmentList(answerAttachments);

    await this.answersRepository.create(answer);
    return success({ answer });
  }
}
