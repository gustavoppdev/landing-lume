/**
 * src/config.ts — fonte única de verdade dos dados do cliente.
 *
 * Nenhum componente contém número, mensagem ou texto de CTA hardcoded
 * (AGENTS.md §1). Valores vêm da spec.md §1.
 */

export const clientConfig = {
  businessName: "Lume Estética Avançada",

  /** Formato internacional, só dígitos: 55 + DDD + número */
  whatsappNumber: "5531999990000",

  /**
   * O MESMO texto em todas as ocorrências da página (AGENTS.md §4, regra 2).
   * A ênfase visual é que varia, e isso é decisão do plan.md §1.5.
   */
  ctaLabel: "Falar no WhatsApp",

  /**
   * A mensagem varia por seção: é ela que identifica de qual parte da página
   * veio o lead. As chaves são contrato duplo — com a spec.md §1 e com o
   * metadado do evento `whatsapp_click`. Renomear quebra os dois.
   */
  whatsappMessages: {
    hero: "Oi! Vim pela página e quero agendar uma avaliação.",
    about: "Oi! Vim pela página e quero entender como funciona a avaliação.",
    specialist: "Oi! Quero falar sobre o protocolo de barreira.",
    offer:
      "Oi! Vi os valores na página e quero entender qual protocolo serve pra minha pele.",
    finalCta: "Oi! Li a página toda e quero agendar a avaliação.",
    /** Barra fixa mobile — idêntica à do hero (spec.md §1). */
    mobileBar: "Oi! Vim pela página e quero agendar uma avaliação.",
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
 * Monta o link `wa.me` com a mensagem da seção, URL-encoded.
 *
 * A UTM NÃO entra no texto (plan.md §3): o lead veria "(via campanha)" na
 * mensagem que ele mesmo envia. A origem fica só no evento `whatsapp_click`.
 */
export function buildWhatsappLink(section: WhatsappSection): string {
  const message = clientConfig.whatsappMessages[section];

  return `https://wa.me/${clientConfig.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
