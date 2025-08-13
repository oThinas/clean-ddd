import { type Either, success, failure } from '@core/either';
import { UniqueEntityId } from '@core/entities/unique-entity-id.entity';
import { [EntityName] } from '@[domain]/entities/[entity-name].entity';
import type { [EntityName]sRepository } from '@[domain]/repositories/[entity-name]s.repository';

interface [ActionName][EntityName]UseCaseRequest {
  // Define request parameters here
  // Example parameters:
  // name: string;
  // email: string;
  // userId: string;
}

type [ActionName][EntityName]UseCaseResponse = Either<
  // Define error types here
  // Example: ResourceNotFoundError | NotAllowedError,
  null,
  { [entityName]: [EntityName] }
>;

export class [ActionName][EntityName]UseCase {
  constructor(
    private readonly [entityName]sRepository: [EntityName]sRepository
  ) {}

  async execute({
    // Destructure request parameters here
    // Example: name, email, userId
  }: [ActionName][EntityName]UseCaseRequest): Promise<[ActionName][EntityName]UseCaseResponse> {
    try {
      // Implement use case logic here
      // Example:
      // const [entityName] = [EntityName].create({
      //   name,
      //   email,
      //   userId: new UniqueEntityId(userId),
      // });
      // 
      // await this.[entityName]sRepository.create([entityName]);
      // 
      // return success({ [entityName] });

      return success({ [entityName]: {} as [EntityName] });
    } catch (error) {
      // Handle errors and return failure
      // Example: return failure(new ResourceNotFoundError());
      return failure(null);
    }
  }
}
