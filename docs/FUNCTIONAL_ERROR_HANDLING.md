# Functional Error Handling com Either

## Visão Geral

O projeto utiliza o padrão **Either** para tratamento funcional de erros, implementado no arquivo `src/core/either.ts`. Este padrão é uma alternativa mais elegante e type-safe ao tratamento tradicional de exceções, seguindo os princípios da programação funcional.

## O que é o Either?

O `Either` é uma **monad** que representa um valor que pode ser de dois tipos possíveis:
- **Success (R)**: Representa o sucesso da operação
- **Failure (L)**: Representa o erro ou falha da operação

Onde:
- `L` = Left (erro/falha)
- `R` = Right (sucesso/resultado)

## Implementação

```typescript
// Definição do tipo Either
export type Either<L, R> = Failure<L, R> | Success<L, R>;

// Classe para representar falhas
class Failure<L, R> {
  readonly value: L;

  constructor(value: L) {
    this.value = value;
  }

  isSuccess(): this is Success<L, R> {
    return false;
  }

  isFailure(): this is Failure<L, R> {
    return true;
  }
}

// Classe para representar sucessos
class Success<L, R> {
  readonly value: R;

  constructor(value: R) {
    this.value = value;
  }

  isSuccess(): this is Success<L, R> {
    return true;
  }

  isFailure(): this is Failure<L, R> {
    return false;
  }
}

// Funções helper para criar instâncias
export const failure = <L, R>(value: L): Either<L, R> => {
  return new Failure(value);
};

export const success = <L, R>(value: R): Either<L, R> => {
  return new Success(value);
};
```

## Como Usar

### 1. Definição de Tipos

Primeiro, defina os tipos para erro e sucesso:

```typescript
// Tipos de erro possíveis
type CreateQuestionError = 
  | 'INVALID_TITLE'
  | 'INVALID_CONTENT'
  | 'STUDENT_NOT_FOUND';

// Tipo de sucesso
type CreateQuestionResult = {
  id: string;
  title: string;
  content: string;
  studentId: string;
};
```

### 2. Implementação em Use Cases

```typescript
export class CreateQuestionUseCase {
  constructor(
    private questionsRepository: QuestionsRepository,
    private studentsRepository: StudentsRepository,
  ) {}

  async execute(
    request: CreateQuestionRequest,
  ): Promise<Either<CreateQuestionError, CreateQuestionResult>> {
    // Validações
    if (!request.title || request.title.length < 3) {
      return failure('INVALID_TITLE');
    }

    if (!request.content || request.content.length < 10) {
      return failure('INVALID_CONTENT');
    }

    // Verificar se o estudante existe
    const student = await this.studentsRepository.findById(request.studentId);
    if (!student) {
      return failure('STUDENT_NOT_FOUND');
    }

    // Criar a pergunta
    const question = Question.create({
      title: request.title,
      content: request.content,
      studentId: request.studentId,
    });

    await this.questionsRepository.create(question);

    return success({
      id: question.id.toString(),
      title: question.title,
      content: question.content,
      studentId: question.studentId.toString(),
    });
  }
}
```

### 3. Tratamento no Controller/Handler

```typescript
export class CreateQuestionController {
  constructor(private createQuestionUseCase: CreateQuestionUseCase) {}

  async handle(request: CreateQuestionRequest) {
    const result = await this.createQuestionUseCase.execute(request);

    if (result.isFailure()) {
      // Tratar erro
      switch (result.value) {
        case 'INVALID_TITLE':
          return { status: 400, message: 'Título inválido' };
        case 'INVALID_CONTENT':
          return { status: 400, message: 'Conteúdo inválido' };
        case 'STUDENT_NOT_FOUND':
          return { status: 404, message: 'Estudante não encontrado' };
      }
    }

    // Tratar sucesso
    return { 
      status: 201, 
      data: result.value 
    };
  }
}
```

## Vantagens do Either

### 1. **Type Safety**
- O TypeScript garante que você trate todos os casos possíveis
- Não há possibilidade de esquecer de tratar um erro

### 2. **Explicitação de Erros**
- Todos os erros possíveis são explicitamente definidos no tipo
- Facilita a documentação e manutenção

### 3. **Composição Funcional**
- Permite encadear operações de forma funcional
- Facilita o tratamento de erros em cadeias de operações

### 4. **Sem Exceções Silenciosas**
- Força o desenvolvedor a tratar explicitamente os erros
- Evita crashes inesperados

### 5. **Testabilidade**
- Fácil de testar tanto casos de sucesso quanto de falha
- Resultados previsíveis e determinísticos

## Padrões de Uso Comuns

### 1. **Validação em Cadeia**

```typescript
async validateAndCreate(
  request: CreateQuestionRequest,
): Promise<Either<ValidationError, Question>> {
  // Validar título
  const titleValidation = this.validateTitle(request.title);
  if (titleValidation.isFailure()) {
    return failure(titleValidation.value);
  }

  // Validar conteúdo
  const contentValidation = this.validateContent(request.content);
  if (contentValidation.isFailure()) {
    return failure(contentValidation.value);
  }

  // Se chegou aqui, todas as validações passaram
  return success(Question.create(request));
}
```

### 2. **Operações com Repositório**

```typescript
async findQuestionById(
  id: string,
): Promise<Either<QuestionError, Question>> {
  const question = await this.questionsRepository.findById(id);
  
  if (!question) {
    return failure('QUESTION_NOT_FOUND');
  }

  return success(question);
}
```

### 3. **Mapeamento de Erros**

```typescript
async execute(request: Request): Promise<Either<ApiError, Response>> {
  const result = await this.useCase.execute(request);
  
  if (result.isFailure()) {
    // Mapear erros de domínio para erros de API
    const apiError = this.mapDomainErrorToApiError(result.value);
    return failure(apiError);
  }

  return success(result.value);
}
```

## Comparação com Tratamento Tradicional

### ❌ Tratamento com Exceções

```typescript
async createQuestion(request: Request): Promise<Question> {
  if (!request.title) {
    throw new Error('Title is required'); // Exceção não tipada
  }
  
  const question = await this.repository.create(request);
  return question; // Pode retornar null/undefined
}

// Uso - propenso a erros
try {
  const question = await createQuestion(request);
  // question pode ser null/undefined
} catch (error) {
  // error é do tipo unknown
  console.error(error);
}
```

### ✅ Tratamento com Either

```typescript
async createQuestion(
  request: Request,
): Promise<Either<CreateQuestionError, Question>> {
  if (!request.title) {
    return failure('TITLE_REQUIRED'); // Erro tipado
  }
  
  const question = await this.repository.create(request);
  return success(question); // Sempre tipado
}

// Uso - type-safe
const result = await createQuestion(request);
if (result.isSuccess()) {
  // result.value é garantidamente Question
  console.log(result.value.title);
} else {
  // result.value é garantidamente CreateQuestionError
  console.log(result.value);
}
```

## Integração com o Sistema

O `Either` é usado consistentemente em todo o sistema:

- **Use Cases**: Retornam `Either<Error, Result>`
- **Repositories**: Retornam `Either<RepositoryError, Entity>`
- **Validators**: Retornam `Either<ValidationError, ValidatedData>`
- **Controllers**: Consomem `Either` e mapeiam para respostas HTTP

## Benefícios no Contexto DDD

1. **Domínio Rico**: Permite expressar regras de negócio de forma clara
2. **Fail Fast**: Falhas são detectadas e tratadas rapidamente
3. **Imutabilidade**: Resultados são imutáveis e previsíveis
4. **Composição**: Facilita a composição de operações complexas
5. **Documentação**: Tipos servem como documentação viva

## Conclusão

O padrão `Either` proporciona uma abordagem mais robusta e type-safe para tratamento de erros, alinhada com os princípios da programação funcional e Clean Architecture. Ele força o desenvolvedor a pensar explicitamente sobre os casos de erro e sucesso, resultando em código mais previsível e manutenível.
