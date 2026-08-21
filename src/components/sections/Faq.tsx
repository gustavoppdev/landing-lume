/**
 * src/components/sections/Faq.tsx — 06 FAQ (spec.md §3).
 *
 * Server Component: a entrada vem do wrapper `Animate` (reveal + fadeUp,
 * plan.md §1.6).
 *
 * MESMO `accordion` DA FEATURE 4, sem variante nova. O que muda é só o call
 * site: aqui o círculo −/+ fica à DIREITA da pergunta, como no hi-fi — o
 * componente do preset delega o indicador à seção justamente por isso.
 *
 * O item 1 é a objeção principal da spec.md §1 e abre por padrão.
 *
 * DIVERGÊNCIA COM O HI-FI (registrada em `specs/tasks/7-faq.md`): o mobile do
 * `design.dc.html` omite a linha de apoio e encurta a resposta 1. A spec.md §3
 * lista as duas — conteúdo vence desenho.
 *
 * COR DE TEXTO DE APOIO: `text-body`. O cinza claro do hi-fi reprova AA sobre
 * fundo claro (AGENTS.md §4, regra 10) e não aparece aqui — o literal dele fica
 * fora deste comentário de propósito, para o `grep` do critério não contar a
 * explicação (AGENTS.md §5).
 */

import { Animate } from "@/components/motion/Animate";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/** As cinco da tabela da spec.md §3, nesta ordem e com o texto exato. */
const FAQ = [
  {
    value: "diferenca",
    question:
      "Já fiz tratamento antes e não vi diferença. Por que aqui seria diferente?",
    answer:
      "Pode ser que não seja — e a avaliação existe pra dizer isso antes de você pagar por seis sessões. Na maioria dos casos que chegam assim, o protocolo anterior começou por um procedimento antes de a barreira estar pronta. A maioria dos pacientes relata mudança entre a 6ª e a 12ª semana; resultado varia de pele para pele.",
  },
  {
    value: "tempo",
    question: "Quanto tempo até eu ver alguma mudança?",
    answer:
      "O protocolo médio leva 12 semanas, e a maioria relata a primeira mudança visível entre a 6ª e a 12ª. Melasma é o mais lento e costuma exigir manejo contínuo.",
  },
  {
    value: "produtos",
    question: "Vou precisar jogar fora os produtos que já uso?",
    answer:
      "Quase nunca. Na avaliação a gente separa o que fica, o que sai por um tempo e o que estava sendo usado na hora errada do dia.",
  },
  {
    value: "avulsa",
    question: "Tem sessão avulsa ou só protocolo fechado?",
    answer:
      "Tem sessão avulsa, e ela custa o mesmo valor por sessão. O que não existe é procedimento sem a avaliação inicial.",
  },
  {
    value: "gestacao",
    question: "Atende quem está grávida ou amamentando?",
    answer:
      "Sim, com protocolo adaptado: sai qualquer ativo com restrição no período e o foco vai para barreira e fotoproteção.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="bg-background">
      <div className="section-container py-8 lg:py-14">
        <Animate>
          <div className="type-label lg:type-label-lg text-body mb-[18px] flex justify-between font-mono lg:mb-[34px]">
            <span>{"// Perguntas"}</span>
            <span>[ 07 ]</span>
          </div>

          <div className="flex flex-col gap-[18px] lg:grid lg:grid-cols-[1fr_1.4fr] lg:items-start lg:gap-11">
            <div className="flex flex-col gap-3 lg:gap-5">
              <h2 className="type-h2 lg:type-h2-lg text-pretty">
                Tudo que costumam perguntar antes de agendar
              </h2>
              <p className="type-lead lg:type-lead-lg text-body text-pretty">
                Se a sua dúvida não está aqui, ela cabe numa mensagem.
              </p>
            </div>

            <Accordion defaultValue={["diferenca"]}>
              {FAQ.map((item) => (
                <AccordionItem key={item.value} value={item.value}>
                  <AccordionTrigger className="gap-3.5 py-[18px] lg:gap-6 lg:py-[22px]">
                    <span className="type-h3 lg:type-h3-lg max-w-[520px]">
                      {item.question}
                    </span>

                    {/* O −/+ do hi-fi desenhado em duas barras: sem glifo, o
                        tamanho não depende de papel tipográfico. */}
                    <span
                      aria-hidden="true"
                      className="border-line-strong text-body group-aria-expanded/accordion-trigger:bg-primary group-aria-expanded/accordion-trigger:border-primary group-aria-expanded/accordion-trigger:text-primary-foreground relative mt-1 flex size-[22px] shrink-0 items-center justify-center rounded-full border lg:size-6"
                    >
                      <span className="bg-current absolute h-px w-2" />
                      <span className="bg-current absolute h-2 w-px group-aria-expanded/accordion-trigger:hidden" />
                    </span>
                  </AccordionTrigger>

                  {/* `keepMounted`: sem ele o Base UI desmonta o painel
                      fechado e só a resposta do item aberto fica no DOM — o
                      critério da feature pede as CINCO. Prop de call site, não
                      variante nova do componente. A 03 não usa porque lá o
                      painel carrega um CTA, e cinco CTAs montados quebrariam
                      "um stop de Tab por pergunta". */}
                  <AccordionContent keepMounted className="pb-[18px] lg:pb-[22px]">
                    <p className="type-body lg:type-body-lg text-body max-w-[620px] pr-9 text-pretty">
                      {item.answer}
                    </p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </Animate>
      </div>
    </section>
  );
}
