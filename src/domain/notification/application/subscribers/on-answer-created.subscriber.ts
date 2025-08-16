import type { EventHandler } from '@core/events/domain.events';
import * as DomainEvent from '@core/events/domain.events';
import { AnswerCreatedEvent } from '@forum/events/answer-created.event';
import type { QuestionsRepository } from '@forum/repositories/questions.repository';
import type { SendNotificationUseCase } from '@notification/use-cases/send-notification.use-case';

export class OnAnswerCreatedSubscriber implements EventHandler {
  constructor(
    private readonly questionsRepository: QuestionsRepository,
    private readonly sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvent.register(this.sendNewAnswerNotification.bind(this), AnswerCreatedEvent.name);
  }

  private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent): Promise<void> {
    const question = await this.questionsRepository.findById(answer.questionId.toString());
    if (question) {
      await this.sendNotificationUseCase.execute({
        recipientId: question.authorId.toString(),
        title: `Nova resposta em "${question.title.substring(0, 40).trimEnd()}..."`,
        content: answer.excerpt,
      });
    }
  }
}
