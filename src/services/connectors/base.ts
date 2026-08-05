import type { ConnectorConfig, SyncError, SyncResult, SyncEntity, SyncDirection } from "@/types/integration";

/**
 * Helpers compartilhados pelos conectores mockados.
 * Endpoints, formatos de payload e limites reais dependem de contratação e
 * documentação técnica de cada fornecedor — nada aqui reflete uma API real.
 */

export const delay = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

/** Gerador determinístico simples baseado em string, para resultados estáveis. */
export function seededFromString(seed: string): () => number {
  let value = 0;
  for (let i = 0; i < seed.length; i += 1) {
    value = (value * 31 + seed.charCodeAt(i)) % 4294967296;
  }
  return () => {
    value = (value * 1664525 + 1013904223) % 4294967296;
    return value / 4294967296;
  };
}

export function buildSyncResult(params: {
  connectorId: string;
  entidade: SyncEntity;
  direction: SyncDirection;
  seedKey: string;
  durationMs: number;
}): SyncResult {
  const rand = seededFromString(params.seedKey);
  const lidos = 20 + Math.floor(rand() * 180);
  const criados = Math.floor(lidos * (0.05 + rand() * 0.15));
  const atualizados = Math.floor(lidos * (0.2 + rand() * 0.3));
  const ignorados = Math.max(0, lidos - criados - atualizados - Math.floor(rand() * 5));
  const totalErros = rand() > 0.82 ? 1 + Math.floor(rand() * 3) : 0;
  const erros: SyncError[] = Array.from({ length: totalErros }, (_, i) => ({
    registroId: `reg-${1000 + i}`,
    campo: rand() > 0.5 ? "documento" : "telefone",
    mensagem: "Registro externo com formato inválido para o campo mapeado.",
  }));
  const iniciadoEm = new Date().toISOString();
  const concluidoEm = new Date(Date.now() + params.durationMs).toISOString();
  return {
    id: `sync-${params.seedKey}`,
    connectorId: params.connectorId,
    entidade: params.entidade,
    direction: params.direction,
    status: totalErros === 0 ? "sucesso" : totalErros > 2 ? "falha" : "parcial",
    iniciadoEm,
    concluidoEm,
    duracaoMs: params.durationMs,
    registrosLidos: lidos,
    registrosCriados: criados,
    registrosAtualizados: atualizados,
    registrosIgnorados: ignorados,
    erros,
    correlationId: `corr-${params.seedKey}`,
  };
}

export function assertConfigured(config: ConnectorConfig | undefined): asserts config is ConnectorConfig {
  if (!config) {
    throw new Error("Conector não configurado.");
  }
}
