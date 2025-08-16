# Passos para a criação de um novo componente

## 1. Planejamento e Documentação

- Definir o conceito: O que é essa "coisa nova"? (entidade, use case, value object, etc.)
- Criar documentação:
  - Adicionar ao glossário em docs/GLOSSARIO.md
  - Criar fluxo de dados se necessário (como em docs/EVENT_FLOW.md)
  - Documentar regras de negócio e relacionamentos

## 2. Implementação dos Arquivos Necessários

- Seguir a ordem de dependências:
  - Value Objects (se necessário)
  - Entidades
  - Interfaces de Repository
  - Use Cases
  - Testes (factories, repositories in-memory, use case tests)

## 3. Criação/Atualização de Templates

- Identificar padrões: Se o que você criou segue um padrão repetível
- Criar template: Adicionar em docs/templates/
- Documentar template: Atualizar docs/templates/README.md

## 4. Criação de Nova Regra no .cursor/

- Criar regra específica: new-[tipo].mdc em .cursor/rules/
- Atualizar overview: Adicionar referência em clean-ddd-overview.mdc
- Testar a regra: Verificar se o Cursor a aplica corretamente
