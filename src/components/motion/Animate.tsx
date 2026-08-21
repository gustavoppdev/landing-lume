/**
 * src/components/motion/Animate.tsx
 *
 * Wrapper de animação de entrada. Toda seção que anima usa este componente —
 * ela mesma continua Server Component; só o `Animate` roda no client
 * (AGENTS.md §1).
 *
 * ───────────────────────────────────────────────────────────────────────────
 * Vocabulário fechado (AGENTS.md §1) — não adicione valor novo aqui sem
 * atualizar a regra fixa primeiro:
 *
 *   as:      "reveal"  — o bloco inteiro entra como uma unidade (default)
 *            "stagger" — os filhos diretos entram em sequência
 *
 *   variant: "fade"    — só opacidade
 *            "fadeUp"  — opacidade + leve translateY (default)
 *            "scaleIn" — opacidade + leve escala
 *
 * Só `transform`/`opacity` são animados em qualquer variante — outra
 * propriedade recalcula layout e derruba o CLS (AGENTS.md §4, regra 6).
 *
 * Ritmo (duração, ease, intervalo do `stagger`, distância, escala de partida e
 * margem do gatilho) vem da tabela do `plan.md` §1.6 e vive nas constantes
 * abaixo — nunca em props, para nenhuma seção "customizar" o timing sem passar
 * pela decisão registrada. O `scaleIn` está declarado mas nenhuma seção desta
 * página o usa.
 * ───────────────────────────────────────────────────────────────────────────
 *
 * O QUE SAI NO HTML ESTÁTICO — o detalhe que decide o LCP:
 *
 * Até a hidratação terminar, este componente renderiza os filhos VISÍVEIS, com
 * a mesma árvore de elementos da versão animada (ver `useIsHydrated`). Isso
 * significa que:
 *
 *   · sem JS, a seção aparece — ela não fica presa em `opacity: 0`;
 *   · a hidratação não muda a estrutura, então não há mismatch nem CLS;
 *   · em compensação, um bloco ACIMA DA DOBRA aparece no primeiro paint e
 *     reanima quando o React assume. É por isso que nada que seja candidato a
 *     LCP (imagem do hero, H1) entra em `Animate` — AGENTS.md §1.
 *
 * `prefers-reduced-motion` é tratado AQUI DENTRO, não opt-in por seção
 * (AGENTS.md §4, regra 10): se a preferência está ativa, o componente fica no
 * estado visível para sempre e nenhuma transição roda.
 */

"use client";

import { Children, type ReactNode } from "react";
import {
  motion,
  stagger,
  useReducedMotion,
  type Transition,
  type Variants,
} from "motion/react";

import { useIsHydrated } from "./useIsHydrated";

type AnimateAs = "reveal" | "stagger";
type AnimateVariant = "fade" | "fadeUp" | "scaleIn";

interface AnimateProps {
  /** O que anima: bloco inteiro ("reveal", default) ou filhos em sequência ("stagger"). */
  as?: AnimateAs;
  /** Como anima. Default "fadeUp". */
  variant?: AnimateVariant;
  children: ReactNode;
  /** Ajuste de LAYOUT desta ocorrência. Nunca propriedade fora de transform/opacity. */
  className?: string;
}

// ── RITMO — os sete valores da tabela do `plan.md` §1.6 ───────────────────
// Nenhum deles é prop: o plano decide uma vez e nenhuma seção customiza.
// Declarar em vez de herdar é obrigatório — sem `transition` própria o Motion
// escolhe um default POR PROPRIEDADE (`opacity` vira tween de 0.3s, `y` e
// `scale` viram molas) e as três variantes ganham ritmos diferentes sem
// ninguém ter decidido isso.
//
// Nunca acrescente `delay` ao TRANSITION: o atraso do `stagger` é aplicado
// antes e a transição da variante o sobrescreveria, matando a sequência.
const TRANSITION: Transition = { duration: 0.7, ease: [0.22, 1, 0.36, 1] };
const STAGGER_INTERVAL = 0.12; // segundos entre um filho e o próximo
const FADE_UP_DISTANCE = 28; // px que o bloco sobe no `fadeUp`
const SCALE_IN_FROM = 0.96; // escala de partida do `scaleIn` (nenhuma seção usa)
const VIEWPORT_MARGIN = "-120px"; // quanto o elemento entra na tela antes de animar

const VARIANTS: Record<AnimateVariant, Variants> = {
  fade: {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: TRANSITION },
  },
  fadeUp: {
    hidden: { opacity: 0, y: FADE_UP_DISTANCE },
    visible: { opacity: 1, y: 0, transition: TRANSITION },
  },
  scaleIn: {
    hidden: { opacity: 0, scale: SCALE_IN_FROM },
    visible: { opacity: 1, scale: 1, transition: TRANSITION },
  },
};

// `delayChildren: stagger(...)` é a API atual do Motion. O antigo
// `staggerChildren: number` está deprecado e vai sumir.
const CONTAINER_VARIANTS: Variants = {
  hidden: {},
  visible: { transition: { delayChildren: stagger(STAGGER_INTERVAL) } },
};

const VIEWPORT = { once: true, margin: VIEWPORT_MARGIN } as const;

export function Animate({
  as = "reveal",
  variant = "fadeUp",
  children,
  className,
}: AnimateProps) {
  const isHydrated = useIsHydrated();
  const shouldReduceMotion = useReducedMotion();

  // Estado visível: o do HTML estático, e o definitivo para quem pediu menos
  // movimento. A árvore é a mesma da versão animada — no `stagger`, os mesmos
  // wrappers — para a hidratação não mexer no layout.
  if (!isHydrated || shouldReduceMotion) {
    return (
      <div className={className}>
        {as === "stagger"
          ? Children.map(children, (child) => <div>{child}</div>)
          : children}
      </div>
    );
  }

  if (as === "reveal") {
    return (
      <motion.div
        className={className}
        initial="hidden"
        whileInView="visible"
        viewport={VIEWPORT}
        variants={VARIANTS[variant]}
      >
        {children}
      </motion.div>
    );
  }

  // as === "stagger": o container distribui o atraso incremental, cada filho
  // direto recebe o mesmo `variant` visual que o reveal usaria sozinho.
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={VIEWPORT}
      variants={CONTAINER_VARIANTS}
    >
      {Children.map(children, (child) => (
        <motion.div variants={VARIANTS[variant]}>{child}</motion.div>
      ))}
    </motion.div>
  );
}
