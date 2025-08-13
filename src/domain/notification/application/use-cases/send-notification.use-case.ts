import { success, type Either } from '@core/either';
import { UniqueEntityId } from '@core/entities/unique-entity-id.entity';
import { Notification } from '@notification/entities/notification.entity';
import type { NotificationsRepository } from '@notification/repositories/notifications.repository';

interface SendNotificationUseCaseRequest {
  recipientId: string;
  title: string;
  content: string;
}

type SendNotificationUseCaseResponse = Either<null, { notification: Notification }>;

export class SendNotificationUseCase {
  constructor(private readonly notificationsRepository: NotificationsRepository) {}

  async execute({
    content,
    recipientId,
    title,
  }: SendNotificationUseCaseRequest): Promise<SendNotificationUseCaseResponse> {
    const notification = Notification.create({
      recipientId: new UniqueEntityId(recipientId),
      title,
      content,
    });

    await this.notificationsRepository.create(notification);
    return success({ notification });
  }
}
