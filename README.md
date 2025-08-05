# Forum - Clean Architecture

Um sistema de fórum implementado seguindo os princípios da **Clean Architecture**, que resolve o problema de gerenciamento de dúvidas entre alunos e instrutores.

## Problema Resolvido

- **Dificuldade em rastrear dúvidas**: Instrutores têm dificuldade em saber quais dúvidas dos alunos ainda precisam ser respondidas
- **Controle de respostas**: Sistema para marcar quais dúvidas já foram respondidas e quais ainda estão pendentes
- **Organização**: Estrutura clara para gerenciar perguntas, respostas e melhores respostas

## Estrutura da Clean Architecture

Este projeto segue a **Clean Architecture**, que organiza o código em camadas bem definidas, do mais específico ao mais genérico. Vamos entender cada pasta:

### `src/core/` - Núcleo da Aplicação

**Camada mais interna e independente** - Contém as regras de negócio fundamentais que não dependem de nada externo.

```text
src/core/
├── entities/           # Entidades base do sistema
│   ├── entity.entity.ts              # Classe base para todas as entidades
│   └── unique-entity-id.entity.ts    # Identificador único para entidades
├── repositories/       # Interfaces base para repositórios
│   └── pagination-params.repository.ts # Parâmetros de paginação
└── types/             # Tipos utilitários
    └── optional.ts    # Tipo para propriedades opcionais
```

**Por que existe?** Esta camada é o "coração" da aplicação. Ela não depende de frameworks, bancos de dados ou qualquer tecnologia externa. É aqui que ficam as regras de negócio mais importantes.

### `src/domain/forum/` - Domínio do Fórum

**Camada específica do domínio** - Contém as regras de negócio específicas do fórum.

```text
src/domain/forum/
├── enterprise/         # Regras de negócio do domínio
│   ├── entities/       # Entidades específicas do fórum
│   │   ├── question.entity.ts     # Entidade Pergunta
│   │   ├── answer.entity.ts       # Entidade Resposta
│   │   ├── student.entity.ts      # Entidade Aluno
│   │   ├── instructor.entity.ts   # Entidade Instrutor
│   │   └── value-objects/         # Objetos de valor
│   │       └── slug.ts            # Slug (URL amigável)
└── application/        # Casos de uso da aplicação
    ├── use-cases/      # Casos de uso (ações do usuário)
    │   ├── create-question.use-case.ts      # Criar pergunta
    │   ├── answer-question.use-case.ts      # Responder pergunta
    │   ├── edit-question.use-case.ts        # Editar pergunta
    │   └── ... (outros casos de uso)
    └── repositories/   # Interfaces dos repositórios
        ├── questions.repository.ts  # Interface para perguntas
        └── answers.repository.ts    # Interface para respostas
```

**Por que existe?** Esta camada contém toda a lógica específica do fórum. As entidades representam os conceitos do negócio (Pergunta, Resposta, etc.) e os casos de uso representam as ações que os usuários podem fazer.

### `test/` - Testes

**Camada de testes** - Implementações para testar a aplicação.

```text
test/
├── factories/          # Fábricas para criar dados de teste
│   ├── make-question.ts    # Fábrica de perguntas
│   └── make-answer.ts      # Fábrica de respostas
└── repositories/       # Implementações de teste dos repositórios
    ├── in-memory-questions.repository.ts  # Repositório em memória
    └── in-memory-answers.repository.ts    # Repositório em memória
```

**Por que existe?** Para testar a aplicação sem depender de bancos de dados reais. Os repositórios em memória simulam o comportamento dos repositórios reais.

## Fluxo de Dados

1. **Entrada**: Usuário faz uma ação (ex: criar pergunta)
2. **Use Case**: Recebe a ação e aplica as regras de negócio
3. **Repository**: Salva/recupera dados através da interface
4. **Entity**: Contém os dados e regras de negócio
5. **Saída**: Retorna o resultado para o usuário

## Benefícios da Clean Architecture

- **Independência**: O código não depende de frameworks específicos
- **Testabilidade**: Fácil de testar cada camada isoladamente
- **Manutenibilidade**: Mudanças em uma camada não afetam outras
- **Flexibilidade**: Pode trocar tecnologias sem afetar a lógica de negócio

## Como Usar

```bash
# Instalar dependências
pnpm install

# Executar testes
pnpm test

# Executar testes em modo watch
pnpm test:watch
```

## Referências

- [The Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html) - Artigo original de Robert C. Martin

![Clean Architecture](./docs/CleanArchitecture.jpg)
