import { Accordion as AccordionPrimitive } from "@base-ui/react/accordion"

import { cn } from "@/lib/utils"

/**
 * Ajustes registrados sobre o componente do preset (plan.md §1.3 e o hi-fi):
 * - o indicador do preset saiu. As duas seções com accordion (03 e 06) usam o
 *   círculo −/+ do hi-fi, e cada uma o posiciona de um lado; quem o desenha é a
 *   seção.
 * - o sublinhado de link do painel passou a valer só dentro de parágrafo: sem
 *   isso ele pegava o CTA, que também é um `<a>`.
 * - o tamanho de fonte do trigger e do painel saiu. Ele vencia o papel
 *   tipográfico vindo do call site: as duas utilities moram na mesma layer, e aí
 *   quem decide é a ordem no CSS, não o tailwind-merge.
 * - o sublinhado de hover saiu: o item inteiro já reage, e o hi-fi não o mostra.
 * - a régua de cada item passou a ser no topo, com a última também embaixo —
 *   é o desenho das duas seções.
 * O anel de foco `--ring` do preset fica como está (AGENTS.md §4, regra 10).
 */

function Accordion({ className, ...props }: AccordionPrimitive.Root.Props) {
  return (
    <AccordionPrimitive.Root
      data-slot="accordion"
      className={cn("flex w-full flex-col", className)}
      {...props}
    />
  )
}

function AccordionItem({ className, ...props }: AccordionPrimitive.Item.Props) {
  return (
    <AccordionPrimitive.Item
      data-slot="accordion-item"
      className={cn("border-t last:border-b", className)}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: AccordionPrimitive.Trigger.Props) {
  return (
    <AccordionPrimitive.Header className="flex">
      <AccordionPrimitive.Trigger
        data-slot="accordion-trigger"
        className={cn(
          "group/accordion-trigger relative flex flex-1 items-start justify-between rounded-lg border border-transparent py-2.5 text-left font-medium transition-all outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:after:border-ring aria-disabled:pointer-events-none aria-disabled:opacity-50",
          className
        )}
        {...props}
      >
        {children}
      </AccordionPrimitive.Trigger>
    </AccordionPrimitive.Header>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: AccordionPrimitive.Panel.Props) {
  return (
    <AccordionPrimitive.Panel
      data-slot="accordion-content"
      className="overflow-hidden data-open:animate-accordion-down data-closed:animate-accordion-up"
      {...props}
    >
      <div
        className={cn(
          "h-(--accordion-panel-height) pt-0 pb-2.5 data-ending-style:h-0 data-starting-style:h-0 [&_p_a]:underline [&_p_a]:underline-offset-3 [&_p_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
          className
        )}
      >
        {children}
      </div>
    </AccordionPrimitive.Panel>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }
