/**
 * src/components/sections/Hero.tsx — 00 Hero (spec.md §3).
 *
 * Server Component sem wrapper de animação: a IMG-01 e o H1 são o LCP
 * (AGENTS.md §1), e entrada animada só marca o LCP depois da hidratação.
 */

import Image from "next/image";
import { Menu, X } from "lucide-react";

import heroImage from "@/assets/hero.webp";
import { WhatsappButton } from "@/components/WhatsappButton";

/** As 5 âncoras da exceção da spec.md §1. Os alvos chegam nas features 2 a 7. */
const NAV_LINKS = [
  { href: "#sobre", label: "Sobre" },
  { href: "#tratamentos", label: "Tratamentos" },
  { href: "#na-pratica", label: "Na prática" },
  { href: "#depoimentos", label: "Depoimentos" },
  { href: "#faq", label: "FAQ" },
];

const navLinkClass =
  "type-body rounded-full px-1 py-1 text-primary-foreground/85 transition-colors hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-foreground";

export function Hero() {
  return (
    <section
      id="topo"
      className="relative isolate flex min-h-[620px] flex-col overflow-hidden lg:min-h-[720px]"
    >
      <Image
        src={heroImage}
        alt="Mulher de olhos fechados recebendo luz natural no rosto, em close"
        fill
        sizes="100vw"
        preload
        className="-z-20 object-cover object-center"
      />
      {/* Escurece de baixo para cima: é a metade inferior que recebe texto
          (plan.md §1.7). Sem caixa atrás do texto — o gradiente é que sustenta o AA. */}
      <div className="from-foreground/95 via-foreground/75 to-foreground/35 absolute inset-0 -z-10 bg-gradient-to-t" />
      {/* A parede clara da IMG-01 fica no topo, onde o gradiente principal é mais
          fraco: sem este segundo véu o wordmark e o badge reprovam AA. */}
      <div className="from-foreground/65 absolute inset-x-0 top-0 -z-10 h-44 bg-gradient-to-b to-transparent" />

      <div className="section-container text-primary-foreground flex flex-1 flex-col py-6 lg:py-8">
        <div className="flex items-start justify-between gap-4">
          <p className="flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="border-primary-foreground/60 size-8 rounded-full border"
            />
            <span className="type-h3 lg:type-h3-lg">Lume</span>
          </p>

          {/* Mini-nav horizontal a partir de lg (plan.md §1.2). */}
          <nav
            aria-label="Seções da página"
            className="hidden items-center gap-7 lg:flex"
          >
            {NAV_LINKS.map((link) => (
              <a key={link.href} href={link.href} className={navLinkClass}>
                {link.label}
              </a>
            ))}
            <WhatsappButton
              section="hero"
              emphasis="secondary"
              ariaLabel="Falar no WhatsApp para agendar uma avaliação facial"
            />
          </nav>

          {/* Abaixo de lg, as mesmas âncoras num disclosure de `:target`: sem
              Client Component, sem modal (spec.md §1).

              POR QUE NÃO `<details>`: ele só fecha por clique no `<summary>`, e
              clicar numa âncora do índice não é isso — o menu ficava aberto por
              cima da seção recém-navegada, e continuava aberto na volta. Aqui
              quem abre é o hash `#menu` e quem fecha é a própria navegação:
              trocar para `#faq` tira o `:target` e o painel some sozinho.
              Decisão do usuário, registrada em `plan.md` §3.

              O CUSTO: sem `<details>` não há `aria-expanded`. Os dois links
              trocam de rótulo ("Abrir" / "Fechar") e só um existe por vez, então
              o estado continua dito em voz alta — mas por texto, não por
              atributo. */}
          <div id="menu" className="group/menu relative lg:hidden">
            <a
              href="#menu"
              className="bg-foreground/40 text-primary-foreground rounded-media focus-visible:outline-primary-foreground flex size-11 items-center justify-center backdrop-blur-sm group-target/menu:hidden focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <Menu aria-hidden="true" className="size-5" />
              <span className="sr-only">Abrir o índice das seções</span>
            </a>
            <a
              href="#topo"
              className="bg-foreground/40 text-primary-foreground rounded-media focus-visible:outline-primary-foreground hidden size-11 items-center justify-center backdrop-blur-sm group-target/menu:flex focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              <X aria-hidden="true" className="size-5" />
              <span className="sr-only">Fechar o índice das seções</span>
            </a>
            <nav
              aria-label="Seções da página"
              className="bg-background text-foreground absolute end-0 top-full z-10 mt-2 hidden w-56 flex-col gap-1 rounded-lg p-3 shadow-lg group-target/menu:flex"
            >
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="type-body focus-visible:outline-ring rounded-md px-2 py-2 focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </div>

        <p className="bg-foreground/45 type-label lg:type-label-lg mt-5 flex w-fit items-center gap-2 rounded-full py-2 pr-4 pl-3 font-mono backdrop-blur-sm">
          <span aria-hidden="true" className="bg-accent size-2 rounded-full" />
          AGENDA ABERTA · AGOSTO
        </p>

        <div className="mt-16 flex flex-1 flex-col justify-end gap-8 lg:mt-0 lg:grid lg:grid-cols-2 lg:items-end lg:gap-12">
          <h1 className="type-h1 lg:type-h1-lg text-balance">
            Pele cuidada com critério clínico, sem pressa e sem promessa.
          </h1>

          <div className="flex flex-col gap-6 lg:pb-2">
            <p className="type-lead lg:type-lead-lg text-primary-foreground/90 max-w-[46ch]">
              Protocolos montados a partir de avaliação presencial — o que a sua
              pele precisa, na ordem em que ela precisa.
            </p>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-5">
              <WhatsappButton
                section="hero"
                emphasis="secondary"
                className="w-full sm:w-auto"
                ariaLabel="Falar no WhatsApp para agendar uma avaliação facial"
              />
              <p className="type-body text-primary-foreground/90">
                Marina Rezende · Biomédica esteta · CRBM-4 XXXXX
              </p>
            </div>
          </div>
        </div>

        <div className="type-label lg:type-label-lg text-primary-foreground/90 mt-10 flex flex-wrap justify-between gap-x-6 gap-y-1 font-mono">
          <span>[ SAVASSI · BELO HORIZONTE ]</span>
          <span>[ SEG A SÁB · 9H ÀS 19H ]</span>
        </div>
      </div>
    </section>
  );
}
