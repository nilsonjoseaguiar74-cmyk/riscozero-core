# Referência da VPS — Risco Zero

Documento operacional para evitar perda de contexto durante a preparação do deploy. Não registrar aqui senhas, chaves privadas, tokens ou conteúdo de arquivos `.env`.

## Endereço público confirmado

- Aplicação: <https://riscozero.vitorads.site/>
- Host: `riscozero.vitorads.site`
- IPv4 observado em 8 de agosto de 2026: `72.60.147.56`
- Proxy público identificado: `nginx/1.18.0 (Ubuntu)`
- Protocolo observado: HTTP/2
- HTTPS: certificado Let's Encrypt para `riscozero.vitorads.site`
- Validade observada do certificado: 5 de agosto de 2026 a 3 de novembro de 2026

O IP, a versão do servidor e a validade do certificado são informações mutáveis. Confirmá-las novamente antes de qualquer intervenção.

## Estado público observado

- `/` responde `200` e serve a aplicação Risco Zero.
- `/login` responde `200`.
- `/api/v1/health/ready` responde `404` pela aplicação web.
- `/api/v1/site-content/unit` responde `404` pela aplicação web.
- O HTML público ainda contém a versão anterior do hero, sem a imagem de fundo editável implementada na branch `feat/gestao-conteudo-funcional`.

Isso indica que o frontend está publicado no subdomínio, mas o proxy público ainda não encaminha `/api/v1` para a API NestJS — ou a API ainda não está implantada nessa VPS. Esta conclusão é uma inferência a partir das respostas públicas e deve ser confirmada no servidor.

## Topologia recomendada

Usar um único domínio público e encaminhar a API pelo Nginx reduz problemas de CORS e cookies:

```text
https://riscozero.vitorads.site/          -> frontend
https://riscozero.vitorads.site/api/v1/   -> API NestJS em 127.0.0.1:3001
```

O PostgreSQL deve permanecer acessível somente pela rede interna/localhost. O diretório de uploads deve estar em volume persistente e incluído no backup.

## Variáveis esperadas em produção

Valores públicos recomendados:

```dotenv
NODE_ENV=production
PORT=3001
API_PREFIX=api/v1
FRONTEND_ORIGIN=https://riscozero.vitorads.site
COOKIE_SECURE=true
SWAGGER_ENABLED=false
UPLOAD_DIR=/var/lib/riscozero/uploads
PUBLIC_UPLOAD_BASE_URL=https://riscozero.vitorads.site/api/v1/uploads
VITE_USE_MOCK_API=false
VITE_API_BASE_URL=/api/v1
```

As variáveis `DATABASE_URL`, `POSTGRES_PASSWORD` e `JWT_ACCESS_SECRET` devem ser definidas somente no gerenciador de segredos ou `.env` protegido da VPS. Nunca usar credenciais locais/E2E na produção.

## Regras mínimas do Nginx

- Manter HTTPS e redirecionar HTTP para HTTPS.
- Encaminhar `/api/v1/` para `http://127.0.0.1:3001/api/v1/`.
- Preservar `Host`, `X-Real-IP`, `X-Forwarded-For` e `X-Forwarded-Proto`.
- Permitir o tamanho necessário para uploads de imagem; o backend limita imagens da unidade a 5 MB.
- Não expor diretamente a porta do PostgreSQL.
- Manter fallback do frontend sem capturar as rotas `/api/v1/`.
- Revisar cabeçalhos HSTS, CSP, `X-Content-Type-Options` e `Referrer-Policy`; eles não apareceram na resposta pública inspecionada.

## Persistência e backup

- PostgreSQL: volume `postgres_data` ou equivalente, com backup automatizado e teste de restauração.
- Uploads: volume persistente montado em `/var/lib/riscozero/uploads` ou caminho equivalente.
- Fazer backup do banco e dos uploads como um conjunto consistente.
- Não executar `docker compose down -v` em produção.

## Checklist antes do deploy

1. Confirmar acesso autorizado à VPS e localizar a configuração efetiva do Nginx.
2. Registrar versões instaladas de Docker, Compose, Nginx e sistema operacional.
3. Fazer backup verificável do banco, uploads e configuração do proxy.
4. Confirmar espaço em disco e permissões do diretório de uploads.
5. Configurar os segredos de produção sem copiá-los para o Git.
6. Aplicar `prisma migrate deploy` antes de iniciar a nova API.
7. Subir PostgreSQL e API e validar `/api/v1/health/ready` internamente.
8. Configurar o proxy de `/api/v1/` e validar a rota publicamente.
9. Publicar o frontend com `VITE_USE_MOCK_API=false` e `VITE_API_BASE_URL=/api/v1`.
10. Testar login, 401, 403, Leads, BI, Tarefas, upload, hero, carrossel e avatar.
11. Confirmar persistência reiniciando os contêineres sem remover volumes.
12. Verificar renovação automática do certificado e monitoramento básico.

## Informações ainda necessárias

- Usuário e porta SSH autorizados.
- Diretório do projeto na VPS.
- Arquivo Compose/serviço systemd efetivamente usado.
- Caminho dos arquivos de configuração do Nginx.
- Provedor da VPS e política de snapshots/backups.
- Processo atual de deploy e rollback.
- Estado e localização do PostgreSQL de produção.
- Diretório real dos uploads e permissões do usuário da aplicação.

Essas informações devem ser coletadas por inspeção somente leitura na VPS antes de qualquer alteração.
