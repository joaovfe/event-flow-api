# Auditoria de Ações Administrativas — Design Patterns Decorator + Observer

> Documento de apoio para apresentação acadêmica. Descreve os dois Design
> Patterns (GoF) utilizados para implementar a trilha de auditoria do
> EventFlow: **Decorator** (estrutural) e **Observer** (comportamental).

## Sumário

1. [Contexto e problema](#1-contexto-e-problema)
2. [Por que Design Patterns (e por que esses dois)](#2-por-que-design-patterns-e-por-que-esses-dois)
3. [Decorator Pattern](#3-decorator-pattern)
4. [Observer Pattern](#4-observer-pattern)
5. [Como os dois patterns se combinam no EventFlow](#5-como-os-dois-patterns-se-combinam-no-eventflow)
6. [Fluxo completo passo a passo](#6-fluxo-completo-passo-a-passo)
7. [Mapeamento de arquivos](#7-mapeamento-de-arquivos)
8. [Modelo de dados — `audit_logs`](#8-modelo-de-dados--audit_logs)
9. [Justificativa técnica (princípios SOLID)](#9-justificativa-técnica-princípios-solid)
10. [Vantagens da solução](#10-vantagens-da-solução)
11. [Como usar e como estender](#11-como-usar-e-como-estender)
12. [Trade-offs e alternativas consideradas](#12-trade-offs-e-alternativas-consideradas)
13. [Como testar manualmente](#13-como-testar-manualmente)
14. [Referências](#14-referências)

---

## 1. Contexto e problema

O EventFlow é uma plataforma de venda de ingressos construída em NestJS +
TypeORM. Usuários com perfil **Master** (ou com as *abilities* adequadas)
realizam ações administrativas sobre vários recursos do sistema:

- CRUD de **eventos** (criar, listar, editar, ativar/desativar, excluir);
- CRUD de **tipos de ingresso**;
- **Visualização de pedidos** (orders);
- **Check-in** de ingressos;
- CRUD de **usuários**;
- CRUD de **perfis (roles)** e **habilidades (abilities)**.

Até a implementação descrita neste documento, essas ações eram protegidas por
`AuthGuard` + `RoleGuard` + `AbilityGuard` (autenticação e autorização), mas
**não existia nenhum registro de "quem fez o quê, quando, e com que
resultado"**. Ou seja, havia controle de acesso, mas não havia **auditoria**.

O requisito era: registrar **todas** as ações administrativas, cobrindo as
quatro operações **CREATE, READ, UPDATE e DELETE**, contendo no mínimo:

- quem executou a ação (ator: id, nome, email, perfil);
- o que foi feito (ação + recurso administrativo);
- qual registro foi afetado (alvo);
- contexto da requisição (rota, método HTTP, IP, status de resposta);
- se a ação teve sucesso ou falhou;
- dados da requisição, **sem informações sensíveis** (senhas, tokens).

O grande risco de implementar isso "da forma direta" é o **espalhamento de
código repetido**: se cada `Service`/`Provider` precisasse chamar
manualmente um `AuditService.create(...)`, o código de auditoria ficaria
misturado com a regra de negócio em **dezenas de pontos** (5 endpoints por
módulo × 7 módulos administrativos), violando o Single Responsibility
Principle e tornando fácil esquecer de auditar uma rota nova.

Auditoria é um exemplo clássico de **cross-cutting concern**: um requisito
que atravessa várias camadas e módulos sem pertencer à lógica de negócio de
nenhum deles. A solução adotada usa dois Design Patterns para isolar essa
responsabilidade.

## 2. Por que Design Patterns (e por que esses dois)

Um *cross-cutting concern* como auditoria tem duas perguntas a responder:

1. **O quê** deve ser auditado, e com qual metadado (ação + recurso)?
   → Resposta: **Decorator**, um marcador declarativo aplicado na própria
   definição da rota.
2. **Quem** reage à ocorrência de uma ação auditável, e o que cada um faz
   com essa informação (persistir em banco? logar? notificar?)
   → Resposta: **Observer**, que desacopla "alguém percebeu que uma ação
   administrativa aconteceu" de "o que se faz a respeito".

Os dois patterns são complementares: o Decorator resolve a **declaração**
(estática, em tempo de definição de rota) e o Observer resolve a
**reação** (dinâmica, em tempo de execução). Nenhum dos dois, isolado,
resolveria o problema por completo:

- Só Decorator, sem Observer: o interceptor que lê o metadado ainda
  precisaria saber, "na mão", todos os lugares que devem ser notificados
  (banco, log, etc.), violando Open/Closed.
- Só Observer, sem Decorator: o interceptor emitiria evento para *toda*
  rota, sem diferenciar rotas administrativas de rotas públicas (ex.:
  checkout, validação de carrinho, listagem pública de eventos), ferindo o
  requisito de auditar apenas ações administrativas.

## 3. Decorator Pattern

### 3.1 Definição (GoF)

> "Anexa responsabilidades adicionais a um objeto dinamicamente. Decorators
> fornecem uma alternativa flexível à herança para estender funcionalidade."
> — Gamma, Helm, Johnson, Vlissides, *Design Patterns: Elements of Reusable
> Object-Oriented Software* (1994).

No GoF "clássico", o Decorator envolve um objeto com outro objeto da mesma
interface, adicionando comportamento sem alterar a classe original. No
ecossistema NestJS/TypeScript (e na maior parte dos frameworks modernos com
suporte a metadados via Reflection), essa ideia evoluiu para o **Decorator
de metadados**: uma função que anota uma classe, método ou parâmetro com
informação extra, lida posteriormente por outro componente (um Guard, um
Interceptor, um Pipe). A estrutura de "anexar uma responsabilidade sem
alterar o artefato original" é preservada — o que muda é o mecanismo
(metadados + reflexão, em vez de composição de objetos em runtime).

O próprio NestJS já usa esse estilo extensivamente: `@Controller`, `@Get`,
`@Injectable`, `@UseGuards` são todos decorators que anexam metadados lidos
por outras partes do framework.

### 3.2 Problema que resolve aqui

Sem o Decorator, marcar uma rota como "auditável, ação CREATE, recurso
EVENTS" exigiria uma das duas abordagens ruins:

- Codificar a lógica de auditoria **dentro do `Service`/`Provider`** —
  acopla regra de negócio a infraestrutura de observabilidade, e precisa
  ser repetida em cada operação;
- Manter uma **lista externa de rotas auditáveis** em algum arquivo de
  configuração — duplica informação que já está implícita no controller,
  ficando fácil dessincronizar.

O Decorator resolve isso colocando a marcação **junto da própria definição
da rota**, no mesmo lugar onde já se declaram outros metadados de acesso
(`roles`, `abilities`, `actions`).

### 3.3 Implementação no EventFlow

```ts
// src/core/audit/domain/decorators/audit.decorator.ts
export const AUDIT_KEY = 'audit';

export interface IAuditMetadata {
  resource: EAuditResource;
  action: EAuditAction;
  description?: string;
}

export const Audit = (metadata: IAuditMetadata) =>
  SetMetadata(AUDIT_KEY, metadata);
```

`Audit(...)` é um decorator de método que usa `SetMetadata` (próprio do
NestJS) para anexar um objeto `{ resource, action, description }` ao
handler da rota, sob a chave `'audit'`. Esse metadado é inerte até que algo
o leia — é exatamente a "responsabilidade adicional" do GoF, anexada sem
alterar o método decorado.

#### Integração transparente no builder `Endpoint`

O projeto já possui um builder central para declarar rotas —
[`Endpoint`](../src/core/base/decorators/endpoint.decorator.ts) — que
combina `@Get/@Post/@Put/@Delete`, Swagger (`@ApiOperation`/`@ApiResponse`),
`@Roles` e `@Abilities` em uma única chamada (`Endpoint.get({...})`,
`Endpoint.post({...})`, etc.). A auditoria foi conectada **nesse mesmo
ponto**, com uma regra de **auto-derivação**:

```ts
// src/core/base/decorators/endpoint.decorator.ts
if (audit) {
  decorators.push(
    this.defineAudit({
      resource: EAuditResource[audit.resource],
      action: EAuditAction[audit.action],
      description: audit.description ?? description,
    }),
  );
} else if (abilities?.length && actions?.length) {
  // Toda rota que já declara abilities + actions é automaticamente
  // auditável — sem precisar adicionar @Audit manualmente.
  decorators.push(
    this.defineAudit({
      resource: EAuditResource[abilities[0]],
      action: EAuditAction[actions[0]],
      description,
    }),
  );
}
```

Isso tem um efeito prático importante: os módulos de **eventos, tipos de
ingresso, pedidos e check-in** já declaravam `abilities: ['EVENTS']` e
`actions: ['CREATE']` (por exemplo) para fins de autorização — e passaram a
ser **auditados automaticamente, sem alterar uma linha nesses arquivos de
rota**, porque as chaves de `EAbilityReference`/`Action` (`USER`, `ROLE`,
`EVENTS`, `TICKET_TYPES`, `ORDERS`, `CHECKIN`, `CREATE`/`READ`/`UPDATE`/`DELETE`)
foram espelhadas nos enums `EAuditResource`/`EAuditAction`.

Para os módulos de **usuário, perfil (role) e habilidade (ability)**, que
não usam `abilities`/`actions` (são protegidos apenas por `AuthGuard`),
o campo `audit` foi adicionado explicitamente em cada endpoint, por
exemplo:

```ts
// src/modules/user/application/routes/default-user.route.ts
@Endpoint.post({
  url: '/',
  description: 'Criar um novo usuário',
  dtoName: 'CreateUserDTO',
  roles: [],
  actions: [],
  abilities: [],
  audit: { resource: 'USER', action: 'CREATE' },
  // ...
})
public async create(@Body() dto: CreateUserDTO, @AuthUser() authUser: UserEntity) {
  return await this.service.create.execute({ dto, authUser });
}
```

Rotas **públicas** (ex.: `POST /api/orders/checkout`,
`GET /api/events/public`, `POST /api/orders/public/validate-cart`) não
declaram `abilities`/`actions` nem `audit` — e por isso **não são
auditadas**, conforme o requisito ("ações administrativas", não ações de
clientes finais).

## 4. Observer Pattern

### 4.1 Definição (GoF)

> "Define uma dependência um-para-muitos entre objetos, de forma que quando
> um objeto muda de estado, todos os seus dependentes são notificados e
> atualizados automaticamente." — GoF, 1994.

O papel **Subject** (ou *Publisher*) mantém uma lista de **Observers**
(*Subscribers*) e os notifica de eventos, sem precisar conhecer
concretamente quem são ou o que cada um faz com a notificação.

### 4.2 Problema que resolve aqui

Depois que o `AuditInterceptor` identifica (via Decorator) que uma rota é
auditável e captura os dados da requisição/resposta, **alguma coisa**
precisa reagir a isso. No EventFlow, hoje existem duas reações:

1. Persistir a ação na tabela `audit_logs` (consulta futura, relatórios);
2. Escrever uma linha no logger da aplicação (observabilidade imediata,
   container logs).

Se o interceptor chamasse diretamente `auditService.create(...)` e
`logger.log(...)`, ele estaria **acoplado** a cada consumidor possível da
informação de auditoria. Adicionar um terceiro consumo no futuro (por
exemplo, publicar em uma fila para um SIEM externo, ou disparar um alerta
quando uma ação sensível falha) exigiria **modificar o interceptor**,
violando o princípio Open/Closed.

O Observer resolve isso: o interceptor apenas **emite um evento**
(`AuditEvent`) e não sabe — nem precisa saber — quantos ou quais listeners
existem.

### 4.3 Implementação no EventFlow

O mecanismo de Observer escolhido é o `EventEmitter2` do pacote
`@nestjs/event-emitter`, que é a forma idiomática de implementar Observer
no ecossistema NestJS (o próprio `EventEmitter2` é o Subject; decorators
`@OnEvent` marcam métodos como Observers).

**Subject (publisher):**

```ts
// src/core/audit/domain/interceptors/audit.interceptor.ts
@Injectable()
export class AuditInterceptor implements NestInterceptor {
  public constructor(
    private readonly reflector: Reflector,
    private readonly eventEmitter: EventEmitter2,
  ) {}

  public intercept(context: ExecutionContext, next: CallHandler) {
    const metadata = this.reflector.getAllAndOverride<IAuditMetadata>(
      AUDIT_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!metadata) {
      return next.handle(); // rota não auditável: passthrough
    }

    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      tap((response) => {
        const statusCode = context.switchToHttp().getResponse().statusCode;
        this.publish(metadata, request, response, statusCode, true);
      }),
      catchError((error) => {
        const statusCode = error?.getStatus?.() ?? 500;
        this.publish(metadata, request, undefined, statusCode, false);
        throw error; // a auditoria nunca engole o erro original
      }),
    );
  }

  private publish(metadata, request, response, statusCode, success) {
    const user = request.user;
    this.eventEmitter.emit(
      AUDIT_EVENT,
      new AuditEvent({
        action: metadata.action,
        resource: metadata.resource,
        description: metadata.description ?? `${metadata.action} ${metadata.resource}`,
        actorId: user?.id,
        actorName: user?.name,
        actorEmail: user?.email,
        actorRole: user?.role?.reference,
        targetId: this.resolveTargetId(request, response),
        httpMethod: request.method,
        path: request.path,
        statusCode,
        success,
        ipAddress: request.ip,
        metadata: this.sanitize({
          params: request.params,
          query: request.query,
          body: request.body,
        }),
      }),
    );
  }
}
```

Pontos relevantes desse Subject:

- É registrado **globalmente** como `APP_INTERCEPTOR` (em
  [`audit.module.ts`](../src/core/audit/audit.module.ts)), ou seja, passa
  por **toda** requisição da aplicação — mas faz nada (`return
  next.handle()`) se não houver metadado `@Audit`, então o custo em rotas
  não administrativas é mínimo (uma leitura de metadado via `Reflector`).
- Usa `tap()`/`catchError()` do RxJS para capturar **tanto sucesso quanto
  falha** — uma tentativa de ação administrativa que falhou (ex.: tentar
  criar um usuário com email duplicado) também é uma informação de
  auditoria relevante (`success: false`, `statusCode: 409`).
- `resolveTargetId()` tenta extrair o identificador do registro afetado a
  partir de `request.params.id` (rotas de update/delete) ou de `id`/`uuid`
  na resposta (rotas de create).
- `sanitize()` remove campos sensíveis (`password`, `newPassword`,
  `oldPassword`, `token`, `refreshToken`) de `params`/`query`/`body` antes
  de persistir, via um `replacer` de `JSON.stringify`.

**Observers (subscribers):**

```ts
// src/core/audit/domain/listeners/persist-audit.listener.ts
@Injectable()
export class PersistAuditListener {
  public constructor(private readonly auditService: AuditService) {}

  @OnEvent(AUDIT_EVENT)
  public async handle(event: AuditEvent): Promise<void> {
    await this.auditService.create.execute({ event });
  }
}
```

```ts
// src/core/audit/domain/listeners/log-audit.listener.ts
@Injectable()
export class LogAuditListener {
  private readonly logger = new Logger('Audit');

  @OnEvent(AUDIT_EVENT)
  public handle(event: AuditEvent): void {
    const actor = event.actorEmail ?? 'usuário anônimo';
    const result = event.success ? 'sucesso' : 'falha';
    this.logger.log(
      `[${result}] ${actor} executou ${event.action} em ${event.resource} via ${event.httpMethod} ${event.path} (status ${event.statusCode})`,
    );
  }
}
```

Os dois listeners são **totalmente independentes** entre si: nenhum dos
dois conhece o outro, nenhum dos dois conhece o `AuditInterceptor`, e
ambos só conhecem o contrato `AuditEvent`. Isso foi verificado em testes
manuais — ao disparar uma ação administrativa, o log abaixo aparece no
console (`LogAuditListener`) **ao mesmo tempo** em que a linha é persistida
em `audit_logs` (`PersistAuditListener`):

```
[Audit] [sucesso] master@email.com executou CREATE em EVENTS via POST /api/events (status 201)
[Audit] [falha] master@email.com executou CREATE em USER via POST /api/users (status 409)
```

## 5. Como os dois patterns se combinam no EventFlow

```
┌──────────────────────────────────────────────────────────────────────┐
│                         Requisição HTTP                              │
│              (ex.: POST /api/events, PUT /api/users/:id)             │
└───────────────────────────────┬────────────────────────────────────-─┘
                                 ▼
                 AuthGuard → RoleGuard → AbilityGuard
                 (autenticação/autorização, já existentes)
                                 ▼
┌────────────────────────────────────────────────────────────────────-──┐
│  @Audit({ resource, action })           <-- DECORATOR                │
│  aplicado em Endpoint.post/get/put/delete({ ..., audit / abilities }) │
│  (explícito OU auto-derivado de abilities+actions)                   │
└────────────────────────────────┬───────────────────────────────────-──┘
                                 ▼
┌──────────────────────────────────────────────────────────────────────┐
│  AuditInterceptor (Subject/Publisher)        <-- OBSERVER (emissor)  │
│  1. Reflector lê o metadado 'audit' (se ausente: passthrough)        │
│  2. Executa o handler real (Controller → Service → Provider)         │
│  3. No tap()/catchError(), monta um AuditEvent e EMITE 'audit.action' │
└────────────────────────────────┬──────────────────────────────────-───┘
                                 ▼  EventEmitter2.emit('audit.action', evt)
            ┌────────────────────┴────────────────────┐
            ▼                                          ▼
┌─────────────────────────────┐        ┌────────────────────────────────┐
│ PersistAuditListener         │        │ LogAuditListener                │
│ (Observer 1)  <-- OBSERVER   │        │ (Observer 2)  <-- OBSERVER      │
│ @OnEvent('audit.action')     │        │ @OnEvent('audit.action')        │
│ grava AuditLogEntity no banco│        │ escreve no Logger da aplicação  │
└─────────────────────────────┘        └────────────────────────────────┘
```

O Decorator decide **estaticamente**, em tempo de definição de rota, *o
que* vai gerar um evento de auditoria. O Observer decide
**dinamicamente**, em tempo de execução, *quem* reage a esse evento e
*como*. Um novo recurso administrativo só precisa do Decorator (ou da
auto-derivação); um novo destino para a informação de auditoria só precisa
de um novo Observer — nenhum dos dois exige tocar no outro.

## 6. Fluxo completo passo a passo

Exemplo: `POST /api/events` (criar evento), executado pelo usuário Master.

1. `AuthGuard` valida o JWT e popula `request.user` com o `UserEntity`
   completo (incluindo `role`).
2. `AbilityGuard`/`RoleGuard` confirmam que o usuário tem a *ability*
   `EVENTS` com a *action* `CREATE`.
3. O `DefaultEventController.create()` é decorado com
   `Endpoint.post({ abilities: ['EVENTS'], actions: ['CREATE'], ... })`,
   o que faz o builder `Endpoint` auto-derivar e aplicar
   `@Audit({ resource: EAuditResource.EVENTS, action: EAuditAction.CREATE })`.
4. O `AuditInterceptor`, registrado globalmente, lê esse metadado via
   `Reflector.getAllAndOverride` e decide auditar a requisição.
5. O handler real executa (`EventService.create.execute(dto)`), criando o
   evento no banco e retornando a entidade criada (com `id`/`uuid`).
6. No `tap()` de sucesso, o interceptor monta um `AuditEvent` com
   `actorId/actorName/actorEmail/actorRole` (de `request.user`),
   `targetId` (do `id` da resposta), `statusCode: 201`, `success: true`, e
   `metadata` sanitizado (`params`, `query`, `body` sem campos sensíveis).
7. `eventEmitter.emit('audit.action', auditEvent)` notifica os
   observers registrados.
8. `PersistAuditListener` grava a linha em `audit_logs`.
9. `LogAuditListener` escreve a linha equivalente no console.
10. A resposta HTTP original (o evento criado) chega ao cliente
    inalterada — a auditoria é inteiramente transparente para quem chamou
    a API.

Se o passo 5 lançar uma exceção (ex.: validação de negócio falhar), o
`catchError()` do interceptor publica o mesmo `AuditEvent` com
`success: false` e o `statusCode` do erro, e **relança a exceção original**
— a auditoria nunca interfere no comportamento de erro da aplicação.

## 7. Mapeamento de arquivos

| Camada / responsabilidade            | Arquivo                                                                                                       |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------- |
| Enums de ação/recurso                 | `src/core/audit/domain/enums/audit-action.enum.ts`, `audit-resource.enum.ts`                                     |
| Entidade/tabela                       | `src/core/audit/domain/entities/audit-log.entity.ts`                                                             |
| Repositório                           | `src/core/audit/domain/repositories/audit-log.repository.ts`                                                    |
| Evento (payload do Observer)          | `src/core/audit/domain/events/audit.event.ts`                                                                    |
| **Decorator** `@Audit`                | `src/core/audit/domain/decorators/audit.decorator.ts`                                                            |
| **Subject** (Observer/publisher)      | `src/core/audit/domain/interceptors/audit.interceptor.ts`                                                        |
| **Observer 1** (persistência)         | `src/core/audit/domain/listeners/persist-audit.listener.ts`                                                      |
| **Observer 2** (log)                  | `src/core/audit/domain/listeners/log-audit.listener.ts`                                                          |
| Serviço + providers                   | `src/core/audit/domain/services/audit.service.ts`, `services/providers/*.provider.ts`                            |
| Endpoint de consulta                  | `src/core/audit/application/{controllers,decorators,routes}/*` → `GET /api/audit-logs`                          |
| Módulo                                | `src/core/audit/audit.module.ts`                                                                                  |
| Integração no builder de rotas        | `src/core/base/decorators/endpoint.decorator.ts` (campo `audit`, auto-derivação)                                 |
| Registro global                       | `src/app.module.ts` (`EventEmitterModule.forRoot()`, `AuditModule`)                                              |
| Rotas com `audit` explícito           | `src/modules/user/.../default-user.route.ts`, `src/modules/role/.../role.route.ts`, `.../ability.route.ts`       |
| Rotas auditadas por auto-derivação    | módulos de evento, tipo de ingresso, pedido e check-in (já tinham `abilities`+`actions`, nenhuma alteração)      |
| Migration                             | `src/core/database/migrations/<timestamp>-create-audit-logs-table.ts`                                            |

## 8. Modelo de dados — `audit_logs`

| Coluna         | Tipo                              | Observação                                                |
| -------------- | --------------------------------- | ---------------------------------------------------------- |
| `id`, `uuid`   | serial / varchar(36)              | Herdados de `BaseEntity`                                   |
| `action`       | enum (`CREATE`,`READ`,`UPDATE`,`DELETE`) |                                                        |
| `resource`     | enum (`USER`,`ROLE`,`ABILITY`,`EVENTS`,`TICKET_TYPES`,`ORDERS`,`CHECKIN`) |                              |
| `description`  | varchar(255)                      | Descrição humana da ação, herdada da definição da rota      |
| `actor_id`     | int, nullable                     | Id do usuário autenticado (nulo em ações anônimas/falha de auth) |
| `actor_name`   | varchar(50), nullable             | Nome do ator **no momento da ação**                         |
| `actor_email`  | varchar(256), nullable            | Email do ator no momento da ação                            |
| `actor_role`   | varchar(50), nullable             | Referência do perfil no momento da ação                     |
| `target_id`    | varchar(100), nullable            | Id/uuid do registro afetado                                  |
| `http_method`  | varchar(10)                       | `GET`, `POST`, `PUT`, `DELETE`...                            |
| `path`         | varchar(255)                      | Caminho da rota                                              |
| `status_code`  | int                                | Código HTTP da resposta                                      |
| `success`      | boolean (default `true`)          | Sucesso ou falha da ação                                     |
| `ip_address`   | varchar(45), nullable             | IP de origem                                                  |
| `metadata`     | jsonb, nullable                   | `{ params, query, body }` **sanitizado**                     |
| `created_at`, `updated_at`, `deleted_at` | timestamp       | Herdados de `BaseEntity`                                     |

Os campos `actor_*` são **desnormalizados** (cópia do nome/email/perfil no
momento da ação, em vez de apenas uma FK para `users`) intencionalmente:
uma trilha de auditoria deve preservar o estado histórico de quem fez a
ação, mesmo que o usuário seja posteriormente renomeado, tenha o perfil
alterado, ou seja excluído.

## 9. Justificativa técnica (princípios SOLID)

- **Single Responsibility Principle (SRP).** Antes: a responsabilidade de
  "saber que uma ação administrativa ocorreu" estaria misturada com a
  lógica de negócio de cada `Service`. Depois: o `AuditInterceptor` tem a
  única responsabilidade de detectar e publicar; cada `Listener` tem a
  única responsabilidade de reagir de uma forma específica (persistir,
  logar); os `Service`/`Provider` de negócio (ex.: `EventService`) não
  sabem que estão sendo auditados.
- **Open/Closed Principle (OCP).** Adicionar um novo destino de auditoria
  (ex.: enviar para um serviço de SIEM, disparar um webhook em falhas)
  significa **criar um novo `@OnEvent(AUDIT_EVENT)`**, sem modificar o
  `AuditInterceptor`, os listeners existentes, ou qualquer rota. Da mesma
  forma, tornar uma nova rota auditável é **fechado para modificação** do
  interceptor — só é necessário declarar `abilities`+`actions` (já
  convencional no projeto) ou `audit` explícito.
- **Dependency Inversion Principle (DIP).** O `AuditInterceptor` depende
  apenas da abstração `EventEmitter2` (publica um evento nomeado), não de
  classes concretas como `AuditService` ou `Logger`. Quem depende da
  concretude é cada *Listener*, que decide como reagir.
- **Interface Segregation (indireta).** O contrato entre publisher e
  observers é só o shape de `AuditEvent` — nenhum observer precisa
  conhecer detalhes de implementação do interceptor (request HTTP,
  `ExecutionContext` do Nest, etc.), apenas o payload já normalizado.

## 10. Vantagens da solução

- **Zero ruído na regra de negócio.** Nenhum `Service`/`Provider` de
  domínio (evento, ticket, pedido, usuário, etc.) precisou ser alterado
  para ganhar auditoria — toda a lógica vive em `src/core/audit/` e no
  builder `Endpoint`.
- **Extensibilidade comprovada.** Adicionar um segundo observer
  (`LogAuditListener`) ao lado do primeiro (`PersistAuditListener`) não
  exigiu alterar nenhuma linha do `AuditInterceptor` — apenas registrar a
  nova classe em `audit.module.ts`.
- **Cobertura automática de rotas futuras.** Qualquer rota administrativa
  nova que já declare `abilities`+`actions` (convenção já usada no
  projeto) é auditada **sem código adicional**.
- **Captura sucesso e falha.** Diferente de uma auditoria feita "no fim"
  de cada `Provider` (que normalmente só roda se não houver exceção), o
  interceptor usa `tap`/`catchError` do RxJS para capturar **ambos** os
  casos, dando visibilidade também de tentativas de ação que falharam
  (ex.: tentativa de duplicar um usuário).
- **Segurança por padrão.** A sanitização de campos sensíveis
  (`password`, `token`, etc.) acontece em um único lugar
  (`AuditInterceptor.sanitize`), reduzindo o risco de uma rota nova
  vazar dados sensíveis para a trilha de auditoria.
- **Testabilidade.** Cada peça é testável isoladamente: o decorator é uma
  função pura que retorna metadados; o interceptor pode ser testado
  mockando `Reflector`/`EventEmitter2`; cada listener pode ser testado
  unitariamente recebendo um `AuditEvent` fake.
- **Sem acoplamento a infraestrutura de persistência específica.** Como o
  `PersistAuditListener` é só mais um observer, trocar a forma de
  persistência (ex.: mandar para outro banco, para Elasticsearch) não
  afeta o resto do fluxo.

## 11. Como usar e como estender

### 11.1 Tornar uma rota administrativa nova auditável

Se a rota já declara `abilities` e `actions` (padrão usado em
evento/ticket-type/order/check-in), **nada precisa ser feito** — a
auditoria é automática.

Se a rota não usa `abilities`/`actions` (como usuário/role/ability), basta
adicionar o campo `audit` na chamada de `Endpoint.get/post/put/delete`:

```ts
@Endpoint.delete({
  url: '/:id',
  description: 'Apagar um recurso',
  audit: { resource: 'USER', action: 'DELETE' }, // <- linha nova
  // ...
})
```

`resource` deve ser uma chave de `EAuditResource`
(`src/core/audit/domain/enums/audit-resource.enum.ts`) e `action` uma
chave de `EAuditAction`
(`src/core/audit/domain/enums/audit-action.enum.ts`). Se um novo tipo de
recurso administrativo for criado no sistema, basta adicionar uma nova
chave a `EAuditResource`.

### 11.2 Adicionar um novo observer (ex.: alertar em falhas críticas)

Criar uma nova classe em `src/core/audit/domain/listeners/`:

```ts
@Injectable()
export class AlertOnFailureListener {
  @OnEvent(AUDIT_EVENT)
  public handle(event: AuditEvent): void {
    if (!event.success && event.action === EAuditAction.DELETE) {
      // disparar notificação, webhook, etc.
    }
  }
}
```

E registrá-la em `providers` de `audit.module.ts`. **Nenhum outro arquivo
precisa ser tocado.**

### 11.3 Consultar a trilha de auditoria

`GET /api/audit-logs` (restrito ao perfil `MASTER`), com filtros opcionais
via `FindManyAuditLogDTO`: `search` (na descrição), `action`, `resource`,
além da paginação padrão do projeto (`page`, `limit`). Esse endpoint **não
é auditado** — leituras da própria trilha não geram ruído recursivo.

## 12. Trade-offs e alternativas consideradas

| Alternativa                                              | Por que foi descartada                                                                                                                       |
| ---------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| **Strategy** (uma estratégia de auditoria por módulo)      | Resolveria "como auditar", mas não "quando/onde" — ainda precisaria de algo cross-cutting (Interceptor) para acioná-la em cada rota; não eliminaria a necessidade do Observer, só adicionaria complexidade sem ganho claro aqui. |
| **Logar diretamente em cada `Service`/`Provider`**         | Simples de entender, mas viola SRP/OCP: cada novo recurso administrativo exigiria lembrar de adicionar a chamada manualmente; alto risco de inconsistência e esquecimento. |
| **TypeORM Subscribers** (`@EventSubscriber`)                | Captura eventos de persistência (`afterInsert`, `afterUpdate`), mas **não tem acesso ao contexto HTTP** (quem é o ator, qual rota, qual IP) nem distingue leitura administrativa de leitura pública — informação essencial para este requisito. |
| **Middleware Express genérico**                            | Roda antes do roteamento do Nest ter resolvido o handler e seus metadados de forma ergonômica; o Interceptor do Nest já resolve isso de forma nativa e dá acesso ao `ExecutionContext` (classe + handler), necessário para o `Reflector`. |
| **Decorator "clássico" por composição de objetos (sem metadados)** | Funcionaria para decorar `Service`s manualmente, mas exigiria reescrever a forma como os controllers chamam os services (envolvendo cada um em um wrapper), uma mudança muito mais invasiva do que anotar a rota. |

A combinação **Decorator de metadados + Observer via EventEmitter2** foi
escolhida por reaproveitar mecanismos **já idiomáticos do NestJS**
(`SetMetadata`/`Reflector`, `@nestjs/event-emitter`) e por já existir no
projeto um precedente direto: o builder `Endpoint` já decorava rotas com
metadados de autorização, e já existia um interceptor de referência
([`PrometheusInterceptor`](../src/core/metrics/domain/interceptors/prometheus-interceptor.ts))
demonstrando o padrão de interceptor global. A auditoria seguiu a mesma
"forma" para manter consistência arquitetural.

## 13. Como testar manualmente

```bash
# 1. Login como master
curl -X POST http://localhost:6200/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"master@email.com","password":"master1234"}'
# -> copiar o "token" da resposta

TOKEN="<token copiado>"

# 2. CREATE — cria um evento (gera audit_logs com action=CREATE, resource=EVENTS)
curl -X POST http://localhost:6200/api/events \
  -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" \
  -d '{"title":"Evento Teste","description":"...","location":"...","startDate":"2026-12-01T20:00:00.000Z","endDate":"2026-12-01T23:00:00.000Z"}'

# 3. READ / UPDATE / DELETE — repetir com GET /api/events/:id, PUT /api/events/:id, DELETE /api/events/:id

# 4. Consultar a trilha (somente MASTER)
curl http://localhost:6200/api/audit-logs?limit=20 -H "Authorization: Bearer $TOKEN"

# 5. Confirmar no log do container que o segundo observer também disparou
docker logs event-flow-api --since 5m | grep "\[Audit\]"
```

Validações importantes ao testar:

- O campo `metadata.body` **nunca** deve conter `password`/`token`.
- Tentativas que falham (ex.: email duplicado) também geram uma linha,
  com `success: false` e o `statusCode` do erro.
- `GET /api/audit-logs` não gera uma nova linha na própria tabela.
- Toda ação administrativa de evento/ticket-type/order/check-in/usuário/
  role/ability aparece na trilha, sem exceção.

## 14. Referências

- Gamma, E.; Helm, R.; Johnson, R.; Vlissides, J. *Design Patterns:
  Elements of Reusable Object-Oriented Software*. Addison-Wesley, 1994.
  (Capítulos Decorator e Observer)
- Documentação oficial do NestJS — [Interceptors](https://docs.nestjs.com/interceptors),
  [Custom decorators](https://docs.nestjs.com/custom-decorators),
  [Custom providers / Reflection](https://docs.nestjs.com/fundamentals/execution-context).
- Pacote [`@nestjs/event-emitter`](https://docs.nestjs.com/techniques/events)
  (wrapper oficial do NestJS sobre `eventemitter2`, usado como mecanismo
  de Observer neste projeto).
