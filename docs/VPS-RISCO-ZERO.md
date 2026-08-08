# Referência da VPS — Risco Zero

Documento operacional para evitar perda de contexto durante a preparação do deploy. Não registrar aqui senhas, chaves privadas, tokens ou conteúdo de arquivos `.env`.

## Endereço público confirmado

- Aplicação: <https://riscozero.vitorads.site/>
- Host: `riscozero.vitorads.site`
- Nome do servidor: `srv993737`
- IPv4 observado em 8 de agosto de 2026: `72.60.147.56`
- IPv6 observado: `2a02:4780:66:b26e::1`
- Sistema operacional confirmado: Ubuntu 22.04.5 LTS
- Kernel confirmado: Linux 5.15.0-181-generic x86_64
- Proxy público identificado: `nginx/1.18.0 (Ubuntu)`
- Protocolo observado: HTTP/2
- HTTPS: certificado Let's Encrypt para `riscozero.vitorads.site`
- Validade observada do certificado: 5 de agosto de 2026 a 3 de novembro de 2026

O IP, a versão do servidor e a validade do certificado são informações mutáveis. Confirmá-las novamente antes de qualquer intervenção.

## Retrato operacional recebido

Estado informado pelo próprio servidor em 7 de agosto de 2026, às 23:44:18 (UTC-3):

- Carga do sistema: `0.87`.
- Processos: `393`.
- Disco raiz: `65,4%` de `193,65 GB` utilizado.
- Memória: `55%` utilizada.
- Swap: `0%` utilizada.
- Usuários conectados naquele momento: `0`.
- Um processo zumbi detectado.
- 17 atualizações disponíveis imediatamente.
- 30 atualizações adicionais vinculadas ao Ubuntu ESM Apps.
- Reinicialização do sistema requerida.
- Console web anunciado pelo servidor na porta `9090`.

Esses números são um retrato pontual, não configuração permanente. Antes do deploy, identificar o processo zumbi, revisar as atualizações e programar a reinicialização em janela de manutenção. Não reiniciar antes de confirmar backups, serviços ativos e mecanismo de retorno.

O console web foi anunciado como `srv993737.hstgr.cloud:9090` e `72.60.147.56:9090`. Confirmar se ele é necessário; caso contrário, restringir a porta 9090 por firewall. Se necessário, limitar o acesso a IPs administrativos ou VPN e validar o certificado usado pelo console.

## Estado público observado

- `/` responde `200` e serve a aplicação Risco Zero.
- `/login` responde `200`.
- `/api/v1/health/ready` responde `404` pela aplicação web.
- `/api/v1/site-content/unit` responde `404` pela aplicação web.
- O HTML público ainda contém a versão anterior do hero, sem a imagem de fundo editável implementada na branch `feat/gestao-conteudo-funcional`.

Isso indica que o frontend está publicado no subdomínio, mas o proxy público ainda não encaminha `/api/v1` para a API NestJS — ou a API ainda não está implantada nessa VPS. Esta conclusão é uma inferência a partir das respostas públicas e deve ser confirmada no servidor.

## Implantação antiga confirmada na VPS

- Diretório-base: `/opt/riscozero`.
- Link ativo: `/opt/riscozero/current`.
- Release ativa: `/opt/riscozero/releases/06c78c7c93993d67a6539f3c77dec2f6aa4c3372`.
- Commit ativo: `06c78c7c93993d67a6539f3c77dec2f6aa4c3372`.
- Branch observada: `integration/frontend-backend`.
- Árvore de trabalho observada sem alterações locais.
- Serviço: `riscozero-frontend.service`.
- Arquivo da unidade: `/etc/systemd/system/riscozero-frontend.service`.
- Processo: Node executando `/opt/riscozero/current/.output/server/index.mjs`.
- Usuário e grupo: `www-data`.
- Endereço interno: `127.0.0.1:4188`.
- Nginx: `riscozero.vitorads.site` encaminhado para `http://127.0.0.1:4188`.
- Arquivo Nginx ativo: `/etc/nginx/sites-enabled/riscozero.vitorads.site`.
- Logs exclusivos: `/var/log/nginx/riscozero-access.log` e `/var/log/nginx/riscozero-error.log`.
- HTTP nas portas 80/IPv6 redirecionado para HTTPS pelo bloco gerenciado pelo Certbot.
- Certificado: `/etc/letsencrypt/live/riscozero.vitorads.site/fullchain.pem`.
- Chave do certificado: `/etc/letsencrypt/live/riscozero.vitorads.site/privkey.pem` (não copiar nem versionar).
- O bloco HTTPS atual contém apenas `location /`; não existe encaminhamento para `/api/v1/`.
- Reinício automático: somente em falha, após 3 segundos.
- Limites: 768 MB de memória, 128 tarefas e 100% de uma CPU.

Proteções confirmadas no serviço: `NoNewPrivileges=true`, `PrivateTmp=true`, `PrivateDevices=true`, `ProtectHome=true` e `ProtectSystem=full`. O frontend atual não deve receber permissão de escrita ampla. A nova API e o volume persistente de uploads devem ficar isolados em serviço ou contêiner próprio, com acesso gravável limitado ao diretório de uploads.

O padrão de releases e o link `current` devem ser preservados. Uma nova versão deve ser construída em outro diretório e validada em portas temporárias antes da troca atômica do link. A release `06c78c7...` não deve ser alterada e será a referência imediata de rollback.

## Isolamento planejado para a nova versão

Portas propostas, observadas como livres no inventário de 7 de agosto de 2026:

- `127.0.0.1:4190`: frontend temporário para homologação local na VPS.
- `127.0.0.1:4191`: API NestJS do Risco Zero.
- `127.0.0.1:55434`: PostgreSQL do Risco Zero somente se for necessário publicar a porta no host; preferir acesso exclusivo pela rede interna do Compose.

Usar um nome de projeto Compose exclusivo, como `riscozero_prod`, e volumes com nomes próprios. Não reutilizar redes, bancos, Redis, portas ou volumes dos outros projetos.

Após a homologação, o frontend continuará no endereço interno `127.0.0.1:4188`. A única ampliação planejada no Nginx será uma localização específica `/api/v1/` apontando para `127.0.0.1:4191`; a localização `/` existente permanecerá apontando para `127.0.0.1:4188`.

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
