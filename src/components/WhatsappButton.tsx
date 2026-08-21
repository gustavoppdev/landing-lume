/**
 * src/components/WhatsappButton.tsx
 *
 * O único Client Component nosso, junto do wrapper de animação (AGENTS.md §1).
 * Lê número e mensagens de src/config.ts — nunca hardcode aqui.
 *
 * O estilo do CTA mora em `ui/button.tsx`, não aqui: as chaves do cva são as
 * nativas do preset e só os VALORES de `default` e `secondary` foram ajustados
 * (plan.md §1.5). Este componente escolhe a ênfase, não a estiliza — concatenar
 * cor ou altura por fora do cva é o que faz dois `bg-` chegarem juntos no
 * className.
 *
 * Por que `buttonVariants` e não `<Button>`: o Button do Base UI injeta
 * `type="button"` (ou `role="button"`) no elemento renderizado e o `<a>` deixa
 * de ser anunciado como link. Como o destino é externo (wa.me), também não se
 * usa `<Link>`.
 *
 * Ícone: `MessageCircle` do lucide é placeholder neutro. Antes do lançamento,
 * troque pelo ícone oficial dos brand assets da Meta — baixe o arquivo, não
 * reproduza o logo de memória.
 */

"use client";

import { useMemo, useSyncExternalStore } from "react";
import { MessageCircle } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  clientConfig,
  buildWhatsappLink,
  parseUtmParams,
  type WhatsappSection,
} from "@/config";

// A query string não muda enquanto a página está aberta: não há nada a que se
// inscrever, então o subscribe é um no-op.
const subscribeToSearch = () => () => {};
const getSearchSnapshot = () => window.location.search;
const getServerSearchSnapshot = () => "";

/**
 * As duas ênfases registradas em plan.md §1.5 — e só elas. O tipo é EXTRAÍDO do
 * cva: se uma delas sumir de ui/button.tsx, `Extract` devolve `never` e todo uso
 * deste componente quebra no typecheck.
 */
type ButtonVariant = NonNullable<
  Parameters<typeof buttonVariants>[0]
>["variant"];

export type WhatsappButtonEmphasis = Extract<
  ButtonVariant,
  "default" | "secondary"
>;

interface WhatsappButtonProps {
  /** Seção de origem — usada no link e no metadado do evento. */
  section: WhatsappSection;
  /** Ênfase visual: `default` = sólido verde, `secondary` = invertido off-white. */
  emphasis?: WhatsappButtonEmphasis;
  /** Ajuste de LAYOUT desta ocorrência (largura, margem). Nunca cor nem altura. */
  className?: string;
  /**
   * Rótulo acessível desta ocorrência. Com 6 CTAs na página, o leitor de tela
   * anuncia o mesmo rótulo 6 vezes na lista de links — por isso cada um recebe o
   * CONTEXTO em linguagem humana, nunca a chave interna (AGENTS.md §4, regra 10).
   */
  ariaLabel?: string;
}

export function WhatsappButton({
  section,
  emphasis = "default",
  className,
  ariaLabel,
}: WhatsappButtonProps) {
  // Os UTMs só existem no browser: o componente é pré-renderizado no build.
  // Eles não entram na mensagem (plan.md §3), só no evento.
  const search = useSyncExternalStore(
    subscribeToSearch,
    getSearchSnapshot,
    getServerSearchSnapshot,
  );
  const utm = useMemo(() => parseUtmParams(search), [search]);

  function handleClick() {
    // AGENTS.md §4, regra 11. O ramo `fbq` e o `@next/third-parties` entram na
    // feature 9-seo-analytics, junto dos IDs.
    if (typeof window !== "undefined" && "gtag" in window) {
      (window as typeof window & { gtag: (...args: unknown[]) => void }).gtag(
        "event",
        "whatsapp_click",
        { section, ...utm },
      );
    }
  }

  return (
    <a
      href={buildWhatsappLink(section)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      aria-label={
        ariaLabel ?? `Falar com ${clientConfig.businessName} no WhatsApp`
      }
      // Toda a aparência vem do cva. O cn() existe só para o `className` de
      // layout do call site não brigar com o resultado — `buttonVariants()` é
      // cva puro e não passa por tailwind-merge sozinho.
      className={cn(
        buttonVariants({ variant: emphasis, size: "lg" }),
        className,
      )}
    >
      {clientConfig.ctaLabel}
      {/* Círculo de 30px à direita do texto (plan.md §1.5): `primary` no botão
          claro, `primary-foreground/16` no verde. */}
      <span
        aria-hidden="true"
        className={cn(
          "flex size-[30px] shrink-0 items-center justify-center rounded-full",
          emphasis === "secondary"
            ? "bg-primary text-primary-foreground"
            : "bg-primary-foreground/16 text-primary-foreground",
        )}
      >
        <MessageCircle className="size-4" />
      </span>
    </a>
  );
}
