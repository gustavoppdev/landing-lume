/**
 * src/components/motion/useIsHydrated.ts
 *
 * `false` no servidor e no primeiro render do cliente; `true` depois da
 * hidratação. Não é um componente — é o que permite que `Animate` e `Counter`
 * pré-renderizem o ESTADO FINAL (bloco visível, número cheio) e só troquem
 * para o estado inicial da animação depois que o React assumiu a página.
 *
 * Sem isso, os dois componentes caem na mesma armadilha: o
 * `useReducedMotion()` do Motion devolve `null` no servidor e um booleano no
 * primeiro render do cliente, então qualquer decisão tomada a partir dele
 * durante o SSR sai diferente na hidratação — número trocado, árvore trocada,
 * e o React reclamando de mismatch.
 *
 * O efeito colateral que importa: o HTML estático sai com o conteúdo visível.
 * Sem JS, a seção aparece; com JS lento, ela não fica invisível esperando o
 * bundle (AGENTS.md §4, regra 6 — o LCP é medido no primeiro paint visível).
 */

"use client";

import { useSyncExternalStore } from "react";

// Não há nada a que se inscrever: o valor muda uma vez só, e o React já
// re-renderiza sozinho quando a hidratação termina.
const subscribe = () => () => {};
const getSnapshot = () => true;
const getServerSnapshot = () => false;

export function useIsHydrated() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
