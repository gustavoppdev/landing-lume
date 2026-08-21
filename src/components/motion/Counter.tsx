/**
 * src/components/motion/Counter.tsx
 *
 * Número que sobe até o valor final ao entrar no viewport. Não usa o
 * vocabulário `as`/`variant` do `Animate` (AGENTS.md §1) — é uma categoria à
 * parte, registrada em `plan.md` §1.6, não uma variante de animação de bloco.
 *
 * Client Component isolado, mesma lógica do `Animate`: a seção que o usa
 * continua Server Component, só este número roda no client.
 *
 * O valor FINAL é o que sai no HTML estático (ver `useIsHydrated`). A contagem
 * começa depois da hidratação, e só então o número desce para zero e sobe.
 * Duas consequências, as duas de propósito:
 *
 *   · sem JS, a página mostra o número certo em vez de "0";
 *   · o HTML e o primeiro render do client são idênticos, então a hidratação
 *     não encontra um número diferente do que o servidor escreveu.
 *
 * `prefers-reduced-motion`: se ativo, o valor final fica parado na tela, sem
 * contagem — mesma regra do `Animate`, tratada aqui dentro, não opt-in por
 * seção (AGENTS.md §4, regra 10).
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

import { cn } from "@/lib/utils";
import { useIsHydrated } from "./useIsHydrated";

interface CounterProps {
  /** Valor final — de `plan.md` §1.6. */
  to: number;
  /** Duração em segundos. Default 1.5 — mais que isso arrasta sem necessidade. */
  duration?: number;
  /** Prefixo, ex: "R$". */
  prefix?: string;
  /** Sufixo, ex: "+", "%". */
  suffix?: string;
  className?: string;
}

export function Counter({
  to,
  duration = 1.5,
  prefix = "",
  suffix = "",
  className,
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const isHydrated = useIsHydrated();
  const shouldReduceMotion = useReducedMotion();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!isInView || shouldReduceMotion) return;

    const start = performance.now();
    let frame = requestAnimationFrame(function tick(now: number) {
      const progress = Math.min((now - start) / (duration * 1000), 1);
      setValue(Math.round(progress * to));
      if (progress < 1) frame = requestAnimationFrame(tick);
    });

    // Sem isto, trocar `to`/`duration` (ou desmontar no meio) deixa um segundo
    // loop escrevendo no mesmo state.
    return () => cancelAnimationFrame(frame);
  }, [isInView, shouldReduceMotion, to, duration]);

  const displayed = isHydrated && !shouldReduceMotion ? value : to;

  return (
    // `tabular-nums`: sem largura fixa por dígito, o número muda de largura a
    // cada quadro e empurra o que está ao lado — CLS (AGENTS.md §4, regra 6).
    <span ref={ref} className={cn("tabular-nums", className)}>
      {prefix}
      {displayed}
      {suffix}
    </span>
  );
}
