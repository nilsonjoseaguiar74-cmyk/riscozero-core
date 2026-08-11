import { APP_CONFIG } from "@/config/site";

export type ApiErrorKind =
  | "validacao"
  | "nao_autenticado"
  | "acesso_negado"
  | "nao_encontrado"
  | "indisponivel"
  | "timeout"
  | "conexao"
  | "desconhecido";

export class ApiError extends Error {
  readonly kind: ApiErrorKind;
  readonly status: number;
  readonly details?: Record<string, string[]>;

  constructor(kind: ApiErrorKind, message: string, status = 0, details?: Record<string, string[]>) {
    super(message);
    this.name = "ApiError";
    this.kind = kind;
    this.status = status;
    if (details) this.details = details;
  }
}

const MESSAGES: Record<ApiErrorKind, string> = {
  validacao: "Revise os dados informados e tente novamente.",
  nao_autenticado: "Sua sessão expirou. Entre novamente para continuar.",
  acesso_negado: "Seu perfil não possui permissão para acessar este recurso.",
  nao_encontrado: "Não encontramos o registro solicitado.",
  indisponivel: "O serviço está temporariamente indisponível. Tente novamente em instantes.",
  timeout: "A solicitação demorou mais do que o esperado.",
  conexao: "Não foi possível conectar. Verifique sua conexão e tente novamente.",
  desconhecido: "Não foi possível concluir a operação.",
};

export const apiErrorMessage = (error: unknown): string => {
  if (error instanceof ApiError) return error.message || MESSAGES[error.kind];
  if (error instanceof Error && error.message) return error.message;
  return MESSAGES.desconhecido;
};

const kindFromStatus = (status: number): ApiErrorKind => {
  if (status === 401) return "nao_autenticado";
  if (status === 403) return "acesso_negado";
  if (status === 404) return "nao_encontrado";
  if (status === 408) return "timeout";
  if (status === 422 || status === 400) return "validacao";
  if (status >= 500) return "indisponivel";
  return "desconhecido";
};

interface RequestOptions {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  query?: Record<string, string | number | boolean | undefined>;
  timeoutMs?: number;
}

let accessToken: string | null = null;
export const setAccessToken = (token: string | null) => {
  accessToken = token;
};

/** Cliente HTTP usado pelo HttpAdapter quando a API REST estiver disponível. */
export async function httpRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = "GET", body, query, timeoutMs = 15000 } = options;
  const url = new URL(
    `${APP_CONFIG.apiBaseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`,
    typeof window === "undefined" ? "http://localhost" : window.location.origin,
  );
  Object.entries(query ?? {}).forEach(([key, value]) => {
    if (value !== undefined && value !== "") url.searchParams.set(key, String(value));
  });

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url.toString(), {
      method,
      headers: {
        Accept: "application/json",
        ...(body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      credentials: "include",
      signal: controller.signal,
      ...(body === undefined
        ? {}
        : { body: body instanceof FormData ? body : JSON.stringify(body) }),
    });

    if (!response.ok) {
      const kind = kindFromStatus(response.status);
      let message = MESSAGES[kind];
      let details: Record<string, string[]> | undefined;
      try {
        const payload = (await response.json()) as {
          message?: string;
          errors?: Record<string, string[]>;
        };
        if (payload.message) message = payload.message;
        if (payload.errors) details = payload.errors;
      } catch {
        /* corpo sem JSON válido */
      }
      throw new ApiError(kind, message, response.status, details);
    }

    if (response.status === 204) return undefined as T;
    return (await response.json()) as T;
  } catch (error) {
    if (error instanceof ApiError) throw error;
    if (error instanceof DOMException && error.name === "AbortError") {
      throw new ApiError("timeout", MESSAGES.timeout);
    }
    throw new ApiError("conexao", MESSAGES.conexao);
  } finally {
    clearTimeout(timer);
  }
}
