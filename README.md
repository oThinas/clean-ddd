# Clean DDD - Sistema de Fórum

Um sistema de fórum implementado seguindo os princípios da **Clean Architecture** e **Domain-Driven Design (DDD)**, que resolve o problema de gerenciamento de dúvidas entre alunos e instrutores, com sistema de notificações integrado.

## Problema Resolvido

- **Dificuldade em rastrear dúvidas**: Instrutores têm dificuldade em saber quais dúvidas dos alunos ainda precisam ser respondidas
- **Controle de respostas**: Sistema para marcar quais dúvidas já foram respondidas e quais ainda estão pendentes
- **Organização**: Estrutura clara para gerenciar perguntas, respostas e melhores respostas
- **Notificações**: Sistema de notificações para manter usuários informados sobre atividades relevantes
- **Melhor resposta**: Funcionalidade para marcar a melhor resposta de uma pergunta

## Arquitetura

Este projeto segue a **Clean Architecture** combinada com **Domain-Driven Design (DDD)**, organizando o código em camadas bem definidas e domínios específicos.

### Estrutura de Domínios

O sistema está dividido em **Bounded Contexts** (contextos delimitados) que representam diferentes áreas do negócio:

#### `src/domain/forum/` - Domínio do Fórum
**Subdomínio Core** - Gerencia perguntas, respostas, comentários e anexos.

```text
src/domain/forum/
├── enterprise/         # Regras de negócio do domínio
│   ├── entities/       # Entidades específicas do fórum
│   │   ├── question.entity.ts           # Entidade Pergunta
│   │   ├── answer.entity.ts             # Entidade Resposta
│   │   ├── comment.entity.ts            # Entidade Comentário
│   │   ├── attachment.entity.ts         # Entidade Anexo
│   │   ├── student.entity.ts            # Entidade Aluno
│   │   ├── instructor.entity.ts         # Entidade Instrutor
│   │   └── value-objects/               # Objetos de valor
│   │       └── slug.ts                  # Slug (URL amigável)
│   └── events/         # Eventos de domínio
│       ├── answer-created.event.ts      # Evento: Resposta criada
│       └── question-best-answer-chosen.event.ts # Evento: Melhor resposta escolhida
└── application/        # Casos de uso da aplicação
    ├── use-cases/      # Casos de uso (ações do usuário)
    │   ├── create-question.use-case.ts      # Criar pergunta
    │   ├── answer-question.use-case.ts      # Responder pergunta
    │   ├── edit-question.use-case.ts        # Editar pergunta
    │   ├── delete-question.use-case.ts      # Deletar pergunta
    │   ├── edit-answer.use-case.ts          # Editar resposta
    │   ├── delete-answer.use-case.ts        # Deletar resposta
    │   ├── comment-on-question.use-case.ts  # Comentar em pergunta
    │   ├── comment-on-answer.use-case.ts    # Comentar em resposta
    │   ├── choose-question-best-answer.use-case.ts # Escolher melhor resposta
    │   ├── fetch-recent-questions.use-case.ts # Buscar perguntas recentes
    │   ├── get-question-by-slug.use-case.ts # Buscar pergunta por slug
    │   └── ... (outros casos de uso)
    └── repositories/   # Interfaces dos repositórios
        ├── questions.repository.ts          # Interface para perguntas
        ├── answers.repository.ts            # Interface para respostas
        ├── question-comments.repository.ts  # Interface para comentários de perguntas
        ├── answer-comments.repository.ts    # Interface para comentários de respostas
        ├── question-attachments.repository.ts # Interface para anexos de perguntas
        └── answer-attachments.repository.ts # Interface para anexos de respostas
```

#### `src/domain/notification/` - Domínio de Notificações
**Subdomínio Supporting** - Gerencia notificações do sistema.

```text
src/domain/notification/
├── enterprise/         # Regras de negócio do domínio
│   └── entities/       # Entidades específicas de notificações
│       └── notification.entity.ts      # Entidade Notificação
└── application/        # Casos de uso da aplicação
    ├── use-cases/      # Casos de uso
    │   ├── send-notification.use-case.ts    # Enviar notificação
    │   └── read-notification.use-case.ts    # Marcar notificação como lida
    ├── repositories/   # Interfaces dos repositórios
    │   └── notifications.repository.ts      # Interface para notificações
    └── subscribers/    # Assinantes de eventos de domínio
        ├── on-answer-created.subscriber.ts  # Notificar quando resposta é criada
        └── on-question-best-answer-chosen.subscriber.ts # Notificar quando melhor resposta é escolhida
```

### `src/core/` - Núcleo da Aplicação

**Camada mais interna e independente** - Contém as regras de negócio fundamentais que não dependem de nada externo.

```text
src/core/
├── entities/           # Entidades base do sistema
│   ├── entity.entity.ts              # Classe base para todas as entidades
│   ├── aggregate-root.entity.ts      # Classe base para raízes de agregado
│   ├── unique-entity-id.entity.ts    # Identificador único para entidades
│   └── watched-list.entity.ts        # Lista observável para agregados
├── events/            # Sistema de eventos de domínio
│   └── domain.events.ts              # Gerenciador de eventos de domínio
├── repositories/      # Interfaces base para repositórios
│   └── pagination-params.repository.ts # Parâmetros de paginação
├── errors/           # Erros de domínio
│   ├── use-case.error.ts             # Erro base para casos de uso
│   ├── resource-not-found.error.ts   # Erro de recurso não encontrado
│   └── not-allowed.error.ts          # Erro de operação não permitida
├── types/            # Tipos utilitários
│   ├── optional.ts                   # Tipo para propriedades opcionais
│   └── empty-object.ts               # Tipo para objetos vazios
└── either.ts         # Monad Either para tratamento de erros
```

**Por que existe?** Esta camada é o "coração" da aplicação. Ela não depende de frameworks, bancos de dados ou qualquer tecnologia externa. É aqui que ficam as regras de negócio mais importantes e os padrões fundamentais.

### `test/` - Testes

**Camada de testes** - Implementações para testar a aplicação.

```text
test/
├── factories/          # Fábricas para criar dados de teste
│   ├── make-question.ts        # Fábrica de perguntas
│   ├── make-answer.ts          # Fábrica de respostas
│   ├── make-question-comment.ts # Fábrica de comentários de perguntas
│   ├── make-answer-comment.ts  # Fábrica de comentários de respostas
│   ├── make-question-attachment.ts # Fábrica de anexos de perguntas
│   ├── make-answer-attachment.ts   # Fábrica de anexos de respostas
│   └── make-notification.ts    # Fábrica de notificações
├── repositories/       # Implementações de teste dos repositórios
│   ├── in-memory-questions.repository.ts      # Repositório em memória
│   ├── in-memory-answers.repository.ts        # Repositório em memória
│   ├── in-memory-question-comments.repository.ts # Repositório em memória
│   ├── in-memory-answer-comments.repository.ts    # Repositório em memória
│   ├── in-memory-question-attachments.repository.ts # Repositório em memória
│   ├── in-memory-answer-attachments.repository.ts   # Repositório em memória
│   └── in-memory-notifications.repository.ts  # Repositório em memória
└── utils/             # Utilitários para testes
    └── wait-for.utils.ts       # Utilitário para aguardar operações assíncronas
```

**Por que existe?** Para testar a aplicação sem depender de bancos de dados reais. Os repositórios em memória simulam o comportamento dos repositórios reais.

## Fluxo de Dados e Eventos

### Fluxo Básico
1. **Entrada**: Usuário faz uma ação (ex: criar pergunta)
2. **Use Case**: Recebe a ação e aplica as regras de negócio
3. **Repository**: Salva/recupera dados através da interface
4. **Entity**: Contém os dados e regras de negócio
5. **Saída**: Retorna o resultado para o usuário

### Fluxo com Eventos de Domínio
1. **Ação do Usuário**: Usuário executa uma ação (ex: responder pergunta)
2. **Use Case**: Processa a ação e aplica regras de negócio
3. **Evento de Domínio**: Dispara evento (ex: `AnswerCreated`)
4. **Subscriber**: Assinante processa o evento (ex: enviar notificação)
5. **Resultado**: Sistema atualizado e notificações enviadas

## Benefícios da Clean Architecture + DDD

- **Independência**: O código não depende de frameworks específicos
- **Testabilidade**: Fácil de testar cada camada isoladamente
- **Manutenibilidade**: Mudanças em uma camada não afetam outras
- **Flexibilidade**: Pode trocar tecnologias sem afetar a lógica de negócio
- **Domínio Rico**: Modelos que refletem fielmente o negócio
- **Separação de Responsabilidades**: Cada domínio tem suas próprias regras
- **Eventos de Domínio**: Comunicação desacoplada entre partes do sistema

## Tecnologias Utilizadas

- **TypeScript**: Linguagem principal
- **Vitest**: Framework de testes
- **Biome**: Linter e formatter
- **Day.js**: Manipulação de datas
- **Faker.js**: Geração de dados para testes
- **PNPM**: Gerenciador de pacotes

## Como Usar

```bash
# Instalar dependências
pnpm install

# Executar testes
pnpm test

# Executar testes em modo watch
pnpm test:watch
```

## Documentação

- [Glossário DDD](./docs/GLOSSARIO.md) - Conceitos fundamentais do DDD
- [Functional Error Handling](./docs/FUNCTIONAL_ERROR_HANDLING.md) - Tratamento funcional de erros com Either
- [Fluxo de Eventos de Domínio](./docs/EVENT_FLOW.md) - Como os eventos funcionam
- [Fluxo de Dados de Eventos de Domínio](./docs/EVENT_FLOW_DIAGRAM.md) - Diagrama do fluxo
- [Passos para a criação de um novo componente](./docs/NEW_COMPONENT.md) - Guia de desenvolvimento
- [Watched List e Agregados](./docs/WATCHED_LIST_AND_AGGREGATE.md) - Padrões de agregados
- [Templates](./docs/templates/README.md) - Templates para novos componentes

## Referências

- [The Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) - Artigo original de Robert C. Martin
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html) - Conceitos de DDD por Martin Fowler
- [Event Sourcing](https://martinfowler.com/eaaDev/EventSourcing.html) - Padrão de Event Sourcing

![Clean Architecture](./docs/CleanArchitecture.jpg)
