/**
 * src/components/ImagePlaceholder.tsx — TEMPORÁRIO, apagado na feature
 * `12-images`.
 *
 * As imagens IMG-06 em diante ainda não foram geradas (condição registrada no
 * `specs/tasks/index.md`). Este componente ocupa o lugar da foto DENTRO do
 * mesmo `<figure>`, com a mesma proporção e o mesmo raio: ele se posiciona em
 * `absolute inset-0`, exatamente como um `<Image fill>`, então a troca pela
 * foto real é um elemento por outro, sem mexer em layout nem em CLS.
 *
 * A hachura diagonal é a mesma marcação que o hi-fi usa para indicar imagem
 * pendente (`specs/design-reference/design.dc.html`).
 *
 * `aria-hidden`: enquanto não há foto, não há alt — e o alt da tabela do
 * `plan.md` §1.7 descreve uma imagem que a página ainda não mostra. Anunciar
 * esse texto agora seria descrever algo inexistente.
 */

interface ImagePlaceholderProps {
  /** Id da tabela do `plan.md` §1.7 — é o que a `12-images` procura. */
  id: string;
  /** Proporção declarada para a imagem final, ex: "3:4". */
  ratio: string;
  /** Enquadramento esperado, resumido, para conferir a foto quando ela chegar. */
  hint?: string;
}

export function ImagePlaceholder({ id, ratio, hint }: ImagePlaceholderProps) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0"
      style={{
        backgroundImage:
          "repeating-linear-gradient(135deg, var(--border) 0 9px, var(--secondary) 9px 18px)",
      }}
    >
      <span className="type-label lg:type-label-lg bg-background text-body absolute top-3 left-3 max-w-[60%] rounded-md px-2 py-1.5 font-mono normal-case">
        {id} · {ratio}
        {hint ? <span className="block">{hint}</span> : null}
      </span>
    </div>
  );
}
