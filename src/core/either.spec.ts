import { type Either, failure, success } from '@core/either';
import { expect, test } from 'vitest';

function doSomething(shouldSuccess: boolean): Either<string, string> {
  if (shouldSuccess) {
    return success('success');
  }

  return failure('error');
}

test('success result', () => {
  const result = doSomething(true);

  expect(result.value).toEqual('success');
  expect(result.isSuccess()).toBe(true);
  expect(result.isFailure()).toBe(false);
});

test('error result', () => {
  const result = doSomething(false);

  expect(result.value).toEqual('error');
  expect(result.isSuccess()).toBe(false);
  expect(result.isFailure()).toBe(true);
});
