/**
 * src/components/sections/Testimonials.tsx — 05 Depoimentos (spec.md §3).
 *
 * Server Component: a diretiva de client desta seção vive em `ui/carousel.tsx`
 * (AGENTS.md §1) e no wrapper `Animate` — nunca aqui. Os dados descem como
 * children do carrossel.
 *
 * COMPLIANCE (spec.md §2): cada card traz nome, idade, contexto e a marca de
 * autorização visível. Nenhuma fala usa linguagem absoluta — o texto é o da
 * tabela da `spec.md` §3, integral nos dois breakpoints. O hi-fi encurta a fala
 * da Camila no mobile; quem manda no conteúdo é a spec.
 *
 * SEM CTA: decisão da `spec.md` §3 — a barra fixa cobre o mobile e o CTA volta
 * na 06, sem competir com a prova.
 *
 * IMG-11 a IMG-13 ainda não existem (condição do `specs/tasks/index.md`): o
 * `<figure>` e o avatar redondo usam o mesmo `ImagePlaceholder`, apontando para
 * o mesmo id — o avatar é recorte 1:1 da foto do card, não um quarto arquivo
 * por depoimento (`plan.md` §1.7). A `12-images` troca os dois juntos.
 *
 * ALTURA NO MOBILE (risco do `plan.md` §4): a foto já entra como faixa
 * horizontal de 150px, que é a mitigação registrada lá e o que o hi-fi mobile
 * desenha — a 390px o card inteiro fica abaixo de 520px. No `lg` ela vira a
 * coluna de 232px da grade.
 *
 * COR: rótulos mono em `primary-foreground/75`. O hi-fi usa 62% de opacidade,
 * que mede ~4,5:1 sobre o `primary` renderizado — passa raspando e some no
 * primeiro ajuste de token. Dentro do card, apoio em `text-body` — o cinza de
 * apoio do preset reprova AA, como nas features 2 a 5.
 */

import { Animate } from "@/components/motion/Animate";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";
import {
  Carousel,
  CarouselContent,
  CarouselIndex,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

/** Os 3 depoimentos da tabela da spec.md §3, nesta ordem. Ids: plan.md §1.7. */
const TESTIMONIALS = [
  {
    name: "Camila Andrade, 34",
    context: "melasma · 14 semanas de protocolo",
    quote:
      "Fiz três tratamentos em clínicas diferentes antes deste. Foi o primeiro em que alguém me explicou por que a minha pele tinha piorado — e o que a gente ia fazer sobre isso.",
    image: "IMG-11",
  },
  {
    name: "Renata Vilela, 41",
    context: "pele reativa a ácidos · 12 semanas",
    quote:
      "Cheguei achando que precisava de mais um produto. Saí com metade do que eu usava e a pele parou de arder no fim do dia.",
    image: "IMG-12",
  },
  {
    name: "Priscila Matos, 28",
    context: "acne ativa · 16 semanas",
    quote:
      "Foi a primeira vez que alguém me disse “ainda não” para um procedimento que eu queria fazer. Perdi um mês e ganhei o resto.",
    image: "IMG-13",
  },
];

export function Testimonials() {
  return (
    <section
      id="depoimentos"
      className="bg-primary text-primary-foreground"
    >
      <div className="section-container py-8 lg:py-14">
        <div className="type-label lg:type-label-lg text-primary-foreground/75 mb-5 flex justify-between font-mono lg:mb-8">
          <span>{"// Depoimentos"}</span>
          <span>[ 06 ]</span>
        </div>

        <Animate variant="fade">
          {/* `loop`: com 3 itens, seta desabilitada nas pontas é regressão —
              o indicador continua absoluto. */}
          <Carousel
            opts={{ loop: true }}
            className="flex flex-col gap-4 lg:gap-7"
          >
            <div className="flex items-end justify-between gap-4 lg:gap-10">
              <h2 className="type-h2 lg:type-h2-lg max-w-[520px] text-pretty">
                Quem já passou pela avaliação
              </h2>

              <div className="flex shrink-0 items-center gap-2.5 lg:gap-3.5">
                <CarouselIndex
                  total={TESTIMONIALS.length}
                  className="type-label lg:type-label-lg text-primary-foreground/75 font-mono tracking-[0.08em] normal-case"
                />
                <CarouselPrevious
                  aria-label="Depoimento anterior"
                  className="border-primary-foreground/35 text-primary-foreground hover:bg-primary-foreground/10 focus-visible:outline-primary-foreground border"
                />
                <CarouselNext
                  aria-label="Próximo depoimento"
                  className="bg-cta-light text-foreground focus-visible:outline-primary-foreground hover:opacity-90"
                />
              </div>
            </div>

            <CarouselContent>
              {TESTIMONIALS.map((testimonial) => (
                <CarouselItem key={testimonial.image}>
                  <div className="bg-primary-foreground/7 flex flex-col gap-3 rounded-lg p-3 lg:grid lg:grid-cols-[232px_1fr] lg:gap-5 lg:p-5">
                    <figure className="rounded-media relative h-[150px] overflow-hidden lg:h-full lg:min-h-[280px]">
                      <ImagePlaceholder
                        id={testimonial.image}
                        ratio="4:5"
                        hint="retrato natural em luz de janela"
                      />
                    </figure>

                    <div className="rounded-media bg-muted text-foreground flex flex-col justify-between gap-4 p-4.5 lg:gap-6 lg:p-6.5">
                      <blockquote className="type-h3 lg:type-h3-lg text-pretty">
                        “{testimonial.quote}”
                      </blockquote>

                      <div className="flex flex-wrap items-center justify-between gap-x-5 gap-y-3">
                        <div className="flex items-center gap-3">
                          <span className="relative size-9 shrink-0 overflow-hidden rounded-full">
                            <ImagePlaceholder
                              id={testimonial.image}
                              ratio="1:1"
                              compact
                            />
                          </span>
                          <span className="type-body text-body">
                            <span className="text-foreground font-medium">
                              {testimonial.name}
                            </span>
                            <br />
                            {testimonial.context}
                          </span>
                        </div>

                        <span className="type-label lg:type-label-lg text-body font-mono normal-case">
                          uso autorizado
                        </span>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </Animate>
      </div>
    </section>
  );
}
