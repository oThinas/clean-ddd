import type { UniqueEntityId } from '@core/entities/unique-entity-id.entity';
import type { Optional } from '@core/types/optional';
import { Comment, type CommentProps } from '@entities/comment.entity';

interface AnswerCommentProps extends CommentProps {
  answerId: UniqueEntityId;
}

export class AnswerComment extends Comment<AnswerCommentProps> {
  get answerId(): UniqueEntityId {
    return this.props.answerId;
  }

  static create(props: Optional<AnswerCommentProps, 'createdAt'>, id?: UniqueEntityId): AnswerComment {
    const answerComment = new AnswerComment(
      {
        ...props,
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );

    return answerComment;
  }
}
