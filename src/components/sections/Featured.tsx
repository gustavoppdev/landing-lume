/**
 * src/components/sections/Featured.tsx — 02 Tratamento em destaque (spec.md §3).
 *
 * Server Component: a entrada em sequência vem do wrapper `Animate`
 * (stagger + fadeUp, plan.md §1.6); a diretiva de client vive lá, não aqui.
 *
 * TRÊS FILHOS DIRETOS, E SÓ TRÊS — o `Animate` embrulha cada filho num `div`
 * sem className, então quem posiciona é o container: no `lg` um grid de duas
 * colunas com `grid-flow-col`, e o terceiro filho (a IMG-05) ocupando a coluna
 * da direita inteira. Filho novo aqui muda o layout do desktop e o ritmo do
 * stagger ao mesmo tempo.
 *
 * ORDEM NO MOBILE: o hi-fi mostra a IMG-05 antes do card da especialista; aqui
 * o card vem antes, porque é ele que carrega o CTA e o CRBM.
 *
 * COR DE TEXTO DE APOIO: `muted-foreground` não aparece — o cinza do hi-fi
 * reprova AA sobre fundo claro (AGENTS.md §4, regra 10). Apoio usa `text-body`;
 * sobre a foto, `primary-foreground` sobre gradiente.
 */

import Image from "next/image";

import featuredApplicationImage from "@/assets/featured-application.webp";
import specialistImage from "@/assets/specialist.webp";
import { Animate } from "@/components/motion/Animate";
import { WhatsappButton } from "@/components/WhatsappButton";

const CHIPS = [
  "Avaliação presencial",
  "Peeling químico",
  "Microagulhamento",
  "LED terapêutico",
  "Skinbooster",
  "Home care orientado",
  "Retorno incluso",
];

export function Featured() {
  return (
    <section id="destaque" className="bg-secondary">
      <div className="section-container py-8 lg:py-14">
        <Animate
          as="stagger"
          className="flex flex-col gap-5 lg:grid lg:grid-flow-col lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-x-8 lg:gap-y-7 [&>*:last-child]:lg:row-span-2"
        >
          <div>
            <div className="type-label lg:type-label-lg text-body mb-5 flex justify-between font-mono lg:mb-8">
              <span>{"// Tratamento em destaque"}</span>
              <span>[ 03 ]</span>
            </div>

            <h2 className="type-h2 lg:type-h2-lg mb-5 text-balance lg:mb-7">
              Protocolo de barreira para pele sensibilizada
            </h2>

            {/* Chips são rótulo, não controle: nada de elemento clicável nem de
                stop de foco aqui — cada stop a mais vem antes do CTA. */}
            <ul className="flex flex-wrap gap-2">
              {CHIPS.map((chip) => (
                <li
                  key={chip}
                  data-chip=""
                  className="type-body lg:type-body-lg bg-card border-border rounded-full border px-3.5 py-2"
                >
                  {chip}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-card rounded-lg p-3.5 lg:p-[18px]">
            <div className="flex gap-3.5 lg:gap-5">
              <figure className="rounded-media relative aspect-4/5 w-[116px] shrink-0 self-start overflow-hidden lg:w-[150px]">
                <Image
                  src={specialistImage}
                  alt="Marina Rezende, biomédica esteta, de jaleco off-white no consultório"
                  fill
                  sizes="(min-width: 1024px) 150px, 116px"
                  className="object-cover object-top"
                />
                {/* Terço inferior recebe o rótulo de vagas (plan.md §1.7): o
                    gradiente é o que sustenta o AA dele, sem caixa atrás. */}
                <div className="from-foreground/95 via-foreground/70 absolute inset-0 bg-gradient-to-t to-transparent" />
                <figcaption className="type-label lg:type-label-lg text-primary-foreground absolute inset-x-2.5 bottom-2.5 font-mono">
                  Últimas 4 vagas de agosto
                  <span
                    aria-hidden="true"
                    className="bg-primary-foreground/25 mt-2 flex h-1.5 overflow-hidden rounded-full"
                  >
                    <span className="bg-accent h-full w-[72%] rounded-full" />
                  </span>
                </figcaption>
              </figure>

              <div>
                <p className="type-h3 lg:type-h3-lg text-nowrap">
                  Marina Rezende
                </p>
                <p className="type-body lg:type-body-lg text-body mt-1">
                  Biomédica esteta · CRBM-4 XXXXX
                </p>
                <p className="type-body lg:type-body-lg text-body mt-1">
                  <span className="text-foreground font-medium">
                    <span aria-hidden="true">★</span> 5,0
                  </span>{" "}
                  · 41 avaliações
                </p>
                <p className="type-body lg:type-body-lg mt-3 text-pretty lg:mt-4">
                  “A sua pele provavelmente não precisa de mais produto. Precisa
                  de ordem.”
                </p>
              </div>
            </div>

            <WhatsappButton
              section="specialist"
              className="mt-4 w-full lg:mt-5 lg:w-auto"
              ariaLabel="Falar no WhatsApp sobre o protocolo de barreira"
            />
          </div>

          <figure
            data-img5=""
            className="rounded-media relative aspect-4/3 overflow-hidden lg:aspect-auto lg:min-h-[480px]"
          >
            <Image
              src={featuredApplicationImage}
              alt="Aplicação de sérum no rosto de uma paciente, mãos com luva, em close"
              fill
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-bottom"
            />
            {/* Terço superior da foto é parede clara (plan.md §1.7): o card fica
                ali, sólido — translucidez sobre quase-branco apagaria a borda. */}
            <div
              data-stats=""
              className="bg-card absolute inset-x-3.5 top-3.5 rounded-lg p-3.5 lg:inset-x-[18px] lg:top-[18px] lg:p-4"
            >
              <div className="flex justify-between gap-4">
                <div>
                  <p className="type-label lg:type-label-lg text-body font-mono">
                    Sessões no protocolo
                  </p>
                  <p className="type-stat lg:type-stat-lg mt-1">6</p>
                </div>
                <div className="text-right">
                  <p className="type-label lg:type-label-lg text-body font-mono">
                    Intervalo entre elas
                  </p>
                  <p className="mt-1 flex items-baseline justify-end gap-1.5">
                    <span className="type-stat lg:type-stat-lg">21</span>
                    <span className="type-body lg:type-body-lg">dias</span>
                  </p>
                </div>
              </div>

              <div className="type-body lg:type-body-lg text-body mt-3 flex justify-between gap-4 lg:mt-4">
                <span>Adesão até a última sessão</span>
                <span className="text-foreground font-medium">70%</span>
              </div>
              {/* Decorativa: o rótulo e o número ao lado já dizem o que ela
                  mostra — `progress` sem rótulo seria pior. */}
              <span
                aria-hidden="true"
                className="bg-border mt-2 flex h-2 overflow-hidden rounded-full"
              >
                <span className="bg-primary h-full w-[70%] rounded-full" />
              </span>
            </div>
          </figure>
        </Animate>
      </div>
    </section>
  );
}
