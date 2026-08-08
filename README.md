# Risco Zero Platform

Este é o comando mestre definitivo. Cole integralmente no Lovable e anexe a logo oficial no mesmo projeto.

Crie o frontend completo, profissional, responsivo e navegável da plataforma digital da Risco Zero Proteção Veicular.

O projeto deverá ser desenvolvido como uma aplicação frontend pronta para apresentação, validação e posterior integração com um backend próprio que será construído no VS Code utilizando NestJS, PostgreSQL e Prisma.

ESCOPO DESTA ENTREGA

Implemente exclusivamente:

Landing page pública.

Captação de leads.

Área administrativa.

CRM.

Dashboard e BI.

Área comercial.

Área de gestão de tráfego.

Central de integrações.

Gestão de usuários e permissões.

Configurações.

Camada frontend de serviços.

Contratos TypeScript.

Dados mockados realistas.

Estados de carregamento, erro, sucesso e vazio.

Navegação completa entre todas as páginas.

Não implementar nesta etapa:

Backend definitivo.

Banco de dados definitivo.

Supabase.

Lovable Cloud como backend.

Autenticação real.

APIs reais.

Webhooks reais.

Integração real com WhatsApp.

Integração real com Google Ads.

Integração real com Meta Ads.

Credenciais, tokens ou segredos.

Deploy ou domínio.

Todas as funcionalidades deverão funcionar visualmente com uma camada mockada, mas a arquitetura precisa permitir substituir os mocks pela futura API REST sem reescrever as páginas.

IDENTIDADE VISUAL

Utilize exclusivamente a logo oficial anexada da Risco Zero Proteção Veicular.

Regras:

Não redesenhar a logo.

Não alterar o escudo.

Não substituir as letras RZ.

Não alterar a assinatura visual.

Não modificar proporções.

Não deformar.

Não cortar.

Não aplicar efeitos 3D.

Não criar outra versão da marca.

Não usar sombras pesadas.

Preservar área de respiro.

Preparar aplicação sobre fundos claros e escuros.

Usar a logo no cabeçalho, login, menu mobile, rodapé e área administrativa.

Utilizar somente o escudo original como favicon.

DIREÇÃO DE DESIGN

Desenvolva uma interface autoral com padrão visual equivalente a projetos profissionais de alto nível apresentados no Figma e Behance.

Utilize essas plataformas somente como referência de qualidade, composição, acabamento, hierarquia e consistência. Não copie nenhum layout ou identidade existente.

O design deverá transmitir:

Solidez.

Confiança.

Tecnologia.

Organização.

Credibilidade.

Atendimento próximo.

Clareza.

Alto valor percebido.

Não utilizar:

Emojis.

Aparência de template genérico.

Ilustrações infantis.

Gradientes chamativos.

Efeitos neon.

Glassmorphism excessivo.

Sombras pesadas.

Excesso de ícones.

Excesso de animações.

Textos decorativos.

Elementos visuais sem função.

Fontes manuscritas ou arredondadas.

Lorem Ipsum.

TIPOGRAFIA

Utilizar Inter Variable em toda a aplicação.

A fonte deverá apresentar aparência:

Reta.

Nítida.

Moderna.

Institucional.

Altamente legível.

Pesos:

Título principal: 700.

Títulos de seção: 650 ou 700.

Subtítulos: 500 ou 600.

Texto: 400.

Labels e botões: 500 ou 600.

Indicadores: 650 ou 700.

Utilizar escala tipográfica responsiva com clamp.

Manter line-height confortável, linhas de texto controladas e hierarquia clara.

PALETA

Extrair a direção cromática da logo:

Azul profundo institucional.

Azul-violeta escuro do escudo.

Dourado elegante.

Dourado claro para detalhes.

Branco.

Off-white.

Cinza frio.

Grafite.

Verde para sucesso.

Vermelho para erro.

Âmbar para alertas.

O dourado deverá ser usado com moderação em detalhes, indicadores, bordas selecionadas e componentes importantes.

Criar tokens semânticos centralizados. Não espalhar valores hexadecimais diretamente nos componentes.

TECNOLOGIAS

Utilizar:

React.

TypeScript.

Vite.

Tailwind CSS.

shadcn/ui.

React Router.

TanStack Query.

React Hook Form.

Zod.

Recharts.

Lucide Icons.

date-fns.

Configurar TypeScript em modo estrito.

DESIGN SYSTEM

Criar um design system completo com:

Tokens de cor.

Tipografia.

Espaçamento.

Grid.

Container.

Raios de borda.

Elevação.

Estados interativos.

Breakpoints.

Componentes reutilizáveis.

Estados de loading, erro, sucesso, vazio e sem permissão.

Componentes:

Button.

IconButton.

Input.

Textarea.

Select.

MultiSelect.

Checkbox.

RadioGroup.

DatePicker.

DateRangePicker.

Badge.

StatusBadge.

Avatar.

Tooltip.

Popover.

Dropdown.

Dialog.

Drawer.

Tabs.

Accordion.

Breadcrumb.

Pagination.

DataTable.

EmptyState.

Skeleton.

Alert.

Toast.

Card.

MetricCard.

ChartCard.

FilterBar.

SearchInput.

PageHeader.

Sidebar.

MobileNavigation.

KanbanBoard.

Timeline.

ActivityItem.

ARQUITETURA PREPARADA PARA O BACKEND

Organize o código em:

src/
assets/
components/
ui/
common/
landing/
dashboard/
crm/
charts/
forms/
navigation/
config/
constants/
contexts/
hooks/
layouts/
lib/
mocks/
pages/
public/
auth/
dashboard/
crm/
reports/
traffic/
integrations/
administration/
routes/
services/
styles/
types/
utils/

Criar os serviços:

src/services/api

src/services/auth

src/services/leads

src/services/activities

src/services/tasks

src/services/analytics

src/services/campaigns

src/services/integrations

src/services/users

src/services/audit

src/services/settings

src/services/tracking

Criar interfaces TypeScript para cada serviço.

Exemplo de padrão:

interface LeadsService {
list(filters: LeadFilters): Promise<PaginatedResponse>;
getById(id: string): Promise;
create(payload: CreateLeadRequest): Promise;
update(id: string, payload: UpdateLeadRequest): Promise;
assign(id: string, userId: string): Promise;
changeStage(id: string, stage: LeadStage): Promise;
addActivity(id: string, payload: CreateActivityRequest): Promise;
}

Criar dois adaptadores:

MockAdapter para esta demonstração.

HttpAdapter preparado para a API futura.

Usar uma configuração:

VITE_API_BASE_URL
VITE_USE_MOCK_API

Nenhuma credencial secreta deverá utilizar prefixo VITE.

Os componentes e páginas não poderão importar mocks diretamente. Todo acesso deverá passar pelos serviços e pelo TanStack Query.

Preparar tratamento centralizado para:

Erros HTTP.

Sessão expirada.

Acesso negado.

Erros de validação.

Indisponibilidade da API.

Timeout.

Falha de conexão.

NOMENCLATURA DO NEGÓCIO

A Risco Zero atua no segmento associativo de proteção patrimonial mutualista, assistência e benefícios.

Não apresentar a Risco Zero como seguradora.

Não descrever o produto como seguro.

Utilizar:

Associado ou participante.

Adesão.

Termo de adesão.

Contrato de participação.

Proteção veicular.

Proteção patrimonial.

Assistência.

Benefícios.

Cobertura.

Ocorrência.

Evento coberto.

Regulamento.

Contribuição.

Consultor.

Equipe comercial.

Não utilizar:

Seguradora.

Segurado.

Apólice.

Prêmio do seguro.

Corretor de seguros.

Venda de seguro.

Contratação de seguro.

Cliente segurado.

Abrir sinistro.

Substituir “sinistro” por “ocorrência” ou “evento”.

Não prometer cobertura ilimitada, indenização automática, aprovação garantida, preço fixo ou benefício sem condições.

Usar quando necessário:

“Conforme regulamento aplicável.”

“Sujeito às condições da opção contratada.”

“Consulte disponibilidade, limites e critérios de utilização.”

LANDING PAGE

Criar as rotas públicas:

/

/beneficios

/como-funciona

/regioes

/perguntas-frequentes

/contato

/solicitar-cotacao

/obrigado

/politica-de-privacidade

/termos-de-uso

/login

A página inicial deverá conter:

Barra institucional discreta.

Cabeçalho fixo.

Logo oficial.

Navegação.

CTA principal.

Hero.

Formulário de cotação.

Indicadores de confiança.

Situações atendidas.

Benefícios.

Como funciona.

Diferenciais.

Regiões atendidas.

Processo de atendimento.

Depoimentos preparados para conteúdo futuro.

FAQ.

Localização.

CTA final.

Rodapé.

Botão fixo de WhatsApp.

HERO

Título:

“Proteção e assistência para o seu veículo, todos os dias.”

Descrição:

“Conte com atendimento próximo, benefícios para diferentes situações e suporte para seguir seu caminho com mais tranquilidade.”

Botões:

“Solicitar uma cotação”

“Falar com a equipe”

Indicadores:

Atendimento local.

Cotação sem compromisso.

Suporte para a Grande Florianópolis.

Assistências conforme regulamento.

Não inventar estatísticas, avaliações, número de associados ou tempo de mercado.

FORMULÁRIO DE LEAD

Campos:

Nome completo.

WhatsApp.

Placa.

Cidade.

Tipo de veículo.

Ano aproximado.

Melhor horário.

Preferência de atendimento.

Consentimento.

Honeypot invisível.

Preferência:

WhatsApp.

Ligação.

Qualquer opção.

Título:

“Encontre a opção ideal para o seu veículo”

Texto:

“Informe seus dados para que nossa equipe apresente as opções de proteção e benefícios disponíveis para o seu perfil.”

Botão:

“Quero conhecer as opções”

Implementar:

Máscara brasileira de telefone.

Normalização de placa.

Validação com Zod.

Prevenção de envio duplicado.

Loading.

Sucesso.

Erro.

Persistência temporária.

Mensagens acessíveis.

Simulação de armazenamento.

Simulação de redirecionamento ao WhatsApp depois do registro.

Mensagem de sucesso:

“Solicitação recebida. Nossa equipe entrará em contato para apresentar as opções disponíveis.”

RASTREAMENTO

Preparar captura de:

utm_source

utm_medium

utm_campaign

utm_term

utm_content

referrer

landing_page

gclid

gbraid

wbraid

fbclid

device_type

browser

operating_system

first_visit_at

conversion_page

conversion_cta

consent_version

Criar TrackingService e simular:

page_view

form_view

form_start

form_submit

form_success

form_error

whatsapp_click

phone_click

location_click

faq_open

cta_click

BENEFÍCIOS

Apresentar, sempre sujeitos ao regulamento:

Proteção em casos de roubo e furto.

Assistência 24 horas.

Reboque.

Chaveiro.

Auxílio em caso de pane.

Rastreamento.

Assistência a terceiros.

Carro reserva.

Proteção em caso de incêndio.

Proteção em colisões.

Usar:

“Disponibilidade, limites e condições conforme opção contratada e regulamento aplicável.”

REGIÕES

Destacar:

São José.

Florianópolis.

Palhoça.

Biguaçu.

Kobrasol.

Campinas.

Barreiros.

Forquilhinhas.

BR-101.

Via Expressa.

Grande Florianópolis.

CONTATO

Informações:

WhatsApp: (48) 99122-7241.

Endereço: Av. Josué di Bernardi, 239 – Campinas, São José – SC, 88101-260.

Criar formulário, link para rota e horário de atendimento configurável.

Não inventar horário.

FAQ

Incluir:

Como solicitar uma cotação?

Por que informar a placa?

Quais regiões são atendidas?

A cotação tem compromisso?

Como funciona a adesão?

Quais documentos podem ser solicitados?

Como falar com a equipe?

Como funciona a proteção veicular?

AUTENTICAÇÃO DEMONSTRATIVA

Criar:

/login

/esqueci-minha-senha

/redefinir-senha

/verificar-acesso

Implementar autenticação simulada através de AuthService.

Perfis:

Comercial.

Gestor.

Gestor de tráfego.

Desenvolvedor.

Administrador.

Criar seletor de perfil apenas no ambiente demonstrativo para validar permissões e layouts.

Preparar:

Rotas protegidas.

Sessão expirada.

Acesso negado.

Recuperação de senha.

Preparação visual para 2FA.

RBAC tipado.

A segurança real será implementada posteriormente no backend.

ÁREA INTERNA

Criar layout com:

Sidebar recolhível.

Header.

Pesquisa global.

Breadcrumb.

Notificações.

Seletor de período.

Menu do usuário.

Command palette.

Navegação mobile.

Menu:

Visão geral.

CRM.

Leads.

Atividades.

Tarefas.

Relatórios.

Aquisição.

Campanhas.

Rastreamento.

Integrações.

Usuários.

Auditoria.

Configurações.

DASHBOARD

Rota:

/app/dashboard

Indicadores:

Leads recebidos.

Novos contatos.

Contatos iniciados.

Opções apresentadas.

Propostas de adesão.

Adesões concluídas.

Taxa de conversão.

Tempo médio de atendimento.

Filtros:

Período.

Cidade.

Origem.

Campanha.

Responsável.

Etapa.

Tipo de veículo.

Gráficos:

Leads por período.

Funil comercial.

Leads por origem.

Leads por campanha.

Leads por cidade.

Leads por responsável.

Conversão por canal.

Conversão por dispositivo.

Motivos de não conversão.

Horários de captação.

Evolução da conversão.

Não usar gráficos 3D.

CRM

Rotas:

/app/crm

/app/leads

/app/leads/:id

/app/activities

/app/tasks

Pipeline:

Novo contato.

Contato iniciado.

Perfil identificado.

Opções apresentadas.

Proposta de adesão.

Documentação pendente.

Adesão concluída.

Não convertido.

Criar:

Kanban.

Tabela.

Pesquisa.

Filtros.

Ordenação.

Paginação.

Seleção múltipla.

Atribuição.

Mudança de etapa.

Exportação simulada.

Colunas configuráveis.

Cards do Kanban:

Nome.

Cidade.

Origem.

Campanha.

Responsável.

Prioridade.

Próxima tarefa.

Tempo na etapa.

DETALHE DO LEAD

Exibir:

Dados pessoais.

Dados do veículo.

Origem.

Campanha.

UTMs.

Etapa.

Responsável.

Prioridade.

Tags.

Consentimento.

Datas.

Timeline.

Observações.

Atividades.

Tarefas.

Histórico de etapas.

Histórico de responsáveis.

Ações:

Falar pelo WhatsApp.

Registrar ligação.

Registrar mensagem.

Adicionar observação.

Criar tarefa.

Agendar retorno.

Alterar responsável.

Alterar etapa.

Marcar adesão concluída.

Marcar como não convertido.

Motivos de não conversão:

Sem retorno.

Sem interesse.

Valor.

Veículo fora do perfil.

Região não atendida.

Escolheu outra alternativa.

Documentação incompleta.

Outro.

BI E RELATÓRIOS

Criar:

/app/reports

/app/reports/commercial

/app/reports/acquisition

/app/reports/productivity

/app/reports/regional

Relatórios:

Funil comercial.

Conversões.

Produtividade.

Tempo de atendimento.

Origem.

Campanha.

Cidade.

Canal.

Motivos de não conversão.

Comparativo de períodos.

Jornada até conversão.

Preparar exportações simuladas em CSV, PDF e XLSX.

GESTÃO DE TRÁFEGO

Criar:

/app/acquisition

/app/campaigns

/app/campaigns/:id

/app/tracking

/app/utm-builder

Indicadores:

Investimento.

Impressões.

Alcance.

Cliques.

CTR.

CPC.

Leads.

CPL.

Leads qualificados.

Custo por lead qualificado.

Adesões.

CPA.

Receita atribuída.

ROAS.

Criar:

Comparativo Google e Meta.

Desempenho diário.

Funil por campanha.

Diagnóstico de UTMs.

Diagnóstico de eventos.

Distribuição por landing page.

Distribuição por dispositivo.

Construtor de URLs com UTM.

INTEGRAÇÕES FUTURAS

Criar:

/app/integrations

/app/integrations/google-ads

/app/integrations/meta-ads

/app/integrations/whatsapp

/app/integrations/analytics

/app/integrations/webhooks

Estados:

Não configurada.

Aguardando configuração.

Conectada.

Erro.

Sincronizando.

Ação necessária.

Criar somente interfaces e serviços simulados.

Nunca solicitar ou armazenar tokens reais.

Exibir:

“As credenciais serão armazenadas de forma segura no servidor e nunca serão expostas no navegador.”

ÁREA DO DESENVOLVEDOR

Criar:

Webhooks.

Logs.

Tentativas.

Status.

Tempo de processamento.

Resposta simulada.

Reenvio simulado.

Feature flags.

Status dos serviços.

Ambiente atual.

Versão da aplicação.

Diagnóstico da API.

USUÁRIOS E PERMISSÕES

Criar:

/app/users

/app/users/:id

/app/roles

/app/permissions

Implementar visualmente:

Lista.

Convite.

Edição.

Ativação.

Desativação.

Definição de perfil.

Matriz de permissões.

Último acesso.

Histórico de atividade.

AUDITORIA

Criar:

/app/audit

Exibir:

Usuário.

Ação.

Recurso.

Data.

Resultado.

IP mascarado.

Dispositivo.

Alteração anterior.

Alteração posterior.

Detalhes.

CONFIGURAÇÕES

Criar:

/app/settings/general

/app/settings/commercial

/app/settings/tracking

/app/settings/privacy

/app/settings/notifications

Permitir configurar visualmente:

Dados institucionais.

WhatsApp.

Endereço.

Horário.

Mensagem padrão.

Pipeline.

Motivos de não conversão.

Distribuição de leads.

Metas.

Consentimento.

Textos legais.

Notificações.

Parâmetros de tracking.

RESPONSIVIDADE

Garantir funcionamento completo em:

Desktop.

Notebook.

Tablet.

Smartphone.

No mobile:

Menu em drawer.

Formulários em uma coluna.

CTA fixo.

Gráficos legíveis.

Kanban utilizável.

Tabelas adaptadas.

Áreas de toque adequadas.

Nenhuma dependência de hover.

Nenhuma rolagem horizontal indevida.

ACESSIBILIDADE

Atender WCAG AA:

Contraste.

Foco visível.

Navegação por teclado.

Labels.

Mensagens de erro.

Headings semânticos.

Alt text.

Skip link.

Focus trap.

Reduced motion.

Áreas de toque adequadas.

LGPD

Criar:

Consentimento explícito.

Política de privacidade.

Termos de uso.

Banner de cookies.

Rejeição de cookies não essenciais.

Preferências de cookies.

Versão do consentimento.

Textos preparados para validação jurídica.

PÁGINAS DE SISTEMA

Criar:

Manutenção.

Sem conexão.

Sessão expirada.

QUALIDADE OBRIGATÓRIA

Não usar any desnecessariamente.

Não criar componentes monolíticos.

Não duplicar componentes.

Não importar mocks diretamente nas páginas.

Não deixar botões sem comportamento.

Não deixar links vazios.

Não criar páginas incompletas.

Não deixar erros no console.

Não deixar erros de TypeScript.

Não utilizar emojis.

Não utilizar linguagem de seguradora.

Não inventar informações institucionais.

Não expor segredos.

Não conectar backend.

CRITÉRIOS DE CONCLUSÃO

Antes de concluir:

Verificar todas as rotas.

Validar todos os links.

Validar todos os formulários.

Testar desktop, tablet e mobile.

Testar perfis de acesso.

Testar Kanban e tabela.

Testar filtros do dashboard.

Testar detalhe do lead.

Testar estados de loading, erro e vazio.

Revisar acessibilidade.

Revisar nomenclaturas.

Revisar consistência visual.

Corrigir erros de TypeScript.

Remover logs e código morto.

Confirmar que nenhuma página acessa diretamente os mocks.

Confirmar que todos os dados passam pela camada de serviços.

Confirmar que o HttpAdapter está preparado para a futura API.

Confirmar que o projeto pode ser sincronizado com GitHub e aberto no VS Code.

O resultado final deverá parecer uma plataforma real, madura, confiável e de alto nível, pronta para apresentação ao cliente, validação do produto, sincronização com GitHub e posterior desenvolvimento do backend no VS Code.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/fa3196af-3b1d-4e7c-921f-45f8133c490c).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
