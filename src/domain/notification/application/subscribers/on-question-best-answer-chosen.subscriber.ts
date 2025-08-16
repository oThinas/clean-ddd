import type { EventHandler } from '@core/events/domain.events';
import * as DomainEvents from '@core/events/domain.events';
import { QuestionBestAnswerChosenEvent } from '@forum/events/question-best-answer-chosen.event';
import type { AnswersRepository } from '@forum/repositories/answers.repository';
import type { SendNotificationUseCase } from '@notification/use-cases/send-notification.use-case';

export class OnQuestionBestAnswerChosenSubscriber implements EventHandler {
  constructor(
    private readonly answersRepository: AnswersRepository,
    private readonly sendNotificationUseCase: SendNotificationUseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.sendNewQuestionBestAnswerNotification.bind(this), QuestionBestAnswerChosenEvent.name);
  }

  private async sendNewQuestionBestAnswerNotification({
    bestAnswerId,
    question,
  }: QuestionBestAnswerChosenEvent): Promise<void> {
    const answer = await this.answersRepository.findById(bestAnswerId.toString());
    if (answer) {
      await this.sendNotificationUseCase.execute({
        recipientId: answer.authorId.toString(),
        title: 'Sua resposta foi escolhida',
        content: `A resposta que você enviou em "${question.title.substring(0, 20).trimEnd()}..." foi escolhida como melhor pelo autor!`,
      });
    }
  }
}
