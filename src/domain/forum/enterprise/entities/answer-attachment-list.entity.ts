import { WatchedList } from '@core/entities/watched-list.entity';
import type { AnswerAttachment } from '@forum/entities/answer-attachment.entity';

export class AnswerAttachmentList extends WatchedList<AnswerAttachment> {
  compareItems(a: AnswerAttachment, b: AnswerAttachment): boolean {
    return a.attachmentId === b.attachmentId;
  }
}
