## Descrição

Aplicação back-end com NestJS, TypeORM e Typescript.

O EventFlow é uma plataforma web para gerenciamento e venda de ingressos para eventos. A aplicação permite que usuários se cadastrem, realizem login e adquiram ingressos para eventos disponíveis de forma simples e segura.

A plataforma também possui um sistema de gerenciamento baseado em permissões. Usuários com perfil Master ou com as permissões adequadas podem cadastrar, editar, ativar, desativar e gerenciar eventos, além de administrar tipos de ingressos, pedidos, usuários e processos de check-in.

## Auditoria & Design Patterns

Todas as ações administrativas (CRUD de eventos, tipos de ingresso, pedidos, check-in, usuários, perfis e habilidades) são registradas automaticamente em uma trilha de auditoria (`audit_logs`), consultável em `GET /api/audit-logs` (perfil Master).

A solução foi construída com os Design Patterns **Decorator** (um marcador `@Audit` que define o que auditar) e **Observer** (um interceptor que publica o evento e múltiplos listeners independentes que reagem a ele — persistência em banco e log). A documentação completa — definição, problema resolvido, justificativa técnica, vantagens e como estender — está em [`docs/audit-observer-decorator-pattern.md`](docs/audit-observer-decorator-pattern.md).

## Conflito de portas com Elysium

O EventFlow usa as portas **6100** (PostgreSQL), **6200** (API) e **6300** (MinIO). Se os containers Elysium estiverem ativos nas mesmas portas, pare-os antes de subir a infra:

```bash
docker stop elysium-api elysium-database elysium-minio elysium-client
```

Depois suba apenas banco e MinIO (ou o stack completo):

```bash
docker compose up -d db minio
```

Se `npm run migration:run` falhar com `password authentication failed` mesmo com o container `event-flow-database` saudável, confira se a porta **6100** no host aponta para este projeto (pare outros stacks e, se a porta continuar ocupada com o container parado, reinicie o Docker Desktop). Migrations podem ser executadas pela rede do Compose:

```bash
docker run --rm --network event-flow-api_default_net -v "$(pwd)":/app -w /app \
  -e DATABASE_HOST=event-flow-database -e DATABASE_PORT=5432 \
  --env-file .env node:22.12.0 npm run migration:run
```

## Instalação e execução

### Com Docker

```bash
$ docker-compose up -d --build
```

### Sem Docker

```bash
# Instalar dependencias
$ npm install

# Desenvolvimento
$ npm run start

# Desenvolvimento (Watch Mode)
$ npm run start:dev

# Produção
$ npm run start:prod
```

## Criando e executando migrações

```bash
# Executar migrações pendentes
$ npm run migration:run

# Criar novas migrações com base nas mudanças nas entidades
$ npm run migration:generate -name=NOME_DA_MIGRATION

# Criar novas migrações sem nenhum conteúdo
$ npm run migration:generate:clear -name=NOME_DA_MIGRATION

# Revertar última migração executada
$ npm run migration:revert
```

## Criando e executando seeds

```bash
# Executar seeds pendentes
$ npm run seed:run

# Criar novas seeds
$ npm run seed:create --name=NOME_DA_SEED
```

### Dados de demonstração (seeds automáticas)

Ao rodar `npm run seed:run`, o sistema popula:

| Seed        | Conteúdo                                                            |
| ----------- | ------------------------------------------------------------------- |
| ability     | Permissões (USER, ROLE, EVENTS, TICKET_TYPES, ORDERS, CHECKIN)      |
| role        | Perfis Master, Admin, Usuário                                       |
| user        | `master@email.com` / `master1234` e `admin@email.com` / `admin1234` |
| event       | 3 eventos (2 ativos, 1 inativo)                                     |
| ticket-type | 6 tipos de ingresso distribuídos nos eventos                        |
| order       | 4 pedidos (pago, pendente, cancelado)                               |
| ticket      | 4 ingressos com QR code e códigos fixos para check-in               |

**Códigos para testar check-in:** `EVF-SEED000001`, `EVF-SEED000002`, `EVF-SEED000003`, `EVF-SEED000004`

As seeds são idempotentes — rodar novamente não duplica registros.

## Configurações de VSCode recomendadas:

```json

"editor.formatOnSave": true,
"prettier.requireConfig": true,
"editor.codeActionsOnSave": {
  "source.fixAll.eslint": true
}

```

## Criadores do Sistema

Este sistema foi desenvolvido por:

- Arthur Ghizi
- Gabriel Jorge Lóh
- Gabriel Boelter
- João Vitor Figueiredo
