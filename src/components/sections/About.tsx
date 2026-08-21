/**
 * src/components/sections/About.tsx — 01 Sobre (spec.md §3).
 *
 * Server Component: a animação de entrada vem do wrapper `Animate`
 * (reveal + fadeUp, plan.md §1.6); a diretiva de client vive lá, não aqui.
 *
 * UMA ORDEM DE DOM, DUAS LEITURAS — o hi-fi mostra dois arranjos diferentes e
 * eles se resolvem com `order-*` no mobile e `col-start`/`row-start` no `lg`,
 * sem markup duplicado:
 *   mobile   citação · IMG-02 · card lima · prova · CTA · rating
 *   desktop  IMG-02 à esquerda; à direita citação, [ IMG-03 | prova+CTA e card
 *            lima ] e o rating
 * O par prova+CTA / card lima troca de ordem entre as duas leituras — daí o
 * `flex-col-reverse lg:flex-col`.
 *
 * COR DE TEXTO DE APOIO: o cinza de apoio do preset não aparece aqui. O
 * `#7B766C` do hi-fi dá ~3,9:1 sobre `--background` e reprova o AA da regra 10
 * do `AGENTS.md` §4; rótulo, linha de prova e rating usam `text-body`.
 */

import Image from "next/image";

import aboutPatientImage from "@/assets/about-patient.webp";
import aboutRoomImage from "@/assets/about-room.webp";
import { Animate } from "@/components/motion/Animate";
import { WhatsappButton } from "@/components/WhatsappButton";

export function About() {
  return (
    <section id="sobre" className="bg-background">
      <div className="section-container py-8 lg:py-14">
        <Animate>
          <div className="type-label lg:type-label-lg text-body mb-5 flex justify-between font-mono lg:mb-8">
            <span>{"// Sobre"}</span>
            <span>[ 02 ]</span>
          </div>

          <div className="flex flex-col gap-5 lg:grid lg:grid-cols-[300px_1fr] lg:gap-x-8 lg:gap-y-7">
            <p className="type-h2 lg:type-h2-lg order-1 text-balance lg:col-start-2 lg:row-start-1">
              “Tratamento de pele que funciona é o que você consegue manter.
              Começo pelo que cabe na sua rotina.”
            </p>

            <figure className="rounded-media order-2 relative h-[260px] overflow-hidden lg:col-start-1 lg:row-span-3 lg:row-start-1 lg:h-full lg:min-h-[330px]">
              <Image
                src={aboutPatientImage}
                alt="Paciente sentada perto de uma janela em sala de atendimento clara"
                fill
                sizes="(min-width: 1024px) 300px, 100vw"
                className="object-cover object-center"
              />
              {/* A legenda ocupa o terço inferior (plan.md §1.7): o gradiente é
                  o que sustenta o AA dela, sem caixa atrás do texto. */}
              <div className="from-foreground/95 via-foreground/75 absolute inset-0 bg-gradient-to-t to-transparent" />
              <figcaption className="type-body lg:type-body-lg text-primary-foreground absolute inset-x-3.5 bottom-3.5 text-pretty lg:inset-x-[18px] lg:bottom-[18px]">
                “Saí da primeira avaliação sabendo o que eu <em>não</em>{" "}
                precisava fazer.”
              </figcaption>
            </figure>

            <div className="order-3 grid gap-5 lg:col-start-2 lg:row-start-2 lg:grid-cols-2 lg:gap-6">
              {/* A IMG-03 não existe no arranjo mobile do hi-fi e não recebe
                  texto; fora de `lg` ela sai da página. */}
              <figure className="rounded-media relative hidden min-h-[190px] overflow-hidden lg:block">
                <Image
                  src={aboutRoomImage}
                  alt="Sala de atendimento da clínica com maca, luz natural e bancada organizada"
                  fill
                  sizes="(min-width: 1024px) 540px, 100vw"
                  className="object-cover object-center"
                />
              </figure>

              <div className="flex flex-col-reverse gap-4 lg:flex-col lg:justify-between">
                <div className="flex flex-col gap-3.5 lg:flex-row lg:items-start lg:justify-between lg:gap-4">
                  <p className="type-body lg:type-body-lg text-body lg:max-w-[190px]">
                    Mais de 600 avaliações feitas na clínica desde 2019.
                  </p>
                  <WhatsappButton
                    section="about"
                    className="w-full lg:w-auto"
                    ariaLabel="Falar no WhatsApp para entender como funciona a avaliação"
                  />
                </div>

                {/* Card de métrica — o único uso de `--accent` na página
                    (plan.md §2) e o único par claro-sobre-claro: texto em
                    `accent-foreground` puro, sem opacidade. */}
                <div className="bg-accent text-accent-foreground rounded-lg p-4 lg:p-[18px]">
                  <div className="type-label lg:type-label-lg mb-2.5 flex flex-wrap justify-between gap-x-4 gap-y-1 font-mono lg:mb-3">
                    <span>Duração média do protocolo</span>
                    <span>Sem. 4 · 8 · 12</span>
                  </div>
                  <p className="mb-3 flex items-baseline gap-2 lg:mb-3.5">
                    <span className="type-stat lg:type-stat-lg">12</span>
                    <span className="type-body lg:type-body-lg">semanas</span>
                  </p>
                  {/* Escala visual das semanas 4 · 8 · 12: decorativa, o número
                      e o rótulo já dizem tudo que ela mostra. */}
                  <div aria-hidden="true" className="flex gap-1.5">
                    <span className="bg-accent-foreground h-2 flex-3 rounded-full" />
                    <span className="bg-accent-foreground/30 h-2 flex-2 rounded-full" />
                    <span className="bg-accent-foreground/30 h-2 flex-2 rounded-full" />
                  </div>
                </div>
              </div>
            </div>

            <p className="type-body text-body order-4 lg:col-start-2 lg:row-start-3">
              <span className="text-foreground font-medium">
                <span aria-hidden="true">★</span> 5,0
              </span>{" "}
              · 87 avaliações no Google
            </p>
          </div>
        </Animate>
      </div>
    </section>
  );
}
