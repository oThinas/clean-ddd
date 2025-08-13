import { type Either, success } from '@core/either';
import { UniqueEntityId } from '@core/entities/unique-entity-id.entity';
import { QuestionAttachmentList } from '@forum/entities/question-attachment-list.entity';
import { QuestionAttachment } from '@forum/entities/question-attachment.entity';
import { Question } from '@forum/entities/question.entity';
import type { QuestionsRepository } from '@forum/repositories/questions.repository';

interface CreateQuestionUseCaseRequest {
  authorId: string;
  title: string;
  content: string;
  attachmentsIds: string[];
}

type CreateQuestionUseCaseResponse = Either<null, { question: Question }>;

export class CreateQuestionUseCase {
  constructor(private readonly questionsRepository: QuestionsRepository) {}

  async execute({
    authorId,
    content,
    title,
    attachmentsIds,
  }: CreateQuestionUseCaseRequest): Promise<CreateQuestionUseCaseResponse> {
    const question = Question.create({ title, content, authorId: new UniqueEntityId(authorId) });
    const questionAttachments = attachmentsIds.map((attachmentId) =>
      QuestionAttachment.create({
        attachmentId: new UniqueEntityId(attachmentId),
        questionId: question.id,
      }),
    );
    question.attachments = new QuestionAttachmentList(questionAttachments);

    await this.questionsRepository.create(question);
    return success({ question });
  }
}
