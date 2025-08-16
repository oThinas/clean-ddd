import type { EventHandler } from '@core/events/domain.events';
import * as DomainEvents from '@core/events/domain.events';
import { [ActionName][EntityName]Event } from '@[domain]/events/[action]-[entity-name].event';
import type { [RepositoryName]Repository } from '@[domain]/repositories/[repository-name].repository';
import type { [UseCaseName]UseCase } from '@[target-domain]/use-cases/[use-case-name].use-case';

export class On[ActionName][EntityName]Subscriber implements EventHandler {
  constructor(
    private readonly [repository-name]Repository: [RepositoryName]Repository,
    private readonly [use-case-name]UseCase: [UseCaseName]UseCase,
  ) {
    this.setupSubscriptions();
  }

  setupSubscriptions(): void {
    DomainEvents.register(this.handle[ActionName][EntityName].bind(this), [ActionName][EntityName]Event.name);
  }

  private async handle[ActionName][EntityName]({ [entity-name] }: [ActionName][EntityName]Event): Promise<void> {
    // Implement your event handling logic here
    // Example:
    // const relatedEntity = await this.[repository-name]Repository.findById([entity-name].someId.toString());
    // if (relatedEntity) {
    //   await this.[use-case-name]UseCase.execute({
    //     // your use case parameters
    //   });
    // }
  }
}
