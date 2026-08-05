/** Implementação mock (em memória) da Gestão da Associação. */
import { ApiError } from "@/services/http";
import type { AssociationServiceRegistry } from "@/services/association.contracts";
import {
  MOCK_APPORTIONMENTS,
  MOCK_ASSISTANCES,
  MOCK_BENEFITS,
  MOCK_BILLINGS,
  MOCK_CONSULTANTS,
  MOCK_DELINQUENCY,
  MOCK_DOCUMENTS,
  MOCK_INSPECTIONS,
  MOCK_MEMBERS,
  MOCK_MEMBERSHIPS,
  MOCK_OCCURRENCES,
  MOCK_PROVIDERS,
  MOCK_VEHICLES,
} from "@/mocks/association";
import type {
  AssociationDashboard,
  AssociationDocument,
  Assistance,
  Billing,
  Member,
  MemberTimelineEntry,
  Membership,
  Occurrence,
  OccurrenceTimelineEntry,
  Inspection,
  PaginatedResult,
  Provider,
  Vehicle,
} from "@/types/association";
import { MEMBERSHIP_STAGE_LABEL } from "@/types/association";
import type { MetricSummary, SeriesPoint } from "@/types";

const delay = (ms = 300) => new Promise<void>((resolve) => setTimeout(resolve, ms));
const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

const members: Member[] = clone(MOCK_MEMBERS);
const vehicles: Vehicle[] = clone(MOCK_VEHICLES);
const memberships: Membership[] = clone(MOCK_MEMBERSHIPS);
const occurrences: Occurrence[] = clone(MOCK_OCCURRENCES);
const assistances: Assistance[] = clone(MOCK_ASSISTANCES);
const inspections: Inspection[] = clone(MOCK_INSPECTIONS);
const billings: Billing[] = clone(MOCK_BILLINGS);
const documents: AssociationDocument[] = clone(MOCK_DOCUMENTS);
const providers: Provider[] = clone(MOCK_PROVIDERS);
const benefits = clone(MOCK_BENEFITS);
const consultants = clone(MOCK_CONSULTANTS);
const apportionments = clone(MOCK_APPORTIONMENTS);
const delinquency = clone(MOCK_DELINQUENCY);

function paginate<T>(list: T[], page = 1, pageSize = 20): PaginatedResult<T> {
  const start = (page - 1) * pageSize;
  return {
    items: list.slice(start, start + pageSize),
    page,
    pageSize,
    total: list.length,
    totalPages: Math.max(1, Math.ceil(list.length / pageSize)),
  };
}

function groupBy<T>(list: T[], key: (item: T) => string | undefined): SeriesPoint[] {
  const map = new Map<string, number>();
  list.forEach((item) => {
    const label = key(item);
    if (!label) return;
    map.set(label, (map.get(label) ?? 0) + 1);
  });
  return [...map.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value);
}

function inRange(dateIso: string, from?: string | undefined, to?: string | undefined): boolean {
  if (from && dateIso < from) return false;
  if (to && dateIso > to) return false;
  return true;
}

export const associationMock: AssociationServiceRegistry = {
  associationDashboard: {
    async overview(filters) {
      await delay(420);
      const filteredMembers = members.filter((m) => {
        if (filters.city && m.cidade !== filters.city) return false;
        if (filters.consultantId && m.consultorId !== filters.consultantId) return false;
        return true;
      });
      const ativos = filteredMembers.filter((m) => m.status === "ativo").length;
      const emAnalise = filteredMembers.filter((m) => m.status === "em_analise").length;
      const inativos = filteredMembers.filter((m) => m.status === "inativo").length;
      const novasAdesoes = memberships.filter(
        (m) =>
          m.stage === "ativa" && inRange(m.ativadaEm ?? m.atualizadaEm, filters.from, filters.to),
      ).length;
      const veiculosAtivos = vehicles.filter((v) => v.status === "ativo").length;
      const ocorrenciasAbertas = occurrences.filter((o) =>
        [
          "comunicada",
          "documentacao_pendente",
          "em_analise",
          "aguardando_terceiro",
          "aguardando_orcamento",
          "em_reparo",
        ].includes(o.status),
      ).length;
      const assistenciasMes = assistances.filter((a) =>
        inRange(a.solicitadaEm, filters.from, filters.to),
      ).length;
      const vistoriasPendentes = inspections.filter((i) =>
        ["solicitada", "agendada", "em_andamento"].includes(i.status),
      ).length;
      const emitidas = billings.filter((b) => b.status === "emitida").length;
      const pagas = billings.filter((b) => b.status === "paga").length;
      const vencidas = billings.filter((b) => b.status === "vencida").length;
      const valorPrevisto = billings.reduce((acc, b) => acc + b.valor, 0);
      const valorRecebido = billings
        .filter((b) => b.status === "paga")
        .reduce((acc, b) => acc + b.valor, 0);
      const taxaInadimplencia = billings.length ? (vencidas / billings.length) * 100 : 0;
      const leadsConvertidos = memberships.filter((m) => m.leadId).length;
      const tempoMedioDias =
        memberships.reduce((acc, m) => {
          const inicio = new Date(m.iniciadaEm).getTime();
          const fim = new Date(m.ativadaEm ?? m.atualizadaEm).getTime();
          return acc + Math.max(0, (fim - inicio) / 86400000);
        }, 0) / Math.max(1, memberships.length);

      const metrics: MetricSummary[] = [
        {
          key: "associados_ativos",
          label: "Associados ativos",
          value: ativos,
          format: "number",
          deltaPercent: 4.2,
        },
        {
          key: "novas_adesoes",
          label: "Novas adesões",
          value: novasAdesoes,
          format: "number",
          deltaPercent: 6.8,
        },
        {
          key: "adesoes_em_analise",
          label: "Adesões em análise",
          value: memberships.filter((m) => m.stage === "em_analise").length,
          format: "number",
          deltaPercent: -1.4,
        },
        {
          key: "associados_inativos",
          label: "Associados inativos",
          value: inativos,
          format: "number",
          deltaPercent: -2.1,
        },
        {
          key: "veiculos_ativos",
          label: "Veículos ativos",
          value: veiculosAtivos,
          format: "number",
          deltaPercent: 3.1,
        },
        {
          key: "ocorrencias_abertas",
          label: "Ocorrências abertas",
          value: ocorrenciasAbertas,
          format: "number",
          deltaPercent: -3.6,
        },
        {
          key: "assistencias",
          label: "Assistências no período",
          value: assistenciasMes,
          format: "number",
          deltaPercent: 5.4,
        },
        {
          key: "vistorias_pendentes",
          label: "Vistorias pendentes",
          value: vistoriasPendentes,
          format: "number",
          deltaPercent: -0.8,
        },
        {
          key: "cobrancas_emitidas",
          label: "Cobranças emitidas",
          value: emitidas,
          format: "number",
          deltaPercent: 2.2,
        },
        {
          key: "cobrancas_recebidas",
          label: "Cobranças recebidas",
          value: pagas,
          format: "number",
          deltaPercent: 3.9,
        },
        {
          key: "cobrancas_vencidas",
          label: "Cobranças vencidas",
          value: vencidas,
          format: "number",
          deltaPercent: -4.5,
        },
        {
          key: "taxa_inadimplencia",
          label: "Taxa de inadimplência",
          value: Number(taxaInadimplencia.toFixed(1)),
          format: "percent",
          deltaPercent: -1.1,
        },
        {
          key: "valor_previsto",
          label: "Valor previsto",
          value: valorPrevisto,
          format: "currency",
          deltaPercent: 4.0,
        },
        {
          key: "valor_recebido",
          label: "Valor recebido",
          value: valorRecebido,
          format: "currency",
          deltaPercent: 5.1,
        },
        {
          key: "leads_convertidos",
          label: "Leads convertidos",
          value: leadsConvertidos,
          format: "number",
          deltaPercent: 7.3,
        },
        {
          key: "tempo_medio_conversao",
          label: "Tempo médio lead-adesão",
          value: Number(tempoMedioDias.toFixed(1)),
          format: "duration",
          deltaPercent: -6.2,
          helper: "Dias entre o início e a ativação da adesão",
        },
      ];

      const months = 6;
      const associadosAoLongoTempo: SeriesPoint[] = Array.from({ length: months }, (_, i) => {
        const date = new Date(Date.now() - (months - 1 - i) * 30 * 86400000);
        const label = date.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
        const value = members.filter(
          (m) => new Date(m.dataAdesao).getTime() <= date.getTime() && m.status !== "inativo",
        ).length;
        return { label, value };
      });

      const adesoesPorPeriodo: SeriesPoint[] = Array.from({ length: months }, (_, i) => {
        const date = new Date(Date.now() - (months - 1 - i) * 30 * 86400000);
        const label = date.toLocaleDateString("pt-BR", { month: "short", year: "2-digit" });
        const value = memberships.filter(
          (m) =>
            new Date(m.iniciadaEm).getMonth() === date.getMonth() &&
            new Date(m.iniciadaEm).getFullYear() === date.getFullYear(),
        ).length;
        return { label, value };
      });

      const dashboard: AssociationDashboard = {
        metrics,
        associadosAoLongoTempo,
        adesoesPorPeriodo,
        veiculosPorCategoria: groupBy(vehicles, (v) => v.categoria),
        ocorrenciasPorCategoria: groupBy(occurrences, (o) => o.tipo),
        ocorrenciasPorStatus: groupBy(occurrences, (o) => o.status),
        assistenciasPorTipo: groupBy(assistances, (a) => a.tipo),
        inadimplenciaPorPeriodo: adesoesPorPeriodo.map((p, i) => ({
          label: p.label,
          value: Number((6 + (i % 4)).toFixed(1)),
        })),
        arrecadacaoPorPeriodo: associadosAoLongoTempo.map((p) => ({
          label: p.label,
          value: Math.round(p.value * 92),
        })),
        adesoesPorConsultor: groupBy(memberships, (m) => m.consultorNome),
        associadosPorCidade: groupBy(members, (m) => m.cidade),
        origemDosAssociados: groupBy(members, (m) => m.sistemaOrigem),
        conversaoLeadAssociado: [
          { label: "Leads convertidos", value: leadsConvertidos },
          { label: "Adesões diretas", value: memberships.length - leadsConvertidos },
        ],
        dadosSincronizadosPorSistema: groupBy(members, (m) => m.sistemaOrigem),
      };
      return dashboard;
    },
  },

  members: {
    async list(filters) {
      await delay();
      let list = members.slice();
      const search = filters.search?.trim().toLowerCase();
      if (search) {
        list = list.filter((m) =>
          `${m.nome} ${m.codigoInterno} ${m.whatsapp} ${m.cidade}`.toLowerCase().includes(search),
        );
      }
      if (filters.status && filters.status !== "todos")
        list = list.filter((m) => m.status === filters.status);
      if (filters.situacaoFinanceira && filters.situacaoFinanceira !== "todas")
        list = list.filter((m) => m.situacaoFinanceira === filters.situacaoFinanceira);
      if (filters.city) list = list.filter((m) => m.cidade === filters.city);
      if (filters.consultantId) list = list.filter((m) => m.consultorId === filters.consultantId);
      if (filters.sistemaOrigem)
        list = list.filter((m) => m.sistemaOrigem === filters.sistemaOrigem);
      if (filters.from) list = list.filter((m) => m.dataAdesao >= filters.from!);
      if (filters.to) list = list.filter((m) => m.dataAdesao <= filters.to!);
      const sortBy = filters.sortBy ?? "dataAdesao";
      const dir = filters.sortDir === "asc" ? 1 : -1;
      list.sort((a, b) => {
        const av = (a as unknown as Record<string, unknown>)[sortBy];
        const bv = (b as unknown as Record<string, unknown>)[sortBy];
        return av && bv && av > bv ? dir : av && bv && av < bv ? -dir : 0;
      });
      const membersMasked = list.map((m) => ({ ...m, cpfFull: "***.***.***-**" }));
      return paginate(membersMasked, filters.page ?? 1, filters.pageSize ?? 20);
    },
    async getById(id) {
      await delay(200);
      const member = members.find((m) => m.id === id);
      if (!member) throw new ApiError("nao_encontrado", "Associado não encontrado.", 404);
      return { ...member, cpfFull: "***.***.***-**" };
    },
    async addNote(id, note, author = "Equipe de relacionamento") {
      await delay(220);
      const member = members.find((m) => m.id === id);
      if (!member) throw new ApiError("nao_encontrado", "Associado não encontrado.", 404);
      const entry: MemberTimelineEntry = {
        id: `tl-${id}-${Date.now()}`,
        tipo: "nota",
        titulo: "Observação registrada",
        descricao: note,
        autor: author,
        createdAt: new Date().toISOString(),
      };
      member.timeline.unshift(entry);
      return entry;
    },
    async registerService(id, description) {
      await delay(220);
      const member = members.find((m) => m.id === id);
      if (!member) throw new ApiError("nao_encontrado", "Associado não encontrado.", 404);
      const entry: MemberTimelineEntry = {
        id: `tl-${id}-${Date.now()}`,
        tipo: "atendimento",
        titulo: "Atendimento registrado",
        descricao: description,
        autor: "Equipe de relacionamento",
        createdAt: new Date().toISOString(),
      };
      member.timeline.unshift(entry);
      return entry;
    },
    async requestDocument(id, documento) {
      await delay(240);
      const member = members.find((m) => m.id === id);
      if (!member) throw new ApiError("nao_encontrado", "Associado não encontrado.", 404);
      member.timeline.unshift({
        id: `tl-${id}-${Date.now()}`,
        tipo: "documento",
        titulo: `Documento solicitado: ${documento}`,
        autor: "Equipe de relacionamento",
        createdAt: new Date().toISOString(),
      });
      return member;
    },
    async syncMember(id) {
      await delay(500);
      const member = members.find((m) => m.id === id);
      if (!member) throw new ApiError("nao_encontrado", "Associado não encontrado.", 404);
      member.ultimaSincronizacaoAt = new Date().toISOString();
      member.lastSyncAt = member.ultimaSincronizacaoAt;
      member.timeline.unshift({
        id: `tl-${id}-${Date.now()}`,
        tipo: "sincronizacao",
        titulo: `Sincronização com ${member.sistemaOrigem.toUpperCase()} concluída`,
        autor: "Plataforma",
        createdAt: member.ultimaSincronizacaoAt,
      });
      return member;
    },
    async checkDivergences(id) {
      await delay(260);
      return vehicles.filter((v) => v.memberId === id && v.divergencias.length > 0);
    },
    async exportCsv(filters) {
      await delay(650);
      const { items } = await associationMock.members.list({
        ...filters,
        page: 1,
        pageSize: 10000,
      });
      const header = "codigo;nome;cidade;status;situacao_financeira;data_adesao";
      const body = items
        .map((m) =>
          [m.codigoInterno, m.nome, m.cidade, m.status, m.situacaoFinanceira, m.dataAdesao].join(
            ";",
          ),
        )
        .join("\n");
      return `${header}\n${body}`;
    },
    async revealCpf(id) {
      await delay(280);
      const member = members.find((m) => m.id === id);
      if (!member) throw new ApiError("nao_encontrado", "Associado não encontrado.", 404);
      return member.cpfFull;
    },
  },

  vehicles: {
    async list(filters) {
      await delay();
      let list = vehicles.slice();
      const search = filters.search?.trim().toLowerCase();
      if (search)
        list = list.filter((v) =>
          `${v.placa} ${v.marca} ${v.modelo}`.toLowerCase().includes(search),
        );
      if (filters.status && filters.status !== "todos")
        list = list.filter((v) => v.status === filters.status);
      if (filters.categoria && filters.categoria !== "todos")
        list = list.filter((v) => v.categoria === filters.categoria);
      if (filters.vistoriaStatus && filters.vistoriaStatus !== "todas")
        list = list.filter((v) => v.vistoriaStatus === filters.vistoriaStatus);
      if (filters.memberId) list = list.filter((v) => v.memberId === filters.memberId);
      if (filters.sistemaOrigem)
        list = list.filter((v) => v.sistemaOrigem === filters.sistemaOrigem);
      return paginate(list, filters.page ?? 1, filters.pageSize ?? 20);
    },
    async getById(id) {
      await delay(200);
      const vehicle = vehicles.find((v) => v.id === id);
      if (!vehicle) throw new ApiError("nao_encontrado", "Veículo não encontrado.", 404);
      return vehicle;
    },
    async syncVehicle(id) {
      await delay(450);
      const vehicle = vehicles.find((v) => v.id === id);
      if (!vehicle) throw new ApiError("nao_encontrado", "Veículo não encontrado.", 404);
      vehicle.ultimaSincronizacaoAt = new Date().toISOString();
      vehicle.lastSyncAt = vehicle.ultimaSincronizacaoAt;
      return vehicle;
    },
    async checkDivergences(id) {
      await delay(250);
      const vehicle = vehicles.find((v) => v.id === id);
      if (!vehicle) throw new ApiError("nao_encontrado", "Veículo não encontrado.", 404);
      return vehicle;
    },
    async exportCsv(filters) {
      await delay(600);
      const { items } = await associationMock.vehicles.list({
        ...filters,
        page: 1,
        pageSize: 10000,
      });
      const header = "placa;marca;modelo;ano;categoria;status";
      const body = items
        .map((v) => [v.placa, v.marca, v.modelo, v.ano, v.categoria, v.status].join(";"))
        .join("\n");
      return `${header}\n${body}`;
    },
  },

  memberships: {
    async list(filters) {
      await delay();
      let list = memberships.slice();
      const search = filters.search?.trim().toLowerCase();
      if (search)
        list = list.filter((m) => `${m.candidatoNome} ${m.cidade}`.toLowerCase().includes(search));
      if (filters.stage && filters.stage !== "todas")
        list = list.filter((m) => m.stage === filters.stage);
      if (filters.city) list = list.filter((m) => m.cidade === filters.city);
      if (filters.consultantId) list = list.filter((m) => m.consultorId === filters.consultantId);
      return paginate(list, filters.page ?? 1, filters.pageSize ?? 20);
    },
    async getById(id) {
      await delay(200);
      const membership = memberships.find((m) => m.id === id);
      if (!membership) throw new ApiError("nao_encontrado", "Adesão não encontrada.", 404);
      return membership;
    },
    async advanceStage(id, stage, note) {
      await delay(280);
      const membership = memberships.find((m) => m.id === id);
      if (!membership) throw new ApiError("nao_encontrado", "Adesão não encontrada.", 404);
      membership.stage = stage;
      membership.atualizadaEm = new Date().toISOString();
      if (stage === "ativa") membership.ativadaEm = membership.atualizadaEm;
      membership.timeline.unshift({
        id: `adesao-${id}-${Date.now()}`,
        titulo: `Etapa alterada para ${MEMBERSHIP_STAGE_LABEL[stage]}`,
        descricao: note,
        autor: "Equipe de relacionamento",
        createdAt: membership.atualizadaEm,
      });
      return membership;
    },
    async requestDocument(id, documento) {
      await delay(240);
      const membership = memberships.find((m) => m.id === id);
      if (!membership) throw new ApiError("nao_encontrado", "Adesão não encontrada.", 404);
      if (!membership.documentosPendentes.includes(documento))
        membership.documentosPendentes.push(documento);
      membership.timeline.unshift({
        id: `adesao-${id}-${Date.now()}`,
        titulo: `Documento solicitado: ${documento}`,
        autor: "Equipe de relacionamento",
        createdAt: new Date().toISOString(),
      });
      return membership;
    },
    async sendToErp(id) {
      await delay(500);
      const membership = memberships.find((m) => m.id === id);
      if (!membership) throw new ApiError("nao_encontrado", "Adesão não encontrada.", 404);
      membership.stage = "enviada_erp";
      membership.atualizadaEm = new Date().toISOString();
      membership.externalRef = { system: "sga", id: `erp-${id}` };
      membership.lastSyncAt = membership.atualizadaEm;
      return membership;
    },
    async reprocessIntegration(id) {
      await delay(450);
      const membership = memberships.find((m) => m.id === id);
      if (!membership) throw new ApiError("nao_encontrado", "Adesão não encontrada.", 404);
      membership.lastSyncAt = new Date().toISOString();
      membership.timeline.unshift({
        id: `adesao-${id}-${Date.now()}`,
        titulo: "Reprocessamento de integração solicitado",
        autor: "Plataforma",
        createdAt: membership.lastSyncAt,
      });
      return membership;
    },
    async cancel(id, motivo) {
      await delay(280);
      const membership = memberships.find((m) => m.id === id);
      if (!membership) throw new ApiError("nao_encontrado", "Adesão não encontrada.", 404);
      membership.stage = "cancelada";
      membership.atualizadaEm = new Date().toISOString();
      membership.timeline.unshift({
        id: `adesao-${id}-${Date.now()}`,
        titulo: "Adesão cancelada",
        descricao: motivo,
        autor: "Equipe de relacionamento",
        createdAt: membership.atualizadaEm,
      });
      return membership;
    },
  },

  occurrences: {
    async list(filters) {
      await delay();
      let list = occurrences.slice();
      const search = filters.search?.trim().toLowerCase();
      if (search)
        list = list.filter((o) => `${o.protocolo} ${o.local}`.toLowerCase().includes(search));
      if (filters.status && filters.status !== "todos")
        list = list.filter((o) => o.status === filters.status);
      if (filters.tipo && filters.tipo !== "todos")
        list = list.filter((o) => o.tipo === filters.tipo);
      if (filters.memberId) list = list.filter((o) => o.memberId === filters.memberId);
      return paginate(list, filters.page ?? 1, filters.pageSize ?? 20);
    },
    async getById(id) {
      await delay(200);
      const occurrence = occurrences.find((o) => o.id === id);
      if (!occurrence) throw new ApiError("nao_encontrado", "Ocorrência não encontrada.", 404);
      return occurrence;
    },
    async addTimelineEntry(id, titulo, descricao) {
      await delay(220);
      const occurrence = occurrences.find((o) => o.id === id);
      if (!occurrence) throw new ApiError("nao_encontrado", "Ocorrência não encontrada.", 404);
      const entry: OccurrenceTimelineEntry = {
        id: `ocorrencia-${id}-${Date.now()}`,
        titulo,
        descricao,
        autor: "Equipe de sinistros",
        createdAt: new Date().toISOString(),
      };
      occurrence.timeline.unshift(entry);
      occurrence.atualizadaEm = entry.createdAt;
      return entry;
    },
    async updateStatus(id, status) {
      await delay(240);
      const occurrence = occurrences.find((o) => o.id === id);
      if (!occurrence) throw new ApiError("nao_encontrado", "Ocorrência não encontrada.", 404);
      occurrence.status = status;
      occurrence.atualizadaEm = new Date().toISOString();
      return occurrence;
    },
  },

  assistance: {
    async list(filters) {
      await delay();
      let list = assistances.slice();
      const search = filters.search?.trim().toLowerCase();
      if (search)
        list = list.filter((a) => `${a.protocolo} ${a.local}`.toLowerCase().includes(search));
      if (filters.status && filters.status !== "todos")
        list = list.filter((a) => a.status === filters.status);
      if (filters.tipo && filters.tipo !== "todos")
        list = list.filter((a) => a.tipo === filters.tipo);
      if (filters.memberId) list = list.filter((a) => a.memberId === filters.memberId);
      return paginate(list, filters.page ?? 1, filters.pageSize ?? 20);
    },
    async getById(id) {
      await delay(200);
      const assistance = assistances.find((a) => a.id === id);
      if (!assistance) throw new ApiError("nao_encontrado", "Assistência não encontrada.", 404);
      return assistance;
    },
    async updateStatus(id, status) {
      await delay(220);
      const assistance = assistances.find((a) => a.id === id);
      if (!assistance) throw new ApiError("nao_encontrado", "Assistência não encontrada.", 404);
      assistance.status = status;
      if (status === "concluida") assistance.concluidaEm = new Date().toISOString();
      return assistance;
    },
    async assignProvider(id, providerId) {
      await delay(220);
      const assistance = assistances.find((a) => a.id === id);
      if (!assistance) throw new ApiError("nao_encontrado", "Assistência não encontrada.", 404);
      assistance.providerId = providerId;
      return assistance;
    },
  },

  inspections: {
    async list(filters) {
      await delay();
      let list = inspections.slice();
      if (filters.status && filters.status !== "todas")
        list = list.filter((i) => i.status === filters.status);
      if (filters.memberId) list = list.filter((i) => i.memberId === filters.memberId);
      return paginate(list, filters.page ?? 1, filters.pageSize ?? 20);
    },
    async getById(id) {
      await delay(200);
      const inspection = inspections.find((i) => i.id === id);
      if (!inspection) throw new ApiError("nao_encontrado", "Vistoria não encontrada.", 404);
      return inspection;
    },
    async schedule(id, date) {
      await delay(240);
      const inspection = inspections.find((i) => i.id === id);
      if (!inspection) throw new ApiError("nao_encontrado", "Vistoria não encontrada.", 404);
      inspection.status = "agendada";
      inspection.agendadaPara = date;
      return inspection;
    },
    async updateStatus(id, status) {
      await delay(220);
      const inspection = inspections.find((i) => i.id === id);
      if (!inspection) throw new ApiError("nao_encontrado", "Vistoria não encontrada.", 404);
      inspection.status = status;
      if (status === "aprovada" || status === "recusada")
        inspection.realizadaEm = new Date().toISOString();
      return inspection;
    },
  },

  finance: {
    async summary(filters) {
      await delay(320);
      const filtered = billings.filter((b) => inRange(b.emitidaEm, filters.from, filters.to));
      const emitidas = filtered.length;
      const pagas = filtered.filter((b) => b.status === "paga").length;
      const vencidas = filtered.filter((b) => b.status === "vencida").length;
      return {
        valorPrevisto: filtered.reduce((acc, b) => acc + b.valor, 0),
        valorRecebido: filtered
          .filter((b) => b.status === "paga")
          .reduce((acc, b) => acc + b.valor, 0),
        taxaInadimplencia: emitidas ? Number(((vencidas / emitidas) * 100).toFixed(1)) : 0,
        cobrancasEmitidas: emitidas,
        cobrancasPagas: pagas,
        cobrancasVencidas: vencidas,
      };
    },
    async delinquency(filters) {
      await delay(280);
      let list = delinquency.slice();
      if (filters.city) list = list.filter((d) => d.cidade === filters.city);
      const search = filters.search?.trim().toLowerCase();
      if (search) list = list.filter((d) => d.memberName.toLowerCase().includes(search));
      return list;
    },
    async apportionments() {
      await delay(260);
      return apportionments;
    },
  },

  billing: {
    async list(filters) {
      await delay();
      let list = billings.slice();
      if (filters.status && filters.status !== "todas")
        list = list.filter((b) => b.status === filters.status);
      if (filters.memberId) list = list.filter((b) => b.memberId === filters.memberId);
      if (filters.from) list = list.filter((b) => b.emitidaEm >= filters.from!);
      if (filters.to) list = list.filter((b) => b.emitidaEm <= filters.to!);
      return paginate(list, filters.page ?? 1, filters.pageSize ?? 20);
    },
    async getById(id) {
      await delay(200);
      const billing = billings.find((b) => b.id === id);
      if (!billing) throw new ApiError("nao_encontrado", "Cobrança não encontrada.", 404);
      return billing;
    },
    async markAsPaid(id) {
      await delay(240);
      const billing = billings.find((b) => b.id === id);
      if (!billing) throw new ApiError("nao_encontrado", "Cobrança não encontrada.", 404);
      billing.status = "paga";
      billing.pagaEm = new Date().toISOString();
      return billing;
    },
    async cancel(id) {
      await delay(240);
      const billing = billings.find((b) => b.id === id);
      if (!billing) throw new ApiError("nao_encontrado", "Cobrança não encontrada.", 404);
      billing.status = "cancelada";
      return billing;
    },
  },

  benefits: {
    async list() {
      await delay(200);
      return benefits;
    },
    async getById(id) {
      await delay(160);
      const benefit = benefits.find((b) => b.id === id);
      if (!benefit) throw new ApiError("nao_encontrado", "Benefício não encontrado.", 404);
      return benefit;
    },
    async toggle(id, ativo) {
      await delay(200);
      const benefit = benefits.find((b) => b.id === id);
      if (!benefit) throw new ApiError("nao_encontrado", "Benefício não encontrado.", 404);
      benefit.ativo = ativo;
      return benefit;
    },
  },

  consultants: {
    async list(filters) {
      await delay(220);
      let list = consultants.slice();
      if (filters.city) list = list.filter((c) => c.cidade === filters.city);
      return list;
    },
    async getById(id) {
      await delay(180);
      const consultant = consultants.find((c) => c.id === id);
      if (!consultant) throw new ApiError("nao_encontrado", "Consultor não encontrado.", 404);
      return consultant;
    },
  },

  providers: {
    async list(filters) {
      await delay();
      let list = providers.slice();
      if (filters.tipo && filters.tipo !== "todos")
        list = list.filter((p) => p.tipo === filters.tipo);
      if (filters.city) list = list.filter((p) => p.cidade === filters.city);
      const search = filters.search?.trim().toLowerCase();
      if (search) list = list.filter((p) => p.nome.toLowerCase().includes(search));
      return paginate(list, filters.page ?? 1, filters.pageSize ?? 20);
    },
    async getById(id) {
      await delay(180);
      const provider = providers.find((p) => p.id === id);
      if (!provider) throw new ApiError("nao_encontrado", "Prestador não encontrado.", 404);
      return provider;
    },
    async toggle(id, ativo) {
      await delay(200);
      const provider = providers.find((p) => p.id === id);
      if (!provider) throw new ApiError("nao_encontrado", "Prestador não encontrado.", 404);
      provider.ativo = ativo;
      return provider;
    },
  },

  documents: {
    async list(filters) {
      await delay();
      let list = documents.slice();
      if (filters.categoria && filters.categoria !== "todas")
        list = list.filter((d) => d.categoria === filters.categoria);
      if (filters.status && filters.status !== "todos")
        list = list.filter((d) => d.status === filters.status);
      if (filters.memberId) list = list.filter((d) => d.memberId === filters.memberId);
      const search = filters.search?.trim().toLowerCase();
      if (search) list = list.filter((d) => d.nomeArquivo.toLowerCase().includes(search));
      return paginate(list, filters.page ?? 1, filters.pageSize ?? 20);
    },
    async getById(id) {
      await delay(180);
      const document = documents.find((d) => d.id === id);
      if (!document) throw new ApiError("nao_encontrado", "Documento não encontrado.", 404);
      return document;
    },
    async approve(id) {
      await delay(220);
      const document = documents.find((d) => d.id === id);
      if (!document) throw new ApiError("nao_encontrado", "Documento não encontrado.", 404);
      document.status = "aprovado";
      return document;
    },
    async reject(id, _motivo) {
      await delay(220);
      const document = documents.find((d) => d.id === id);
      if (!document) throw new ApiError("nao_encontrado", "Documento não encontrado.", 404);
      document.status = "rejeitado";
      return document;
    },
    async requestRenewal(id) {
      await delay(220);
      const document = documents.find((d) => d.id === id);
      if (!document) throw new ApiError("nao_encontrado", "Documento não encontrado.", 404);
      document.status = "pendente";
      return document;
    },
  },
};
