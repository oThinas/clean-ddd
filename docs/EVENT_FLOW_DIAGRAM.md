# Diagrama do Fluxo de Eventos de Domínio

## Sequência de Eventos

```mermaid
sequenceDiagram
    participant App as Application Startup
    participant Sub as OnAnswerCreatedSubscriber
    participant Registry as Domain Events Registry
    participant UC as AnswerQuestionUseCase
    participant Answer as Answer Entity
    participant Repo as AnswersRepository
    participant Dispatch as Event Dispatcher
    participant Handler as Notification Handler
    participant NotifUC as SendNotificationUseCase

    Note over App,NotifUC: 1. INICIALIZAÇÃO
    App->>Sub: new OnAnswerCreatedSubscriber()
    Sub->>Registry: register(handler, 'AnswerCreatedEvent')
    Registry->>Registry: handlersMap.set('AnswerCreatedEvent', [handler])

    Note over App,NotifUC: 2. CRIAÇÃO DA RESPOSTA
    UC->>Answer: Answer.create(props)
    Answer->>Answer: new AnswerCreatedEvent(this)
    Answer->>Answer: addDomainEvent(event)
    Answer->>Registry: markAggregateForDispatch(this)
    UC->>Repo: create(answer)
    Repo->>Repo: save to database

    Note over App,NotifUC: 3. DISPATCH DOS EVENTOS
    App->>Dispatch: dispatchEventsForAggregate(answer.id)
    Dispatch->>Dispatch: findMarkedAggregateById(id)
    Dispatch->>Answer: get domainEvents
    Answer->>Dispatch: [AnswerCreatedEvent]
    
    loop Para cada evento
        Dispatch->>Dispatch: dispatch(event)
        Dispatch->>Registry: handlersMap.get('AnswerCreatedEvent')
        Registry->>Dispatch: [sendNewAnswerNotification]
        Dispatch->>Handler: sendNewAnswerNotification(event)
        Handler->>Handler: find question by answer.questionId
        Handler->>NotifUC: execute(notificationData)
        NotifUC->>NotifUC: save notification
    end
```

## Arquitetura do Sistema

```mermaid
graph TB
    subgraph "Application Layer"
        UC[AnswerQuestionUseCase]
        Sub[OnAnswerCreatedSubscriber]
    end

    subgraph "Domain Layer"
        Answer[Answer Entity]
        Event[AnswerCreatedEvent]
        Aggregate[AggregateRoot]
    end

    subgraph "Infrastructure Layer"
        Repo[AnswersRepository]
        NotifRepo[NotificationsRepository]
    end

    subgraph "Event System"
        Registry[Domain Events Registry]
        Dispatch[Event Dispatcher]
        Handlers[Handlers Map]
    end

    subgraph "Notification Module"
        NotifUC[SendNotificationUseCase]
    end

    UC --> Answer
    Answer --> Event
    Answer --> Aggregate
    Aggregate --> Registry
    Registry --> Handlers
    Handlers --> Dispatch
    Dispatch --> Sub
    Sub --> NotifUC
    NotifUC --> NotifRepo
    UC --> Repo
```

## Estados do Sistema

```mermaid
stateDiagram-v2
    [*] --> Initialized: Application Startup
    Initialized --> HandlerRegistered: OnAnswerCreatedSubscriber created
    HandlerRegistered --> AnswerCreated: AnswerQuestionUseCase executed
    AnswerCreated --> EventQueued: addDomainEvent called
    EventQueued --> SavedToDB: Repository.create called
    SavedToDB --> EventsDispatched: dispatchEventsForAggregate called
    EventsDispatched --> NotificationSent: Handler executed
    NotificationSent --> [*]

    state EventQueued {
        [*] --> MarkedForDispatch
        MarkedForDispatch --> InEventList
    }

    state EventsDispatched {
        [*] --> FindAggregate
        FindAggregate --> DispatchEvents
        DispatchEvents --> ExecuteHandlers
        ExecuteHandlers --> ClearEvents
    }
```

## Estrutura de Dados

```mermaid
classDiagram
    class DomainEvent {
        <<abstract>>
        +ocurredAt: Date
        +getAggregateId() UniqueEntityId
    }

    class AnswerCreatedEvent {
        +answer: Answer
        +ocurredAt: Date
        +getAggregateId() UniqueEntityId
    }

    class AggregateRoot {
        -_domainEvents: DomainEvent[]
        +domainEvents: DomainEvent[]
        +addDomainEvent(event: DomainEvent)
        +clearEvents()
    }

    class Answer {
        +authorId: UniqueEntityId
        +questionId: UniqueEntityId
        +content: string
        +create(props, id?) Answer
    }

    class EventHandler {
        <<abstract>>
        +setupSubscriptions()
    }

    class OnAnswerCreatedSubscriber {
        -questionsRepository: QuestionsRepository
        -sendNotificationUseCase: SendNotificationUseCase
        +setupSubscriptions()
        -sendNewAnswerNotification(event: AnswerCreatedEvent)
    }

    DomainEvent <|-- AnswerCreatedEvent
    AggregateRoot <|-- Answer
    EventHandler <|-- OnAnswerCreatedSubscriber
    Answer --> AnswerCreatedEvent : creates
```

## Fluxo de Execução Detalhado

### 1. **Setup (Inicialização)**

```typescript
// handlersMap = new Map()
// markedAggregates = []

new OnAnswerCreatedSubscriber(questionsRepo, sendNotificationUseCase);
// → handlersMap.set('AnswerCreatedEvent', [sendNewAnswerNotification])
```

### 2. **Criação da Resposta**

```typescript
const answer = Answer.create({...});
// → new AnswerCreatedEvent(answer)
// → answer.addDomainEvent(event)
// → markedAggregates.push(answer)

await answersRepository.create(answer);
// → save to database
```

### 3. **Dispatch dos Eventos**

```typescript
dispatchEventsForAggregate(answer.id);
// → findMarkedAggregateById(answer.id)
// → aggregate.domainEvents.forEach(dispatch)
// → handlersMap.get('AnswerCreatedEvent').forEach(handler => handler(event))
// → aggregate.clearEvents()
// → removeAggregateFromMarkedDispatchList(aggregate)
```

### 4. **Processamento da Notificação**

```typescript
sendNewAnswerNotification({ answer });
// → find question by answer.questionId
// → sendNotificationUseCase.execute({
//     recipientId: question.authorId,
//     title: `Nova resposta em "${question.title}..."`,
//     content: answer.excerpt
//   })
```

## Pontos de Atenção

1. **Timing**: O dispatch deve acontecer após o commit da transação
2. **Idempotência**: Handlers devem ser idempotentes (poderem ser executados múltiplas vezes sem efeitos colaterais)
3. **Falhas**: Se um handler falhar, outros handlers ainda devem ser executados
4. **Performance**: Múltiplos handlers para o mesmo evento são executados sequencialmente
5. **Limpeza**: Eventos são limpos após o dispatch para evitar reprocessamento
