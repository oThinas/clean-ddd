import { AggregateRoot } from '@core/entities/aggregate-root.entity';
import type { UniqueEntityId } from '@core/entities/unique-entity-id.entity';
import type { Optional } from '@core/types/optional';
import { QuestionAttachmentList } from '@forum/entities/question-attachment-list.entity';
import { Slug } from '@forum/value-objects/slug';
import dayjs from 'dayjs';

export interface QuestionProps {
  authorId: UniqueEntityId;
  bestAnswerId?: UniqueEntityId;
  title: string;
  content: string;
  slug: Slug;
  attachments: QuestionAttachmentList;
  createdAt: Date;
  updatedAt?: Date;
}

export class Question extends AggregateRoot<QuestionProps> {
  get authorId(): UniqueEntityId {
    return this.props.authorId;
  }

  get bestAnswerId(): UniqueEntityId | undefined {
    return this.props.bestAnswerId;
  }

  get title(): string {
    return this.props.title;
  }

  get content(): string {
    return this.props.content;
  }

  get slug(): Slug {
    return this.props.slug;
  }

  get attachments(): QuestionAttachmentList {
    return this.props.attachments;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date | undefined {
    return this.props.updatedAt;
  }

  get isNew(): boolean {
    return dayjs().diff(this.createdAt, 'days') <= 3;
  }

  get excerpt(): string {
    return this.content.substring(0, 120).trimEnd().concat('...');
  }

  private touch(): void {
    this.props.updatedAt = new Date();
  }

  set content(value: string) {
    this.props.content = value;
    this.touch();
  }

  set title(value: string) {
    this.props.title = value;
    this.props.slug = Slug.createFromText(value);
    this.touch();
  }

  set bestAnswerId(value: UniqueEntityId | undefined) {
    this.props.bestAnswerId = value;
    this.touch();
  }

  set attachments(values: QuestionAttachmentList) {
    this.props.attachments = values;
    this.touch();
  }

  static create(props: Optional<QuestionProps, 'createdAt' | 'slug' | 'attachments'>, id?: UniqueEntityId): Question {
    return new Question(
      {
        ...props,
        slug: props.slug ?? Slug.createFromText(props.title),
        attachments: props.attachments ?? new QuestionAttachmentList(),
        createdAt: props.createdAt ?? new Date(),
      },
      id,
    );
  }
}
