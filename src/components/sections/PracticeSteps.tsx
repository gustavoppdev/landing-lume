/**
 * src/components/sections/PracticeSteps.tsx — 04 Como é na prática (spec.md §3).
 *
 * Server Component: a entrada em sequência vem do wrapper `Animate`
 * (stagger + fadeUp, plan.md §1.6); a diretiva de client vive lá, não aqui.
 *
 * QUATRO FILHOS DIRETOS, E SÓ QUATRO — o `plan.md` §1.6 conta as etapas para
 * chegar aos 0.48s do último. Por isso o cabeçalho (rótulo, H2 e apoio) fica
 * FORA do `Animate`: filho extra ali mudaria o ritmo sem ninguém decidir isso.
 * O `className` do `Animate` é o próprio container da faixa, e os wrappers que
 * ele cria em volta de cada filho são os cards.
 *
 * UMA ORDEM DE DOM, DOIS LAYOUTS — sem componente de carrossel e sem JS:
 *   mobile   faixa `flex` com `snap-x` e `overflow-x-auto`, 2,4 cards a 390px
 *   desktop  grade de 4 colunas a partir de `lg` (1024px, plan.md §1.2)
 *
 * A base de 2,4 cards é `calc((100% - 16.8px) / 2.4)`: 2,4 larguras mais 1,4
 * gaps de 12px preenchem a faixa, então a proporção se mantém em 360 e em 390.
 * `overscroll-x-contain` impede que o gesto vertical do dedo sobre a faixa seja
 * capturado por ela em vez de rolar a página.
 *
 * SEM CTA E SEM PREÇO: decisão da `spec.md` §3 — a seção explica, e o CTA volta
 * na 05/06 sem competir.
 *
 * COR DE TEXTO DE APOIO: `muted-foreground` não aparece — o cinza do hi-fi
 * reprova AA sobre fundo claro (AGENTS.md §4, regra 10). Apoio usa `text-body`.
 */

import { Animate } from "@/components/motion/Animate";
import { ImagePlaceholder } from "@/components/ImagePlaceholder";

/** As quatro etapas da spec.md §3, nesta ordem. Ids das imagens: plan.md §1.7. */
const STEPS = [
  {
    number: "01",
    title: "Avaliação e mapeamento",
    description: "50 minutos, presencial. Sai com o protocolo escrito.",
    image: { id: "IMG-07", hint: "lupa e ficha de mapeamento" },
  },
  {
    number: "02",
    title: "Preparo da barreira",
    description: "Duas a quatro semanas antes de qualquer ácido.",
    image: { id: "IMG-08", hint: "mãos aplicando sérum" },
  },
  {
    number: "03",
    title: "Procedimento em consultório",
    description: "Seis sessões, com 21 dias de intervalo.",
    image: { id: "IMG-09", hint: "ponteira de LED sobre a pele" },
  },
  {
    number: "04",
    title: "Home care e retorno",
    description: "Rotina curta, e um retorno já incluído.",
    image: { id: "IMG-10", hint: "rotina de casa sobre a bancada" },
  },
];

export function PracticeSteps() {
  return (
    <section id="na-pratica" className="bg-secondary">
      <div className="section-container py-8 lg:py-14">
        <div className="type-label lg:type-label-lg text-body mb-5 flex justify-between font-mono lg:mb-8">
          <span>{"// Como é na prática"}</span>
          <span>[ 05 ]</span>
        </div>

        <div className="mb-5 flex flex-col gap-3 lg:mb-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10">
          <h2 className="type-h2 lg:type-h2-lg max-w-[560px] text-pretty">
            Quatro etapas, sempre na mesma ordem.
          </h2>
          <p className="type-body lg:type-body-lg text-body text-pretty lg:max-w-[300px]">
            Nenhuma delas é vendida separada — é o mesmo protocolo, do
            mapeamento ao retorno.
          </p>
        </div>

        <Animate
          as="stagger"
          className="flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain lg:grid lg:grid-cols-4 lg:gap-4 lg:overflow-x-visible [&>*]:shrink-0 [&>*]:basis-[calc((100%_-_16.8px)/2.4)] [&>*]:snap-start lg:[&>*]:basis-auto"
        >
          {STEPS.map((step) => (
            <div key={step.number} className="flex flex-col gap-2.5 lg:gap-3">
              <figure className="rounded-media relative aspect-3/4 overflow-hidden">
                <ImagePlaceholder
                  id={step.image.id}
                  ratio="3:4"
                  hint={step.image.hint}
                  labelPosition="bottom"
                />
                {/* Ordinal visual: a ordem já está no DOM e o nome da etapa se
                    lê sozinho, então o número não vai para o leitor de tela. */}
                <span
                  aria-hidden="true"
                  className="type-label lg:type-label-lg bg-background text-foreground absolute top-2.5 left-2.5 rounded-md px-1.5 py-1 font-mono"
                >
                  {step.number}
                </span>
              </figure>

              <h3 className="type-h3 lg:type-h3-lg text-pretty">
                {step.title}
              </h3>
              <p className="type-body lg:type-body-lg text-body text-pretty">
                {step.description}
              </p>
            </div>
          ))}
        </Animate>
      </div>
    </section>
  );
}
