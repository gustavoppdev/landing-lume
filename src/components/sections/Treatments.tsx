/**
 * src/components/sections/Treatments.tsx — 03 Tratamentos (spec.md §3).
 *
 * Server Component: a entrada vem do wrapper `Animate` (reveal + fadeUp,
 * plan.md §1.6); a diretiva de client vive lá, não aqui.
 *
 * UMA ORDEM DE DOM, DUAS LEITURAS:
 *   mobile   rótulo · H2 · IMG-06 com o card de preço · accordion
 *   desktop  IMG-06 à esquerda ocupando as duas linhas; à direita H2 e accordion
 *
 * A DESCRIÇÃO DE CADA TRATAMENTO VIVE NO PAINEL, não no gatilho — divergência
 * com o hi-fi registrada em `specs/tasks/4-treatments.md`: no gatilho ela
 * viraria rótulo do botão e o leitor de tela anunciaria a frase inteira a cada
 * item da lista.
 *
 * O CTA está no painel de CADA item, sempre com a mensagem `offer`. O Base UI
 * desmonta o painel fechado assim que a animação de saída termina, então existe
 * um só CTA no DOM por vez: o do item aberto. (Em janela que não pinta o
 * `animationend` nunca chega e o painel fica montado — é artefato de automação,
 * não da página: ver `friction-log.md`, 4-treatments.)
 *
 * COR DE TEXTO DE APOIO: `muted-foreground` não aparece — o cinza do hi-fi
 * reprova AA sobre fundo claro (AGENTS.md §4, regra 10). Apoio usa `text-body`.
 *
 * TAMANHO DO TEXTO DE APOIO DO CARD DE PREÇO: o hi-fi o desenha a 13px; aqui
 * ele é `type-body` (15px), porque a spec.md §4 põe piso de 15px no corpo em
 * mobile e o piso vence o desenho.
 */

import { Animate } from "@/components/motion/Animate";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { WhatsappButton } from "@/components/WhatsappButton";

/** Os quatro da tabela da spec.md §3, nesta ordem. */
const TREATMENTS = [
  {
    value: "barreira",
    name: "Protocolo de barreira",
    price: "R$ 420",
    description:
      "Para pele que ficou reativa depois de ácido, sol ou excesso de produto. Recupera a função de barreira antes de qualquer procedimento mais intenso.",
  },
  {
    value: "melasma",
    name: "Clareamento de melasma",
    price: "R$ 390",
    description:
      "Manejo contínuo, com fotoproteção como parte do tratamento.",
  },
  {
    value: "colageno",
    name: "Bioestimulação de colágeno",
    price: "R$ 560",
    description: "Firmeza e textura, em janelas de 21 dias.",
  },
  {
    value: "acne",
    name: "Acne ativa e cicatrizes",
    price: "R$ 450",
    description:
      "Acompanhamento em conjunto com dermatologia quando o caso pede.",
  },
];

/** Alturas das 5 barras do mini-gráfico decorativo, na ordem do hi-fi. */
const CHART_BARS = [
  { height: "40%", strong: false },
  { height: "62%", strong: false },
  { height: "55%", strong: false },
  { height: "82%", strong: true },
  { height: "100%", strong: true },
];

export function Treatments() {
  return (
    <section id="tratamentos" className="bg-background">
      <div className="section-container py-8 lg:py-14">
        <Animate>
          <div className="type-label lg:type-label-lg text-body mb-5 flex justify-between font-mono lg:mb-8">
            <span>{"// Tratamentos"}</span>
            <span>[ 04 ]</span>
          </div>

          <div className="flex flex-col gap-5 lg:grid lg:grid-cols-[1fr_1.25fr] lg:grid-rows-[auto_1fr] lg:gap-x-11 lg:gap-y-6">
            <h2 className="type-h2 lg:type-h2-lg text-balance lg:col-start-2 lg:row-start-1">
              A escolha começa na avaliação, não no cardápio.
            </h2>

            <figure
              data-img6=""
              className="rounded-media relative h-[320px] overflow-hidden lg:col-start-1 lg:row-span-2 lg:row-start-1 lg:h-full lg:min-h-[430px]"
            >
              <ImagePlaceholder
                id="IMG-06"
                ratio="3:4"
                hint="paciente em consulta, meio corpo"
              />
              {/* Terço inferior recebe o card (plan.md §1.7). Translúcido, como
                  no hi-fi: a foto por baixo continua legível nas bordas. */}
              <div
                data-price=""
                className="bg-card/94 absolute inset-x-3.5 bottom-3.5 rounded-lg p-3.5 backdrop-blur-md lg:inset-x-5 lg:bottom-5 lg:p-[18px]"
              >
                <div className="flex items-end justify-between gap-4">
                  <span className="type-stat lg:type-stat-lg">R$ 420</span>
                  {/* Decorativo: o valor ao lado já diz o que ele mostra. */}
                  <span
                    data-bars=""
                    aria-hidden="true"
                    className="flex h-6 items-end gap-[3px] lg:h-[30px]"
                  >
                    {CHART_BARS.map((bar) => (
                      <span
                        key={bar.height}
                        style={{ height: bar.height }}
                        className={`w-[5px] rounded-xs lg:w-1.5 ${bar.strong ? "bg-primary" : "bg-border"}`}
                      />
                    ))}
                  </span>
                </div>
                <p className="type-body lg:type-body-lg text-body mt-2 text-pretty">
                  por sessão · 6 sessões no protocolo completo, avaliação
                  incluída na primeira
                </p>
              </div>
            </figure>

            <Accordion
              defaultValue={["barreira"]}
              className="lg:col-start-2 lg:row-start-2"
            >
              {TREATMENTS.map((treatment) => (
                <AccordionItem key={treatment.value} value={treatment.value}>
                  <AccordionTrigger className="items-center gap-3 py-[18px] lg:gap-4 lg:py-[22px]">
                    {/* O −/+ do hi-fi desenhado em duas barras: sem glifo, o
                        tamanho não depende de papel tipográfico. */}
                    <span
                      aria-hidden="true"
                      className="border-line-strong text-body group-aria-expanded/accordion-trigger:bg-primary group-aria-expanded/accordion-trigger:border-primary group-aria-expanded/accordion-trigger:text-primary-foreground relative flex size-5 shrink-0 items-center justify-center rounded-full border lg:size-[22px]"
                    >
                      <span className="bg-current absolute h-px w-2" />
                      <span className="bg-current absolute h-2 w-px group-aria-expanded/accordion-trigger:hidden" />
                    </span>

                    <span className="flex flex-1 items-baseline justify-between gap-3 lg:gap-5">
                      <span className="type-h3 lg:type-h3-lg">
                        {treatment.name}
                      </span>
                      <span className="type-body lg:type-body-lg font-mono font-normal whitespace-nowrap">
                        {treatment.price}
                        <span className="hidden lg:inline"> / sessão</span>
                      </span>
                    </span>
                  </AccordionTrigger>

                  <AccordionContent className="pb-5 pl-8 lg:pb-6 lg:pl-[38px]">
                    <p className="type-body lg:type-body-lg text-body max-w-[560px] text-pretty">
                      {treatment.description}
                    </p>

                    <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:gap-4">
                      <WhatsappButton
                        section="offer"
                        className="w-full lg:w-auto"
                        ariaLabel="Falar no WhatsApp sobre valores e qual protocolo serve para a sua pele"
                      />
                      <span className="type-body lg:type-body-lg text-body">
                        <span className="text-foreground font-medium">
                          <span aria-hidden="true">★</span> 5,0
                        </span>{" "}
                        · 41 avaliações
                      </span>
                    </div>
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
