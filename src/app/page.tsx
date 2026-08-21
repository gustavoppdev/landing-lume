import { About } from "@/components/sections/About";
import { Featured } from "@/components/sections/Featured";
import { Hero } from "@/components/sections/Hero";
import { Treatments } from "@/components/sections/Treatments";
import { WhatsappButton } from "@/components/WhatsappButton";

const Home = () => {
  return (
    <>
      <Hero />

      {/* Barra fixa de CTA do mobile — exceção registrada na spec.md §1.
          Ela é o ÚLTIMO filho deste wrapper e `sticky bottom-0`: fica presa ao
          fim da viewport enquanto o wrapper está em cena e some quando ele
          termina. Sem IntersectionObserver e sem Client Component. A feature 8
          fecha o wrapper antes da 07, que é onde a barra deve sumir. */}
      <div className="flex flex-1 flex-col">
        <About />
        <Featured />
        <Treatments />

        <div className="border-border bg-background/92 sticky bottom-0 z-40 mt-auto border-t px-5 py-3 backdrop-blur-sm lg:hidden">
          <WhatsappButton
            section="mobileBar"
            className="w-full"
            ariaLabel="Falar no WhatsApp para agendar uma avaliação facial"
          />
        </div>
      </div>
    </>
  );
};

export default Home;
