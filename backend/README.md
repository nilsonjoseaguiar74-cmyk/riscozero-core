# Risco Zero Backend

Protótipo funcional do backend da plataforma Risco Zero, implementado como monólito modular NestJS com PostgreSQL e Prisma.

## Pré-requisitos

- Bun 1.3.14 ou compatível.
- Docker com Docker Compose v2.
- Porta local da API disponível, por padrão `3001`.
- Porta local do PostgreSQL disponível, por padrão `5432`.

O frontend permanece na raiz do repositório. Esta versão não depende de Supabase, Lovable Cloud, Redis, MinIO ou serviços externos.

## Configuração local

```bash
cd backend
cp .env.example .env
```

Preencha obrigatoriamente:

- `DATABASE_URL`
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `JWT_ACCESS_SECRET`
- `DEMO_ADMIN_PASSWORD`
- `DEMO_MANAGER_PASSWORD`
- `DEMO_SALES_PASSWORD`
- `DEMO_TRAFFIC_PASSWORD`
- `DEMO_DEVELOPER_PASSWORD`

Também podem ser configurados:

- `E2E_DATABASE_URL` (deve apontar para um banco cujo nome termina em `_e2e`)
- `PORT`
- `API_PREFIX`
- `FRONTEND_ORIGIN`
- `POSTGRES_PORT`
- `JWT_ACCESS_TTL_SECONDS`
- `REFRESH_TOKEN_TTL_DAYS`
- `REFRESH_COOKIE_NAME`
- `COOKIE_SECURE`
- `SWAGGER_ENABLED`

Use segredos locais próprios. O arquivo `.env` é ignorado pelo Git e não deve ser publicado.

## Iniciar somente o PostgreSQL

```bash
docker compose up -d postgres
docker compose ps postgres
```

O Compose contém apenas a API e o PostgreSQL. Para desenvolvimento, o PostgreSQL é publicado exclusivamente em `127.0.0.1`.

## Prisma e banco de dados

Validar e gerar o cliente:

```bash
bunx prisma validate
bunx prisma generate
```

Aplicar migrations existentes:

```bash
bunx prisma migrate deploy
```

Popular os dados demonstrativos:

```bash
bunx prisma db seed
```

O seed é determinístico, usa IDs fixos e dados fictícios. As senhas são lidas exclusivamente das variáveis de ambiente.

## Usuários demonstrativos

| E-mail | Perfil | Variável da senha |
|---|---|---|
| `admin@riscozero.demo` | Administrador | `DEMO_ADMIN_PASSWORD` |
| `gestor@riscozero.demo` | Gestor | `DEMO_MANAGER_PASSWORD` |
| `comercial@riscozero.demo` | Comercial | `DEMO_SALES_PASSWORD` |
| `trafego@riscozero.demo` | Gestor de tráfego | `DEMO_TRAFFIC_PASSWORD` |
| `dev@riscozero.demo` | Desenvolvedor | `DEMO_DEVELOPER_PASSWORD` |

Nenhuma senha demonstrativa é registrada no código ou exibida pelo seed.

## Executar a API

```bash
bun run dev
```

Para executar sem watch:

```bash
bun run build
bun run start
```

Por padrão, a API usa `http://localhost:3001/api/v1`.

## Swagger e health checks

Em desenvolvimento, com `SWAGGER_ENABLED=true`:

- Swagger: `http://localhost:3001/api/v1/docs`
- Liveness: `GET http://localhost:3001/api/v1/health/live`
- Readiness: `GET http://localhost:3001/api/v1/health/ready`

Swagger não é habilitado quando `NODE_ENV=production`.

## Testes e qualidade

Testes unitários, sem banco:

```bash
bun run test
```

Os E2E exigem PostgreSQL e um banco isolado. Exemplo de preparação local:

```bash
docker compose exec -T postgres createdb -U "$POSTGRES_USER" riscozero_e2e
DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@localhost:${POSTGRES_PORT:-5432}/riscozero_e2e?schema=public" bunx prisma migrate deploy
```

Depois execute:

```bash
bun run test:e2e
```

O runner usa `E2E_DATABASE_URL` quando ela está definida. Caso contrário, deriva automaticamente de `DATABASE_URL` acrescentando `_e2e` ao nome do banco. Antes de qualquer limpeza, há uma proteção que recusa bancos cujo nome não termina em `_e2e`.

Demais validações:

```bash
bun run lint
bun run build
```

## Encerrar os serviços locais

Encerre somente os serviços deste Compose:

```bash
docker compose stop api postgres
```

Não use remoção global de containers ou volumes. Não use `docker compose down -v` se quiser preservar o banco local.

## Escopo implementado

- Health checks.
- JWT e refresh token HttpOnly.
- RBAC para os cinco perfis.
- Captação pública e idempotente de leads.
- CRM, atribuição, atividades, tarefas e etapas.
- Dashboard comercial calculado do PostgreSQL.
- Auditoria básica.
- Associados, veículos e adesões demonstrativos somente leitura.
- Métricas de tráfego demonstrativas.
- Catálogo de integrações sem conexões fictícias.

## Limitações e ampliação futura

Ainda não estão implementados:

- recuperação de senha, MFA e convites por e-mail;
- financeiro operacional, cobranças, rateios e inadimplência;
- ocorrências, assistências, documentos, uploads e vistorias completos;
- Redis, BullMQ, MinIO e workers;
- WhatsApp, Google Ads, Meta Ads, Analytics e conversões offline reais;
- sincronização SIPROV ou SGA;
- webhooks e CSV operacionais;
- backups, monitoramento avançado e deploy de produção.

As integrações reais dependem de documentação técnica, credenciais e autorização dos fornecedores. O catálogo atual não simula conexões bem-sucedidas.
