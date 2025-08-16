# Fluxo do Sistema de Eventos de Domínio

## Visão Geral

Este documento explica como funciona o sistema de eventos de domínio no projeto Clean DDD, desde a criação de uma resposta até o envio de notificação.

## Diagrama do Fluxo

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           FLUXO COMPLETO                                    │
└─────────────────────────────────────────────────────────────────────────────┘

1. INICIALIZAÇÃO
   ┌─────────────────┐
   │ Application     │
   │ (Startup)       │
   └─────────────────┘
           │
           ▼
   ┌─────────────────┐
   │ OnAnswerCreated │
   │ Subscriber      │ ◄── Registra handler para AnswerCreatedEvent
   └─────────────────┘
           │
           ▼
   ┌─────────────────┐
   │ Domain Events   │ ◄── Handler registrado no Map global
   │ Registry        │
   └─────────────────┘

2. CRIAÇÃO DA RESPOSTA
   ┌─────────────────┐
   │ AnswerQuestion  │
   │ Use Case        │
   └─────────────────┘
           │
           ▼
   ┌─────────────────┐
   │ Answer.create() │ ◄── Cria nova instância
   └─────────────────┘
           │
           ▼
   ┌─────────────────┐
   │ AnswerCreated   │ ◄── Evento criado automaticamente
   │ Event           │
   └─────────────────┘
           │
           ▼
   ┌─────────────────┐
   │ Aggregate Root  │ ◄── Evento adicionado à lista
   │ (addDomainEvent)│    e aggregate marcado para dispatch
   └─────────────────┘
           │
           ▼
   ┌─────────────────┐
   │ Repository      │ ◄── Resposta salva no banco
   │ (create)        │
   └─────────────────┘

3. DISPATCH DOS EVENTOS
   ┌─────────────────┐
   │ Application     │
   │ (Transaction    │ ◄── Após commit da transação
   │  Commit)        │
   └─────────────────┘
           │
           ▼
   ┌─────────────────┐
   │ dispatchEvents  │ ◄── Busca aggregates marcados
   │ ForAggregate()  │
   └─────────────────┘
           │
           ▼
   ┌─────────────────┐
   │ dispatch()      │ ◄── Para cada evento do aggregate
   └─────────────────┘
           │
           ▼
   ┌─────────────────┐
   │ Handler Map     │ ◄── Busca handlers registrados
   └─────────────────┘
           │
           ▼
   ┌─────────────────┐
   │ sendNewAnswer   │ ◄── Handler executado
   │ Notification()  │
   └─────────────────┘
           │
           ▼
   ┌─────────────────┐
   │ SendNotification│ ◄── Use case executado
   │ Use Case        │
   └─────────────────┘
           │
           ▼
   ┌─────────────────┐
   │ Notification    │ ◄── Notificação salva
   │ Repository      │
   └─────────────────┘
```

## Detalhamento das Etapas

### 1. **Inicialização do Sistema**

```typescript
// Quando a aplicação inicia
new OnAnswerCreatedSubscriber(questionsRepository, sendNotificationUseCase);

// Internamente:
setupSubscriptions(): void {
  DomainEvent.register(this.sendNewAnswerNotification.bind(this), AnswerCreatedEvent.name);
}
```

**O que acontece:**

- O subscriber se registra no sistema de eventos
- O handler `sendNewAnswerNotification` fica associado ao evento `AnswerCreatedEvent`
- Isso é armazenado no `handlersMap` global

### 2. **Criação da Resposta**

```typescript
// No use case
const answer = Answer.create({
  content,
  authorId: new UniqueEntityId(instructorId),
  questionId: new UniqueEntityId(questionId),
});

await this.answersRepository.create(answer);
```

**O que acontece:**

- `Answer.create()` é chamado
- Como é uma nova resposta (`!id`), um `AnswerCreatedEvent` é criado
- O evento é adicionado à lista de eventos do aggregate via `addDomainEvent()`
- O aggregate é marcado para dispatch via `markAggregateForDispatch()`

### 3. **Estrutura do Evento**

```typescript
export class AnswerCreatedEvent implements DomainEvent {
  public ocurredAt: Date;

  constructor(public readonly answer: Answer) {
    this.ocurredAt = new Date();
  }

  getAggregateId(): UniqueEntityId {
    return this.answer.id;
  }
}
```

### 4. **Sistema de Dispatch**

```typescript
// Após o commit da transação
dispatchEventsForAggregate(answer.id);

// Internamente:
function dispatchAggregateEvents(aggregate: AggregateRoot<unknown>): void {
  aggregate.domainEvents.forEach((event: DomainEvent) => dispatch(event));
}

function dispatch(event: DomainEvent): void {
  const eventClassName: string = event.constructor.name;
  const handlers = handlersMap.get(eventClassName);
  
  for (const handler of handlers ?? []) {
    handler(event);
  }
}
```

### 5. **Processamento da Notificação**

```typescript
private async sendNewAnswerNotification({ answer }: AnswerCreatedEvent): Promise<void> {
  const question = await this.questionsRepository.findById(answer.questionId.toString());
  if (question) {
    await this.sendNotificationUseCase.execute({
      recipientId: question.authorId.toString(),
      title: `Nova resposta em "${question.title.substring(0, 40).trimEnd()}..."`,
      content: answer.excerpt,
    });
  }
}
```

## Pontos Importantes

### **1. Desacoplamento**

- O módulo `forum` não conhece o módulo `notification`
- A comunicação acontece apenas através de eventos
- Cada módulo pode reagir aos eventos independentemente

### **2. Timing do Dispatch**

- Os eventos são criados durante a execução do use case
- O dispatch acontece **após** o commit da transação
- Isso garante que a notificação só é enviada se a resposta foi realmente salva

### **3. Registro de Handlers**

```typescript
// Mapa global de handlers
const handlersMap: Map<string, DomainEventCallback[]> = new Map();

// Registro
register(callback, 'AnswerCreatedEvent');
// Resultado: handlersMap.get('AnswerCreatedEvent') = [callback]
```

### **4. Marcação para Dispatch**

```typescript
const markedAggregates: AggregateRoot<unknown>[] = [];

export function markAggregateForDispatch(aggregate: AggregateRoot<unknown>): void {
  const aggregateFound = !!findMarkedAggregateById(aggregate.id);
  if (!aggregateFound) {
    markedAggregates.push(aggregate);
  }
}
```

## Vantagens do Sistema

1. **Baixo Acoplamento**: Módulos não dependem diretamente uns dos outros
2. **Extensibilidade**: Fácil adicionar novos handlers para eventos existentes
3. **Testabilidade**: Cada parte pode ser testada isoladamente
4. **Consistência**: Eventos só são disparados após commit da transação
5. **Flexibilidade**: Múltiplos handlers podem reagir ao mesmo evento

## Exemplo de Uso

```typescript
// 1. Registrar subscriber (na inicialização)
new OnAnswerCreatedSubscriber(questionsRepo, sendNotificationUseCase);

// 2. Executar use case
const result = await answerQuestionUseCase.execute({
  instructorId: '1',
  questionId: '1',
  content: 'Nova resposta'
});

// 3. Commit da transação (geralmente automático)
// 4. Dispatch dos eventos (geralmente automático)
// 5. Notificação enviada automaticamente
```

Este sistema permite que diferentes partes da aplicação reajam a mudanças de domínio de forma desacoplada e consistente.
