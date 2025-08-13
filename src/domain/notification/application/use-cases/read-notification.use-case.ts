import { type Either, failure, success } from '@core/either';
import { NotAllowedError } from '@core/errors/not-allowed.error';
import { ResourceNotFoundError } from '@core/errors/resource-not-found.error';
import type { Notification } from '@notification/entities/notification.entity';
import type { NotificationsRepository } from '@notification/repositories/notifications.repository';

interface ReadNotificationUseCaseRequest {
  recipientId: string;
  notificationId: string;
}

type ReadNotificationUseCaseResponse = Either<ResourceNotFoundError | NotAllowedError, { notification: Notification }>;

export class ReadNotificationUseCase {
  constructor(private readonly notificationsRepository: NotificationsRepository) {}

  async execute({
    recipientId,
    notificationId,
  }: ReadNotificationUseCaseRequest): Promise<ReadNotificationUseCaseResponse> {
    const notification = await this.notificationsRepository.findById(notificationId);
    if (!notification) {
      return failure(new ResourceNotFoundError());
    }

    if (recipientId !== notification.recipientId.toString()) {
      return failure(new NotAllowedError());
    }

    notification.read();
    await this.notificationsRepository.save(notification);
    return success({ notification });
  }
}
