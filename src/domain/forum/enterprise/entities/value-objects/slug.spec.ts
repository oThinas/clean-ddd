import { Slug } from '@forum/value-objects/slug';
import { describe, expect, it } from 'vitest';

describe('Slug', () => {
  it('should be able to create a new slug from text', () => {
    const slug = Slug.createFromText('Example question title');

    expect(slug.value).toEqual('example-question-title');
  });
});
