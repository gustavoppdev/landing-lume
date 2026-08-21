/**
 * src/components/sections/FinalCta.tsx — 07 CTA final + rodapé (spec.md §3).
 *
 * Server Component: a entrada vem do wrapper `Animate` (reveal + fadeUp,
 * plan.md §1.6).
 *
 * UM BLOCO SÓ, UM LANDMARK. O hi-fi desenha CTA e rodapé dentro do mesmo
 * retângulo escuro; dois irmãos repetindo `bg-foreground` seriam a mesma faixa
 * partida em dois. Fecho do ritmo de fundo do `plan.md` §2.
 *
 * A BARRA FIXA DO MOBILE não chega aqui: em `page.tsx` esta seção fica FORA do
 * wrapper que hospeda a barra `sticky`, então ela some sozinha quando o wrapper
 * termina — sem IntersectionObserver e sem Client Component.
 *
 * SEM RÓTULO DE FAIXA: não há `// …` nem numeração aqui. O rodapé fecha a
 * página, não abre mais uma seção.
 *
 * OPACIDADES (divergência registrada em `specs/tasks/8-final-cta-footer.md`):
 * a escada do hi-fi desce até 34% de off-white sobre esta faixa, e dali para
 * baixo o texto não alcança 4,5:1. Aqui a escada é 85 → 72 → 62, que preserva a
 * hierarquia com piso acima de 6:1 na linha mais fraca (AGENTS.md §4, regra 10).
 *
 * COMPLIANCE (spec.md §2): disclaimer com o texto exato, terceira e última
 * ocorrência do registro profissional, aviso de projeto de portfólio e link da
 * política de privacidade — obrigatório porque a página usa analytics.
 */

import { Animate } from "@/components/motion/Animate";
import { WhatsappButton } from "@/components/WhatsappButton";

const labelClass =
  "type-label lg:type-label-lg text-primary-foreground/72 font-mono";
const valueClass =
  "type-body lg:type-body-lg text-primary-foreground/85 not-italic";
const dividerClass = "border-primary-foreground/16";

/** Texto exato da `spec.md` §2 — nunca parafraseado, nunca quebrado em duas
 *  strings: o critério de aceite procura a frase inteira no fonte. */
const DISCLAIMER =
  "Resultados variam conforme a pele, a adesão ao protocolo e o histórico de cada pessoa. Nenhum tratamento aqui garante resultado individual.";

/** Terceira e última ocorrência do registro profissional exigida pela §2. */
const PROFESSIONAL_REGISTRY = "Marina Rezende · Biomédica esteta · CRBM-4 XXXXX.";

export function FinalCta() {
  return (
    <footer id="contato" className="bg-foreground text-primary-foreground">
      <div className="section-container py-8 lg:py-16">
        <Animate>
          <div
            className={`grid gap-[26px] lg:grid-cols-[1.2fr_1fr] lg:gap-12 lg:border-b lg:pb-11 ${dividerClass}`}
          >
            <div className="flex flex-col gap-[18px] lg:gap-6">
              <h2 className="type-h2 lg:type-h2-lg max-w-[460px] text-pretty">
                Começa com uma avaliação de 50 minutos.
              </h2>
              <WhatsappButton
                section="finalCta"
                emphasis="secondary"
                className="w-full sm:w-auto sm:self-start"
                ariaLabel="Falar no WhatsApp para agendar a avaliação de 50 minutos"
              />
            </div>

            <div
              className={`grid grid-cols-2 gap-5 border-t pt-5 lg:gap-8 lg:border-0 lg:pt-0 ${dividerClass}`}
            >
              <div className="flex flex-col gap-2">
                <span className={labelClass}>Onde</span>
                <address className={valueClass}>
                  Rua Antônio de Albuquerque, 000
                  <br />
                  Savassi · Belo Horizonte, MG
                </address>
              </div>
              <div className="flex flex-col gap-2">
                <span className={labelClass}>Quando</span>
                <p className={valueClass}>
                  Seg a sex · 9h às 19h
                  <br />
                  Sáb · 9h às 14h
                </p>
              </div>
            </div>
          </div>

          <div
            className={`mt-[26px] grid gap-3 border-t pt-[18px] lg:mt-0 lg:grid-cols-[1.2fr_1fr] lg:gap-12 lg:border-0 lg:pt-7 ${dividerClass}`}
          >
            <div className="flex max-w-[560px] flex-col gap-2.5">
              <p className="type-body text-primary-foreground/72 text-pretty">
                {`${DISCLAIMER} ${PROFESSIONAL_REGISTRY}`}
              </p>
              <p className="type-label lg:type-label-lg text-primary-foreground/62 font-mono">
                Projeto de portfólio — negócio fictício, imagens geradas por IA.
              </p>
            </div>

            <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
              {/* Rota criada na feature de launch; `<a>` puro porque o prefetch
                  do <Link> bateria em 404 até lá. Link fora do buttonVariants
                  traz o próprio anel de foco (AGENTS.md §4, regra 10). */}
              <a
                href="/privacidade"
                className="type-body text-primary-foreground/85 focus-visible:outline-primary-foreground w-fit underline underline-offset-[3px] focus-visible:outline-2 focus-visible:outline-offset-2"
              >
                Política de privacidade
              </a>
              <span className="type-label lg:type-label-lg text-primary-foreground/62 font-mono">
                © 2026 Lume
              </span>
            </div>
          </div>
        </Animate>
      </div>
    </footer>
  );
}
