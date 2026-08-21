/**
 * src/config.ts — fonte única de verdade dos dados do cliente.
 *
 * Nenhum componente contém número, mensagem ou texto de CTA hardcoded
 * (AGENTS.md, Seção 1). Valores vêm de spec.md, Seção 1.
 */

export const clientConfig = {
  /** Nome do negócio — spec.md §1 */
  businessName: "[NOME DO NEGÓCIO]",

  /** Formato internacional, só dígitos: 55 + DDD + número */
  whatsappNumber: "[5511999990000]",

  /**
   * O MESMO texto em todas as ocorrências da página (AGENTS.md §4, regra 2):
   * repetição gera reconhecimento. Não crie um label por seção — a ênfase
   * visual é que varia, e isso é decisão do plan.md §1.5, não deste arquivo.
   */
  ctaLabel: "[Falar no WhatsApp]",

  /**
   * A MENSAGEM, ao contrário do label, varia por seção de propósito: é o que
   * permite saber de qual parte da página veio o lead.
   *
   * Uma chave por seção que tem CTA — as quatro abaixo são o caso comum, não
   * uma lista fechada: copie da spec.md §1, que já as derivou das seções da §3.
   *
   * Estas chaves são contrato duplo — com a spec.md §1 e com o metadado do
   * evento `whatsapp_click`, que o cliente lê no relatório do GA4. Uma vez
   * definidas, renomear quebra os dois.
   */
  whatsappMessages: {
    hero: "[Oi! Vim pela página e quero saber sobre <oferta>.]",
    offer: "[Oi! Quero entender como funciona e os valores.]",
    finalCta: "[Oi! Li a página toda e quero começar.]",
    /** Barra fixa mobile — normalmente idêntica à do hero. */
    mobileBar: "[Oi! Vim pela página e quero saber sobre <oferta>.]",
  },
} as const;

export type WhatsappSection = keyof typeof clientConfig.whatsappMessages;

/** Parâmetros de campanha capturados da URL de entrada. */
export type UtmParams = Record<string, string>;

const UTM_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
] as const;

/**
 * Extrai os UTMs de uma query string (AGENTS.md §4, regra 11).
 *
 * Recebe a string em vez de ler `window` sozinha para ser pura: quem lê o
 * browser é o componente, via `useSyncExternalStore`.
 */
export function parseUtmParams(search: string): UtmParams {
  const params = new URLSearchParams(search);
  const utm: UtmParams = {};

  for (const key of UTM_KEYS) {
    const value = params.get(key);
    if (value) utm[key] = value;
  }

  return utm;
}

/** Conveniência para uso fora de componente. No servidor devolve `{}`. */
export function readUtmParams(): UtmParams {
  if (typeof window === "undefined") return {};
  return parseUtmParams(window.location.search);
}

/**
 * Monta o link `wa.me` com a mensagem da seção, URL-encoded. Havendo UTM, a
 * origem entra no fim da mensagem — é assim que o cliente sabe de qual anúncio
 * veio o lead, mesmo sem abrir o analytics.
 */
export function buildWhatsappLink(
  section: WhatsappSection,
  utm: UtmParams = {},
): string {
  const message = clientConfig.whatsappMessages[section];
  const origin = utm.utm_campaign ?? utm.utm_source;
  const fullMessage = origin ? `${message} (via ${origin})` : message;

  return `https://wa.me/${clientConfig.whatsappNumber}?text=${encodeURIComponent(fullMessage)}`;
}
