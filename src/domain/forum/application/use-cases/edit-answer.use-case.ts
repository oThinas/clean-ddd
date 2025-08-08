import { type Either, failure, success } from '@core/either';
import { UniqueEntityId } from '@core/entities/unique-entity-id.entity';
import type { EmptyObject } from '@core/types/empty-object';
import { AnswerAttachmentList } from '@entities/answer-attachment-list.entity';
import { AnswerAttachment } from '@entities/answer-attachment.entity';
import type { AnswerAttachmentsRepository } from '@repositories/answer-attachments.repository';
import type { AnswersRepository } from '@repositories/answers.repository';
import { NotAllowedError } from '@use-cases/errors/not-allowed.error';
import { ResourceNotFoundError } from '@use-cases/errors/resource-not-found.error';

interface EditAnswerUseCaseRequest {
  authorId: string;
  answerId: string;
  content: string;
  attachmentsIds: string[];
}

type EditAnswerUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, EmptyObject>;

export class EditAnswerUseCase {
  constructor(
    private readonly answersRepository: AnswersRepository,
    private readonly answerAttachmentsRepository: AnswerAttachmentsRepository,
  ) {}

  async execute({
    answerId,
    authorId,
    content,
    attachmentsIds,
  }: EditAnswerUseCaseRequest): Promise<EditAnswerUseCaseResponse> {
    const answer = await this.answersRepository.findById(answerId);
    if (!answer) {
      return failure(new ResourceNotFoundError());
    }

    if (authorId !== answer.authorId.toString()) {
      return failure(new NotAllowedError());
    }

    const currentAnswerAttachments = await this.answerAttachmentsRepository.findManyByAnswerId(answerId);
    const answerAttachmentList = new AnswerAttachmentList(currentAnswerAttachments);
    const answerAttachments = attachmentsIds.map((attachmentId) =>
      AnswerAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        answerId: answer.id,
      }),
    );
    answerAttachmentList.update(answerAttachments);

    answer.content = content;
    answer.attachments = answerAttachmentList;
    await this.answersRepository.save(answer);
    return success({});
  }
}
