/**
 * src/components/WhatsappButton.tsx
 *
 * O único Client Component nosso, junto do wrapper de animação (AGENTS.md §1).
 * Lê número e mensagens de src/config.ts — nunca hardcode aqui.
 *
 * ───────────────────────────────────────────────────────────────────────────
 * ANTES DE USAR: o estilo do CTA mora em `ui/button.tsx`, não aqui.
 *
 * As CHAVES do cva são as nativas do preset e não mudam de nome (variant:
 * default | outline | secondary | ghost | destructive | link · size: default |
 * xs | sm | lg | icon…). O que se ajusta é o VALOR de cada chave, para bater
 * com os tokens do plan.md §2 e as medidas do plan.md §1.2 — a edição acontece
 * uma vez, na feature-0, dentro do cva. Chave NOVA é exceção registrada em
 * plan.md §1.5, não o caminho normal.
 *
 * A edição obrigatória em toda página é a altura de toque: o `lg` do preset
 * vem com 36px (`h-9`), abaixo do alvo mínimo de 44px.
 *
 *   size: {
 *     …                            // default, xs, sm, icon, …
 *     lg: "h-11 gap-2 rounded-full px-6 type-body lg:type-body-lg", // 44px
 *   },
 *
 * Repare no `gap-2`: cada chave de `size` do preset carrega o próprio
 * espaçamento (`gap-1.5` no `lg` original). Sobrescrever a chave inteira sem
 * repor o gap gruda o ícone no texto.
 *
 * Este componente não estiliza nada: ele escolhe. Concatenar cor ou altura por
 * fora do cva é o que fazia `bg-primary` (do variant default) e `bg-transparent`
 * (de outro variant) chegarem juntos no className — o cn() resolvia a briga, mas
 * só enquanto alguém lembrasse dele. Dentro do cva a briga não existe: uma
 * chave, um valor.
 * ───────────────────────────────────────────────────────────────────────────
 *
 * Por que `buttonVariants` e não `<Button>`: o Button do Base UI parte de
 * `nativeButton: true` e injeta `type="button"` no elemento renderizado; com
 * `nativeButton={false}` ele injeta `role="button"`. Nos dois casos um `<a>`
 * deixa de ser anunciado como link. Como o destino é externo (wa.me), também
 * não se usa `<Link>` do Next.js — ele não traz ganho fora de navegação
 * interna. Ver AGENTS.md §1.
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
 * As variantes registradas em plan.md §1.5 para este projeto — e só elas.
 * Os nomes abaixo são exemplo; troque pelos que o `plan.md` §1.5 deste
 * projeto mapeou (ex: só `default` e `secondary`, se for o caso).
 *
 * O tipo é EXTRAÍDO do cva de ui/button.tsx, não redigitado: se um deles não
 * existir lá, `Extract` devolve `never` e todo uso deste componente quebra no
 * typecheck. Uma variante fora desta lista também não passa — usá-la exige
 * editar esta união, que é um ato visível na revisão, não um improviso dentro
 * de uma feature (AGENTS.md §4, regra 2).
 */
type ButtonVariant = NonNullable<
  Parameters<typeof buttonVariants>[0]
>["variant"];

export type WhatsappButtonEmphasis = Extract<
  ButtonVariant,
  "default" | "outline" | "secondary"
>;

interface WhatsappButtonProps {
  /** Seção de origem — usada no link e no metadado do evento. */
  section: WhatsappSection;
  /** Ênfase visual, restrita às registradas em plan.md §1.5. */
  emphasis?: WhatsappButtonEmphasis;
  /** Ajuste de LAYOUT desta ocorrência (largura, margem). Nunca cor nem altura. */
  className?: string;
  /**
   * Rótulo acessível desta ocorrência. Numa página com 4 CTAs, o leitor de tela
   * anuncia o mesmo rótulo 4 vezes na lista de links — por isso cada um recebe
   * o CONTEXTO em linguagem humana ("Falar no WhatsApp sobre o pacote de 3
   * meses"), nunca a chave interna ("hero", "finalCta"), que não significa nada
   * para quem ouve.
   */
  ariaLabel?: string;
}

export function WhatsappButton({
  section,
  emphasis = "default",
  className,
  ariaLabel,
}: WhatsappButtonProps) {
  // Os UTMs só existem no browser: o componente é pré-renderizado no build,
  // quando window ainda não existe. useSyncExternalStore é o jeito correto de
  // ler valor externo com snapshot de servidor — no HTML estático o link sai sem
  // UTM (certo para acesso direto) e passa a incluí-los na hidratação, sem o
  // cascading render que useEffect + setState provoca (regra
  // react-hooks/set-state-in-effect do eslint-config-next).
  const search = useSyncExternalStore(
    subscribeToSearch,
    getSearchSnapshot,
    getServerSearchSnapshot,
  );
  const utm = useMemo(() => parseUtmParams(search), [search]);

  function handleClick() {
    // AGENTS.md §4, regra 11. Ajuste conforme a plataforma de plan.md §3.
    //
    // Com `@next/third-parties` instalado, o transporte idiomático é
    // `sendGAEvent("event", "whatsapp_click", { section, ...utm })`, que
    // enfileira no `dataLayer` e não perde o clique que acontece antes do
    // script do GA carregar. O guard abaixo é a versão sem dependência: se o
    // analytics ainda é uma condição em aberto no `index.md`, ela não quebra o
    // build — mas perde os cliques mais rápidos.
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
      href={buildWhatsappLink(section, utm)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      aria-label={
        ariaLabel ?? `Falar com ${clientConfig.businessName} no WhatsApp`
      }
      // Toda a aparência vem do cva: ênfase pelo `variant`, altura/raio/padding
      // pelo `size: lg` sobrescrito (plan.md §1.2 — o `lg` original do preset
      // fica abaixo do alvo de toque de 44px). O cn() aqui existe só para o
      // `className` de layout do call site não brigar com o resultado do cva —
      // `buttonVariants()` é cva puro e não passa por tailwind-merge sozinho.
      className={cn(
        buttonVariants({ variant: emphasis, size: "lg" }),
        className,
      )}
    >
      <MessageCircle className="size-5" aria-hidden="true" />
      {clientConfig.ctaLabel}
    </a>
  );
}
